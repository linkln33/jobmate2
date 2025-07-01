import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    console.log('Initializing waitlist database tables...');
    
    // Create waitlist_users table
    const { error: usersError } = await supabaseAdmin.from('waitlist_users').select('count').limit(1).then(
      async () => ({ error: null }),
      async () => {
        console.log('Creating waitlist_users table...');
        return await supabaseAdmin.rpc('create_waitlist_users_table');
      }
    );
    
    if (usersError) {
      console.error('Error creating waitlist_users table:', usersError);
    }
    
    // Create waitlist_referrals table
    const { error: referralsError } = await supabaseAdmin.from('waitlist_referrals').select('count').limit(1).then(
      async () => ({ error: null }),
      async () => {
        console.log('Creating waitlist_referrals table...');
        return await supabaseAdmin.rpc('create_waitlist_referrals_table');
      }
    );
    
    if (referralsError) {
      console.error('Error creating waitlist_referrals table:', referralsError);
    }
    
    // Create waitlist_rewards table
    const { error: rewardsError } = await supabaseAdmin.from('waitlist_rewards').select('count').limit(1).then(
      async () => ({ error: null }),
      async () => {
        console.log('Creating waitlist_rewards table...');
        return await supabaseAdmin.rpc('create_waitlist_rewards_table');
      }
    );
    
    if (rewardsError) {
      console.error('Error creating waitlist_rewards table:', rewardsError);
    }
    
    // Create waitlist_badges table
    const { error: badgesError } = await supabaseAdmin.from('waitlist_badges').select('count').limit(1).then(
      async () => ({ error: null }),
      async () => {
        console.log('Creating waitlist_badges table...');
        return await supabaseAdmin.rpc('create_waitlist_badges_table');
      }
    );
    
    if (badgesError) {
      console.error('Error creating waitlist_badges table:', badgesError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables initialized successfully',
      errors: {
        users: usersError?.message,
        referrals: referralsError?.message,
        rewards: rewardsError?.message,
        badges: badgesError?.message
      }
    });
  } catch (error: any) {
    console.error('Unexpected error initializing database:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: 'Unexpected error initializing database'
    }, { status: 500 });
  }
}
