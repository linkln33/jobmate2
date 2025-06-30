import { BaseService } from './base.service';
import { ListingsTable, ListingAttachmentsTable, ListingTagsTable, ListingWithDetails } from '@/lib/supabase/types';

/**
 * Service for managing listings
 */
export class ListingService extends BaseService {
  /**
   * Get a listing by ID
   * @param id Listing ID
   * @returns Listing with details
   */
  async getListingById(id: string): Promise<ListingWithDetails> {
    // Increment view count
    await this.incrementViewCount(id);

    const { data, error } = await this.supabase
      .from('listings')
      .select(`
        *,
        profile:profiles(id, full_name, avatar_url),
        category:categories(id, name, slug),
        attachments:listing_attachments(*),
        tags:listing_tags(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      this.handleError(error, 'Failed to fetch listing');
    }

    return data as unknown as ListingWithDetails;
  }

  /**
   * Create a new listing
   * @param listing Listing data
   * @returns Created listing
   */
  async createListing(listing: Omit<ListingsTable['Insert'], 'user_id'>): Promise<ListingsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Check if user can create a listing
    const { data: canCreate, error: checkError } = await this.supabase
      .rpc('can_create_listing');
    
    if (checkError) {
      this.handleError(checkError, 'Failed to check listing creation permissions');
    }
    
    if (!canCreate) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You have reached your listing limit. Please upgrade your subscription to create more listings.'
      );
    }
    
    const { data, error } = await this.supabase
      .from('listings')
      .insert({ ...listing, user_id: userId })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to create listing');
    }

    return data;
  }

  /**
   * Update a listing
   * @param id Listing ID
   * @param listing Listing data to update
   * @returns Updated listing
   */
  async updateListing(id: string, listing: ListingsTable['Update']): Promise<ListingsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Verify ownership
    const { data: existingListing, error: fetchError } = await this.supabase
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch listing');
    }
    
    if (existingListing.user_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to update this listing'
      );
    }
    
    const { data, error } = await this.supabase
      .from('listings')
      .update(listing)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update listing');
    }

    return data;
  }

  /**
   * Delete a listing
   * @param id Listing ID
   * @returns Success status
   */
  async deleteListing(id: string): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    // Verify ownership
    const { data: existingListing, error: fetchError } = await this.supabase
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch listing');
    }
    
    if (existingListing.user_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to delete this listing'
      );
    }
    
    const { error } = await this.supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      this.handleError(error, 'Failed to delete listing');
    }

    return { success: true };
  }

  /**
   * Search for listings
   * @param params Search parameters
   * @returns Listings matching search criteria
   */
  async searchListings(params: {
    searchTerm?: string;
    categoryId?: string;
    minBudget?: number;
    maxBudget?: number;
    location?: string;
    maxDistance?: number;
    userLocation?: { lat: number; lng: number };
    status?: string[];
    tags?: string[];
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageSize?: number;
    pageNumber?: number;
  }) {
    const {
      searchTerm,
      categoryId,
      minBudget,
      maxBudget,
      location,
      maxDistance,
      userLocation,
      status = ['open'],
      tags,
      sortBy = 'created_at',
      sortDirection = 'desc',
      pageSize = 10,
      pageNumber = 1
    } = params;

    const { data, error } = await this.supabase.rpc('search_listings', {
      search_term: searchTerm,
      category_id: categoryId,
      min_budget: minBudget,
      max_budget: maxBudget,
      location,
      max_distance: maxDistance,
      user_location: userLocation ? { x: userLocation.lng, y: userLocation.lat } : null,
      status,
      tags,
      sort_by: sortBy,
      sort_direction: sortDirection,
      page_size: pageSize,
      page_number: pageNumber
    });

    if (error) {
      this.handleError(error, 'Failed to search listings');
    }

    return data;
  }

  /**
   * Get recommended listings for the current user
   * @param limit Maximum number of listings to return
   * @returns Recommended listings
   */
  async getRecommendedListings(limit: number = 10) {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase.rpc('get_recommended_listings', {
      for_user_id: userId,
      limit_count: limit
    });

    if (error) {
      this.handleError(error, 'Failed to get recommended listings');
    }

    return data;
  }

  /**
   * Get similar listings to a given listing
   * @param listingId Listing ID
   * @param limit Maximum number of listings to return
   * @returns Similar listings
   */
  async getSimilarListings(listingId: string, limit: number = 5) {
    const { data, error } = await this.supabase.rpc('get_similar_listings', {
      listing_id: listingId,
      limit_count: limit
    });

    if (error) {
      this.handleError(error, 'Failed to get similar listings');
    }

    return data;
  }

  /**
   * Get listings created by the current user
   * @returns User's listings
   */
  async getMyListings() {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error, 'Failed to fetch your listings');
    }

    return data;
  }

  /**
   * Add tags to a listing
   * @param listingId Listing ID
   * @param tags Tags to add
   * @returns Added tags
   */
  async addListingTags(listingId: string, tags: string[]): Promise<ListingTagsTable['Row'][]> {
    const userId = await this.getCurrentUserId();
    
    // Verify ownership
    const { data: existingListing, error: fetchError } = await this.supabase
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch listing');
    }
    
    if (existingListing.user_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to update this listing'
      );
    }
    
    // Prepare tags for insertion
    const tagsToInsert = tags.map(tag => ({
      listing_id: listingId,
      tag
    }));
    
    const { data, error } = await this.supabase
      .from('listing_tags')
      .insert(tagsToInsert)
      .select();

    if (error) {
      this.handleError(error, 'Failed to add tags');
    }

    return data;
  }

  /**
   * Upload an attachment to a listing
   * @param listingId Listing ID
   * @param file File to upload
   * @param isFeatured Whether this is a featured attachment
   * @returns Uploaded attachment
   */
  async uploadListingAttachment(
    listingId: string, 
    file: File, 
    isFeatured: boolean = false
  ): Promise<ListingAttachmentsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Verify ownership
    const { data: existingListing, error: fetchError } = await this.supabase
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch listing');
    }
    
    if (existingListing.user_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to update this listing'
      );
    }
    
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${listingId}/${fileName}`;

    const { error: uploadError } = await this.supabase
      .storage
      .from('listing_attachments')
      .upload(filePath, file, {
        contentType: file.type
      });

    if (uploadError) {
      this.handleError(uploadError, 'Failed to upload attachment');
    }

    const { data: { publicUrl } } = this.supabase
      .storage
      .from('listing_attachments')
      .getPublicUrl(filePath);

    // Create attachment record
    const { data, error } = await this.supabase
      .from('listing_attachments')
      .insert({
        listing_id: listingId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        is_featured: isFeatured
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to create attachment record');
    }

    return data;
  }

  /**
   * Delete a listing attachment
   * @param attachmentId Attachment ID
   * @returns Success status
   */
  async deleteListingAttachment(attachmentId: string): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    // Get attachment details
    const { data: attachment, error: fetchError } = await this.supabase
      .from('listing_attachments')
      .select('file_path, listing_id')
      .eq('id', attachmentId)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch attachment');
    }
    
    // Verify ownership
    const { data: listing, error: listingError } = await this.supabase
      .from('listings')
      .select('user_id')
      .eq('id', attachment.listing_id)
      .single();
    
    if (listingError) {
      this.handleError(listingError, 'Failed to fetch listing');
    }
    
    if (listing.user_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to delete this attachment'
      );
    }
    
    // Delete from storage
    const { error: storageError } = await this.supabase
      .storage
      .from('listing_attachments')
      .remove([attachment.file_path]);
    
    if (storageError) {
      this.handleError(storageError, 'Failed to delete attachment file');
    }
    
    // Delete record
    const { error } = await this.supabase
      .from('listing_attachments')
      .delete()
      .eq('id', attachmentId);

    if (error) {
      this.handleError(error, 'Failed to delete attachment record');
    }

    return { success: true };
  }

  /**
   * Increment the view count for a listing
   * @param listingId Listing ID
   * @private
   */
  private async incrementViewCount(listingId: string): Promise<void> {
    try {
      // This is a fire-and-forget operation, we don't need to wait for it
      await this.supabase.rpc('increment_listing_view', { listing_id: listingId });
    } catch (error) {
      // Just log the error, don't fail the whole request
      console.error('Failed to increment view count:', error);
    }
  }
}

// Export a singleton instance for client-side use
export const listingService = new ListingService();
