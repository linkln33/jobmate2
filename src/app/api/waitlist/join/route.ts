/**
 * @file API route for waitlist registration
 * @module app/api/waitlist/join
 * 
 * This API endpoint handles user registration for the waitlist system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { registerWaitlistUser } from '@/services/waitlist/waitlistService';

/**
 * POST handler for waitlist registration
 * @param request The incoming request object
 * @returns API response with user data or error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, name, location, interests, referredBy } = body;
    
    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required fields' },
        { status: 400 }
      );
    }
    
    // Register the user
    const user = await registerWaitlistUser({
      email,
      name,
      location,
      interests,
      referredBy
    });
    
    // Return success response with user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referral_code,
        points: user.points
      }
    });
  } catch (error: any) {
    console.error('Error in waitlist registration:', error);
    
    // Handle duplicate email error
    if (error.code === '23505' && error.message.includes('email')) {
      return NextResponse.json(
        { error: 'This email is already registered on the waitlist' },
        { status: 409 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again later.' },
      { status: 500 }
    );
  }
}
