import { CompatibilityCache, compatibilityCache } from '../cache';
import { CompatibilityResult, MainCategory } from '@/types/compatibility';

// Mock the Date.now function to control time in tests
const mockDateNow = jest.spyOn(Date, 'now');

describe('CompatibilityCache', () => {
  let cache: CompatibilityCache;
  const userId = 'user123';
  const listingId = 'listing456';
  const category: MainCategory = 'jobs';
  
  // Sample compatibility result for testing
  const sampleResult: CompatibilityResult = {
    overallScore: 85,
    dimensions: [
      { name: 'Skills Match', score: 90, weight: 0.5, description: 'Match between skills' },
      { name: 'Salary Match', score: 80, weight: 0.3, description: 'Match between salary expectations' }
    ],
    category: 'jobs',
    subcategory: 'full-time',
    listingId,
    userId,
    timestamp: new Date(),
    primaryMatchReason: 'Strong skills match',
    improvementSuggestions: ['Add more experience details']
  };

  beforeEach(() => {
    // Reset the cache before each test
    cache = new CompatibilityCache();
    
    // Reset the Date.now mock
    mockDateNow.mockReset();
    
    // Default mock time
    mockDateNow.mockReturnValue(1000);
  });

  afterAll(() => {
    mockDateNow.mockRestore();
  });

  test('should store and retrieve a compatibility result', () => {
    // Store the result in cache
    cache.set(sampleResult);
    
    // Retrieve the result
    const cachedResult = cache.get(userId, listingId, category);
    
    // Verify the result matches
    expect(cachedResult).toEqual(sampleResult);
  });

  test('should return null for non-existent cache entries', () => {
    // Try to get a result that doesn't exist
    const result = cache.get('nonexistent', listingId, category);
    
    // Should return null
    expect(result).toBeNull();
  });

  test('should respect TTL and expire cache entries', () => {
    // Set current time
    mockDateNow.mockReturnValue(1000);
    
    // Store with a short TTL (500ms)
    cache.set(sampleResult, 500);
    
    // Verify it's in cache immediately
    expect(cache.get(userId, listingId, category)).toEqual(sampleResult);
    
    // Advance time beyond TTL
    mockDateNow.mockReturnValue(2000);
    
    // Should now return null as entry has expired
    expect(cache.get(userId, listingId, category)).toBeNull();
  });

  test('should invalidate specific cache entries', () => {
    // Store multiple entries
    cache.set(sampleResult);
    cache.set({
      ...sampleResult,
      listingId: 'otherListing',
      overallScore: 70
    });
    
    // Invalidate specific entry
    cache.invalidate(userId, listingId, category);
    
    // Verify it's gone
    expect(cache.get(userId, listingId, category)).toBeNull();
    
    // But other entries remain
    expect(cache.get(userId, 'otherListing', category)).not.toBeNull();
  });

  test('should invalidate all entries for a user', () => {
    // Store multiple entries for the same user
    cache.set(sampleResult);
    cache.set({
      ...sampleResult,
      listingId: 'otherListing',
      category: 'rentals'
    });
    
    // Also add an entry for a different user
    cache.set({
      ...sampleResult,
      userId: 'otherUser'
    });
    
    // Invalidate all entries for our test user
    cache.invalidateForUser(userId);
    
    // Verify all entries for the user are gone
    expect(cache.get(userId, listingId, category)).toBeNull();
    expect(cache.get(userId, 'otherListing', 'rentals')).toBeNull();
    
    // But other user's entries remain
    expect(cache.get('otherUser', listingId, category)).not.toBeNull();
  });

  test('should invalidate all entries for a listing', () => {
    // Store multiple entries for the same listing
    cache.set(sampleResult);
    cache.set({
      ...sampleResult,
      userId: 'otherUser'
    });
    
    // Also add an entry for a different listing
    cache.set({
      ...sampleResult,
      listingId: 'otherListing'
    });
    
    // Invalidate all entries for our test listing
    cache.invalidateForListing(listingId);
    
    // Verify all entries for the listing are gone
    expect(cache.get(userId, listingId, category)).toBeNull();
    expect(cache.get('otherUser', listingId, category)).toBeNull();
    
    // But other listing entries remain
    expect(cache.get(userId, 'otherListing', category)).not.toBeNull();
  });

  test('should report correct cache size', () => {
    // Empty cache initially
    expect(cache.size()).toBe(0);
    
    // Add entries
    cache.set(sampleResult);
    expect(cache.size()).toBe(1);
    
    cache.set({
      ...sampleResult,
      listingId: 'otherListing'
    });
    expect(cache.size()).toBe(2);
    
    // Remove an entry
    cache.invalidate(userId, listingId, category);
    expect(cache.size()).toBe(1);
    
    // Clear all
    cache.clear();
    expect(cache.size()).toBe(0);
  });

  test('should cleanup expired entries', () => {
    // Set current time
    mockDateNow.mockReturnValue(1000);
    
    // Add some entries with different TTLs
    cache.set(sampleResult, 500); // Will expire soon
    cache.set({
      ...sampleResult,
      listingId: 'longLived',
    }, 2000); // Will not expire soon
    
    // Advance time
    mockDateNow.mockReturnValue(1800);
    
    // Run cleanup
    cache.cleanup();
    
    // First entry should be gone, second should remain
    expect(cache.get(userId, listingId, category)).toBeNull();
    expect(cache.get(userId, 'longLived', category)).not.toBeNull();
    expect(cache.size()).toBe(1);
  });

  test('should not cache entries without required fields', () => {
    // Try to cache an incomplete result
    cache.set({
      ...sampleResult,
      userId: undefined as unknown as string
    });
    
    // Should not be cached
    expect(cache.size()).toBe(0);
  });
});
