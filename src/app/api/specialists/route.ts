import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/specialists - Get all specialists with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId');
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined;
    const location = searchParams.get('location');
    const latitude = searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : undefined;
    const longitude = searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : undefined;
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : undefined;
    const sortBy = searchParams.get('sortBy') || 'rating'; // rating, distance, price
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // asc, desc

    // Build filter conditions
    const filters: any = {
      user: {
        isActive: true,
        isVerified: true,
      },
    };

    // Filter by category
    if (categoryId) {
      filters.services = {
        some: {
          serviceCategoryId: categoryId,
        },
      };
    }

    // Filter by rating
    if (rating) {
      filters.averageRating = {
        gte: rating,
      };
    }

    // Filter by location (text-based)
    if (location) {
      filters.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
        { zipCode: { contains: location, mode: 'insensitive' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get specialists with filters and pagination
    const specialists = await prisma.specialistProfile.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true,
            createdAt: true,
          },
        },
        services: {
          include: {
            serviceCategory: true,
          },
        },
        certifications: true,
      },
      skip,
      take: limit,
      orderBy: sortBy === 'rating' 
        ? { averageRating: sortOrder === 'asc' ? 'asc' : 'desc' } 
        : { createdAt: sortOrder === 'asc' ? 'asc' : 'desc' },
    });

    // Get total count for pagination
    const totalCount = await prisma.specialistProfile.count({
      where: filters,
    });

    // Calculate distance if coordinates are provided
    let specialistsWithDistance = specialists;
    if (latitude && longitude && radius) {
      // Filter specialists by distance
      specialistsWithDistance = specialists.filter(specialist => {
        if (!specialist.latitude || !specialist.longitude) return false;
        
        // Calculate distance using Haversine formula
        const R = 6371; // Earth radius in km
        const dLat = (specialist.latitude - latitude) * Math.PI / 180;
        const dLon = (specialist.longitude - longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(latitude * Math.PI / 180) * Math.cos(specialist.latitude * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // Add distance to specialist object
        (specialist as any).distance = distance;
        
        // Return true if within radius
        return distance <= radius;
      });
      
      // Sort by distance if requested
      if (sortBy === 'distance') {
        specialistsWithDistance.sort((a, b) => {
          return sortOrder === 'asc' 
            ? (a as any).distance - (b as any).distance
            : (b as any).distance - (a as any).distance;
        });
      }
    }

    return NextResponse.json({
      specialists: specialistsWithDistance,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching specialists:', error);
    return NextResponse.json(
      { message: 'Failed to fetch specialists' },
      { status: 500 }
    );
  }
}

// POST /api/specialists - Create or update specialist profile (for authenticated specialists only)
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only specialists can create/update their profile
    if (user.role !== 'SPECIALIST') {
      return NextResponse.json(
        { message: 'Only specialists can update specialist profiles' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
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

    // Check if specialist profile exists
    const existingProfile = await prisma.specialistProfile.findUnique({
      where: { userId: user.id },
    });

    let specialistProfile;

    if (existingProfile) {
      // Update existing profile
      specialistProfile = await prisma.specialistProfile.update({
        where: { userId: user.id },
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
    } else {
      // Create new profile
      specialistProfile = await prisma.specialistProfile.create({
        data: {
          userId: user.id,
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
          availabilityStatus: availabilityStatus || 'offline',
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        },
      });
    }

    // Handle services if provided
    if (services && Array.isArray(services)) {
      // Delete existing services first
      await prisma.specialistService.deleteMany({
        where: { specialistId: specialistProfile.id },
      });

      // Create new services
      for (const service of services) {
        await prisma.specialistService.create({
          data: {
            specialistId: specialistProfile.id,
            serviceCategoryId: service.categoryId,
            priceType: service.priceType,
            basePrice: service.basePrice ? parseFloat(service.basePrice) : null,
            description: service.description,
            isPrimary: service.isPrimary || false,
          },
        });
      }
    }

    return NextResponse.json({
      message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
      specialistProfile,
    });
  } catch (error) {
    console.error('Error creating/updating specialist profile:', error);
    return NextResponse.json(
      { message: 'Failed to create/update specialist profile' },
      { status: 500 }
    );
  }
}
