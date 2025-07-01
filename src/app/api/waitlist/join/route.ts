/**
 * @file API route for waitlist registration
 * @module app/api/waitlist/join
 * 
 * This API endpoint handles user registration for the waitlist system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { generateReferralCode } from '@/utils/helpers';

/**
 * POST handler for waitlist registration
 * @param request NextRequest object containing user data
 * @returns NextResponse with user data or error message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, location, interests, referredBy } = body;
    
    // Validate required fields
    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required fields' }, { status: 400 });
    }
    
    // Generate a unique referral code based on the user's name
    const referralCode = generateReferralCode(name);
    
    // Check if the referral code exists and generate a new one if needed
    const { data: existingCodes } = await supabaseAdmin
      .from('waitlist_users')
      .select('referral_code')
      .eq('referral_code', referralCode);
      
    const finalReferralCode = existingCodes && existingCodes.length > 0 
      ? generateReferralCode(name + Date.now()) 
      : referralCode;
    
    // Check if the user with this email already exists
    const { data: existingUser } = await supabaseAdmin
      .from('waitlist_users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          referralCode: existingUser.referral_code,
          points: existingUser.points
        },
        message: 'User already registered'
      });
    }
    
    // Find the referrer if a referral code was provided
    let referrerId = null;
    if (referredBy) {
      const { data: referrer } = await supabaseAdmin
        .from('waitlist_users')
        .select('id')
        .eq('referral_code', referredBy)
        .single();
        
      if (referrer) {
        referrerId = referrer.id;
        
        // Award points to the referrer
        await supabaseAdmin
          .from('waitlist_users')
          .update({ points: supabaseAdmin.rpc('add_points', { user_id: referrer.id, points_to_add: 5 }) })
          .eq('id', referrer.id);
      }
    }
    
    // Insert the new user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('waitlist_users')
      .insert([
        { 
          name, 
          email, 
          referral_code: finalReferralCode,
          referred_by: referrerId,
          location: location || null,
          interests: interests || []
        }
      ])
      .select()
      .single();
      
    if (insertError) {
      console.error('Error inserting user:', insertError);
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'This email is already registered on the waitlist' }, { status: 409 });
      }
      throw insertError;
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        referralCode: newUser.referral_code,
        points: newUser.points
      }
    });
  } catch (error: any) {
    console.error('Waitlist registration error:', error);
    return NextResponse.json({ 
      error: 'Failed to join waitlist. Please try again later.',
      details: error.message
    }, { status: 500 });
  }
}
