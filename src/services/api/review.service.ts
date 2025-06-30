import { BaseService } from './base.service';
import { ReviewsTable, ReviewCategoriesTable, ReviewWithDetails } from '@/lib/supabase/types';

/**
 * Service for managing reviews
 */
export class ReviewService extends BaseService {
  /**
   * Get a review by ID
   * @param id Review ID
   * @returns Review with details
   */
  async getReviewById(id: string): Promise<ReviewWithDetails> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(id, full_name, avatar_url),
        reviewee:profiles!reviewee_id(id, full_name, avatar_url),
        categories:review_categories(*),
        listing:listings(id, title)
      `)
      .eq('id', id)
      .single();

    if (error) {
      this.handleError(error, 'Failed to fetch review');
    }

    return data as unknown as ReviewWithDetails;
  }

  /**
   * Create a new review
   * @param review Review data
   * @param categories Optional category ratings
   * @returns Created review
   */
  async createReview(
    review: Omit<ReviewsTable['Insert'], 'reviewer_id'>,
    categories?: { category: string; rating: number }[]
  ): Promise<ReviewsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Check if user already reviewed this entity
    const { data: existingReview, error: checkError } = await this.supabase
      .from('reviews')
      .select('id')
      .eq('reviewer_id', userId)
      .eq('reviewee_id', review.reviewee_id)
      .eq('listing_id', review.listing_id || '')
      .eq('application_id', review.application_id || '')
      .maybeSingle();
    
    if (checkError) {
      this.handleError(checkError, 'Failed to check existing reviews');
    }
    
    if (existingReview) {
      this.handleError(
        { status: 400, code: 'ALREADY_REVIEWED' }, 
        'You have already submitted a review for this'
      );
    }
    
    // Check if user is allowed to review (must be part of completed application)
    if (review.application_id) {
      const { data: application, error: appError } = await this.supabase
        .from('applications')
        .select('status, applicant_id, listing_id, listings!inner(user_id)')
        .eq('id', review.application_id)
        .single();
      
      if (appError) {
        this.handleError(appError, 'Failed to check application');
      }
      
      const isApplicant = application.applicant_id === userId;
      const isListingOwner = application.listings.user_id === userId;
      
      if (!isApplicant && !isListingOwner) {
        this.handleError(
          { status: 403, code: 'FORBIDDEN' }, 
          'You are not authorized to review this application'
        );
      }
      
      if (application.status !== 'completed') {
        this.handleError(
          { status: 400, code: 'INVALID_STATUS' }, 
          'You can only review completed applications'
        );
      }
      
      // Set the correct reviewee_id based on who is reviewing
      if (isApplicant) {
        review.reviewee_id = application.listings.user_id;
      } else if (isListingOwner) {
        review.reviewee_id = application.applicant_id;
      }
      
      // Set listing_id if not provided
      if (!review.listing_id) {
        review.listing_id = application.listing_id;
      }
    }
    
    // Create the review
    const { data, error } = await this.supabase
      .from('reviews')
      .insert({ ...review, reviewer_id: userId })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to create review');
    }
    
    // Add category ratings if provided
    if (categories && categories.length > 0) {
      const categoriesToInsert = categories.map(cat => ({
        review_id: data.id,
        category: cat.category,
        rating: cat.rating
      }));
      
      const { error: catError } = await this.supabase
        .from('review_categories')
        .insert(categoriesToInsert);
      
      if (catError) {
        this.handleError(catError, 'Failed to add review categories');
      }
    }

    return data;
  }

  /**
   * Update a review
   * @param id Review ID
   * @param review Review data to update
   * @returns Updated review
   */
  async updateReview(id: string, review: ReviewsTable['Update']): Promise<ReviewsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Verify ownership
    const { data: existingReview, error: fetchError } = await this.supabase
      .from('reviews')
      .select('reviewer_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch review');
    }
    
    if (existingReview.reviewer_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to update this review'
      );
    }
    
    const { data, error } = await this.supabase
      .from('reviews')
      .update(review)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update review');
    }

    return data;
  }

  /**
   * Add a response to a review (for reviewee only)
   * @param id Review ID
   * @param response Response text
   * @returns Updated review
   */
  async respondToReview(id: string, response: string): Promise<ReviewsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Verify reviewee is current user
    const { data: existingReview, error: fetchError } = await this.supabase
      .from('reviews')
      .select('reviewee_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch review');
    }
    
    if (existingReview.reviewee_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'Only the person being reviewed can respond to this review'
      );
    }
    
    const { data, error } = await this.supabase
      .from('reviews')
      .update({ response })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to add response');
    }

    return data;
  }

  /**
   * Delete a review
   * @param id Review ID
   * @returns Success status
   */
  async deleteReview(id: string): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    // Verify ownership or admin
    const { data: existingReview, error: fetchError } = await this.supabase
      .from('reviews')
      .select('reviewer_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch review');
    }
    
    const isAdmin = await this.isUserAdmin();
    
    if (existingReview.reviewer_id !== userId && !isAdmin) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to delete this review'
      );
    }
    
    const { error } = await this.supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      this.handleError(error, 'Failed to delete review');
    }

    return { success: true };
  }

  /**
   * Get reviews for a user
   * @param userId User ID
   * @param asReviewer Whether to get reviews written by the user (true) or about the user (false)
   * @returns Reviews
   */
  async getUserReviews(userId: string, asReviewer: boolean = false): Promise<ReviewWithDetails[]> {
    const field = asReviewer ? 'reviewer_id' : 'reviewee_id';
    
    const { data, error } = await this.supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(id, full_name, avatar_url),
        reviewee:profiles!reviewee_id(id, full_name, avatar_url),
        categories:review_categories(*),
        listing:listings(id, title)
      `)
      .eq(field, userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error, 'Failed to fetch reviews');
    }

    return data as unknown as ReviewWithDetails[];
  }

  /**
   * Get reviews for a listing
   * @param listingId Listing ID
   * @returns Reviews
   */
  async getListingReviews(listingId: string): Promise<ReviewWithDetails[]> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(id, full_name, avatar_url),
        reviewee:profiles!reviewee_id(id, full_name, avatar_url),
        categories:review_categories(*),
        listing:listings(id, title)
      `)
      .eq('listing_id', listingId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error, 'Failed to fetch reviews');
    }

    return data as unknown as ReviewWithDetails[];
  }

  /**
   * Update review category ratings
   * @param reviewId Review ID
   * @param categories Category ratings
   * @returns Success status
   */
  async updateReviewCategories(
    reviewId: string, 
    categories: { category: string; rating: number }[]
  ): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    // Verify ownership
    const { data: existingReview, error: fetchError } = await this.supabase
      .from('reviews')
      .select('reviewer_id')
      .eq('id', reviewId)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch review');
    }
    
    if (existingReview.reviewer_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to update this review'
      );
    }
    
    // Delete existing categories
    const { error: deleteError } = await this.supabase
      .from('review_categories')
      .delete()
      .eq('review_id', reviewId);
    
    if (deleteError) {
      this.handleError(deleteError, 'Failed to update review categories');
    }
    
    // Add new categories
    if (categories.length > 0) {
      const categoriesToInsert = categories.map(cat => ({
        review_id: reviewId,
        category: cat.category,
        rating: cat.rating
      }));
      
      const { error: insertError } = await this.supabase
        .from('review_categories')
        .insert(categoriesToInsert);
      
      if (insertError) {
        this.handleError(insertError, 'Failed to add review categories');
      }
    }

    return { success: true };
  }
}

// Export a singleton instance for client-side use
export const reviewService = new ReviewService();
