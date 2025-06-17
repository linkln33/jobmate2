/**
 * Simple rate limiting middleware for Next.js API routes
 * Adapted from Next.js examples and rate-limiting best practices
 */

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Define rate limit window and max requests
type RateLimitConfig = {
  // Time window in seconds
  window: number;
  // Max requests per window
  limit: number;
  // Optional identifier function to customize how the limiter identifies requests
  identifierFn?: (req: NextRequest) => string;
};

// Default configurations for different rate limit tiers
export const RATE_LIMIT_CONFIGS = {
  // Default API rate limit (30 requests per minute)
  DEFAULT: {
    window: 60,
    limit: 30,
  },
  // Stricter limit for AI-powered endpoints (10 requests per minute)
  AI_ENDPOINTS: {
    window: 60,
    limit: 10,
  },
  // Very strict limit for token-heavy operations (5 requests per minute)
  GPT_ENDPOINTS: {
    window: 60,
    limit: 5,
  }
};

// Redis client for distributed rate limiting
// In production, use environment variables for connection details
let redis: Redis | null = null;

// Initialize Redis client if environment variables are set
const initRedis = () => {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      return true;
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
    }
  }
  return false;
};

// In-memory store for rate limiting in development or when Redis is unavailable
const inMemoryStore = new Map<string, { count: number; timestamp: number }>();

/**
 * Rate limiting middleware factory
 * @param config Rate limit configuration
 * @returns Middleware function for rate limiting
 */
export function createRateLimiter(config: RateLimitConfig = RATE_LIMIT_CONFIGS.DEFAULT) {
  return async function rateLimitMiddleware(req: NextRequest) {
    try {
      // Get client identifier (IP address by default)
      const identifier = config.identifierFn 
        ? config.identifierFn(req) 
        : req.ip || 'anonymous';
      
      // Create a unique key for this rate limit
      const key = `rate-limit:${identifier}:${req.nextUrl.pathname}`;
      
      // Try to use Redis if available, otherwise use in-memory store
      if (redis || initRedis()) {
        // Redis-based rate limiting
        const result = await redis!.get<{ count: number; timestamp: number }>(key);
        const now = Date.now();
        
        if (result) {
          // Check if the window has expired
          if (now - result.timestamp > config.window * 1000) {
            // Reset counter for new window
            await redis!.set(key, { count: 1, timestamp: now }, { ex: config.window });
          } else if (result.count >= config.limit) {
            // Rate limit exceeded
            return createRateLimitResponse(config);
          } else {
            // Increment counter
            await redis!.set(key, { count: result.count + 1, timestamp: result.timestamp }, { ex: config.window });
          }
        } else {
          // First request in this window
          await redis!.set(key, { count: 1, timestamp: now }, { ex: config.window });
        }
      } else {
        // In-memory rate limiting (fallback)
        const now = Date.now();
        const record = inMemoryStore.get(key);
        
        if (record) {
          // Check if the window has expired
          if (now - record.timestamp > config.window * 1000) {
            // Reset counter for new window
            inMemoryStore.set(key, { count: 1, timestamp: now });
          } else if (record.count >= config.limit) {
            // Rate limit exceeded
            return createRateLimitResponse(config);
          } else {
            // Increment counter
            inMemoryStore.set(key, { count: record.count + 1, timestamp: record.timestamp });
          }
        } else {
          // First request in this window
          inMemoryStore.set(key, { count: 1, timestamp: now });
        }
        
        // Clean up old entries periodically (every 100 requests)
        if (inMemoryStore.size % 100 === 0) {
          cleanupInMemoryStore();
        }
      }
      
      // Request is allowed to proceed
      return null;
    } catch (error) {
      console.error('Rate limiting error:', error);
      // In case of error, allow the request to proceed
      return null;
    }
  };
}

/**
 * Create a rate limit exceeded response
 */
function createRateLimitResponse(config: RateLimitConfig) {
  return NextResponse.json(
    {
      error: 'Rate limit exceeded',
      message: `Too many requests, please try again in ${config.window} seconds.`,
    },
    {
      status: 429,
      headers: {
        'Retry-After': config.window.toString(),
        'X-RateLimit-Limit': config.limit.toString(),
        'X-RateLimit-Reset-In': config.window.toString(),
      },
    }
  );
}

/**
 * Clean up expired entries from in-memory store
 */
function cleanupInMemoryStore() {
  const now = Date.now();
  // Use Array.from to avoid TypeScript iterator issues
  Array.from(inMemoryStore.entries()).forEach(([key, record]) => {
    if (now - record.timestamp > 3600000) { // Remove entries older than 1 hour
      inMemoryStore.delete(key);
    }
  });
}

/**
 * Apply rate limiting to a route handler
 * @param handler Next.js route handler
 * @param config Rate limit configuration
 * @returns Rate-limited route handler
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.DEFAULT
) {
  const rateLimiter = createRateLimiter(config);
  
  return async function rateLimit(req: NextRequest) {
    // Apply rate limiting
    const rateLimitResult = await rateLimiter(req);
    
    // If rate limit is exceeded, return the rate limit response
    if (rateLimitResult) {
      return rateLimitResult;
    }
    
    // Otherwise, proceed with the original handler
    return handler(req);
  };
}
