import { 
  indexListing, 
  updateListing, 
  removeListing, 
  batchIndexListings,
  configureIndexSettings
} from './algolia';

/**
 * A utility class to handle Algolia indexing operations
 */
export class AlgoliaIndexer {
  /**
   * Initialize Algolia index with proper settings
   */
  static async initializeIndex() {
    try {
      await configureIndexSettings();
      console.log('Algolia index settings configured successfully');
      return true;
    } catch (error) {
      console.error('Error configuring Algolia index settings:', error);
      return false;
    }
  }

  /**
   * Index a single listing
   */
  static async addListing(listing: any) {
    try {
      await indexListing(listing);
      console.log(`Listing ${listing.id} indexed successfully`);
      return true;
    } catch (error) {
      console.error(`Error indexing listing ${listing.id}:`, error);
      return false;
    }
  }

  /**
   * Update a single listing
   */
  static async updateListing(listing: any) {
    try {
      await updateListing(listing);
      console.log(`Listing ${listing.id} updated successfully`);
      return true;
    } catch (error) {
      console.error(`Error updating listing ${listing.id}:`, error);
      return false;
    }
  }

  /**
   * Remove a single listing
   */
  static async removeListing(listingId: string) {
    try {
      await removeListing(listingId);
      console.log(`Listing ${listingId} removed successfully`);
      return true;
    } catch (error) {
      console.error(`Error removing listing ${listingId}:`, error);
      return false;
    }
  }

  /**
   * Batch index multiple listings
   */
  static async batchIndexListings(listings: any[]) {
    try {
      await batchIndexListings(listings);
      console.log(`${listings.length} listings indexed successfully`);
      return true;
    } catch (error) {
      console.error(`Error batch indexing ${listings.length} listings:`, error);
      return false;
    }
  }

  /**
   * Sync all listings from database to Algolia
   * This should be called periodically to ensure Algolia index is in sync with database
   */
  static async syncAllListings(fetchAllListings: () => Promise<any[]>) {
    try {
      const listings = await fetchAllListings();
      await batchIndexListings(listings);
      console.log(`Synced ${listings.length} listings to Algolia`);
      return true;
    } catch (error) {
      console.error('Error syncing listings to Algolia:', error);
      return false;
    }
  }
}
