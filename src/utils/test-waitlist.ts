/**
 * Waitlist Testing Utility
 * 
 * This file provides helper functions to test the waitlist system functionality
 */

import { supabaseAdmin } from './supabase-admin';

/**
 * Clear all waitlist test data
 * Only use this in development/testing environments!
 */
export async function clearWaitlistTestData() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot clear data in production environment');
  }
  
  try {
    // Delete data from tables in reverse order of dependencies
    await supabaseAdmin.from('waitlist_badges').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('waitlist_rewards').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('waitlist_referrals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('waitlist_users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    return { success: true, message: 'All test data cleared successfully' };
  } catch (error: any) {
    console.error('Error clearing test data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate test users for the waitlist
 * @param count Number of test users to generate
 */
export async function generateTestUsers(count: number = 5) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot generate test data in production environment');
  }
  
  try {
    const users = [];
    
    for (let i = 0; i < count; i++) {
      const name = `Test User ${i + 1}`;
      const email = `test${i + 1}@example.com`;
      const referralCode = `TEST${i + 1}${Math.floor(Math.random() * 1000)}`;
      
      const { data: user, error } = await supabaseAdmin
        .from('waitlist_users')
        .insert([
          { name, email, referral_code: referralCode, points: 10 + (i * 5) }
        ])
        .select()
        .single();
        
      if (error) {
        if (error.code === '23505') { // Duplicate key error
          console.log(`User ${email} already exists, skipping`);
          continue;
        }
        throw error;
      }
      
      users.push(user);
    }
    
    return { success: true, users };
  } catch (error: any) {
    console.error('Error generating test users:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate test referrals between users
 */
export async function generateTestReferrals() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot generate test data in production environment');
  }
  
  try {
    // Get existing users
    const { data: users } = await supabaseAdmin
      .from('waitlist_users')
      .select('id, email')
      .order('created_at', { ascending: true })
      .limit(10);
      
    if (!users || users.length < 2) {
      throw new Error('Not enough users to create referrals');
    }
    
    // Create referrals (first user refers others)
    const referrer = users[0];
    const referrals = [];
    
    for (let i = 1; i < users.length; i++) {
      // Update the referred user
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('waitlist_users')
        .update({ referred_by: referrer.id })
        .eq('id', users[i].id)
        .select();
        
      if (updateError) {
        console.error(`Error updating referred user ${users[i].email}:`, updateError);
        continue;
      }
      
      // Create referral record
      const { data: referral, error: referralError } = await supabaseAdmin
        .from('waitlist_referrals')
        .insert([
          {
            referrer_id: referrer.id,
            referred_email: users[i].email,
            status: 'converted',
            points_awarded: 5,
            converted_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (referralError) {
        console.error(`Error creating referral for ${users[i].email}:`, referralError);
        continue;
      }
      
      referrals.push(referral);
      
      // Award points to referrer
      await supabaseAdmin
        .from('waitlist_users')
        .update({ points: supabaseAdmin.rpc('add_points', { user_id: referrer.id, points_to_add: 5 }) })
        .eq('id', referrer.id);
    }
    
    return { success: true, referrals };
  } catch (error: any) {
    console.error('Error generating test referrals:', error);
    return { success: false, error: error.message };
  }
}
