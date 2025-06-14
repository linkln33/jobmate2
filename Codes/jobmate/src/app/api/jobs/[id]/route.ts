import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/jobs/[id] - Get a specific job by ID
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

    // Get the job with related data
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        category: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            email: user.role === 'ADMIN' ? true : false, // Only admins can see email
          },
        },
        jobMedia: true,
        proposals: user.role === 'CUSTOMER' || user.role === 'ADMIN' ? {
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
        } : {
          where: { specialistId: user.id }, // Specialists can only see their own proposals
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
        },
        milestones: true,
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to view this job
    const isCustomer = user.id === job.customerId;
    const isAssignedSpecialist = job.specialistId === user.id;
    const isAdmin = user.role === 'ADMIN';
    
    // If job is not open and user is not the customer, assigned specialist, or admin
    if (job.status !== 'OPEN' && !isCustomer && !isAssignedSpecialist && !isAdmin) {
      return NextResponse.json(
        { message: 'You do not have permission to view this job' },
        { status: 403 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { message: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PATCH /api/jobs/[id] - Update a job
export async function PATCH(
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
    const body = await req.json();

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

    // Check if user has permission to update this job
    const isCustomer = user.id === job.customerId;
    const isAdmin = user.role === 'ADMIN';
    
    if (!isCustomer && !isAdmin) {
      return NextResponse.json(
        { message: 'You do not have permission to update this job' },
        { status: 403 }
      );
    }

    // Prevent updating certain fields if job is not in OPEN status
    if (job.status !== 'OPEN' && (body.title || body.description || body.categoryId || body.budget)) {
      return NextResponse.json(
        { message: 'Cannot update job details after it has been assigned' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    // Fields that can be updated
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.budget !== undefined) updateData.budget = parseFloat(body.budget);
    if (body.location !== undefined) updateData.location = body.location;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.latitude !== undefined) updateData.latitude = parseFloat(body.latitude);
    if (body.longitude !== undefined) updateData.longitude = parseFloat(body.longitude);
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
    
    // Only admin or customer (when job is OPEN) can change status
    if (body.status !== undefined && (isAdmin || (isCustomer && job.status === 'OPEN'))) {
      updateData.status = body.status;
    }
    
    // Only admin or customer can assign specialist
    if (body.specialistId !== undefined && (isAdmin || isCustomer)) {
      updateData.specialistId = body.specialistId;
    }
    
    // Only admin or customer can change category
    if (body.categoryId !== undefined && (isAdmin || isCustomer)) {
      updateData.categoryId = body.categoryId;
    }

    // Update the job
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: updateData,
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
        specialist: body.specialistId ? {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        } : undefined,
        jobMedia: true,
      },
    });

    // Handle media updates if provided
    if (body.mediaUrls && Array.isArray(body.mediaUrls)) {
      // Delete existing media
      await prisma.jobMedia.deleteMany({
        where: { jobId },
      });

      // Add new media
      const mediaItems = body.mediaUrls.map((url: string) => ({
        jobId,
        url,
        type: url.match(/\.(jpg|jpeg|png|gif)$/i) ? 'IMAGE' : 'OTHER',
      }));

      if (mediaItems.length > 0) {
        await prisma.jobMedia.createMany({
          data: mediaItems,
        });
      }

      // Refresh job with updated media
      updatedJob.jobMedia = await prisma.jobMedia.findMany({
        where: { jobId },
      });
    }

    return NextResponse.json({
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { message: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
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

    // Check if user has permission to delete this job
    const isCustomer = user.id === job.customerId;
    const isAdmin = user.role === 'ADMIN';
    
    if (!isCustomer && !isAdmin) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this job' },
        { status: 403 }
      );
    }

    // Can only delete jobs that are in OPEN status
    if (job.status !== 'OPEN') {
      return NextResponse.json(
        { message: 'Cannot delete a job that has been assigned or is in progress' },
        { status: 400 }
      );
    }

    // Delete related records first
    await prisma.$transaction([
      prisma.jobMedia.deleteMany({ where: { jobId } }),
      prisma.jobProposal.deleteMany({ where: { jobId } }),
      prisma.job.delete({ where: { id: jobId } }),
    ]);

    return NextResponse.json({
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { message: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
