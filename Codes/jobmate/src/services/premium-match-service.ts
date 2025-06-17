import { MatchResult, Specialist, Job, matchService } from '@/services/match-service';

// Define premium specialist features
export interface PremiumFeatures {
  isPremium: boolean;
  premiumLevel?: 'basic' | 'pro' | 'elite';
  featuredProfile?: boolean;
  priorityMatching?: boolean;
  instantBooking?: boolean;
  verifiedOnly?: boolean;
  boostFactor?: number; // How much to boost match scores (1.0-1.3)
  premiumSince?: Date;
  premiumUntil?: Date;
}

// Extend specialist type to include premium features
export interface PremiumSpecialist extends Specialist {
  premium?: PremiumFeatures;
}

// Define client reputation data
export interface ClientReputation {
  id: string;
  overallRating: number; // 1-5 stars
  reliability: number; // 1-5
  communication: number; // 1-5
  fairPayment: number; // 1-5
  respectfulness: number; // 1-5
  totalRatings: number;
  badges: string[]; // e.g., "Fair Payer", "Respectful", "Reliable"
}

// Extend job type to include client reputation
export interface PremiumJob extends Job {
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    reputation?: ClientReputation;
  };
}

/**
 * Premium Match Service - Extends the base match service with premium features
 */
export class PremiumMatchService {
  /**
   * Calculate match score with premium features considered
   */
  calculatePremiumMatchScore(
    job: PremiumJob,
    specialist: PremiumSpecialist
  ): MatchResult {
    // First get the base match result
    const baseMatchResult = matchService.calculateMatchScore(job, specialist);
    
    // Apply premium boosts if applicable
    if (specialist.premium?.isPremium) {
      return this.applyPremiumBoosts(baseMatchResult, specialist.premium);
    }
    
    return baseMatchResult;
  }
  
  /**
   * Apply premium boosts to match result
   */
  private applyPremiumBoosts(
    matchResult: MatchResult,
    premiumFeatures: PremiumFeatures
  ): MatchResult {
    // Get boost factor based on premium level
    const boostFactor = premiumFeatures.boostFactor || this.getPremiumBoostFactor(premiumFeatures.premiumLevel);
    
    // Create a copy of the match result with boosted score
    const boostedResult: MatchResult = {
      score: Math.min(100, Math.round(matchResult.score * boostFactor)),
      factors: {
        ...matchResult.factors
      },
      explanations: []
    };
    
    // Initialize explanations array if it doesn't exist
    if (matchResult.explanations) {
      boostedResult.explanations = [...matchResult.explanations];
    }
    
    // Add explanation for premium boost
    if (!boostedResult.explanations) {
      boostedResult.explanations = [];
    }
    
    boostedResult.explanations.push(
      `Premium ${premiumFeatures.premiumLevel || ''} status applied a ${Math.round((boostFactor - 1) * 100)}% boost to your match score.`
    );
    
    // If featured profile is enabled, add explanation
    if (premiumFeatures.featuredProfile) {
      boostedResult.explanations.push(
        'Your profile is featured in search results and match listings.'
      );
    }
    
    return boostedResult;
  }
  
  /**
   * Get boost factor based on premium level
   */
  private getPremiumBoostFactor(level?: 'basic' | 'pro' | 'elite'): number {
    switch (level) {
      case 'basic':
        return 1.05; // 5% boost
      case 'pro':
        return 1.10; // 10% boost
      case 'elite':
        return 1.15; // 15% boost
      default:
        return 1.05; // Default 5% boost
    }
  }
  
  /**
   * Calculate client reputation score (0-1)
   */
  calculateClientReputationScore(clientReputation?: ClientReputation): number {
    if (!clientReputation) return 0.5; // Default neutral score
    
    // Weight different factors
    const weights = {
      overallRating: 0.3,
      reliability: 0.25,
      communication: 0.2,
      fairPayment: 0.15,
      respectfulness: 0.1
    };
    
    // Calculate weighted score (normalized to 0-1)
    const weightedScore = 
      (clientReputation.overallRating * weights.overallRating +
       clientReputation.reliability * weights.reliability +
       clientReputation.communication * weights.communication +
       clientReputation.fairPayment * weights.fairPayment +
       clientReputation.respectfulness * weights.respectfulness) / 5;
    
    // Apply a confidence factor based on number of ratings
    const confidenceFactor = Math.min(1, clientReputation.totalRatings / 10);
    
    // Final score is weighted by confidence (with minimum of 0.5)
    return 0.5 + (weightedScore - 0.5) * confidenceFactor;
  }
  
  /**
   * Check if a specialist can see a job based on premium settings
   */
  canAccessJob(job: PremiumJob, specialist: PremiumSpecialist): boolean {
    // If specialist has verified-only setting, check job client verification
    if (specialist.premium?.verifiedOnly && !job.isVerifiedPayment) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Get premium badge types for a specialist
   */
  getPremiumBadges(specialist: PremiumSpecialist): string[] {
    const badges: string[] = [];
    
    if (!specialist.premium?.isPremium) return badges;
    
    // Add premium badge
    badges.push('premium');
    
    // Add level-specific badges
    switch (specialist.premium.premiumLevel) {
      case 'pro':
        badges.push('verified');
        break;
      case 'elite':
        badges.push('verified');
        badges.push('top-rated');
        break;
    }
    
    return badges;
  }
}

// Export singleton instance
export const premiumMatchService = new PremiumMatchService();
