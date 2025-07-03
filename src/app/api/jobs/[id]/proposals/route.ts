import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../../../lib/auth';
import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/client';

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

    const supabase = getSupabaseServiceClient();
    
    // Get the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, customerId, status')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
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
      const { data: ownProposal, error: proposalError } = await supabase
        .from('jobProposals')
        .select(`
          *,
          specialist:specialistId(*)
        `)
        .eq('jobId', jobId)
        .eq('specialistId', user.id)
        .single();

      return NextResponse.json(
        ownProposal ? [ownProposal] : []
      );
    }

    // Get all proposals for the job
    const { data: proposals, error: proposalsError } = await supabase
      .from('jobProposals')
      .select(`
        *,
        specialist:specialistId(id, firstName, lastName, profileImageUrl, bio, 
          specialistProfile:id(averageRating, totalJobsCompleted))
      `)
      .eq('jobId', jobId)
      .order('createdAt', { ascending: false });
      
    if (proposalsError) {
      console.error('Error fetching proposals:', proposalsError);
      return NextResponse.json(
        { message: 'Failed to fetch proposals' },
        { status: 500 }
      );
    }

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

    const supabase = getSupabaseServiceClient();
    
    // Get the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, status, customerId, title')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
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
    const { data: existingProposal, error: proposalError } = await supabase
      .from('jobProposals')
      .select('id')
      .eq('jobId', jobId)
      .eq('specialistId', user.id)
      .maybeSingle();

    if (existingProposal) {
      return NextResponse.json(
        { message: 'You have already submitted a proposal for this job' },
        { status: 400 }
      );
    }

    // Create the proposal
    const { data: proposal, error: createError } = await supabase
      .from('jobProposals')
      .insert({
        price: parseFloat(price),
        message: description,
        estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
        estimatedDurationUnit: estimatedDurationUnit || null,
        status: 'PENDING',
        jobId: jobId,
        specialistId: user.id,
        createdAt: new Date()
      })
      .select(`
        *,
        specialist:specialistId(id, firstName, lastName, profileImageUrl)
      `)
      .single();
      
    if (createError) {
      console.error('Error creating proposal:', createError);
      return NextResponse.json(
        { message: 'Failed to create proposal' },
        { status: 500 }
      );
    }

    // Get job title for notification
    const { data: jobDetails } = await supabase
      .from('jobs')
      .select('title, customerId')
      .eq('id', jobId)
      .single();
      
    // Create a notification for the job owner
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        userId: jobDetails?.customerId,
        type: 'NEW_PROPOSAL',
        title: 'New Proposal Received',
        message: `You have received a new proposal for your job: ${jobDetails?.title}`,
        isRead: false,
        data: {
          jobId: jobId,
          proposalId: proposal.id,
          specialistId: user.id,
          specialistName: `${user.firstName} ${user.lastName}`,
        },
        createdAt: new Date()
      });
      
    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Continue anyway since the proposal was created
    }

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
