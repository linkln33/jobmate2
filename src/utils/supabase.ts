/**
 * @file Supabase client utility
 * @module utils/supabase
 * 
 * This file provides a configured Supabase client for use throughout the application.
 * It handles authentication, database operations, and storage functionality.
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase configuration
// These should be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Initialized Supabase client with public configuration
 * This client has limited permissions based on Row Level Security policies
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get user session data if available
 * @returns The current session or null if not authenticated
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return data.session;
}

/**
 * Check if a user is currently authenticated
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}
