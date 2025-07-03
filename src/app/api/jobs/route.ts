import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/client';

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

    const supabase = getSupabaseServiceClient();
    
    // Build query
    let query = supabase
      .from('jobs')
      .select(`
        *,
        serviceCategory:categoryId(*),
        customer:customerId(*),
        specialist:specialistId(*),
        media:id(*),
        proposals:id(count)
      `)
      .order('createdAt', { ascending: false })
      .range(skip, skip + limit - 1);
    
    // Apply filters
    if (category) {
      query = query.eq('categoryId', category);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Apply user role-based filters
    if (user.role === 'SPECIALIST') {
      query = query.eq('status', 'OPEN');
    } else if (user.role === 'CUSTOMER') {
      query = query.eq('customerId', user.id);
    }
    
    // Execute query
    const { data: jobs, error } = await query;
    
    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json(
        { message: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }
    
    // Get total count
    let countQuery = supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true });
      
    // Apply the same filters to count query
    if (category) {
      countQuery = countQuery.eq('categoryId', category);
    }
    
    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    
    if (user.role === 'SPECIALIST') {
      countQuery = countQuery.eq('status', 'OPEN');
    } else if (user.role === 'CUSTOMER') {
      countQuery = countQuery.eq('customerId', user.id);
    }
    
    const { count: totalCount, error: countError } = await countQuery;
    
    if (countError) {
      console.error('Error counting jobs:', countError);
    }

    const total = totalCount || 0;
    
    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
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

    const supabase = getSupabaseServiceClient();
    
    // Create the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        title,
        description,
        status: 'OPEN',
        budgetMin: budget ? parseFloat(budget) : null,
        budgetMax: budget ? parseFloat(budget) : null,
        address,
        city: location?.city || '',
        zipCode: location?.zipCode || '',
        country: location?.country || 'Unknown',
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
        scheduledStartTime: startDate ? new Date(startDate) : null,
        scheduledEndTime: endDate ? new Date(endDate) : null,
        categoryId: categoryId,
        customerId: user.id,
        createdAt: new Date()
      })
      .select()
      .single();
      
    if (jobError) {
      console.error('Error creating job:', jobError);
      return NextResponse.json(
        { message: 'Failed to create job' },
        { status: 500 }
      );
    }

    // Add job media if provided
    if (mediaUrls && mediaUrls.length > 0) {
      const mediaItems = mediaUrls.map((url: string) => ({
        jobId: job.id,
        url,
        type: url.match(/\.(jpg|jpeg|png|gif)$/i) ? 'IMAGE' : 'OTHER',
      }));

      const { error: mediaError } = await supabase
        .from('jobMedia')
        .insert(mediaItems);
        
      if (mediaError) {
        console.error('Error adding job media:', mediaError);
        // Continue anyway since the job was created
      }
    }

    // Get the created job with related data
    const { data: createdJob, error: fetchError } = await supabase
      .from('jobs')
      .select(`
        *,
        serviceCategory:categoryId(*),
        customer:customerId(*),
        specialist:specialistId(*),
        media:id(*),
        proposals:id(*)
      `)
      .eq('id', job.id)
      .single();
      
    if (fetchError) {
      console.error('Error fetching created job:', fetchError);
      // Return the basic job data anyway
      return NextResponse.json(
        { message: 'Job created successfully', job },
        { status: 201 }
      );
    }

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
