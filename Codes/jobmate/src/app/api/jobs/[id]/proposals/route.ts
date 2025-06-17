import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '../../../../../lib/auth';

const prisma = new PrismaClient();

// GET /api/jobs/[id]/proposals - Get all proposals for a job
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const jobId = params.id;

    // Get the job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to view proposals
    const isCustomer = user.id === job.customerId;
    const isAdmin = user.role === 'ADMIN';
    
    // Only the job owner (customer) or admin can see all proposals
    if (!isCustomer && !isAdmin) {
      // Specialists can only see their own proposals
      const ownProposal = await prisma.jobProposal.findFirst({
        where: {
          jobId,
          specialistId: user.id,
        },
        include: {
          specialist: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
        },
      });

      return NextResponse.json(
        ownProposal ? [ownProposal] : []
      );
    }

    // Get all proposals for the job
    const proposals = await prisma.jobProposal.findMany({
      where: { jobId },
      include: {
        specialist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            bio: true,
            specialistProfile: {
              select: {
                averageRating: true,
                totalJobsCompleted: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { message: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST /api/jobs/[id]/proposals - Create a new proposal for a job
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only specialists can submit proposals
    if (user.role !== 'SPECIALIST') {
      return NextResponse.json(
        { message: 'Only specialists can submit proposals' },
        { status: 403 }
      );
    }

    const jobId = params.id;
    const body = await req.json();
    const { price, description, estimatedDuration, estimatedDurationUnit } = body;

    // Validate required fields
    if (!price || !description) {
      return NextResponse.json(
        { message: 'Price and description are required' },
        { status: 400 }
      );
    }

    // Get the job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if job is still open for proposals
    if (job.status !== 'OPEN') {
      return NextResponse.json(
        { message: 'This job is no longer accepting proposals' },
        { status: 400 }
      );
    }

    // Check if specialist has already submitted a proposal for this job
    const existingProposal = await prisma.jobProposal.findFirst({
      where: {
        jobId,
        specialistId: user.id,
      },
    });

    if (existingProposal) {
      return NextResponse.json(
        { message: 'You have already submitted a proposal for this job' },
        { status: 400 }
      );
    }

    // Create the proposal
    const proposal = await prisma.jobProposal.create({
      data: {
        price: parseFloat(price),
        message: description,
        estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
        status: 'PENDING',
        job: {
          connect: { id: jobId },
        },
        specialist: {
          connect: { id: user.id },
        },
      },
      include: {
        specialist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    // Create a notification for the job owner
    await prisma.notification.create({
      data: {
        userId: job.customerId,
        type: 'NEW_PROPOSAL',
        title: 'New Proposal Received',
        message: `You have received a new proposal for your job: ${job.title}`,
        isRead: false,
        data: {
          jobId: job.id,
          proposalId: proposal.id,
          specialistId: user.id,
          specialistName: `${user.firstName} ${user.lastName}`,
        },
      },
    });

    return NextResponse.json(
      { message: 'Proposal submitted successfully', proposal },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting proposal:', error);
    return NextResponse.json(
      { message: 'Failed to submit proposal' },
      { status: 500 }
    );
  }
}
