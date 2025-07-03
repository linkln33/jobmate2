import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabase/client';

// GET /api/specialists/[id]/services - Get services offered by a specialist
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const specialistId = params.id;
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

    // Get all services offered by the specialist
    const { data: services, error: servicesError } = await supabase
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
      .eq('specialistId', specialistId)
      .order('title', { ascending: true });

    if (servicesError) {
      console.error('Error fetching specialist services:', servicesError);
      return NextResponse.json(
        { message: 'Failed to fetch specialist services' },
        { status: 500 }
      );
    }

    return NextResponse.json({ services: services || [] });
  } catch (error) {
    console.error('Error in GET /api/specialists/[id]/services:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
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
    const specialistId = params.id;
    const currentUser = await getUserFromRequest(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only the specialist themselves or an admin can add services
    if (currentUser.id !== specialistId && currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'You can only add services to your own profile' },
        { status: 403 }
      );
    }

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

    // Parse request body
    const body = await req.json();
    const { title, description, price, duration, categoryId } = body;

    // Validate required fields
    if (!title || !description || !price || !categoryId) {
      return NextResponse.json(
        { message: 'Missing required fields: title, description, price, and categoryId are required' },
        { status: 400 }
      );
    }

    // Check if the category exists
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

    // Create the new service
    const { data: newService, error: createError } = await supabase
      .from('specialistServices')
      .insert({
        specialistId,
        title,
        description,
        price,
        duration: duration || null,
        categoryId
      })
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

    if (createError || !newService) {
      console.error('Error creating service:', createError);
      return NextResponse.json(
        { message: 'Failed to create service' },
        { status: 500 }
      );
    }

    return NextResponse.json({ service: newService }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/specialists/[id]/services:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
