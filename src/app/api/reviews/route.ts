import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/client';
import { ReviewType } from '@/lib/types';

/**
 * GET /api/reviews
 * Get reviews with optional filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const revieweeId = searchParams.get('revieweeId');
    const reviewerId = searchParams.get('reviewerId');
    const jobId = searchParams.get('jobId');
    const reviewType = searchParams.get('reviewType') as ReviewType;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') || '10') : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset') || '0') : 0;
    
    // Build the query
    const query: any = {
      isPublic: true
    };
    
    if (revieweeId) query.revieweeId = revieweeId;
    if (reviewerId) query.reviewerId = reviewerId;
    if (jobId) query.jobId = jobId;
    if (reviewType) query.reviewType = reviewType;
    
    // Get reviews with pagination using Supabase
    const supabase = getSupabaseServiceClient();
    
    let reviewsQuery = supabase
      .from('reviews')
      .select(`
        *,
        reviewer:reviewerId(*),
        reviewee:revieweeId(*),
        job:jobId(*)
      `)
      .eq('isPublic', query.isPublic)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (revieweeId) reviewsQuery = reviewsQuery.eq('revieweeId', revieweeId);
    if (reviewerId) reviewsQuery = reviewsQuery.eq('reviewerId', reviewerId);
    if (jobId) reviewsQuery = reviewsQuery.eq('jobId', jobId);
    if (reviewType) reviewsQuery = reviewsQuery.eq('reviewType', reviewType);
    
    const { data: reviews, error } = await reviewsQuery;
    
    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
    
    // Get total count for pagination using Supabase
    let countQuery = supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('isPublic', query.isPublic);
      
    if (revieweeId) countQuery = countQuery.eq('revieweeId', revieweeId);
    if (reviewerId) countQuery = countQuery.eq('reviewerId', reviewerId);
    if (jobId) countQuery = countQuery.eq('jobId', jobId);
    if (reviewType) countQuery = countQuery.eq('reviewType', reviewType);
    
    const { count: totalCount, error: countError } = await countQuery;
    
    if (countError) {
      console.error('Error counting reviews:', countError);
      return NextResponse.json({ error: 'Failed to count reviews' }, { status: 500 });
    }
    
    // Calculate review statistics if revieweeId is provided
    let reviewStats = null;
    if (revieweeId) {
      reviewStats = await calculateReviewStatistics(revieweeId);
    }
    
    return NextResponse.json({
      reviews,
      pagination: {
        total: totalCount || 0,
        limit,
        offset
      },
      reviewStats
    }, { status: 200 });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { message: 'Failed to get reviews' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Create a new review
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await req.json();
    const { 
      jobId, 
      revieweeId, 
      overallRating,
      timingRating,
      satisfactionRating,
      costRating,
      communicationRating,
      comment,
      reviewType,
      isPublic,
      mediaUrls
    } = data;
    
    // Validate required fields
    if (!jobId || !revieweeId || !overallRating) {
      return NextResponse.json(
        { message: 'Job ID, reviewee ID, and overall rating are required' },
        { status: 400 }
      );
    }
    
    // Check if the job exists if jobId is provided
    if (jobId) {
      const supabase = getSupabaseServiceClient();
      const { data: job, error } = await supabase
        .from('jobs')
        .select('id')
        .eq('id', jobId)
        .single();

      if (error || !job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
    }
    
    // Check if the user is authorized to review this job
    if (jobId) {
      const { data: jobDetails, error: jobError } = await getSupabaseServiceClient()
        .from('jobs')
        .select('customerId, specialistId')
        .eq('id', jobId)
        .single();
        
      if (jobError || !jobDetails) {
        return NextResponse.json(
          { message: 'Error fetching job details' },
          { status: 500 }
        );
      }
        
      if (jobDetails.customerId !== user.id && jobDetails.specialistId !== user.id) {
        return NextResponse.json(
          { message: 'You are not authorized to review this job' },
          { status: 403 }
        );
      }
    }
    
    // Check if the reviewee is part of the job
    if (jobId) {
      const { data: jobData } = await getSupabaseServiceClient()
        .from('jobs')
        .select('customerId, specialistId')
        .eq('id', jobId)
        .single();
        
      if (jobData && revieweeId !== jobData.customerId && revieweeId !== jobData.specialistId) {
        return NextResponse.json(
          { message: 'Reviewee must be part of the job' },
          { status: 400 }
        );
      }
    }
    
    // Check if the user has already reviewed this job for this reviewee
    const existingReview = await getSupabaseServiceClient()
      .from('reviews')
      .select('id')
      .eq('jobId', jobId)
      .eq('reviewerId', user.id)
      .eq('revieweeId', revieweeId)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { message: 'You have already reviewed this job for this user' },
        { status: 409 }
      );
    }
    
    // Determine review type based on job if not provided
    let determinedReviewType = reviewType;
    if (!determinedReviewType && jobId) {
      // Check if the user is the customer or specialist for this job
      const { data: jobDetails } = await getSupabaseServiceClient()
        .from('jobs')
        .select('customerId, specialistId')
        .eq('id', jobId)
        .single();
        
      if (jobDetails) {
        if (jobDetails.customerId === user.id) {
          determinedReviewType = ReviewType.CUSTOMER_TO_SPECIALIST;
        } else if (jobDetails.specialistId === user.id) {
          determinedReviewType = ReviewType.SPECIALIST_TO_CUSTOMER;
        }
      }
    }
    
    // Create the review
    const supabase = getSupabaseServiceClient();
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        jobId,
        reviewerId: user.id,
        revieweeId,
        overallRating,
        timingRating,
        satisfactionRating,
        costRating,
        communicationRating,
        comment,
        reviewType: determinedReviewType as ReviewType,
        isPublic: isPublic !== undefined ? isPublic : true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating review:', error);
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
    
    // Add media if provided
    if (mediaUrls && mediaUrls.length > 0) {
      const { error: mediaError } = await supabase
        .from('reviewMedia')
        .insert(
          mediaUrls.map((url: string) => ({
            reviewId: review.id,
            mediaUrl: url,
            mediaType: getMediaType(url)
          }))
        );
        
      if (mediaError) {
        console.error('Error creating review media:', mediaError);
        // Continue anyway since the review was created
      }
    }
    
    // Update user's review statistics
    if (revieweeId) {
      const reviewStats = await calculateReviewStatistics(revieweeId);
      
      // Update specialist profile if reviewee is a specialist
      const specialistProfile = await getSupabaseServiceClient()
        .from('specialistProfiles')
        .select('id')
        .eq('userId', revieweeId)
        .single();
        
      if (specialistProfile && reviewStats) {
        await getSupabaseServiceClient()
          .from('specialistProfiles')
          .update({
            averageRating: reviewStats.averageRating,
            positiveReviewPercentage: reviewStats.positivePercentage,
            totalReviews: reviewStats.totalReviews
          })
          .eq('userId', revieweeId);
      }
    }
    
    // Get the complete review with related data
    const completeReview = await getSupabaseServiceClient()
      .from('reviews')
      .select(`
        *,
        reviewer:reviewerId(*),
        reviewee:revieweeId(*),
        job:jobId(*),
        reviewMedia:reviewId(*)
      `)
      .eq('id', review.id)
      .single();
    
    return NextResponse.json({
      message: 'Review created successfully',
      review: completeReview
    }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { message: 'Failed to create review' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to calculate review statistics for a user
 */
async function calculateReviewStatistics(userId: string) {
  // Get all reviews for this user using Supabase
  const supabase = getSupabaseServiceClient();
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('revieweeId', userId)
    .eq('isPublic', true);

  if (error) {
    console.error('Error fetching reviews for statistics:', error);
    return null;
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Calculate review type breakdown
  const positive = reviews.filter(r => r.reviewType === 'POSITIVE').length;
  const neutral = reviews.filter(r => r.reviewType === 'NEUTRAL').length;
  const negative = reviews.filter(r => r.reviewType === 'NEGATIVE').length;
  
  // Calculate positive percentage
  const positivePercentage = (positive / reviews.length) * 100;
  
  // Calculate overall average rating
  const overallRatings = reviews.map((r: any) => r.overallRating).filter(Boolean);
  const averageRating = overallRatings.length > 0
    ? overallRatings.reduce((sum: number, rating: number) => sum + rating, 0) / overallRatings.length
    : 0;
  
  // Calculate criteria averages
  const communicationRatings = reviews.map((r: any) => r.communicationRating).filter(Boolean);
  const qualityRatings = reviews.map((r: any) => r.qualityRating).filter(Boolean);
  const valueRatings = reviews.map((r: any) => r.valueRating).filter(Boolean);
  
  const avgCommunication = communicationRatings.length > 0
    ? communicationRatings.reduce((sum: number, rating: number) => sum + rating, 0) / communicationRatings.length
    : 0;
  
  const avgQuality = qualityRatings.length > 0
    ? qualityRatings.reduce((sum: number, rating: number) => sum + rating, 0) / qualityRatings.length
    : 0;
  
  const avgValue = valueRatings.length > 0
    ? valueRatings.reduce((sum: number, rating: number) => sum + rating, 0) / valueRatings.length
    : 0;

  return {
    totalReviews: reviews.length,
    averageRating,
    positivePercentage,
    reviewBreakdown: {
      positive,
      neutral,
      negative
    },
    criteriaAverages: {
      quality: avgQuality,
      value: avgValue,
      communication: avgCommunication
    }
  };
}

/**
 * Helper function to determine media type from URL
 */
function getMediaType(url: string): string {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  
  const lowerUrl = url.toLowerCase();
  
  for (const ext of imageExtensions) {
    if (lowerUrl.endsWith(ext)) {
      return 'image';
    }
  }
  
  for (const ext of videoExtensions) {
    if (lowerUrl.endsWith(ext)) {
      return 'video';
    }
  }
  
  // Default to image if can't determine
  return 'image';
}
