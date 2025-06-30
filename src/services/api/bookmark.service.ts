import { BaseService } from './base.service';
import { BookmarksTable, SavedSearchesTable, BookmarkWithListing } from '@/lib/supabase/types';

/**
 * Service for managing bookmarks and saved searches
 */
export class BookmarkService extends BaseService {
  /**
   * Get all bookmarks for the current user
   * @returns User's bookmarks with listing details
   */
  async getMyBookmarks(): Promise<BookmarkWithListing[]> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('bookmarks')
      .select(`
        *,
        listing:listings(
          id, title, description, budget_min, budget_max, 
          budget_type, status, created_at, user_id
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error, 'Failed to fetch bookmarks');
    }

    return data as unknown as BookmarkWithListing[];
  }

  /**
   * Create a new bookmark
   * @param listingId Listing ID to bookmark
   * @param notes Optional notes
   * @returns Created bookmark
   */
  async createBookmark(listingId: string, notes?: string): Promise<BookmarksTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Check if already bookmarked
    const { data: existingBookmark, error: checkError } = await this.supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .maybeSingle();
    
    if (checkError) {
      this.handleError(checkError, 'Failed to check existing bookmarks');
    }
    
    if (existingBookmark) {
      this.handleError(
        { status: 400, code: 'ALREADY_BOOKMARKED' }, 
        'You have already bookmarked this listing'
      );
    }
    
    const { data, error } = await this.supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        listing_id: listingId,
        notes
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to create bookmark');
    }

    return data;
  }

  /**
   * Update bookmark notes
   * @param id Bookmark ID
   * @param notes New notes
   * @returns Updated bookmark
   */
  async updateBookmarkNotes(id: string, notes: string): Promise<BookmarksTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('bookmarks')
      .update({ notes })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update bookmark');
    }

    return data;
  }

  /**
   * Delete a bookmark
   * @param id Bookmark ID
   * @returns Success status
   */
  async deleteBookmark(id: string): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    const { error } = await this.supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      this.handleError(error, 'Failed to delete bookmark');
    }

    return { success: true };
  }

  /**
   * Check if a listing is bookmarked by the current user
   * @param listingId Listing ID
   * @returns Boolean indicating if bookmarked
   */
  async isBookmarked(listingId: string): Promise<boolean> {
    try {
      const userId = await this.getCurrentUserId();
      
      const { data, error } = await this.supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('listing_id', listingId)
        .maybeSingle();
      
      if (error) {
        return false;
      }
      
      return !!data;
    } catch (error) {
      // User might not be authenticated
      return false;
    }
  }

  /**
   * Get all saved searches for the current user
   * @returns User's saved searches
   */
  async getMySavedSearches(): Promise<SavedSearchesTable['Row'][]> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error, 'Failed to fetch saved searches');
    }

    return data;
  }

  /**
   * Create a new saved search
   * @param search Search data
   * @returns Created saved search
   */
  async createSavedSearch(search: Omit<SavedSearchesTable['Insert'], 'user_id'>): Promise<SavedSearchesTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('saved_searches')
      .insert({
        ...search,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to create saved search');
    }

    return data;
  }

  /**
   * Update a saved search
   * @param id Saved search ID
   * @param search Search data to update
   * @returns Updated saved search
   */
  async updateSavedSearch(id: string, search: SavedSearchesTable['Update']): Promise<SavedSearchesTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('saved_searches')
      .update(search)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update saved search');
    }

    return data;
  }

  /**
   * Delete a saved search
   * @param id Saved search ID
   * @returns Success status
   */
  async deleteSavedSearch(id: string): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    const { error } = await this.supabase
      .from('saved_searches')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      this.handleError(error, 'Failed to delete saved search');
    }

    return { success: true };
  }

  /**
   * Toggle alert status for a saved search
   * @param id Saved search ID
   * @param isAlert Whether to enable alerts
   * @param frequency Alert frequency (if enabling)
   * @returns Updated saved search
   */
  async toggleSearchAlert(
    id: string, 
    isAlert: boolean, 
    frequency?: string
  ): Promise<SavedSearchesTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    const update: SavedSearchesTable['Update'] = { is_alert: isAlert };
    
    if (isAlert && frequency) {
      update.alert_frequency = frequency;
    }
    
    const { data, error } = await this.supabase
      .from('saved_searches')
      .update(update)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update search alert');
    }

    return data;
  }
}

// Export a singleton instance for client-side use
export const bookmarkService = new BookmarkService();
