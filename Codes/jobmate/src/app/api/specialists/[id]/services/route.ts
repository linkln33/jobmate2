import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/specialists/[id]/services - Get services offered by a specialist
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const specialistId = params.id;

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

    // Get all services offered by the specialist
    const services = await prisma.specialistService.findMany({
      where: { specialistId: specialist.specialistProfile.id },
      include: {
        serviceCategory: true,
      },
      orderBy: { isPrimary: 'desc' },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching specialist services:', error);
    return NextResponse.json(
      { message: 'Failed to fetch specialist services' },
      { status: 500 }
    );
  }
}

// POST /api/specialists/[id]/services - Add a new service for a specialist
export async function POST(
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

    // Only the specialist themselves or admins can add services
    if (user.id !== specialistId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'You can only add services to your own profile' },
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

    const body = await req.json();
    const {
      serviceCategoryId,
      priceType,
      basePrice,
      description,
      isPrimary,
    } = body;

    // Validate required fields
    if (!serviceCategoryId || !priceType) {
      return NextResponse.json(
        { message: 'Service category and price type are required' },
        { status: 400 }
      );
    }

    // Check if the service category exists
    const category = await prisma.serviceCategory.findUnique({
      where: { id: serviceCategoryId },
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Service category not found' },
        { status: 404 }
      );
    }

    // Check if the specialist already offers this service
    const existingService = await prisma.specialistService.findFirst({
      where: {
        specialistId: specialistProfile.id,
        serviceCategoryId,
      },
    });

    if (existingService) {
      return NextResponse.json(
        { message: 'You already offer this service' },
        { status: 409 }
      );
    }

    // If this is marked as primary, update other services to not be primary
    if (isPrimary) {
      await prisma.specialistService.updateMany({
        where: {
          specialistId: specialistProfile.id,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Create the new service
    const newService = await prisma.specialistService.create({
      data: {
        specialistId: specialistProfile.id,
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
      message: 'Service added successfully',
      service: newService,
    });
  } catch (error) {
    console.error('Error adding specialist service:', error);
    return NextResponse.json(
      { message: 'Failed to add specialist service' },
      { status: 500 }
    );
  }
}
