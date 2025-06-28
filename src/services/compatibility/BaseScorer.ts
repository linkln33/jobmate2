import { 
  CompatibilityResult, 
  CompatibilityDimension, 
  UserPreferences, 
  ContextualFactors,
  WeightPreferences
} from '@/types/compatibility';

/**
 * BaseScorer is the abstract class that all category-specific scorers will extend.
 * It provides common functionality for calculating compatibility scores.
 */
export abstract class BaseScorer {
  /**
   * Calculate a compatibility score between user preferences and a listing
   */
  abstract calculateScore(
    userPreferences: UserPreferences,
    listing: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult;
  
  /**
   * Get default weights if user hasn't specified custom weights
   */
  protected getDefaultWeights(): WeightPreferences {
    return {
      skills: 0.3,
      location: 0.15,
      availability: 0.1,
      price: 0.1,
      userPreferences: 0.1,
      previousInteractions: 0.1,
      reputation: 0.1,
      aiTrend: 0.05
    };
  }
  
  /**
   * Get user's custom weights or default weights
   */
  protected getWeights(userPreferences: UserPreferences): WeightPreferences {
    return userPreferences.weightPreferences || this.getDefaultWeights();
  }
  
  /**
   * Apply user's weight preferences to dimension weights
   */
  protected applyUserWeights(dimensions: CompatibilityDimension[], weights: WeightPreferences): CompatibilityDimension[] {
    return dimensions.map(dim => {
      // Map dimension name to weight preference key
      let weightKey: keyof WeightPreferences;
      
      switch (dim.name.toLowerCase()) {
        case 'skills match':
        case 'tag match':
          weightKey = 'skills';
          break;
        case 'location match':
        case 'distance':
          weightKey = 'location';
          break;
        case 'availability':
        case 'schedule match':
          weightKey = 'availability';
          break;
        case 'price match':
        case 'salary match':
        case 'budget match':
          weightKey = 'price';
          break;
        case 'user preference':
        case 'preference match':
          weightKey = 'userPreferences';
          break;
        case 'interaction history':
        case 'previous interactions':
          weightKey = 'previousInteractions';
          break;
        case 'reputation':
        case 'rating match':
        case 'trust score':
          weightKey = 'reputation';
          break;
        case 'trending':
        case 'ai boost':
        case 'popularity':
          weightKey = 'aiTrend';
          break;
        default:
          return dim; // Keep original weight if no match
      }
      
      // Apply user's weight preference
      return {
        ...dim,
        weight: weights[weightKey]
      };
    });
  }
  
  /**
   * Calculate the overall score from individual dimensions
   */
  protected calculateOverallScore(dimensions: CompatibilityDimension[], userPreferences?: UserPreferences): number {
    // Apply user weights if available
    const finalDimensions = userPreferences 
      ? this.applyUserWeights(dimensions, this.getWeights(userPreferences))
      : dimensions;
    
    // Calculate weighted average
    const totalWeight = finalDimensions.reduce((sum, dim) => sum + dim.weight, 0);
    const weightedSum = finalDimensions.reduce((sum, dim) => sum + (dim.score * dim.weight), 0);
    
    // Return score as 0-100 percentage
    return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0;
  }
  
  /**
   * Generate improvement suggestions based on dimensions
   */
  protected generateImprovementSuggestions(dimensions: CompatibilityDimension[]): string[] {
    // Find dimensions with low scores
    const lowScoreDimensions = dimensions
      .filter(dim => dim.score < 50)
      .sort((a, b) => a.score - b.score);
    
    // Generate suggestions for up to 3 lowest dimensions
    return lowScoreDimensions.slice(0, 3).map(dim => {
      return `Improve your ${dim.name.toLowerCase()} match by updating your preferences.`;
    });
  }
  
  /**
   * Find the primary reason for the match
   */
  protected findPrimaryMatchReason(dimensions: CompatibilityDimension[]): string {
    // Find the highest scoring dimension
    const highestDim = dimensions
      .filter(dim => dim.score >= 70)
      .sort((a, b) => b.score - a.score)[0];
    
    if (highestDim) {
      return `Strong match on ${highestDim.name.toLowerCase()}.`;
    }
    
    return 'Moderate overall compatibility.';
  }
  
  /**
   * Calculate text similarity score (0-100)
   */
  protected calculateTextSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;
    
    const normalizedText1 = text1.toLowerCase().trim();
    const normalizedText2 = text2.toLowerCase().trim();
    
    if (normalizedText1 === normalizedText2) return 100;
    
    // Simple word overlap calculation
    const words1Array = normalizedText1.split(/\s+/);
    const words2Array = normalizedText2.split(/\s+/);
    const words1 = new Set(words1Array);
    const words2 = new Set(words2Array);
    
    let matchCount = 0;
    words1Array.forEach(word => {
      if (words2.has(word)) matchCount++;
    });
    
    const allWords = [...words1Array, ...words2Array];
    const totalUniqueWords = new Set(allWords).size;
    return totalUniqueWords > 0 ? Math.round((matchCount / totalUniqueWords) * 100) : 0;
  }
  
  /**
   * Calculate array overlap percentage (0-100)
   */
  protected calculateArrayOverlap<T>(array1: T[], array2: T[]): number {
    if (!array1?.length || !array2?.length) return 0;
    
    const set1 = new Set(array1);
    const set2 = new Set(array2);
    
    let matchCount = 0;
    array1.forEach(item => {
      if (set2.has(item)) matchCount++;
    });
    
    const allItems = [...array1, ...array2];
    const totalUniqueItems = new Set(allItems).size;
    return totalUniqueItems > 0 ? Math.round((matchCount / totalUniqueItems) * 100) : 0;
  }
  
  /**
   * Calculate numeric range match (0-100)
   */
  protected calculateRangeMatch(
    value: number, 
    minDesired: number, 
    maxDesired: number
  ): number {
    if (isNaN(value) || isNaN(minDesired) || isNaN(maxDesired)) return 0;
    
    // Perfect match if within range
    if (value >= minDesired && value <= maxDesired) {
      return 100;
    }
    
    // Below minimum - calculate how close
    if (value < minDesired) {
      const shortfall = minDesired - value;
      const percentShortfall = shortfall / minDesired;
      return Math.max(0, Math.round((1 - percentShortfall) * 100));
    }
    
    // Above maximum - calculate how close
    const excess = value - maxDesired;
    const percentExcess = excess / maxDesired;
    return Math.max(0, Math.round((1 - percentExcess * 0.5) * 100)); // Less penalty for higher values
  }
  
  /**
   * Calculate distance match (0-100)
   */
  protected calculateDistanceMatch(
    distance: number, 
    maxDesiredDistance: number
  ): number {
    if (isNaN(distance) || isNaN(maxDesiredDistance) || maxDesiredDistance <= 0) return 0;
    
    // Perfect match if within desired distance
    if (distance <= maxDesiredDistance) {
      return 100;
    }
    
    // Calculate how much it exceeds the desired distance
    const excess = distance - maxDesiredDistance;
    const percentExcess = excess / maxDesiredDistance;
    return Math.max(0, Math.round((1 - percentExcess) * 100));
  }
}
