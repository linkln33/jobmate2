import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/specialists/[id] - Get specialist profile by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const specialistId = params.id;

    // Get the specialist profile with related information
    const specialist = await prisma.user.findUnique({
      where: { id: specialistId, role: 'SPECIALIST' },
      include: {
        specialistProfile: {
          include: {
            services: {
              include: {
                serviceCategory: true,
              },
            },
            certifications: true,
          },
        },
        reviewsGiven: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!specialist || !specialist.specialistProfile) {
      return NextResponse.json(
        { message: 'Specialist not found' },
        { status: 404 }
      );
    }

    // Get completed jobs count and average rating
    const completedJobs = await prisma.job.count({
      where: {
        specialistId: specialistId,
        status: 'COMPLETED',
      },
    });

    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: specialistId,
      },
      select: {
        overallRating: true,
      },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length
      : 0;

    // Get recent completed jobs
    const recentJobs = await prisma.job.findMany({
      where: {
        specialistId: specialistId,
        status: 'COMPLETED',
      },
      take: 5,
      orderBy: { completedAt: 'desc' },
      include: {
        serviceCategory: true,
        reviews: {
          where: {
            revieweeId: specialistId,
          },
          take: 1,
        },
      },
    });

    // Remove sensitive information
    const { passwordHash, ...userWithoutPassword } = specialist;

    return NextResponse.json({
      ...userWithoutPassword,
      completedJobsCount: completedJobs,
      averageRating,
      recentJobs,
    });
  } catch (error) {
    console.error('Error fetching specialist profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch specialist profile' },
      { status: 500 }
    );
  }
}

// PATCH /api/specialists/[id] - Update specialist profile (only for the specialist themselves)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    const specialistId = params.id;
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only the specialist themselves or admins can update the profile
    if (user.id !== specialistId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'You can only update your own profile' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      profileImageUrl,
      bio,
      phone,
      businessName,
      businessDescription,
      yearsOfExperience,
      address,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      serviceRadius,
      availabilityStatus,
      hourlyRate,
      services,
    } = body;

    // Update user information
    const updatedUser = await prisma.user.update({
      where: { id: specialistId },
      data: {
        firstName,
        lastName,
        profileImageUrl,
        bio,
        phone,
      },
    });

    // Update specialist profile
    const updatedProfile = await prisma.specialistProfile.update({
      where: { userId: specialistId },
      data: {
        businessName,
        businessDescription,
        yearsOfExperience,
        address,
        city,
        state,
        zipCode,
        country,
        latitude,
        longitude,
        serviceRadius,
        availabilityStatus,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      },
    });

    // Handle services if provided
    if (services && Array.isArray(services)) {
      // Delete existing services first
      await prisma.specialistService.deleteMany({
        where: { specialistId: updatedProfile.id },
      });

      // Create new services
      for (const service of services) {
        await prisma.specialistService.create({
          data: {
            specialistId: updatedProfile.id,
            serviceCategoryId: service.categoryId,
            priceType: service.priceType,
            basePrice: service.basePrice ? parseFloat(service.basePrice) : null,
            description: service.description,
            isPrimary: service.isPrimary || false,
          },
        });
      }
    }

    // Remove sensitive information
    const { passwordHash, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
      specialistProfile: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating specialist profile:', error);
    return NextResponse.json(
      { message: 'Failed to update specialist profile' },
      { status: 500 }
    );
  }
}
