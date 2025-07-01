import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    console.log('Creating waitlist database tables...');
    
    // Enable UUID extension
    await supabaseAdmin.rpc('create_uuid_extension');
    
    // Create waitlist_users table
    const { error: usersTableError } = await supabaseAdmin.rpc('create_waitlist_users_table');
    if (usersTableError) {
      console.error('Error creating users table:', usersTableError);
    } else {
      console.log('Successfully created waitlist_users table');
    }
    
    // Create waitlist_referrals table
    const { error: referralsTableError } = await supabaseAdmin.rpc('create_waitlist_referrals_table');
    if (referralsTableError) {
      console.error('Error creating referrals table:', referralsTableError);
    } else {
      console.log('Successfully created waitlist_referrals table');
    }
    
    // Create waitlist_rewards table
    const { error: rewardsTableError } = await supabaseAdmin.rpc('create_waitlist_rewards_table');
    if (rewardsTableError) {
      console.error('Error creating rewards table:', rewardsTableError);
    } else {
      console.log('Successfully created waitlist_rewards table');
    }
    
    // Create waitlist_badges table
    const { error: badgesTableError } = await supabaseAdmin.rpc('create_waitlist_badges_table');
    if (badgesTableError) {
      console.error('Error creating badges table:', badgesTableError);
    } else {
      console.log('Successfully created waitlist_badges table');
    }
    
    // Disable RLS for all tables
    const { error: disableRlsError } = await supabaseAdmin.rpc('disable_rls_for_waitlist_tables');
    if (disableRlsError) {
      console.error('Error disabling RLS:', disableRlsError);
    } else {
      console.log('Successfully disabled RLS for waitlist tables');
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Waitlist tables created successfully',
      errors: {
        users: usersTableError?.message,
        referrals: referralsTableError?.message,
        rewards: rewardsTableError?.message,
        badges: badgesTableError?.message,
        rls: disableRlsError?.message
      }
    });
  } catch (error: any) {
    console.error('Unexpected error creating tables:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: 'Unexpected error creating tables'
    }, { status: 500 });
  }
}
