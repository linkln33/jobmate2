import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/specialists/[id]/services/[serviceId] - Get a specific service offered by a specialist
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const { id: specialistId, serviceId } = params;

    // Check if the specialist exists
    const specialist = await prisma.user.findUnique({
      where: { id: specialistId, role: 'SPECIALIST' },
      include: {
        specialistProfile: true,
      },
    });

    if (!specialist || !specialist.specialistProfile) {
      return NextResponse.json(
        { message: 'Specialist not found' },
        { status: 404 }
      );
    }

    // Get the specific service
    const service = await prisma.specialistService.findUnique({
      where: { 
        id: serviceId,
        specialistId: specialist.specialistProfile.id,
      },
      include: {
        serviceCategory: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error fetching specialist service:', error);
    return NextResponse.json(
      { message: 'Failed to fetch specialist service' },
      { status: 500 }
    );
  }
}

// PATCH /api/specialists/[id]/services/[serviceId] - Update a specific service
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    const { id: specialistId, serviceId } = params;
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only the specialist themselves or admins can update services
    if (user.id !== specialistId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'You can only update your own services' },
        { status: 403 }
      );
    }

    // Get the specialist profile
    const specialistProfile = await prisma.specialistProfile.findUnique({
      where: { userId: specialistId },
    });

    if (!specialistProfile) {
      return NextResponse.json(
        { message: 'Specialist profile not found' },
        { status: 404 }
      );
    }

    // Check if the service exists
    const existingService = await prisma.specialistService.findUnique({
      where: { 
        id: serviceId,
      },
    });

    if (!existingService || existingService.specialistId !== specialistProfile.id) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      serviceCategoryId,
      priceType,
      basePrice,
      description,
      isPrimary,
    } = body;

    // If this is marked as primary, update other services to not be primary
    if (isPrimary) {
      await prisma.specialistService.updateMany({
        where: {
          specialistId: specialistProfile.id,
          id: { not: serviceId },
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Update the service
    const updatedService = await prisma.specialistService.update({
      where: { id: serviceId },
      data: {
        serviceCategoryId,
        priceType,
        basePrice: basePrice ? parseFloat(basePrice) : null,
        description,
        isPrimary: isPrimary || false,
      },
      include: {
        serviceCategory: true,
      },
    });

    return NextResponse.json({
      message: 'Service updated successfully',
      service: updatedService,
    });
  } catch (error) {
    console.error('Error updating specialist service:', error);
    return NextResponse.json(
      { message: 'Failed to update specialist service' },
      { status: 500 }
    );
  }
}

// DELETE /api/specialists/[id]/services/[serviceId] - Delete a specific service
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    const { id: specialistId, serviceId } = params;
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only the specialist themselves or admins can delete services
    if (user.id !== specialistId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'You can only delete your own services' },
        { status: 403 }
      );
    }

    // Get the specialist profile
    const specialistProfile = await prisma.specialistProfile.findUnique({
      where: { userId: specialistId },
    });

    if (!specialistProfile) {
      return NextResponse.json(
        { message: 'Specialist profile not found' },
        { status: 404 }
      );
    }

    // Check if the service exists
    const existingService = await prisma.specialistService.findUnique({
      where: { id: serviceId },
    });

    if (!existingService || existingService.specialistId !== specialistProfile.id) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    // Delete the service
    await prisma.specialistService.delete({
      where: { id: serviceId },
    });

    return NextResponse.json({
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting specialist service:', error);
    return NextResponse.json(
      { message: 'Failed to delete specialist service' },
      { status: 500 }
    );
  }
}
