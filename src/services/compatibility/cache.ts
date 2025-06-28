import { CompatibilityResult } from '@/types/compatibility';

/**
 * Cache service for compatibility results to improve performance
 */
export class CompatibilityCache {
  private cache: Map<string, { result: CompatibilityResult; timestamp: number }>;
  private readonly DEFAULT_TTL = 1000 * 60 * 60; // 1 hour in milliseconds
  
  constructor() {
    this.cache = new Map();
  }
  
  /**
   * Generate a cache key for a compatibility result
   */
  private generateKey(userId: string, listingId: string, category: string): string {
    return `${userId}:${category}:${listingId}`;
  }
  
  /**
   * Store a compatibility result in the cache
   */
  set(result: CompatibilityResult, ttl: number = this.DEFAULT_TTL): void {
    if (!result.userId || !result.listingId || !result.category) {
      console.warn('Cannot cache compatibility result without userId, listingId, and category');
      return;
    }
    
    const key = this.generateKey(result.userId, result.listingId, result.category);
    const timestamp = Date.now() + ttl;
    
    this.cache.set(key, { result, timestamp });
  }
  
  /**
   * Retrieve a compatibility result from the cache
   * Returns null if the result is not in the cache or has expired
   */
  get(userId: string, listingId: string, category: string): CompatibilityResult | null {
    const key = this.generateKey(userId, listingId, category);
    const cached = this.cache.get(key);
    
    // Return null if not in cache or expired
    if (!cached || cached.timestamp < Date.now()) {
      if (cached) {
        // Remove expired entry
        this.cache.delete(key);
      }
      return null;
    }
    
    return cached.result;
  }
  
  /**
   * Check if a compatibility result is in the cache and not expired
   */
  has(userId: string, listingId: string, category: string): boolean {
    const key = this.generateKey(userId, listingId, category);
    const cached = this.cache.get(key);
    
    return !!cached && cached.timestamp >= Date.now();
  }
  
  /**
   * Remove a compatibility result from the cache
   */
  invalidate(userId: string, listingId: string, category: string): void {
    const key = this.generateKey(userId, listingId, category);
    this.cache.delete(key);
  }
  
  /**
   * Remove all compatibility results for a specific user
   */
  invalidateForUser(userId: string): void {
    // Convert keys iterator to array to avoid iteration issues
    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (key.startsWith(`${userId}:`)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Remove all compatibility results for a specific listing
   */
  invalidateForListing(listingId: string): void {
    // Convert keys iterator to array to avoid iteration issues
    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (key.includes(`:${listingId}`)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Clear all cached compatibility results
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get the number of cached compatibility results
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * Clean up expired cache entries
   */
  cleanup(): void {
    const now = Date.now();
    // Convert entries iterator to array to avoid iteration issues
    const entries = Array.from(this.cache.entries());
    for (const [key, { timestamp }] of entries) {
      if (timestamp < now) {
        this.cache.delete(key);
      }
    }
  }
}

// Export a singleton instance
export const compatibilityCache = new CompatibilityCache();
