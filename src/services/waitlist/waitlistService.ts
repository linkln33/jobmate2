/**
 * @file Waitlist service for managing waitlist users and referrals
 * @module services/waitlist/waitlistService
 * 
 * This service handles waitlist registration, referral tracking, and leaderboard functionality.
 */

import { supabase } from '@/utils/supabase';
import { nanoid } from 'nanoid';

/**
 * Waitlist user interface
 */
export interface WaitlistUser {
  id: string;
  email: string;
  name: string;
  referral_code: string;
  referred_by?: string;
  points: number;
  location?: string;
  interests?: string[];
  created_at: string;
}

/**
 * Waitlist referral interface
 */
export interface WaitlistReferral {
  id: string;
  referrer_id: string;
  referred_email: string;
  status: 'pending' | 'joined';
  points_awarded: number;
  created_at: string;
  converted_at?: string;
}

/**
 * Waitlist reward interface
 */
export interface WaitlistReward {
  id: string;
  user_id: string;
  reward_type: 'badge' | 'credit' | 'feature' | 'perk';
  reward_name: string;
  threshold: number;
  unlocked_at: string;
}

/**
 * Generate a unique referral code based on user's name
 * @param name User's name to base the code on
 * @returns Unique referral code
 */
export function generateReferralCode(name: string): string {
  // Create a base from the name (lowercase, no spaces or special chars)
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8);
  // Add a unique random string
  const random = nanoid(6);
  return `${base}-${random}`;
}

/**
 * Register a new user to the waitlist
 * @param userData User data including email, name, and optional fields
 * @returns The created waitlist user
 */
export async function registerWaitlistUser(userData: {
  email: string;
  name: string;
  location?: string;
  interests?: string[];
  referredBy?: string;
}): Promise<WaitlistUser> {
  // Generate a unique referral code for this user
  const referralCode = generateReferralCode(userData.name);
  
  // Find referrer ID if a referral code was provided
  let referrerId = null;
  if (userData.referredBy) {
    const { data: referrer } = await supabase
      .from('waitlist_users')
      .select('id')
      .eq('referral_code', userData.referredBy)
      .single();
      
    if (referrer) {
      referrerId = referrer.id;
    }
  }
  
  // Insert the new user into the waitlist_users table
  const { data, error } = await supabase
    .from('waitlist_users')
    .insert({
      email: userData.email,
      name: userData.name,
      referral_code: referralCode,
      referred_by: referrerId,
      points: 10, // Starting points for signing up
      location: userData.location || null,
      interests: userData.interests || []
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error registering waitlist user:', error);
    throw error;
  }
  
  // If this user was referred by someone, track the successful referral
  if (referrerId) {
    await trackSuccessfulReferral(referrerId, userData.email);
  }
  
  return data;
}

/**
 * Track a successful referral and award points to the referrer
 * @param referrerId ID of the user who referred
 * @param referredEmail Email of the user who was referred
 * @returns The created referral record
 */
export async function trackSuccessfulReferral(
  referrerId: string,
  referredEmail: string
): Promise<WaitlistReferral> {
  const POINTS_PER_REFERRAL = 100;
  
  // Record the referral
  const { data, error } = await supabase
    .from('waitlist_referrals')
    .insert({
      referrer_id: referrerId,
      referred_email: referredEmail,
      status: 'joined',
      points_awarded: POINTS_PER_REFERRAL,
      converted_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error tracking referral:', error);
    throw error;
  }
  
  // Award points to the referrer
  const { error: pointsError } = await supabase
    .from('waitlist_users')
    .update({ 
      points: supabase.rpc('increment', { 
        row_id: referrerId,
        table: 'waitlist_users',
        column: 'points',
        value: POINTS_PER_REFERRAL
      })
    })
    .eq('id', referrerId);
    
  if (pointsError) {
    console.error('Error awarding points:', pointsError);
    throw pointsError;
  }
  
  // Check and award any badges/rewards the user may have unlocked
  await checkAndAwardRewards(referrerId);
  
  return data;
}

/**
 * Get the leaderboard of top referrers
 * @param limit Maximum number of users to return
 * @returns Array of users with their points and referral counts
 */
export async function getLeaderboard(limit = 10): Promise<any[]> {
  const { data, error } = await supabase
    .from('waitlist_users')
    .select(`
      id, 
      name, 
      referral_code,
      points,
      waitlist_referrals!referrer_id(count)
    `)
    .order('points', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
  
  // Format the response to include referral count
  return data.map(user => ({
    id: user.id,
    name: user.name,
    referral_code: user.referral_code,
    points: user.points,
    referral_count: user.waitlist_referrals?.[0]?.count || 0
  }));
}

/**
 * Check and award rewards based on a user's referral count
 * @param userId ID of the user to check for rewards
 */
async function checkAndAwardRewards(userId: string): Promise<void> {
  // Get the user's current referral count
  const { data: referrals, error: countError } = await supabase
    .from('waitlist_referrals')
    .select('id')
    .eq('referrer_id', userId)
    .eq('status', 'joined');
    
  if (countError) {
    console.error('Error counting referrals:', countError);
    throw countError;
  }
  
  const referralCount = referrals?.length || 0;
  
  // Define the reward thresholds
  const rewards = [
    { threshold: 1, type: 'badge', name: 'Early Adopter' },
    { threshold: 3, type: 'feature', name: 'Beta Spotlight' },
    { threshold: 5, type: 'credit', name: 'Platform Credit ($5)' },
    { threshold: 10, type: 'perk', name: '0% Fee for Life' }
  ];
  
  // Check each reward threshold
  for (const reward of rewards) {
    if (referralCount >= reward.threshold) {
      // Check if this reward has already been awarded
      const { data: existingReward } = await supabase
        .from('waitlist_rewards')
        .select('id')
        .eq('user_id', userId)
        .eq('reward_name', reward.name)
        .single();
        
      // If not already awarded, grant it
      if (!existingReward) {
        const { error } = await supabase
          .from('waitlist_rewards')
          .insert({
            user_id: userId,
            reward_type: reward.type,
            reward_name: reward.name,
            threshold: reward.threshold
          });
          
        if (error) {
          console.error('Error awarding reward:', error);
          throw error;
        }
      }
    }
  }
}

/**
 * Get a user's waitlist status including points, referrals and rewards
 * @param userId ID of the user to get status for
 * @returns User status object with all relevant information
 */
export async function getUserWaitlistStatus(userId: string): Promise<any> {
  // Get user details
  const { data: user, error: userError } = await supabase
    .from('waitlist_users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (userError) {
    console.error('Error fetching user:', userError);
    throw userError;
  }
  
  // Get referrals
  const { data: referrals, error: referralsError } = await supabase
    .from('waitlist_referrals')
    .select('*')
    .eq('referrer_id', userId);
    
  if (referralsError) {
    console.error('Error fetching referrals:', referralsError);
    throw referralsError;
  }
  
  // Get rewards
  const { data: rewards, error: rewardsError } = await supabase
    .from('waitlist_rewards')
    .select('*')
    .eq('user_id', userId);
    
  if (rewardsError) {
    console.error('Error fetching rewards:', rewardsError);
    throw rewardsError;
  }
  
  return {
    user,
    referrals,
    rewards,
    stats: {
      totalReferrals: referrals.length,
      convertedReferrals: referrals.filter(r => r.status === 'joined').length,
      totalPoints: user.points,
      nextRewardThreshold: getNextRewardThreshold(referrals.length)
    }
  };
}

/**
 * Helper function to determine the next reward threshold
 * @param currentReferrals Current number of referrals
 * @returns Next threshold or null if all thresholds reached
 */
function getNextRewardThreshold(currentReferrals: number): number | null {
  const thresholds = [1, 3, 5, 10, 25];
  return thresholds.find(t => t > currentReferrals) || null;
}
