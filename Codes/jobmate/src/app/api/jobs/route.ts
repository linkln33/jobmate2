import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/jobs - Get all jobs with filtering options
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};
    
    if (category) {
      where.categoryId = category;
    }
    
    if (status) {
      where.status = status;
    }

    // Get jobs based on user role
    if (user.role === 'SPECIALIST') {
      // For specialists, show all available jobs
      where.status = 'OPEN';
    } else if (user.role === 'CUSTOMER') {
      // For customers, show only their own jobs
      where.customerId = user.id;
    }

    // Get jobs with pagination
    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          category: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
          jobMedia: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { message: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only customers can create jobs
    if (user.role !== 'CUSTOMER') {
      return NextResponse.json(
        { message: 'Only customers can create jobs' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      categoryId,
      budget,
      location,
      address,
      latitude,
      longitude,
      startDate,
      endDate,
      mediaUrls,
    } = body;

    // Validate required fields
    if (!title || !description || !categoryId || !budget || !location) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        status: 'OPEN',
        budget: parseFloat(budget),
        location,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        category: {
          connect: { id: categoryId },
        },
        customer: {
          connect: { id: user.id },
        },
      },
    });

    // Add job media if provided
    if (mediaUrls && mediaUrls.length > 0) {
      const mediaItems = mediaUrls.map((url: string) => ({
        jobId: job.id,
        url,
        type: url.match(/\.(jpg|jpeg|png|gif)$/i) ? 'IMAGE' : 'OTHER',
      }));

      await prisma.jobMedia.createMany({
        data: mediaItems,
      });
    }

    // Get the created job with related data
    const createdJob = await prisma.job.findUnique({
      where: { id: job.id },
      include: {
        category: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        },
        jobMedia: true,
      },
    });

    return NextResponse.json(
      { message: 'Job created successfully', job: createdJob },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { message: 'Failed to create job' },
      { status: 500 }
    );
  }
}
