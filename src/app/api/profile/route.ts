import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/client';

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

    const supabase = getSupabaseServiceClient();
    
    // Get the user with basic information
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (userError || !userData) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json(
        { message: 'Failed to fetch profile' },
        { status: 500 }
      );
    }
    
    // Get profile data based on user role
    let profileData = null;
    if (user.role === 'CUSTOMER') {
      const { data: customerProfile, error: customerError } = await supabase
        .from('customerProfiles')
        .select('*')
        .eq('userId', user.id)
        .single();
        
      if (!customerError) {
        profileData = customerProfile;
      }
    } else if (user.role === 'SPECIALIST') {
      const { data: specialistProfile, error: specialistError } = await supabase
        .from('specialistProfiles')
        .select('*')
        .eq('userId', user.id)
        .single();
        
      if (!specialistError) {
        profileData = specialistProfile;
      }
    }
    
    // Get user skills with endorsements
    const { data: userSkills, error: skillsError } = await supabase
      .from('userSkills')
      .select(`
        *,
        skill:skillId(*),
        endorsements:id(*, endorser:endorserId(id, firstName, lastName, profileImageUrl))
      `)
      .eq('userId', user.id);
      
    // Get social links
    const { data: socialLinks, error: socialsError } = await supabase
      .from('socialLinks')
      .select('*')
      .eq('userId', user.id);
      
    // Get portfolio items
    const { data: portfolioItems, error: portfolioError } = await supabase
      .from('portfolioItems')
      .select('*')
      .eq('userId', user.id);
      
    // Get reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:reviewerId(id, firstName, lastName, profileImageUrl),
        reviewMedia:reviewId(*)
      `)
      .eq('revieweeId', user.id)
      .eq('isPublic', true)
      .order('createdAt', { ascending: false })
      .limit(10);
    // Get user badges
    const { data: userBadges, error: badgesError } = await supabase
      .from('userBadges')
      .select(`
        *,
        badge:badgeId(*)
      `)
      .eq('userId', user.id);
      
    // Combine all data into a single profile object
    const userWithProfile = {
      ...userData,
      customerProfile: user.role === 'CUSTOMER' ? profileData : null,
      specialistProfile: user.role === 'SPECIALIST' ? profileData : null,
      skills: userSkills || [],
      socialLinks: socialLinks || [],
      portfolioItems: portfolioItems || [],
      reviews: reviews || [],
      badges: userBadges || []
    };

    if (!userData) {
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

    const supabase = getSupabaseServiceClient();
    
    // Update basic user information
    const { data: updatedUser, error: userUpdateError } = await supabase
      .from('users')
      .update({
        firstName,
        lastName,
        bio,
        phone
      })
      .eq('id', user.id)
      .select()
      .single();
      
    if (userUpdateError) {
      console.error('Error updating user:', userUpdateError);
      return NextResponse.json(
        { message: 'Failed to update profile' },
        { status: 500 }
      );
    }
      
    // Update location-related information
    if (location) {
        const { address, city, state, zipCode, country, latitude, longitude } = location;
        
        const locationData = {
          address,
          city,
          state,
          zipCode,
          country,
          latitude,
          longitude
        };
        
        if (user.role === 'CUSTOMER') {
          // Check if customer profile exists
          const { data: existingProfile } = await supabase
            .from('customerProfiles')
            .select('userId')
            .eq('userId', user.id)
            .maybeSingle();
            
          if (existingProfile) {
            // Update existing profile
            const { error: updateError } = await supabase
              .from('customerProfiles')
              .update(locationData)
              .eq('userId', user.id);
              
            if (updateError) {
              console.error('Error updating customer profile:', updateError);
              return NextResponse.json(
                { message: 'Failed to update location information' },
                { status: 500 }
              );
            }
          } else {
            // Create new profile
            const { error: createError } = await supabase
              .from('customerProfiles')
              .insert({
                userId: user.id,
                ...locationData
              });
              
            if (createError) {
              console.error('Error creating customer profile:', createError);
              return NextResponse.json(
                { message: 'Failed to create location information' },
                { status: 500 }
              );
            }
          }
        } else if (user.role === 'SPECIALIST') {
          // Check if specialist profile exists
          const { data: existingProfile } = await supabase
            .from('specialistProfiles')
            .select('userId')
            .eq('userId', user.id)
            .maybeSingle();
            
          if (existingProfile) {
            // Update existing profile
            const { error: updateError } = await supabase
              .from('specialistProfiles')
              .update(locationData)
              .eq('userId', user.id);
              
            if (updateError) {
              console.error('Error updating specialist profile:', updateError);
              return NextResponse.json(
                { message: 'Failed to update location information' },
                { status: 500 }
              );
            }
          } else {
            // Create new profile
            const { error: createError } = await supabase
              .from('specialistProfiles')
              .insert({
                userId: user.id,
                ...locationData
              });
              
            if (createError) {
              console.error('Error creating specialist profile:', createError);
              return NextResponse.json(
                { message: 'Failed to create location information' },
                { status: 500 }
              );
            }
          }
        }
      }

      // Update role-specific profile information
      if (user.role === 'CUSTOMER' && customerProfile) {
        // Check if customer profile exists
        const { data: existingCustomerProfile } = await supabase
          .from('customerProfiles')
          .select('userId')
          .eq('userId', user.id)
          .maybeSingle();
          
        if (existingCustomerProfile) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('customerProfiles')
            .update(customerProfile)
            .eq('userId', user.id);
            
          if (updateError) {
            console.error('Error updating customer profile:', updateError);
            return NextResponse.json(
              { message: 'Failed to update customer profile' },
              { status: 500 }
            );
          }
        } else {
          // Create new profile
          const { error: createError } = await supabase
            .from('customerProfiles')
            .insert({
              userId: user.id,
              ...customerProfile
            });
            
          if (createError) {
            console.error('Error creating customer profile:', createError);
            return NextResponse.json(
              { message: 'Failed to create customer profile' },
              { status: 500 }
            );
          }
        }
      } else if (user.role === 'SPECIALIST' && specialistProfile) {
        // Check if specialist profile exists
        const { data: existingSpecialistProfile } = await supabase
          .from('specialistProfiles')
          .select('userId')
          .eq('userId', user.id)
          .maybeSingle();
          
        if (existingSpecialistProfile) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('specialistProfiles')
            .update(specialistProfile)
            .eq('userId', user.id);
            
          if (updateError) {
            console.error('Error updating specialist profile:', updateError);
            return NextResponse.json(
              { message: 'Failed to update specialist profile' },
              { status: 500 }
            );
          }
        } else {
          // Create new profile
          const { error: createError } = await supabase
            .from('specialistProfiles')
            .insert({
              userId: user.id,
              ...specialistProfile
            });
            
          if (createError) {
            console.error('Error creating specialist profile:', createError);
            return NextResponse.json(
              { message: 'Failed to create specialist profile' },
              { status: 500 }
            );
          }
        }
      }

      // Update skills if provided
      if (skills && skills.length > 0) {
        // First, get existing skills for the user
        const { data: existingSkills, error: skillsError } = await supabase
          .from('userSkills')
          .select('skillId')
          .eq('userId', user.id);
          
        if (skillsError) {
          console.error('Error fetching existing skills:', skillsError);
          return NextResponse.json(
            { message: 'Failed to update skills' },
            { status: 500 }
          );
        }
        
        const existingSkillIds = existingSkills.map((skill: { skillId: string }) => skill.skillId);
        
        // Find skills to add (in skills but not in existingSkillIds)
        const skillsToAdd = skills.filter((skill: { id: string; proficiencyLevel?: number }) => 
          !existingSkillIds.includes(skill.id));
        
        // Add new skills
        if (skillsToAdd.length > 0) {
          const skillsToInsert = skillsToAdd.map((skill: { id: string; proficiencyLevel?: number }) => ({
            userId: user.id,
            skillId: skill.id,
            proficiencyLevel: skill.proficiencyLevel || 1
          }));
          
          const { error: insertError } = await supabase
            .from('userSkills')
            .insert(skillsToInsert);
            
          if (insertError) {
            console.error('Error adding new skills:', insertError);
            return NextResponse.json(
              { message: 'Failed to add new skills' },
              { status: 500 }
            );
          }
        }
        
        // Find skills to remove (in existingSkillIds but not in skills)
        const skillIdsToKeep = skills.map((skill: { id: string }) => skill.id);
        const skillsToRemove = existingSkillIds.filter((id: string) => !skillIdsToKeep.includes(id));
        
        // Remove skills that are no longer in the list
        if (skillsToRemove.length > 0) {
          const { error: deleteError } = await supabase
            .from('userSkills')
            .delete()
            .eq('userId', user.id)
            .in('skillId', skillsToRemove);
            
          if (deleteError) {
            console.error('Error removing skills:', deleteError);
            return NextResponse.json(
              { message: 'Failed to remove skills' },
              { status: 500 }
            );
          }
        }
      }

      // Get the updated user with all related data
      const { data: updatedUserWithProfile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          customerProfiles!userId(*),
          specialistProfiles!userId(*),
          userSkills!userId(*, skills!skillId(*)),
          socialLinks!userId(*),
          portfolioItems!userId(*)
        `)
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching updated profile:', profileError);
        return NextResponse.json(
          { message: 'Failed to fetch updated profile' },
          { status: 500 }
        );
      }

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
  const supabase = getSupabaseServiceClient();
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('revieweeId', userId);
    
  if (error) {
    console.error('Error fetching reviews for statistics:', error);
    return null;
  }

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

  // Define review type for TypeScript
  type Review = {
    reviewType: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    overallRating: number;
    timingRating: number | null;
    satisfactionRating: number | null;
    costRating: number | null;
    communicationRating: number | null;
  };
  
  // Calculate review type breakdown
  const positive = reviews.filter((r: any) => r.reviewType === 'POSITIVE').length;
  const neutral = reviews.filter((r: any) => r.reviewType === 'NEUTRAL').length;
  const negative = reviews.filter((r: any) => r.reviewType === 'NEGATIVE').length;
  
  // Calculate positive percentage
  const positivePercentage = reviews.length > 0 ? (positive / reviews.length) * 100 : 0;
  
  // Calculate overall average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, review: any) => sum + review.overallRating, 0) / reviews.length
    : 0;
  
  // Calculate criteria averages
  const timingRatings = reviews
    .filter((r: any) => r.timingRating !== null)
    .map((r: any) => r.timingRating);
  
  const satisfactionRatings = reviews
    .filter((r: any) => r.satisfactionRating !== null)
    .map((r: any) => r.satisfactionRating);
  
  const costRatings = reviews
    .filter((r: any) => r.costRating !== null)
    .map((r: any) => r.costRating);
  
  const communicationRatings = reviews
    .filter((r: any) => r.communicationRating !== null)
    .map((r: any) => r.communicationRating);
  
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
