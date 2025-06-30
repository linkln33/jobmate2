import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient, getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';

/**
 * Base service class that provides common functionality for all services
 */
export class BaseService {
  protected supabase: SupabaseClient<Database>;
  protected isServer: boolean;
  protected isAdmin: boolean;

  /**
   * Creates a new service instance
   * @param options Service configuration options
   */
  constructor(options: { 
    isServer?: boolean; 
    isAdmin?: boolean;
  } = {}) {
    const { isServer = false, isAdmin = false } = options;
    this.isServer = isServer;
    this.isAdmin = isAdmin;
    
    if (isAdmin) {
      // Use service role client for admin operations
      this.supabase = getSupabaseServiceClient();
    } else if (isServer) {
      // Use server client for server-side operations
      // Note: This is async, so we'll need to initialize it in the init method
      this.supabase = getSupabaseClient();
    } else {
      // Use client-side client for browser operations
      this.supabase = getSupabaseClient();
    }
  }

  /**
   * Initialize the service (required for server-side services)
   */
  async init(): Promise<void> {
    if (this.isServer && !this.isAdmin) {
      this.supabase = await getSupabaseServerClient();
    }
  }

  /**
   * Handle Supabase errors
   * @param error Error object
   * @param customMessage Custom error message
   */
  protected handleError(error: any, customMessage?: string): never {
    console.error('Service error:', error);
    
    const message = customMessage || 'An error occurred while processing your request';
    const statusCode = error?.status || 500;
    const errorCode = error?.code || 'UNKNOWN_ERROR';
    
    throw new Error(JSON.stringify({
      message,
      statusCode,
      errorCode,
      details: error?.message || error?.toString() || 'No additional details',
    }));
  }

  /**
   * Check if the current user is authenticated
   * @returns User ID if authenticated
   */
  protected async getCurrentUserId(): Promise<string> {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    
    if (error) {
      this.handleError(error, 'Authentication error');
    }
    
    if (!session?.user) {
      this.handleError({ status: 401, code: 'UNAUTHORIZED' }, 'User not authenticated');
    }
    
    return session.user.id;
  }

  /**
   * Check if the current user is an admin
   * @returns Boolean indicating if user is admin
   */
  protected async isUserAdmin(): Promise<boolean> {
    const { data, error } = await this.supabase.rpc('is_admin');
    
    if (error) {
      this.handleError(error, 'Error checking admin status');
    }
    
    return !!data;
  }
}
