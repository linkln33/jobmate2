/**
 * @file API route for waitlist user badges
 * @module app/api/waitlist/user/[id]/badges
 * 
 * This API endpoint retrieves badges earned by a waitlist user based on their referral activity.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';

/**
 * GET handler for retrieving user badges
 * @param request The incoming request object
 * @param params Route parameters containing the user ID
 * @returns API response with user badges or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Get user's referral count to determine badges
    const { count, error: referralsError } = await supabaseAdmin
      .from('waitlist_users')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', userId);
      
    if (referralsError) {
      throw referralsError;
    }
    
    // Use the count safely with a default of 0
    const referralCount = count || 0;
    
    // Determine which badges the user has earned
    const badges = [
      'early_adopter', // Everyone gets this badge
      ...(referralCount >= 1 ? ['first_referral'] : []),
      ...(referralCount >= 5 ? ['influencer'] : [])
    ];
    
    return NextResponse.json({ badges });
  } catch (error: any) {
    console.error('Error fetching user badges:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user badges',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
