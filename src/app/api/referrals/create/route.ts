import { NextRequest, NextResponse } from 'next/server';
import { createReferral } from '@/services/referral/referralService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referrerId, listingId, listingType } = body;
    
    if (!referrerId || !listingId || !listingType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newReferral = await createReferral(referrerId, listingId, listingType);
    
    return NextResponse.json({ referral: newReferral });
  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json(
      { error: 'Failed to create referral' },
      { status: 500 }
    );
  }
}
