import { NextRequest, NextResponse } from 'next/server';

import { ReviewType } from '@/lib/types';
import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/client';

/**
 * GET /api/users/[id]/reviews
 * Get reviews for a specific user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(req.url);
    const reviewType = searchParams.get('reviewType') as ReviewType;
    const asReviewer = searchParams.get('asReviewer') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') || '10') : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset') || '0') : 0;
    
    // Build the query
    const query: any = {
      isPublic: true
    };
    
    // Filter by user role (reviewee or reviewer)
    if (asReviewer) {
      query.reviewerId = userId;
    } else {
      query.revieweeId = userId;
    }
    
    // Filter by review type if specified
    if (reviewType) {
      query.reviewType = reviewType;
    }
    
    // Get reviews with pagination using Supabase
    const supabase = getSupabaseClient();
    
    let reviewsQuery = supabase
      .from('reviews')
      .select(`
        *,
        reviewer:reviewerId(*),
        reviewee:revieweeId(*),
        job:jobId(*),
        reviewMedia:reviewId(*)
      `)
      .eq('isPublic', query.isPublic)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (asReviewer) {
      reviewsQuery = reviewsQuery.eq('reviewerId', userId);
    } else {
      reviewsQuery = reviewsQuery.eq('revieweeId', userId);
    }
    
    if (reviewType) {
      reviewsQuery = reviewsQuery.eq('reviewType', reviewType);
    }
    
    const { data: reviews, error } = await reviewsQuery;
    
    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
    
    // Get total count for pagination
    let countQuery = supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('isPublic', query.isPublic);
    
    if (asReviewer) {
      countQuery = countQuery.eq('reviewerId', userId);
    } else {
      countQuery = countQuery.eq('revieweeId', userId);
    }
    
    if (reviewType) {
      countQuery = countQuery.eq('reviewType', reviewType);
    }
    
    const { count: totalCount } = await countQuery;
    
    // Calculate review statistics if user is being reviewed
    let reviewStats = null;
    if (!asReviewer) {
      reviewStats = await calculateReviewStatistics(userId);
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
    console.error('Get user reviews error:', error);
    return NextResponse.json(
      { message: 'Failed to get user reviews' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to calculate review statistics for a user
 */
async function calculateReviewStatistics(userId: string) {
  const supabase = getSupabaseClient();
  
  // Get all reviews for this user
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
    return {
      totalReviews: 0,
      averageRating: 0,
      positivePercentage: 0,
      reviewBreakdown: {
        positive: 0,
        neutral: 0,
        negative: 0
      }
    };
  }

  // Calculate review type breakdown
  const positive = reviews.filter((r: any) => r.reviewType === 'POSITIVE').length;
  const neutral = reviews.filter((r: any) => r.reviewType === 'NEUTRAL').length;
  const negative = reviews.filter((r: any) => r.reviewType === 'NEGATIVE').length;
  
  // Calculate positive percentage
  const positivePercentage = (positive / reviews.length) * 100;
  
  // Calculate average rating
  const overallRatings = reviews.map((r: any) => r.overallRating).filter(Boolean);
  const communicationRatings = reviews.map((r: any) => r.communicationRating).filter(Boolean);
  const qualityRatings = reviews.map((r: any) => r.qualityRating).filter(Boolean);
  const valueRatings = reviews.map((r: any) => r.valueRating).filter(Boolean);
  
  const avgOverall = overallRatings.length > 0
    ? overallRatings.reduce((sum: number, review: number) => sum + review, 0) / overallRatings.length
    : 0;
    
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
    averageRating: avgOverall,
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
