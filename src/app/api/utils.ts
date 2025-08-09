import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import { cookies } from 'next/headers';

/**
 * Helper to handle API authentication and error handling
 * @param handler API route handler function
 * @param options Configuration options
 * @returns Next.js API route handler
 */
export function createApiHandler<T>(
  handler: (
    req: NextRequest,
    context: { userId: string; supabase: any; params?: Record<string, string> }
  ) => Promise<T>,
  options: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
  } = {}
) {
  const { requireAuth = true, requireAdmin = false } = options;
  
  return async (
    req: NextRequest,
    routeContext?: { params?: Record<string, string> }
  ) => {
    try {
      // Initialize Supabase client
      const supabase = await getSupabaseServerClient();
      
      // Check authentication if required
      let userId: string | undefined;
      
      if (requireAuth || requireAdmin) {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }
        
        userId = session.user.id;
        
        // Check admin status if required
        if (requireAdmin) {
          const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
          
          if (adminError || !isAdmin) {
            return NextResponse.json(
              { error: 'Admin privileges required' },
              { status: 403 }
            );
          }
        }
      }
      
      // Call the handler with authenticated context
      const result = await handler(req, { 
        userId: userId as string, 
        supabase,
        params: routeContext?.params,
      });
      
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('API error:', error);
      
      // Parse error if it's our custom format
      try {
        const parsedError = JSON.parse(error.message);
        return NextResponse.json(
          { error: parsedError.message, details: parsedError.details },
          { status: parsedError.statusCode || 500 }
        );
      } catch {
        // Otherwise return a generic error
        return NextResponse.json(
          { error: error.message || 'An unexpected error occurred' },
          { status: 500 }
        );
      }
    }
  };
}

/**
 * Helper to validate request body against a schema
 * @param req Next.js request
 * @param schema Validation schema (e.g., Zod schema)
 * @returns Validated data or throws error
 */
export async function validateBody<T>(req: NextRequest, schema: any): Promise<T> {
  const body = await req.json().catch(() => ({}));
  
  try {
    return schema.parse(body);
  } catch (error: any) {
    throw new Error(JSON.stringify({
      message: 'Validation error',
      statusCode: 400,
      details: error.errors || error.message
    }));
  }
}

/**
 * Helper to get query parameters from a request
 * @param req Next.js request
 * @param key Query parameter key
 * @returns Query parameter value
 */
export function getQueryParam(req: NextRequest, key: string): string | null {
  const url = new URL(req.url);
  return url.searchParams.get(key);
}

/**
 * Helper to get numeric query parameters from a request
 * @param req Next.js request
 * @param key Query parameter key
 * @param defaultValue Default value if parameter is missing or invalid
 * @returns Numeric query parameter value
 */
export function getNumericQueryParam(
  req: NextRequest, 
  key: string, 
  defaultValue: number
): number {
  const value = getQueryParam(req, key);
  const parsed = value ? parseInt(value, 10) : NaN;
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Helper to get boolean query parameters from a request
 * @param req Next.js request
 * @param key Query parameter key
 * @param defaultValue Default value if parameter is missing
 * @returns Boolean query parameter value
 */
export function getBooleanQueryParam(
  req: NextRequest, 
  key: string, 
  defaultValue: boolean = false
): boolean {
  const value = getQueryParam(req, key);
  if (value === null) return defaultValue;
  return value === 'true' || value === '1';
}
