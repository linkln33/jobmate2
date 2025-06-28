import { BaseScorer } from '../BaseScorer';
import { 
  CompatibilityResult,
  UserPreferences,
  ContextualFactors,
  MarketplacePreferences,
  CompatibilityDimension,
  Subcategory,
  MainCategory
} from '@/types/compatibility';

/**
 * Marketplace-specific compatibility scorer
 */
export class MarketplaceScorer extends BaseScorer {
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
   * Calculate compatibility score for marketplace listings
   */
  calculateScore(
    userPreferences: UserPreferences,
    listingData: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult {
    // Default result structure
    const result: CompatibilityResult = this.createDefaultResult('marketplace', listingData.subcategory, userPreferences.userId);
    
    // If no marketplace preferences in category preferences, return default moderate score
    if (!userPreferences.categoryPreferences?.marketplace) {
      return {
        ...result,
        overallScore: 50,
        primaryMatchReason: 'No specific marketplace preferences set'
      };
    }
    
    const prefs = userPreferences.categoryPreferences.marketplace;
    
    // Calculate item type match
    const itemTypeScore = this.calculateItemTypeMatch(prefs, listingData);
    
    // Calculate price match
    const priceScore = this.calculatePriceMatch(prefs, listingData);
    
    // Calculate condition match
    const conditionScore = this.calculateConditionMatch(prefs, listingData);
    
    // Calculate distance match - use a wrapper method to avoid signature conflicts
    const distanceScore = this.calculateDistanceForMarketplace(prefs, listingData);
    
    // Calculate brand match
    const brandScore = this.calculateBrandMatch(prefs, listingData);
    
    // Calculate weighted dimensions
    const dimensions: CompatibilityDimension[] = [
      {
        name: 'Item Type',
        score: itemTypeScore,
        weight: 0.3,
        description: 'How well the item type matches your preferences'
      },
      {
        name: 'Price',
        score: priceScore,
        weight: prefs.priceImportance || 0.2,
        description: 'How well the price matches your budget'
      },
      {
        name: 'Condition',
        score: conditionScore,
        weight: prefs.qualityImportance || 0.2,
        description: 'How well the item condition matches your preferences'
      },
      {
        name: 'Distance',
        score: distanceScore,
        weight: prefs.locationImportance || 0.15,
        description: 'How close the item is to your preferred location'
      },
      {
        name: 'Brand',
        score: brandScore,
        weight: 0.15,
        description: 'How well the brand matches your preferred brands'
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
   * Calculate item type match score
   */
  private calculateItemTypeMatch(prefs: MarketplacePreferences, listing: any): number {
    if (!prefs.itemTypes || !prefs.itemTypes.length || !listing.itemType) {
      return 50; // Default moderate score if no preferences or listing data
    }
    
    // Direct match if the item type is in the preferred types
    if (prefs.itemTypes.includes(listing.itemType)) {
      return 100;
    }
    
    // Calculate similarity based on text
    return super.calculateTextSimilarity(prefs.itemTypes.join(' '), listing.itemType);
  }
  
  /**
   * Calculate price match score
   */
  private calculatePriceMatch(prefs: MarketplacePreferences, listing: any): number {
    if (!prefs.maxBudget || !listing.price) {
      return 50; // Default moderate score if no budget or price
    }
    
    const price = Number(listing.price);
    if (isNaN(price)) {
      return 50;
    }
    
    // Perfect if within budget
    if (price <= prefs.maxBudget) {
      // Calculate how much below budget (higher score for better deals)
      const percentBelowBudget = 1 - (price / prefs.maxBudget);
      // Scale to give 80-100 range for items within budget
      return Math.round(80 + (percentBelowBudget * 20));
    }
    
    // Over budget - calculate how much over
    const percentOverBudget = (price - prefs.maxBudget) / prefs.maxBudget;
    // Scale to give 0-80 range for items over budget
    return Math.max(0, Math.round(80 - (percentOverBudget * 100)));
  }
  
  /**
   * Calculate condition match score
   */
  private calculateConditionMatch(prefs: MarketplacePreferences, listing: any): number {
    if (!prefs.minCondition || !listing.condition) {
      return 50; // Default moderate score
    }
    
    // Condition ratings (higher is better)
    const conditionRatings: Record<string, number> = {
      'new': 5,
      'like-new': 4,
      'good': 3,
      'fair': 2,
      'poor': 1
    };
    
    const preferredRating = conditionRatings[prefs.minCondition] || 3;
    const listingRating = conditionRatings[listing.condition] || 3;
    
    // Perfect match if meets or exceeds preferred condition
    if (listingRating >= preferredRating) {
      // Better than minimum gets bonus points
      const bonus = (listingRating - preferredRating) * 5;
      return Math.min(100, 90 + bonus);
    }
    
    // Below preferred condition
    const deficit = preferredRating - listingRating;
    return Math.max(0, 90 - (deficit * 30));
  }
  
  /**
   * Calculate distance match score for marketplace listings
   * This is a wrapper to avoid signature conflicts with BaseScorer.calculateDistanceMatch
   */
  private calculateDistanceForMarketplace(prefs: MarketplacePreferences, listing: any): number {
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
   * Calculate brand match score
   */
  private calculateBrandMatch(prefs: MarketplacePreferences, listing: any): number {
    if (!prefs.preferredBrands || !prefs.preferredBrands.length || !listing.brand) {
      return 50; // Default moderate score
    }
    
    // Direct match if the brand is in preferred brands
    if (prefs.preferredBrands.includes(listing.brand)) {
      return 100;
    }
    
    // Calculate similarity based on array overlap
    return super.calculateArrayOverlap(prefs.preferredBrands, [listing.brand]);
  }
}

export default MarketplaceScorer;
