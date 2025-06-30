/**
 * @file API route for waitlist user status
 * @module app/api/waitlist/status
 * 
 * This API endpoint provides user status information for the waitlist system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserWaitlistStatus } from '@/services/waitlist/waitlistService';

/**
 * GET handler for waitlist user status
 * @param request The incoming request object
 * @returns API response with user status data or error
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from query string
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Get user status
    const status = await getUserWaitlistStatus(userId);
    
    // Return success response with status data
    return NextResponse.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error fetching user status:', error);
    
    // Handle errors
    return NextResponse.json(
      { error: 'Failed to fetch user status. Please try again later.' },
      { status: 500 }
    );
  }
}
