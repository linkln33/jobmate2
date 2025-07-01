/**
 * @file Waitlist service for managing waitlist users and referrals
 * @module services/waitlist/waitlistService
 * 
 * This service handles waitlist registration, referral tracking, and leaderboard functionality.
 */

import { supabase } from '@/utils/supabase';
import { nanoid } from 'nanoid';

/**
 * Initialize the database tables if they don't exist
 * This is a temporary solution for development purposes
 */
async function initializeDatabase() {
  try {
    // Check if waitlist_users table exists
    const { error: userTableError } = await supabase
      .from('waitlist_users')
      .select('id')
      .limit(1);

    if (userTableError) {
      console.log('Creating waitlist tables...');
      
      // Create waitlist_users table
      await supabase.rpc('create_waitlist_tables');
      
      console.log('Waitlist tables created successfully');
    } else {
      console.log('Waitlist tables already exist');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize database on service import
initializeDatabase();

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
  try {
    // Generate a unique referral code for this user
    const referralCode = generateReferralCode(userData.name);
    
    // Find referrer ID if a referral code was provided
    let referrerId = null;
    if (userData.referredBy) {
      try {
        const { data: referrer } = await supabase
          .from('waitlist_users')
          .select('id')
          .eq('referral_code', userData.referredBy)
          .single();
          
        if (referrer) {
          referrerId = referrer.id;
        }
      } catch (err) {
        console.log('Referrer not found, continuing without referrer');
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
      // If the error is because the table doesn't exist, try to initialize the database
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        console.log('Tables not found, attempting to initialize database...');
        await fetch('/api/waitlist/init', { method: 'POST' });
        
        // Try again after initializing
        return registerWaitlistUser(userData);
      }
      
      console.error('Error registering waitlist user:', error);
      throw error;
    }
    
    // If this user was referred by someone, track the successful referral
    if (referrerId) {
      try {
        await trackSuccessfulReferral(referrerId, userData.email);
      } catch (err) {
        console.error('Error tracking referral, but user was created:', err);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error in registerWaitlistUser:', error);
    throw error;
  }
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
  
  // Format the response to include referral count and position
  return data.map((user, index) => ({
    id: user.id,
    name: user.name,
    referral_code: user.referral_code,
    points: user.points,
    referral_count: user.waitlist_referrals?.[0]?.count || 0,
    position: index + 1 // Add position based on array index
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
  const thresholds = [1, 3, 5, 10, 25, 50, 100];
  const nextThreshold = thresholds.find(t => t > currentReferrals);
  return nextThreshold || null;
}

/**
 * Get badges for a specific user
 * @param userId ID of the user to get badges for
 * @returns Array of badge IDs that the user has unlocked
 */
export async function getUserBadges(userId: string): Promise<string[]> {
  try {
    // Get user's rewards that are badges
    const { data: badgeRewards, error: badgeError } = await supabase
      .from('waitlist_rewards')
      .select('reward_name')
      .eq('user_id', userId)
      .eq('reward_type', 'badge');
      
    if (badgeError) {
      console.error('Error fetching user badges:', badgeError);
      throw badgeError;
    }
    
    // Get user's referral count for badge calculation
    const { data: referrals, error: refError } = await supabase
      .from('waitlist_referrals')
      .select('id')
      .eq('referrer_id', userId)
      .eq('status', 'joined');
      
    if (refError) {
      console.error('Error counting referrals:', refError);
      throw refError;
    }
    
    const referralCount = referrals?.length || 0;
    
    // Define badge IDs based on rewards and referral count
    const badges: string[] = [];
    
    // Early adopter badge (everyone gets this)
    badges.push('early_adopter');
    
    // First referral badge
    if (referralCount >= 1) {
      badges.push('first_referral');
    }
    
    // Influencer badge (5+ referrals)
    if (referralCount >= 5) {
      badges.push('influencer');
    }
    
    // Add any additional badges from the rewards table
    badgeRewards?.forEach(reward => {
      // Map reward names to badge IDs if needed
      if (reward.reward_name === 'Super Referrer' && !badges.includes('super_referrer')) {
        badges.push('super_referrer');
      }
    });
    
    return badges;
  } catch (error) {
    console.error('Error in getUserBadges:', error);
    throw error;
  }
}
