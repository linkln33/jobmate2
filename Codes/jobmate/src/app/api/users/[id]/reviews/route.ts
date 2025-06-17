import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReviewType } from '@prisma/client';

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
    
    // Get reviews with pagination
    const reviews = await prisma.review.findMany({
      where: query,
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        },
        reviewee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        },
        job: {
          select: {
            id: true,
            title: true,
            status: true,
            completedAt: true
          }
        },
        reviewMedia: true
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    });
    
    // Get total count for pagination
    const totalCount = await prisma.review.count({
      where: query
    });
    
    // Calculate review statistics if user is being reviewed
    let reviewStats = null;
    if (!asReviewer) {
      reviewStats = await calculateReviewStatistics(userId);
    }
    
    return NextResponse.json({
      reviews,
      totalCount,
      reviewStats,
      pagination: {
        limit,
        offset,
        hasMore: offset + reviews.length < totalCount
      }
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
  const reviews = await prisma.review.findMany({
    where: { revieweeId: userId }
  });

  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      positivePercentage: 0,
      reviewBreakdown: {
        positive: 0,
        neutral: 0,
        negative: 0
      },
      criteriaAverages: {
        timing: 0,
        satisfaction: 0,
        cost: 0,
        communication: 0
      }
    };
  }

  // Calculate review type breakdown
  const positive = reviews.filter(r => r.reviewType === 'POSITIVE').length;
  const neutral = reviews.filter(r => r.reviewType === 'NEUTRAL').length;
  const negative = reviews.filter(r => r.reviewType === 'NEGATIVE').length;
  
  // Calculate positive percentage
  const positivePercentage = (positive / reviews.length) * 100;
  
  // Calculate overall average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length;
  
  // Calculate criteria averages
  const timingRatings = reviews
    .filter((r): r is typeof r & { timingRating: number } => r.timingRating !== null)
    .map(r => r.timingRating);
  
  const satisfactionRatings = reviews
    .filter((r): r is typeof r & { satisfactionRating: number } => r.satisfactionRating !== null)
    .map(r => r.satisfactionRating);
  
  const costRatings = reviews
    .filter((r): r is typeof r & { costRating: number } => r.costRating !== null)
    .map(r => r.costRating);
  
  const communicationRatings = reviews
    .filter((r): r is typeof r & { communicationRating: number } => r.communicationRating !== null)
    .map(r => r.communicationRating);
  
  const avgTiming = timingRatings.length > 0 
    ? timingRatings.reduce((sum: number, rating: number) => sum + rating, 0) / timingRatings.length 
    : 0;
  
  const avgSatisfaction = satisfactionRatings.length > 0 
    ? satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / satisfactionRatings.length 
    : 0;
  
  const avgCost = costRatings.length > 0 
    ? costRatings.reduce((sum, rating) => sum + rating, 0) / costRatings.length 
    : 0;
  
  const avgCommunication = communicationRatings.length > 0 
    ? communicationRatings.reduce((sum, rating) => sum + rating, 0) / communicationRatings.length 
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
      timing: avgTiming,
      satisfaction: avgSatisfaction,
      cost: avgCost,
      communication: avgCommunication
    }
  };
}
