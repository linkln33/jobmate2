/**
 * @file API route for waitlist leaderboard
 * @module app/api/waitlist/leaderboard
 * 
 * This API endpoint provides leaderboard data for the waitlist referral system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';

/**
 * GET handler for waitlist leaderboard
 * @param request The incoming request object
 * @returns API response with leaderboard data or error
 */
export async function GET(request: NextRequest) {
  try {
    // Get limit parameter from query string (default to 10)
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Query the database for leaderboard data
    const { data: leaderboardData, error } = await supabaseAdmin
      .from('waitlist_users')
      .select('id, name, referral_code, points')
      .order('points', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Format the leaderboard data
    const leaderboard = leaderboardData.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      points: user.points,
      referralCode: user.referral_code
    }));
    
    // Return success response with leaderboard data
    return NextResponse.json({
      success: true,
      leaderboard
    });
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    
    // Handle errors
    return NextResponse.json(
      { 
        error: 'Failed to fetch leaderboard data. Please try again later.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
