import { BaseScorer } from '../BaseScorer';
import { 
  CompatibilityResult,
  UserPreferences,
  ContextualFactors,
  FavorPreferences,
  FavorSubcategory,
  CompatibilityDimension,
  Subcategory,
  MainCategory
} from '@/types/compatibility';

/**
 * Favor-specific compatibility scorer
 */
export class FavorScorer extends BaseScorer {
  /**
   * Create a default compatibility result
   */
  private createDefaultResult(category: MainCategory, subcategory: Subcategory | undefined, userId: string): CompatibilityResult {
    return {
      overallScore: 50,
      dimensions: [
        { name: 'Overall Match', score: 50, weight: 1, description: 'General compatibility score' }
      ],
      category,
      subcategory,
      listingId: '',
      userId,
      timestamp: new Date(),
      primaryMatchReason: 'Basic compatibility calculation',
      improvementSuggestions: ['Add more specific preferences to get better matches']
    };
  }

  /**
   * Calculate compatibility score for favor listings
   */
  calculateScore(
    userPreferences: UserPreferences,
    listingData: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult {
    // Default result structure
    const result: CompatibilityResult = this.createDefaultResult('favors', listingData.subcategory, userPreferences.userId);
    
    // If no favor preferences in category preferences, return default moderate score
    if (!userPreferences.categoryPreferences?.favors) {
      return {
        ...result,
        overallScore: 50,
        primaryMatchReason: 'No specific favor preferences set'
      };
    }
    
    const prefs = userPreferences.categoryPreferences.favors;
    
    // Calculate favor type match
    const favorTypeScore = this.calculateFavorTypeMatch(prefs, listingData);
    
    // Calculate price/compensation match
    const priceScore = this.calculatePriceMatch(prefs, listingData);
    
    // Calculate time commitment match
    const timeCommitmentScore = this.calculateTimeCommitmentMatch(prefs, listingData);
    
    // Calculate distance/location match
    const distanceScore = this.calculateDistanceForFavors(prefs, listingData);
    
    // Calculate reciprocity match
    const reciprocityScore = this.calculateReciprocityMatch(prefs, listingData);
    
    // Calculate weighted dimensions
    const dimensions: CompatibilityDimension[] = [
      {
        name: 'Favor Type',
        score: favorTypeScore,
        weight: 0.3,
        description: 'How well the favor type matches your preferences'
      },
      {
        name: 'Compensation',
        score: priceScore,
        weight: 0.2,
        description: 'How well the compensation matches your expectations'
      },
      {
        name: 'Time Commitment',
        score: timeCommitmentScore,
        weight: 0.2,
        description: 'How well the time commitment matches your availability'
      },
      {
        name: 'Distance',
        score: distanceScore,
        weight: 0.2,
        description: 'How close the favor is to your location'
      },
      {
        name: 'Reciprocity',
        score: reciprocityScore,
        weight: 0.1,
        description: 'How well the reciprocity matches your preferences'
      }
    ];
    
    // Calculate overall score
    const overallScore = super.calculateOverallScore(dimensions);
    
    // Generate improvement suggestions
    const improvementSuggestions = super.generateImprovementSuggestions(dimensions);
    
    // Find primary match reason
    const primaryMatchReason = super.findPrimaryMatchReason(dimensions);
    
    return {
      ...result,
      overallScore,
      dimensions,
      primaryMatchReason,
      improvementSuggestions,
      listingId: listingData.id || ''
    };
  }

  /**
   * Calculate favor type match score
   */
  private calculateFavorTypeMatch(prefs: FavorPreferences, listing: any): number {
    if (!prefs.favorTypes || !prefs.favorTypes.length || !listing.favorType) {
      return 50; // Default moderate score if no preferences or listing data
    }
    
    // Direct match if the favor type is in the preferred types
    if (prefs.favorTypes.includes(listing.favorType)) {
      return 100;
    }
    
    // Calculate similarity based on text
    return super.calculateTextSimilarity(prefs.favorTypes.join(' '), listing.favorType);
  }
  
  /**
   * Calculate price/compensation match score
   */
  private calculatePriceMatch(prefs: FavorPreferences, listing: any): number {
    if (!prefs.compensationPreference || !listing.compensation) {
      return 50; // Default moderate score if no compensation preferences or listing data
    }
    
    // Direct match for compensation type preference
    if (prefs.compensationPreference === listing.compensationType) {
      return 100;
    }
    
    // If user prefers monetary compensation and listing offers it
    if (prefs.compensationPreference === 'monetary' && listing.compensationType === 'monetary') {
      // Check if the amount meets expectations
      if (listing.compensationAmount >= prefs.minCompensation) {
        return 100;
      } else {
        // Calculate how close it is to minimum
        const ratio = listing.compensationAmount / prefs.minCompensation;
        return Math.max(50, Math.round(ratio * 100));
      }
    }
    
    // Partial match - some compensation is offered but not preferred type
    return 60;
  }
  
  /**
   * Calculate time commitment match score
   */
  private calculateTimeCommitmentMatch(prefs: FavorPreferences, listing: any): number {
    if (!prefs.maxTimeCommitment || !listing.estimatedTime) {
      return 50; // Default moderate score
    }
    
    const estimatedTime = Number(listing.estimatedTime);
    if (isNaN(estimatedTime)) {
      return 50;
    }
    
    // Perfect if within max time commitment
    if (estimatedTime <= prefs.maxTimeCommitment) {
      // Calculate how much below max (higher score for shorter commitments)
      const percentBelowMax = 1 - (estimatedTime / prefs.maxTimeCommitment);
      // Scale to give 80-100 range for items within max
      return Math.round(80 + (percentBelowMax * 20));
    }
    
    // Over max time commitment - calculate how much over
    const percentOverMax = (estimatedTime - prefs.maxTimeCommitment) / prefs.maxTimeCommitment;
    // Scale to give 0-80 range for items over max
    return Math.max(0, Math.round(80 - (percentOverMax * 100)));
  }
  
  /**
   * Calculate distance match score for favors
   * This is a wrapper to avoid signature conflicts with BaseScorer.calculateDistanceMatch
   */
  private calculateDistanceForFavors(prefs: FavorPreferences, listing: any): number {
    if (!prefs.maxDistance || !listing.distance) {
      return 50; // Default moderate score
    }
    
    const distance = Number(listing.distance);
    if (isNaN(distance)) {
      return 50;
    }
    
    // Use the base scorer's distance match calculation
    return super.calculateDistanceMatch(distance, prefs.maxDistance);
  }
  
  /**
   * Calculate reciprocity match score
   */
  private calculateReciprocityMatch(prefs: FavorPreferences, listing: any): number {
    if (!prefs.reciprocityPreference || !listing.reciprocity) {
      return 50; // Default moderate score
    }
    
    // Direct match for reciprocity preference
    if (prefs.reciprocityPreference === listing.reciprocity) {
      return 100;
    }
    
    // If user is flexible about reciprocity
    if (prefs.reciprocityPreference === 'either') {
      return 90;
    }
    
    // Mismatch in reciprocity preference
    return 30;
  }
}

export default FavorScorer;
