/**
 * @file Supabase admin client utility
 * @module utils/supabase-admin
 * 
 * This file provides a configured Supabase admin client for server-side operations
 * that require bypassing Row Level Security (RLS) policies.
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * For server-side API routes, we use the same anon key but with special headers
 * that allow us to bypass RLS policies
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// We don't need to bypass RLS since we've set up policies for anon users
// This client will work with the RLS policies we've created
