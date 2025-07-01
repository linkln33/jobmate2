/**
 * @file Mock Waitlist service for development and testing
 * @module services/waitlist/mockWaitlistService
 * 
 * This service provides mock implementations of waitlist functionality
 * for development and testing when Supabase is not available.
 */

import { nanoid } from 'nanoid';

// In-memory storage for mock data
const mockStorage = {
  users: new Map<string, any>(),
  referrals: new Map<string, any>(),
  rewards: new Map<string, any>()
};

// Generate a simple referral code from a name
function generateReferralCode(name: string): string {
  const prefix = name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 3);
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${randomPart}`;
}

/**
 * Register a new user to the waitlist
 */
export async function registerWaitlistUser(userData: {
  email: string;
  name: string;
  location?: string;
  interests?: string[];
  referredBy?: string;
}): Promise<any> {
  // Check if email already exists
  const userValues = Array.from(mockStorage.users.values());
  for (const user of userValues) {
    if (user.email === userData.email) {
      const error = new Error('This email is already registered on the waitlist');
      (error as any).code = '23505';
      throw error;
    }
  }

  // Generate ID and referral code
  const id = nanoid();
  const referralCode = generateReferralCode(userData.name);
  
  // Find referrer if provided
  let referrerId = null;
  if (userData.referredBy) {
    const userEntries = Array.from(mockStorage.users.entries());
    for (const [userId, user] of userEntries) {
      if (user.referral_code === userData.referredBy) {
        referrerId = userId;
        break;
      }
    }
  }
  
  // Create user record
  const timestamp = new Date().toISOString();
  const user = {
    id,
    email: userData.email,
    name: userData.name,
    referral_code: referralCode,
    referred_by: referrerId,
    points: 10,
    location: userData.location || null,
    interests: userData.interests || [],
    created_at: timestamp
  };
  
  // Store user
  mockStorage.users.set(id, user);
  
  // Handle referral if applicable
  if (referrerId) {
    await trackSuccessfulReferral(referrerId, userData.email);
  }
  
  return user;
}

/**
 * Track a successful referral
 */
export async function trackSuccessfulReferral(
  referrerId: string,
  referredEmail: string
): Promise<any> {
  const id = nanoid();
  const timestamp = new Date().toISOString();
  
  // Create referral record
  const referral = {
    id,
    referrer_id: referrerId,
    referred_email: referredEmail,
    status: 'joined',
    points_awarded: 50,
    created_at: timestamp,
    converted_at: timestamp
  };
  
  // Store referral
  mockStorage.referrals.set(id, referral);
  
  // Update referrer points
  const referrer = mockStorage.users.get(referrerId);
  if (referrer) {
    referrer.points += 50;
    
    // Check for rewards
    await checkAndAwardRewards(referrerId);
  }
  
  return referral;
}

/**
 * Get the leaderboard of top referrers
 */
export async function getLeaderboard(limit = 10): Promise<any[]> {
  // Convert users to array and sort by points
  const users = Array.from(mockStorage.users.values());
  users.sort((a, b) => b.points - a.points);
  
  // Take top users based on limit
  const topUsers = users.slice(0, limit);
  
  // Format response
  return topUsers.map((user, index) => {
    // Count referrals for this user
    let referralCount = 0;
    for (const referral of mockStorage.referrals.values()) {
      if (referral.referrer_id === user.id && referral.status === 'joined') {
        referralCount++;
      }
    }
    
    return {
      id: user.id,
      name: user.name,
      referral_code: user.referral_code,
      points: user.points,
      referral_count: referralCount,
      position: index + 1
    };
  });
}

/**
 * Check and award rewards based on referral count
 */
async function checkAndAwardRewards(userId: string): Promise<void> {
  // Count referrals
  let referralCount = 0;
  const referralValues = Array.from(mockStorage.referrals.values());
  for (const referral of referralValues) {
    if (referral.referrer_id === userId && referral.status === 'joined') {
      referralCount++;
    }
  }
  
  // Define reward thresholds
  const thresholds = [
    { count: 1, name: 'First Referral', type: 'badge' },
    { count: 3, name: 'Growing Network', type: 'badge' },
    { count: 5, name: 'Influencer', type: 'badge' },
    { count: 10, name: 'Super Referrer', type: 'badge' },
    { count: 25, name: 'Referral Legend', type: 'badge' }
  ];
  
  // Check each threshold
  for (const threshold of thresholds) {
    if (referralCount >= threshold.count) {
      // Create unique ID for the reward
      const rewardId = `${userId}-${threshold.name}`;
      
      // Only award if not already awarded
      if (!mockStorage.rewards.has(rewardId)) {
        const timestamp = new Date().toISOString();
        const reward = {
          id: nanoid(),
          user_id: userId,
          reward_type: threshold.type,
          reward_name: threshold.name,
          threshold: threshold.count,
          unlocked_at: timestamp
        };
        
        mockStorage.rewards.set(rewardId, reward);
      }
    }
  }
}

/**
 * Get a user's waitlist status
 */
export async function getUserWaitlistStatus(userId: string): Promise<any> {
  const user = mockStorage.users.get(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Count referrals
  let referralCount = 0;
  const referrals = [];
  const referralValues = Array.from(mockStorage.referrals.values());
  for (const referral of referralValues) {
    if (referral.referrer_id === userId) {
      referralCount++;
      if (referral.status === 'joined') {
        referrals.push(referral);
      }
    }
  }
  
  // Get rewards
  const rewards = [];
  const rewardValues = Array.from(mockStorage.rewards.values());
  for (const reward of rewardValues) {
    if (reward.user_id === userId) {
      rewards.push(reward);
    }
  }
  
  // Get next threshold
  const nextThreshold = getNextRewardThreshold(referralCount);
  
  return {
    user,
    stats: {
      referralCount,
      points: user.points,
      nextThreshold
    },
    referrals,
    rewards
  };
}

/**
 * Get badges for a specific user
 */
export async function getUserBadges(userId: string): Promise<string[]> {
  // Count referrals
  let referralCount = 0;
  const referralValues = Array.from(mockStorage.referrals.values());
  for (const referral of referralValues) {
    if (referral.referrer_id === userId && referral.status === 'joined') {
      referralCount++;
    }
  }
  
  // Define badges based on referral count
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
  
  // Super referrer badge (10+ referrals)
  if (referralCount >= 10) {
    badges.push('super_referrer');
  }
  
  return badges;
}

/**
 * Helper function to determine the next reward threshold
 */
function getNextRewardThreshold(currentReferrals: number): number | null {
  const thresholds = [1, 3, 5, 10, 25, 50, 100];
  const nextThreshold = thresholds.find(t => t > currentReferrals);
  return nextThreshold || null;
}

// Add some sample data for testing
function addSampleData() {
  // Add sample users
  const user1 = {
    id: 'user1',
    email: 'john@example.com',
    name: 'John Doe',
    referral_code: 'joh1234',
    referred_by: null,
    points: 150,
    location: 'New York',
    interests: ['tech', 'design'],
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  const user2 = {
    id: 'user2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    referral_code: 'jan5678',
    referred_by: 'user1',
    points: 80,
    location: 'San Francisco',
    interests: ['marketing', 'business'],
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  const user3 = {
    id: 'user3',
    email: 'bob@example.com',
    name: 'Bob Johnson',
    referral_code: 'bob9012',
    referred_by: 'user1',
    points: 10,
    location: 'Chicago',
    interests: ['finance'],
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  mockStorage.users.set(user1.id, user1);
  mockStorage.users.set(user2.id, user2);
  mockStorage.users.set(user3.id, user3);
  
  // Add sample referrals
  const referral1 = {
    id: 'ref1',
    referrer_id: 'user1',
    referred_email: 'jane@example.com',
    status: 'joined',
    points_awarded: 50,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    converted_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  const referral2 = {
    id: 'ref2',
    referrer_id: 'user1',
    referred_email: 'bob@example.com',
    status: 'joined',
    points_awarded: 50,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    converted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  mockStorage.referrals.set(referral1.id, referral1);
  mockStorage.referrals.set(referral2.id, referral2);
  
  // Add sample rewards
  const reward1 = {
    id: 'reward1',
    user_id: 'user1',
    reward_type: 'badge',
    reward_name: 'First Referral',
    threshold: 1,
    unlocked_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  mockStorage.rewards.set('user1-First Referral', reward1);
}

// Initialize sample data
addSampleData();
