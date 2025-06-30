import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Initialize the Supabase client with environment variables
// These should be set in .env.local or in the deployment environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export a function to get a fresh client (useful for server components)
export const getSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Export a function to get a client with user context (for server actions)
export const getSupabaseServerClient = async () => {
  const { cookies } = await import('next/headers');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name) => cookies().get(name)?.value,
        set: () => {}, // No-op as we're in a server context
        remove: () => {}, // No-op as we're in a server context
      },
    }
  );
};

// Export a function to get a client with admin privileges (for trusted server operations)
export const getSupabaseServiceClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
};
