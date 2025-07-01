/**
 * @file API route for initializing waitlist database tables
 * @module app/api/waitlist/init
 * 
 * This API endpoint initializes the waitlist database tables if they don't exist.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

/**
 * POST handler for initializing waitlist database
 * @param request The incoming request object
 * @returns API response with status
 */
export async function POST(request: NextRequest) {
  try {
    // Create waitlist_users table
    await supabase.rpc('exec_sql', { 
      sql_query: `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Waitlist Users Table
        CREATE TABLE IF NOT EXISTS waitlist_users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          referral_code TEXT UNIQUE NOT NULL,
          referred_by UUID REFERENCES waitlist_users(id),
          points INTEGER NOT NULL DEFAULT 10,
          location TEXT,
          interests TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Waitlist Referrals Table
        CREATE TABLE IF NOT EXISTS waitlist_referrals (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          referrer_id UUID NOT NULL REFERENCES waitlist_users(id),
          referred_email TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          points_awarded INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          converted_at TIMESTAMP WITH TIME ZONE
        );

        -- Waitlist Rewards Table
        CREATE TABLE IF NOT EXISTS waitlist_rewards (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES waitlist_users(id),
          reward_type TEXT NOT NULL,
          reward_name TEXT NOT NULL,
          threshold INTEGER NOT NULL,
          unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Waitlist database tables initialized successfully'
    });
  } catch (error: any) {
    console.error('Error initializing waitlist database:', error);
    
    return NextResponse.json({
      error: 'Failed to initialize waitlist database. Please try again later.',
      details: error.message
    }, { status: 500 });
  }
}
