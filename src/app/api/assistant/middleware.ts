/**
 * Rate limiting middleware for assistant API routes
 */
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';

/**
 * Apply appropriate rate limiting to assistant API routes
 * - Regular routes: DEFAULT tier (30 req/min)
 * - AI-powered routes: AI_ENDPOINTS tier (10 req/min)
 * - GPT/heavy routes: GPT_ENDPOINTS tier (5 req/min)
 */

// Helper to wrap route handlers with rate limiting
export function withAssistantRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  isAIEndpoint: boolean = false,
  isGPTEndpoint: boolean = false
) {
  // Select appropriate rate limit tier based on endpoint type
  const config = isGPTEndpoint 
    ? RATE_LIMIT_CONFIGS.GPT_ENDPOINTS
    : isAIEndpoint 
      ? RATE_LIMIT_CONFIGS.AI_ENDPOINTS 
      : RATE_LIMIT_CONFIGS.DEFAULT;
  
  // Apply rate limiting
  return withRateLimit(handler, config);
}

// Specific wrappers for different endpoint types
export const withStandardRateLimit = (handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) => 
  withAssistantRateLimit(handler, false, false);

export const withAIRateLimit = (handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) => 
  withAssistantRateLimit(handler, true, false);

export const withGPTRateLimit = (handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) => 
  withAssistantRateLimit(handler, false, true);
