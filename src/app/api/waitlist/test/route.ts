/**
 * @file API route for waitlist testing utilities
 * @module app/api/waitlist/test
 * 
 * This API endpoint provides testing utilities for the waitlist system.
 * IMPORTANT: This should only be used in development environments!
 */

import { NextRequest, NextResponse } from 'next/server';
import { clearWaitlistTestData, generateTestUsers, generateTestReferrals } from '@/utils/test-waitlist';

/**
 * POST handler for waitlist test operations
 * @param request NextRequest object containing test operation details
 * @returns NextResponse with operation results
 */
export async function POST(request: NextRequest) {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Test endpoints are not available in production' }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    const { operation, count } = body;
    
    switch (operation) {
      case 'clear':
        const clearResult = await clearWaitlistTestData();
        return NextResponse.json(clearResult);
        
      case 'generate_users':
        const userCount = count || 5;
        const usersResult = await generateTestUsers(userCount);
        return NextResponse.json(usersResult);
        
      case 'generate_referrals':
        const referralsResult = await generateTestReferrals();
        return NextResponse.json(referralsResult);
        
      case 'setup_test_data':
        // Clear existing data first
        await clearWaitlistTestData();
        
        // Generate users
        const userResult = await generateTestUsers(count || 10);
        if (!userResult.success) {
          return NextResponse.json({ 
            error: 'Failed to generate test users', 
            details: userResult.error 
          }, { status: 500 });
        }
        
        // Generate referrals
        const refResult = await generateTestReferrals();
        
        return NextResponse.json({
          success: true,
          message: 'Test data setup complete',
          users: userResult.users,
          referrals: refResult.success ? refResult.referrals : null
        });
        
      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error in test operation:', error);
    return NextResponse.json({ 
      error: 'Failed to perform test operation', 
      details: error.message 
    }, { status: 500 });
  }
}
