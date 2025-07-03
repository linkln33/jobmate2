import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabase/client';

// GET /api/specialists/[id]/services/[serviceId] - Get a specific service offered by a specialist
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const { id: specialistId, serviceId } = params;
    const supabase = getSupabaseServiceClient();

    // Check if the specialist exists
    const { data: specialist, error: specialistError } = await supabase
      .from('users')
      .select(`
        id,
        specialistProfiles!inner (
          id
        )
      `)
      .eq('id', specialistId)
      .eq('role', 'SPECIALIST')
      .single();

    if (specialistError || !specialist) {
      console.error('Error fetching specialist:', specialistError);
      return NextResponse.json(
        { message: 'Specialist not found' },
        { status: 404 }
      );
    }

    // Get the specific service
    const { data: service, error: serviceError } = await supabase
      .from('specialistServices')
      .select(`
        id,
        title,
        description,
        price,
        duration,
        categoryId,
        createdAt,
        updatedAt,
        serviceCategories:categoryId (
          id,
          name,
          slug,
          icon
        )
      `)
      .eq('id', serviceId)
      .eq('specialistId', specialistId)
      .single();

    if (serviceError || !service) {
      console.error('Error fetching service:', serviceError);
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error in GET /api/specialists/[id]/services/[serviceId]:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
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
    const { id: specialistId, serviceId } = params;
    const currentUser = await getUserFromRequest(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Check if the service exists and belongs to the specialist
    const { data: service, error: serviceError } = await supabase
      .from('specialistServices')
      .select('id, specialistId')
      .eq('id', serviceId)
      .eq('specialistId', specialistId)
      .single();

    if (serviceError || !service) {
      console.error('Error fetching service:', serviceError);
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    // Only the specialist themselves or an admin can update services
    if (currentUser.id !== specialistId && currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'You can only update your own services' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { title, description, price, duration, categoryId } = body;

    // Build update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (duration !== undefined) updateData.duration = duration;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    
    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No fields to update' },
        { status: 400 }
      );
    }

    // If categoryId is provided, check if it exists
    if (categoryId !== undefined) {
      const { data: category, error: categoryError } = await supabase
        .from('serviceCategories')
        .select('id')
        .eq('id', categoryId)
        .single();

      if (categoryError || !category) {
        console.error('Error fetching category:', categoryError);
        return NextResponse.json(
          { message: 'Invalid category ID' },
          { status: 400 }
        );
      }
    }

    // Update the service
    updateData.updatedAt = new Date().toISOString();
    
    const { data: updatedService, error: updateError } = await supabase
      .from('specialistServices')
      .update(updateData)
      .eq('id', serviceId)
      .select(`
        id,
        title,
        description,
        price,
        duration,
        categoryId,
        createdAt,
        updatedAt,
        serviceCategories:categoryId (
          id,
          name,
          slug,
          icon
        )
      `)
      .single();

    if (updateError || !updatedService) {
      console.error('Error updating service:', updateError);
      return NextResponse.json(
        { message: 'Failed to update service' },
        { status: 500 }
      );
    }

    return NextResponse.json({ service: updatedService });
  } catch (error) {
    console.error('Error in PATCH /api/specialists/[id]/services/[serviceId]:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
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
    const { id: specialistId, serviceId } = params;
    const currentUser = await getUserFromRequest(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Check if the service exists and belongs to the specialist
    const { data: service, error: serviceError } = await supabase
      .from('specialistServices')
      .select('id, specialistId')
      .eq('id', serviceId)
      .eq('specialistId', specialistId)
      .single();

    if (serviceError || !service) {
      console.error('Error fetching service:', serviceError);
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    // Only the specialist themselves or an admin can delete services
    if (currentUser.id !== specialistId && currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'You can only delete your own services' },
        { status: 403 }
      );
    }

    // Delete the service
    const { error: deleteError } = await supabase
      .from('specialistServices')
      .delete()
      .eq('id', serviceId);

    if (deleteError) {
      console.error('Error deleting service:', deleteError);
      return NextResponse.json(
        { message: 'Failed to delete service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Service deleted successfully',
      deletedId: serviceId
    });
  } catch (error) {
    console.error('Error in DELETE /api/specialists/[id]/services/[serviceId]:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
