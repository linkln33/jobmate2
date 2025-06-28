import { 
  CompatibilityResult, 
  CompatibilityDimension, 
  UserPreferences, 
  ContextualFactors,
  Subcategory,
  MainCategory
} from '@/types/compatibility';
import { BaseScorer } from '../BaseScorer';

/**
 * Giveaway & Free Stuff compatibility scorer
 */
export class GiveawayScorer extends BaseScorer {
  /**
   * Calculate compatibility score for giveaway & free stuff listings
   */
  calculateScore(
    userPreferences: UserPreferences,
    listing: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult {
    const dimensions: CompatibilityDimension[] = [];
    
    // If no giveaways preferences, return default moderate score
    if (!userPreferences.categoryPreferences?.giveaways) {
      return this.createDefaultResult('giveaways', listing.subcategory, userPreferences.userId, listing.id);
    }
    
    const prefs = userPreferences.categoryPreferences.giveaways;
    
    // 1. Item type match
    const itemTypeScore = this.calculateItemTypeMatch(
      prefs.interestedItemTypes || [],
      listing.itemType
    );
    
    dimensions.push({
      name: 'Item Type',
      score: itemTypeScore,
      weight: 0.4,
      description: this.getItemTypeDescription(itemTypeScore, listing.itemType)
    });
    
    // 2. Condition match
    const conditionScore = this.calculateConditionMatch(
      prefs.minCondition || 'any',
      listing.condition
    );
    
    dimensions.push({
      name: 'Condition',
      score: conditionScore,
      weight: 0.3,
      description: this.getConditionDescription(conditionScore, listing.condition)
    });
    
    // 3. Distance match
    const distanceScore = this.calculateDistanceForGiveaway(
      listing.distance || 10,
      prefs.maxDistance || 20
    );
    
    dimensions.push({
      name: 'Distance',
      score: distanceScore,
      weight: 0.3,
      description: this.getDistanceDescription(distanceScore, listing.distance)
    });
    
    // Calculate overall score
    const overallScore = super.calculateOverallScore(dimensions);
    
    // Generate improvement suggestions
    const improvementSuggestions = super.generateImprovementSuggestions(dimensions);
    
    // Find primary match reason
    const primaryMatchReason = super.findPrimaryMatchReason(dimensions);
    
    return {
      overallScore,
      dimensions,
      category: 'giveaways',
      subcategory: listing.subcategory,
      listingId: listing.id,
      userId: userPreferences.userId,
      timestamp: new Date(),
      primaryMatchReason,
      improvementSuggestions
    };
  }
  
  /**
   * Create a default result when no preferences are available
   */
  private createDefaultResult(category: MainCategory, subcategory: Subcategory | undefined, userId: string, listingId: string): CompatibilityResult {
    return {
      overallScore: 50, // Neutral score
      dimensions: [
        {
          name: 'Overall Match',
          score: 50,
          weight: 1,
          description: 'Based on general profile information'
        }
      ],
      category,
      subcategory,
      listingId,
      userId,
      timestamp: new Date(),
      primaryMatchReason: 'Limited preference data available',
      improvementSuggestions: ['Add giveaway preferences to get more accurate matches']
    };
  }
  
  /**
   * Calculate item type match score
   */
  private calculateItemTypeMatch(interestedTypes: string[], actualType: string): number {
    if (!interestedTypes.length || !actualType) return 50;
    
    // Check for exact type match
    if (interestedTypes.some(type => 
      type.toLowerCase() === actualType.toLowerCase()
    )) {
      return 100;
    }
    
    // Check for partial type match
    const partialMatches = interestedTypes.filter(type => 
      type.toLowerCase().includes(actualType.toLowerCase()) ||
      actualType.toLowerCase().includes(type.toLowerCase())
    );
    
    if (partialMatches.length > 0) {
      return 80;
    }
    
    // No match
    return 30;
  }
  
  /**
   * Calculate condition match score
   */
  private calculateConditionMatch(minCondition: string, actualCondition: string): number {
    if (!minCondition || !actualCondition) return 50;
    
    // If minimum condition is 'any', any condition is acceptable
    if (minCondition.toLowerCase() === 'any') {
      return 100;
    }
    
    // Condition levels from lowest to highest
    const conditions = ['poor', 'fair', 'good', 'very good', 'like new', 'new'];
    
    const minIndex = conditions.indexOf(minCondition.toLowerCase());
    const actualIndex = conditions.indexOf(actualCondition.toLowerCase());
    
    if (minIndex === -1 || actualIndex === -1) return 50;
    
    // If actual condition meets or exceeds minimum
    if (actualIndex >= minIndex) {
      // Even better if it significantly exceeds minimum
      const difference = actualIndex - minIndex;
      return Math.min(100, 80 + difference * 5);
    }
    
    // Below minimum condition
    const shortfall = minIndex - actualIndex;
    return Math.max(0, 80 - shortfall * 20);
  }
  
  /**
   * Calculate distance match score for giveaways
   * This is a wrapper to avoid signature conflicts with BaseScorer.calculateDistanceMatch
   */
  private calculateDistanceForGiveaway(actualDistance: number, maxDistance: number): number {
    if (isNaN(actualDistance) || isNaN(maxDistance)) return 50;
    
    return super.calculateDistanceMatch(actualDistance, maxDistance);
  }
  
  /**
   * Get description for item type match
   */
  private getItemTypeDescription(score: number, itemType: string): string {
    if (score >= 90) return `${itemType} is one of your interested item types`;
    if (score >= 70) return `${itemType} is similar to your interested item types`;
    return `${itemType} is different from your usual interests`;
  }
  
  /**
   * Get description for condition match
   */
  private getConditionDescription(score: number, condition: string): string {
    if (score >= 90) return `The ${condition} condition exceeds your requirements`;
    if (score >= 70) return `The ${condition} condition meets your requirements`;
    if (score >= 50) return `The ${condition} condition is slightly below your requirements`;
    return `The ${condition} condition is below your minimum requirements`;
  }
  
  /**
   * Get description for distance match
   */
  private getDistanceDescription(score: number, distance: number): string {
    if (score >= 90) return `Located very close to you (${distance} miles)`;
    if (score >= 70) return `Located within reasonable distance (${distance} miles)`;
    if (score >= 50) return `Located somewhat far from you (${distance} miles)`;
    return `Located quite far from your preferred area (${distance} miles)`;
  }
}

export default GiveawayScorer;
