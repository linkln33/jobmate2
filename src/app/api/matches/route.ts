import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';
import { matchingService } from '@/services/server/matching-service';

const prisma = new PrismaClient();

// POST /api/matches - Get job matches for a specialist with scoring
export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      specialistId,
      filters = {},
      preferences = {},
      pagination = { page: 1, limit: 10 }
    } = body;

    // Validate request
    if (!specialistId) {
      return NextResponse.json(
        { message: 'specialistId is required' },
        { status: 400 }
      );
    }

    // Ensure the user has access to this specialist profile
    if (user.role === 'SPECIALIST' && user.id !== specialistId) {
      return NextResponse.json(
        { message: 'You can only request matches for your own profile' },
        { status: 403 }
      );
    }

    // Set up pagination
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    // Get the specialist profile
    // Using type assertion as specialist model might not be directly accessible in Prisma Client
    const specialist = await (prisma as any).specialist.findUnique({
      where: { id: specialistId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        skills: true,
        location: true,
        availability: true,
        ratePreferences: true,
        premium: true
      }
    });

    if (!specialist) {
      return NextResponse.json(
        { message: 'Specialist not found' },
        { status: 404 }
      );
    }

    // Build the query for jobs
    const where: any = {
      status: 'OPEN', // Only match open jobs
    };

    // Apply filters
    if (filters.categories && filters.categories.length > 0) {
      where.categoryId = { in: filters.categories };
    }

    if (filters.minBudget) {
      where.budgetMax = { gte: filters.minBudget };
    }

    if (filters.maxBudget) {
      where.budgetMin = { lte: filters.maxBudget };
    }

    if (filters.urgencyLevel && filters.urgencyLevel.length > 0) {
      where.urgencyLevel = { in: filters.urgencyLevel };
    }

    if (filters.showVerifiedOnly) {
      where.isVerifiedPayment = true;
    }

    if (filters.showNeighborsOnly) {
      where.isNeighborPosted = true;
    }

    // Get jobs with pagination
    // Using type assertion for the entire query to bypass TypeScript errors
    const jobs = await (prisma as any).job.findMany({
      where,
      include: {
        category: true,
        customer: true,
        location: true
      },
      skip,
      take: limit
    });

    // Count total jobs matching the criteria
    const totalJobs = await prisma.job.count({ where });
    const totalPages = Math.ceil(totalJobs / limit);

    // Calculate match scores for each job
    // Use type assertion to make the jobs compatible with the matching service
    const matches = await matchingService.calculateMatchesForSpecialist(
      specialist,
      jobs as any, // Type assertion to bypass type checking for now
      preferences
    );

    // Sort matches by score (highest first)
    matches.sort((a, b) => b.matchResult.score - a.matchResult.score);

    return NextResponse.json({
      matches,
      pagination: {
        totalMatches: totalJobs,
        currentPage: page,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error in matches API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
