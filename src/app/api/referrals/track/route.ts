import { NextRequest, NextResponse } from 'next/server';
import { trackReferralClick } from '@/services/referral/referralService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralId, visitorId } = body;
    
    if (!referralId) {
      return NextResponse.json(
        { error: 'Missing referral ID' },
        { status: 400 }
      );
    }
    
    const updatedReferral = await trackReferralClick(referralId, visitorId);
    
    if (!updatedReferral) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ referral: updatedReferral });
  } catch (error) {
    console.error('Error tracking referral click:', error);
    return NextResponse.json(
      { error: 'Failed to track referral click' },
      { status: 500 }
    );
  }
}
