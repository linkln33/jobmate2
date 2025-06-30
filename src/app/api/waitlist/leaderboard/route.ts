/**
 * @file API route for waitlist leaderboard
 * @module app/api/waitlist/leaderboard
 * 
 * This API endpoint provides leaderboard data for the waitlist referral system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/services/waitlist/waitlistService';

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
    
    // Get leaderboard data
    const leaderboard = await getLeaderboard(limit);
    
    // Return success response with leaderboard data
    return NextResponse.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    
    // Handle errors
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data. Please try again later.' },
      { status: 500 }
    );
  }
}
