import { NextRequest, NextResponse } from 'next/server';
import { getReferralsByUser, getUserReferralStats } from '@/services/referral/referralService';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }
    
    const referrals = await getReferralsByUser(userId);
    const stats = await getUserReferralStats(userId);
    
    return NextResponse.json({ 
      referrals,
      stats
    });
  } catch (error) {
    console.error('Error getting user referrals:', error);
    return NextResponse.json(
      { error: 'Failed to get user referrals' },
      { status: 500 }
    );
  }
}
