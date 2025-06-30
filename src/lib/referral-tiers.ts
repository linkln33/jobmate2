// Referral tier system for gamification

export interface ReferralTier {
  name: string;
  minReferrals: number;
  commissionRate: number;
  icon: string;
  color: string;
}

// Define the referral tiers
export const referralTiers: ReferralTier[] = [
  {
    name: 'Bronze',
    minReferrals: 0,
    commissionRate: 0.03, // 3%
    icon: '/icons/bronze-badge.svg',
    color: '#CD7F32'
  },
  {
    name: 'Silver',
    minReferrals: 5,
    commissionRate: 0.05, // 5%
    icon: '/icons/silver-badge.svg',
    color: '#C0C0C0'
  },
  {
    name: 'Gold',
    minReferrals: 15,
    commissionRate: 0.07, // 7%
    icon: '/icons/gold-badge.svg',
    color: '#FFD700'
  },
  {
    name: 'Platinum',
    minReferrals: 30,
    commissionRate: 0.10, // 10%
    icon: '/icons/platinum-badge.svg',
    color: '#E5E4E2'
  }
];

/**
 * Get the user's current tier based on their referral count
 * @param referralCount Number of successful referrals
 * @returns The user's current tier
 */
export function getUserTier(referralCount: number): ReferralTier {
  // Return highest tier the user qualifies for
  for (let i = referralTiers.length - 1; i >= 0; i--) {
    if (referralCount >= referralTiers[i].minReferrals) {
      return referralTiers[i];
    }
  }
  return referralTiers[0]; // Default to Bronze
}

/**
 * Calculate progress to the next tier
 * @param referralCount Number of successful referrals
 * @returns Progress information
 */
export function calculateTierProgress(referralCount: number): {
  currentTier: ReferralTier;
  nextTier: ReferralTier | null;
  progress: number;
  remaining: number;
} {
  const currentTier = getUserTier(referralCount);
  const currentTierIndex = referralTiers.findIndex(tier => tier.name === currentTier.name);
  const nextTier = currentTierIndex < referralTiers.length - 1 
    ? referralTiers[currentTierIndex + 1] 
    : null;
  
  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progress: 100,
      remaining: 0
    };
  }
  
  const range = nextTier.minReferrals - currentTier.minReferrals;
  const progress = ((referralCount - currentTier.minReferrals) / range) * 100;
  const remaining = nextTier.minReferrals - referralCount;
  
  return {
    currentTier,
    nextTier,
    progress: Math.min(100, Math.max(0, progress)),
    remaining
  };
}
