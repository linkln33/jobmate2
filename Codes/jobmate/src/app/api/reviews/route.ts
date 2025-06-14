import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ReviewType } from '@prisma/client';

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
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : 0;
    
    // Build the query
    const query: any = {
      isPublic: true
    };
    
    if (revieweeId) query.revieweeId = revieweeId;
    if (reviewerId) query.reviewerId = reviewerId;
    if (jobId) query.jobId = jobId;
    if (reviewType) query.reviewType = reviewType;
    
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
    
    // Calculate review statistics if revieweeId is provided
    let reviewStats = null;
    if (revieweeId) {
      reviewStats = await calculateReviewStatistics(revieweeId);
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
    
    // Check if the job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });
    
    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is authorized to review this job
    if (job.customerId !== user.id && job.specialistId !== user.id) {
      return NextResponse.json(
        { message: 'You are not authorized to review this job' },
        { status: 403 }
      );
    }
    
    // Check if the reviewee is part of the job
    if (revieweeId !== job.customerId && revieweeId !== job.specialistId) {
      return NextResponse.json(
        { message: 'Reviewee must be part of the job' },
        { status: 400 }
      );
    }
    
    // Check if the user has already reviewed this job for this reviewee
    const existingReview = await prisma.review.findFirst({
      where: {
        jobId,
        reviewerId: user.id,
        revieweeId
      }
    });
    
    if (existingReview) {
      return NextResponse.json(
        { message: 'You have already reviewed this job for this user' },
        { status: 409 }
      );
    }
    
    // Determine review type if not provided
    let determinedReviewType = reviewType;
    if (!determinedReviewType) {
      if (overallRating >= 4) {
        determinedReviewType = 'POSITIVE';
      } else if (overallRating >= 2) {
        determinedReviewType = 'NEUTRAL';
      } else {
        determinedReviewType = 'NEGATIVE';
      }
    }
    
    // Create the review
    const review = await prisma.$transaction(async (tx) => {
      // Create the review
      const newReview = await tx.review.create({
        data: {
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
        }
      });
      
      // Add media if provided
      if (mediaUrls && mediaUrls.length > 0) {
        for (const mediaUrl of mediaUrls) {
          await tx.reviewMedia.create({
            data: {
              reviewId: newReview.id,
              mediaUrl,
              mediaType: getMediaType(mediaUrl)
            }
          });
        }
      }
      
      // Update user's review statistics
      if (revieweeId) {
        const reviewStats = await calculateReviewStatistics(revieweeId);
        
        // Update specialist profile if reviewee is a specialist
        const specialistProfile = await tx.specialistProfile.findUnique({
          where: { userId: revieweeId }
        });
        
        if (specialistProfile) {
          await tx.specialistProfile.update({
            where: { userId: revieweeId },
            data: {
              averageRating: reviewStats.averageRating,
              positiveReviewPercentage: reviewStats.positivePercentage,
              totalReviews: reviewStats.totalReviews
            }
          });
        }
      }
      
      return newReview;
    });
    
    // Get the complete review with related data
    const completeReview = await prisma.review.findUnique({
      where: { id: review.id },
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
            title: true
          }
        },
        reviewMedia: true
      }
    });
    
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
  const timingRatings = reviews.filter(r => r.timingRating !== null).map(r => r.timingRating);
  const satisfactionRatings = reviews.filter(r => r.satisfactionRating !== null).map(r => r.satisfactionRating);
  const costRatings = reviews.filter(r => r.costRating !== null).map(r => r.costRating);
  const communicationRatings = reviews.filter(r => r.communicationRating !== null).map(r => r.communicationRating);
  
  const avgTiming = timingRatings.length > 0 
    ? timingRatings.reduce((sum, rating) => sum + rating, 0) / timingRatings.length 
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
