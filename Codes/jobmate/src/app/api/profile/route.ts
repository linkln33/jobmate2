import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/profile
 * Fetch the current user's profile information
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user with related profile data based on their role
    const userWithProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        customerProfile: user.role === 'CUSTOMER',
        specialistProfile: user.role === 'SPECIALIST',
        skills: {
          include: {
            skill: true,
            endorsements: {
              include: {
                endorser: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImageUrl: true
                  }
                }
              }
            }
          }
        },
        socialLinks: true,
        portfolioItems: true,
        reviews: {
          where: { isPublic: true },
          include: {
            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true
              }
            },
            reviewMedia: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        badges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!userWithProfile) {
      return NextResponse.json(
        { message: 'User profile not found' },
        { status: 404 }
      );
    }

    // Remove sensitive data before sending response
    const { passwordHash, ...userWithoutPassword } = userWithProfile;

    // Calculate review statistics
    const reviewStats = await calculateReviewStatistics(user.id);

    return NextResponse.json({
      profile: {
        ...userWithoutPassword,
        reviewStats
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Failed to get profile information' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile
 * Update the current user's profile information
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { 
      firstName, 
      lastName, 
      bio, 
      phone, 
      location,
      customerProfile,
      specialistProfile,
      skills
    } = data;

    // Start a transaction to update all related data
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update basic user information
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
          bio,
          phone
        }
      });

      // Update location-related information
      if (location) {
        const { address, city, state, zipCode, country, latitude, longitude } = location;
        
        if (user.role === 'CUSTOMER') {
          await tx.customerProfile.upsert({
            where: { userId: user.id },
            update: {
              address,
              city,
              state,
              zipCode,
              country,
              latitude,
              longitude
            },
            create: {
              userId: user.id,
              address,
              city,
              state,
              zipCode,
              country,
              latitude,
              longitude
            }
          });
        } else if (user.role === 'SPECIALIST') {
          await tx.specialistProfile.upsert({
            where: { userId: user.id },
            update: {
              address,
              city,
              state,
              zipCode,
              country,
              latitude,
              longitude
            },
            create: {
              userId: user.id,
              address,
              city,
              state,
              zipCode,
              country,
              latitude,
              longitude
            }
          });
        }
      }

      // Update role-specific profile information
      if (user.role === 'CUSTOMER' && customerProfile) {
        await tx.customerProfile.upsert({
          where: { userId: user.id },
          update: customerProfile,
          create: {
            userId: user.id,
            ...customerProfile
          }
        });
      } else if (user.role === 'SPECIALIST' && specialistProfile) {
        await tx.specialistProfile.upsert({
          where: { userId: user.id },
          update: specialistProfile,
          create: {
            userId: user.id,
            ...specialistProfile
          }
        });
      }

      // Update skills if provided
      if (skills && skills.length > 0) {
        // First, get existing skills for the user
        const existingSkills = await tx.userSkill.findMany({
          where: { userId: user.id },
          select: { skillId: true }
        });
        
        const existingSkillIds = existingSkills.map(skill => skill.skillId);
        
        // Find skills to add (in skills but not in existingSkillIds)
        const skillsToAdd = skills.filter((skill: { id: string; proficiencyLevel?: number }) => !existingSkillIds.includes(skill.id));
        
        // Add new skills
        for (const skill of skillsToAdd) {
          await tx.userSkill.create({
            data: {
              userId: user.id,
              skillId: skill.id,
              proficiencyLevel: skill.proficiencyLevel || 1
            }
          });
        }
        
        // Find skills to remove (in existingSkillIds but not in skills)
        const skillIdsToKeep = skills.map((skill: { id: string }) => skill.id);
        const skillsToRemove = existingSkillIds.filter(id => !skillIdsToKeep.includes(id));
        
        // Remove skills that are no longer in the list
        if (skillsToRemove.length > 0) {
          await tx.userSkill.deleteMany({
            where: {
              userId: user.id,
              skillId: { in: skillsToRemove }
            }
          });
        }
      }

      return updatedUser;
    });

    // Get the updated user with all related data
    const updatedUserWithProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        customerProfile: user.role === 'CUSTOMER',
        specialistProfile: user.role === 'SPECIALIST',
        skills: {
          include: {
            skill: true
          }
        },
        socialLinks: true,
        portfolioItems: true
      }
    });

    // The user object already doesn't contain passwordHash due to our select options
    const userWithoutPassword = updatedUserWithProfile;

    return NextResponse.json({
      profile: userWithoutPassword,
      message: 'Profile updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile information' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to calculate review statistics for a user
 */
async function calculateReviewStatistics(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { revieweeId: userId }
  });

  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      positivePercentage: 0,
      reviewBreakdown: {
        positive: 0,
        neutral: 0,
        negative: 0
      },
      criteriaAverages: {
        timing: 0,
        satisfaction: 0,
        cost: 0,
        communication: 0
      }
    };
  }

  // Calculate review type breakdown
  const positive = reviews.filter(r => r.reviewType === 'POSITIVE').length;
  const neutral = reviews.filter(r => r.reviewType === 'NEUTRAL').length;
  const negative = reviews.filter(r => r.reviewType === 'NEGATIVE').length;
  
  // Calculate positive percentage
  const positivePercentage = reviews.length > 0 ? (positive / reviews.length) * 100 : 0;
  
  // Calculate overall average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, review) => sum + review.overallRating, 0) / reviews.length
    : 0;
  
  // Calculate criteria averages
  const timingRatings = reviews
    .filter((r): r is typeof r & { timingRating: number } => r.timingRating !== null)
    .map(r => r.timingRating);
  
  const satisfactionRatings = reviews
    .filter((r): r is typeof r & { satisfactionRating: number } => r.satisfactionRating !== null)
    .map(r => r.satisfactionRating);
  
  const costRatings = reviews
    .filter((r): r is typeof r & { costRating: number } => r.costRating !== null)
    .map(r => r.costRating);
  
  const communicationRatings = reviews
    .filter((r): r is typeof r & { communicationRating: number } => r.communicationRating !== null)
    .map(r => r.communicationRating);
  
  const avgTiming = timingRatings.length > 0 
    ? timingRatings.reduce((sum: number, rating: number) => sum + rating, 0) / timingRatings.length 
    : 0;
  
  const avgSatisfaction = satisfactionRatings.length > 0 
    ? satisfactionRatings.reduce((sum: number, rating: number) => sum + rating, 0) / satisfactionRatings.length 
    : 0;
  
  const avgCost = costRatings.length > 0 
    ? costRatings.reduce((sum: number, rating: number) => sum + rating, 0) / costRatings.length 
    : 0;
  
  const avgCommunication = communicationRatings.length > 0 
    ? communicationRatings.reduce((sum: number, rating: number) => sum + rating, 0) / communicationRatings.length 
    : 0;

  return {
    totalReviews: reviews.length,
    averageRating,
    positivePercentage,
    reviewBreakdown: {
      positive,
      neutral,
      negative
    },
    criteriaAverages: {
      timing: avgTiming,
      satisfaction: avgSatisfaction,
      cost: avgCost,
      communication: avgCommunication
    }
  };
}
