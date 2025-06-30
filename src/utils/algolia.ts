/**
 * @file Algolia utility functions for JobMate's search functionality
 * @module utils/algolia
 * 
 * This file contains utilities for interacting with Algolia search service,
 * including client initialization, indexing operations, and configuration.
 */

// Using require syntax for compatibility
const algoliasearch = require('algoliasearch');

/**
 * Algolia application ID from environment variables
 * This is safe to expose in client-side code
 */
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'placeholder';

/**
 * Algolia admin API key from environment variables
 * @security This should NEVER be exposed client-side and should only be used in server-side code
 */
const ALGOLIA_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || 'placeholder';

/**
 * Algolia search-only API key from environment variables
 * This key has limited permissions and is safe to expose client-side
 */
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || 'placeholder';

/**
 * Algolia client initialized with admin API key
 * @security This client should only be used in server-side code
 */
export const adminClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

/**
 * Algolia client initialized with search-only API key
 * This client is safe to use in client-side code
 */
export const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

/**
 * Main Algolia index for JobMate listings
 * This index contains both jobs and specialists
 */
export const listingsIndex = adminClient.initIndex('jobmate_listings');

/**
 * Transforms a marketplace listing object into an Algolia record format
 * Extracts and formats relevant fields for search indexing
 *
 * @param {any} listing - The listing object to transform
 * @returns {Object} Formatted Algolia record with objectID and searchable fields
 */
export function transformListingToAlgoliaRecord(listing: any) {
  return {
    objectID: listing.id,
    // Core fields
    title: listing.title,
    description: listing.description,
    price: listing.price,
    priceUnit: listing.priceUnit,
    imageUrl: listing.imageUrl,
    tags: listing.tags || [],
    type: listing.type,
    category: listing.category,
    
    // Location data
    address: listing.address,
    lat: listing.lat,
    lng: listing.lng,
    
    // Seller information
    sellerId: listing.sellerId || listing.user?.id,
    sellerName: listing.sellerName || listing.user?.name,
    sellerImage: listing.sellerImage || listing.user?.avatar,
    
    // Additional metadata
    createdAt: listing.createdAt,
    status: listing.status || 'active',
  };
}

/**
 * Adds a single listing to the Algolia index
 * Transforms the listing to Algolia format before indexing
 *
 * @param {any} listing - The listing object to index
 * @returns {Promise} Promise resolving to the Algolia indexing result
 */
export async function indexListing(listing: any) {
  const record = transformListingToAlgoliaRecord(listing);
  return listingsIndex.saveObject(record);
}

/**
 * Updates an existing listing in the Algolia index
 * Only updates the fields that have changed
 *
 * @param {any} listing - The listing object to update
 * @returns {Promise} Promise resolving to the Algolia update result
 */
export async function updateListing(listing: any) {
  const record = transformListingToAlgoliaRecord(listing);
  return listingsIndex.partialUpdateObject(record);
}

/**
 * Removes a listing from the Algolia index by its objectID
 *
 * @param {string} objectID - The unique identifier of the listing to remove
 * @returns {Promise} Promise resolving to the Algolia deletion result
 */
export async function removeListing(objectID: string) {
  return listingsIndex.deleteObject(objectID);
}

/**
 * Batch indexes multiple listings to the Algolia index
 * More efficient than indexing listings one by one
 *
 * @param {any[]} listings - Array of listing objects to index
 * @returns {Promise} Promise resolving to the Algolia batch indexing result
 */
export async function batchIndexListings(listings: any[]) {
  const records = listings.map(transformListingToAlgoliaRecord);
  return listingsIndex.saveObjects(records);
}

/**
 * Configures the Algolia index settings
 * Sets up searchable attributes, facets, ranking, and other index configuration
 *
 * @returns {Promise} Promise resolving to the Algolia settings update result
 */
export async function configureIndexSettings() {
  return listingsIndex.setSettings({
    // Configure searchable attributes (in order of importance)
    searchableAttributes: [
      'title',
      'description',
      'tags',
      'category',
      'sellerName',
      'address',
    ],
    
    // Configure attributes for faceting (filtering)
    attributesForFaceting: [
      'type',
      'category',
      'tags',
      'status',
      'sellerId',
    ],
    
    // Configure ranking
    ranking: [
      'typo',
      'geo',
      'words',
      'filters',
      'proximity',
      'attribute',
      'exact',
      'custom',
    ],
    
    // Configure custom ranking factors
    customRanking: [
      'desc(createdAt)',
      'desc(price)',
    ],
  });
}
