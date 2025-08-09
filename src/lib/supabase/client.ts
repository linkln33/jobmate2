import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Helpers to ensure env is present before creating clients
function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Export a function to get a fresh client (works in client or server)
export const getSupabaseClient = () => {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anon = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return createClient<Database>(url, anon);
};

// Export a function to get a client with user context (for server components/actions)
export const getSupabaseServerClient = () => {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anon = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return createClient<Database>(url, anon);
};

// Export a function to get a client with admin privileges (trusted server operations)
export const getSupabaseServiceClient = () => {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY);
  return createClient<Database>(url, serviceKey);
};
