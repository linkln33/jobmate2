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
 * Holiday & Travel compatibility scorer
 */
export class HolidayScorer extends BaseScorer {
  /**
   * Calculate compatibility score for holiday & travel listings
   */
  calculateScore(
    userPreferences: UserPreferences,
    listing: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult {
    const dimensions: CompatibilityDimension[] = [];
    
    // If no holiday preferences, return default moderate score
    if (!userPreferences.categoryPreferences?.holiday) {
      return this.createDefaultResult('holiday', listing.subcategory, userPreferences.userId, listing.id);
    }
    
    const prefs = userPreferences.categoryPreferences.holiday;
    
    // 1. Destination match
    const destinationScore = this.calculateDestinationMatch(
      prefs.preferredDestinations || [],
      listing.destination
    );
    
    dimensions.push({
      name: 'Destination',
      score: destinationScore,
      weight: 0.3,
      description: this.getDestinationDescription(destinationScore, listing.destination)
    });
    
    // 2. Activity type match
    const activityScore = this.calculateActivityMatch(
      prefs.preferredActivities || [],
      listing.activities || []
    );
    
    dimensions.push({
      name: 'Activities',
      score: activityScore,
      weight: 0.25,
      description: this.getActivityDescription(activityScore)
    });
    
    // 3. Budget match
    const budgetScore = this.calculateBudgetMatch(
      prefs.maxBudget,
      listing.price
    );
    
    dimensions.push({
      name: 'Budget',
      score: budgetScore,
      weight: 0.25,
      description: this.getBudgetDescription(budgetScore, listing.price)
    });
    
    // 4. Duration match
    const durationScore = this.calculateDurationMatch(
      prefs.preferredDuration || { min: 1, max: 30 },
      listing.duration
    );
    
    dimensions.push({
      name: 'Duration',
      score: durationScore,
      weight: 0.1,
      description: this.getDurationDescription(durationScore, listing.duration)
    });
    
    // 5. Season match
    const seasonScore = this.calculateSeasonMatch(
      prefs.preferredSeasons || [],
      listing.season
    );
    
    dimensions.push({
      name: 'Season',
      score: seasonScore,
      weight: 0.1,
      description: this.getSeasonDescription(seasonScore, listing.season)
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
      category: 'holiday',
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
      improvementSuggestions: ['Add holiday preferences to get more accurate matches']
    };
  }
  
  /**
   * Calculate destination match score
   */
  private calculateDestinationMatch(preferredDestinations: string[], actualDestination: string): number {
    if (!preferredDestinations.length || !actualDestination) return 50;
    
    // Check for exact destination match
    if (preferredDestinations.some(dest => 
      dest.toLowerCase() === actualDestination.toLowerCase()
    )) {
      return 100;
    }
    
    // Check for partial destination match (e.g., country level)
    const partialMatches = preferredDestinations.filter(dest => 
      dest.toLowerCase().includes(actualDestination.toLowerCase()) ||
      actualDestination.toLowerCase().includes(dest.toLowerCase())
    );
    
    if (partialMatches.length > 0) {
      return 80;
    }
    
    // No match
    return 30;
  }
  
  /**
   * Calculate activity type match score
   */
  private calculateActivityMatch(preferredActivities: string[], actualActivities: string[]): number {
    if (!preferredActivities.length || !actualActivities.length) return 50;
    
    // Calculate overlap between preferred and actual activities
    return super.calculateArrayOverlap(preferredActivities, actualActivities);
  }
  
  /**
   * Calculate budget match score
   */
  private calculateBudgetMatch(maxBudget: number, actualPrice: number): number {
    if (isNaN(maxBudget) || isNaN(actualPrice) || maxBudget <= 0) return 50;
    
    // Perfect match if price is below budget
    if (actualPrice <= maxBudget) {
      // Even better if it's significantly below budget
      const percentOfBudget = actualPrice / maxBudget;
      if (percentOfBudget <= 0.7) {
        return 100; // Great deal
      }
      return 90; // Good price
    }
    
    // Calculate how much it exceeds the budget
    const excess = actualPrice - maxBudget;
    const percentExcess = excess / maxBudget;
    
    // Penalty for exceeding budget
    return Math.max(0, Math.round(100 - (percentExcess * 100)));
  }
  
  /**
   * Calculate duration match score
   */
  private calculateDurationMatch(
    preferredDuration: { min: number, max: number }, 
    actualDuration: number
  ): number {
    if (!preferredDuration || isNaN(actualDuration)) return 50;
    
    return super.calculateRangeMatch(actualDuration, preferredDuration.min, preferredDuration.max);
  }
  
  /**
   * Calculate season match score
   */
  private calculateSeasonMatch(preferredSeasons: string[], actualSeason: string): number {
    if (!preferredSeasons.length || !actualSeason) return 50;
    
    // Check if actual season is in preferred seasons
    return preferredSeasons.some(season => 
      season.toLowerCase() === actualSeason.toLowerCase()
    ) ? 100 : 30;
  }
  
  /**
   * Get description for destination match
   */
  private getDestinationDescription(score: number, destination: string): string {
    if (score >= 90) return `${destination} is one of your preferred destinations`;
    if (score >= 70) return `${destination} is similar to your preferred destinations`;
    return `${destination} is different from your usual preferences`;
  }
  
  /**
   * Get description for activity match
   */
  private getActivityDescription(score: number): string {
    if (score >= 90) return 'Activities match your preferences perfectly';
    if (score >= 70) return 'Most activities align with your preferences';
    if (score >= 50) return 'Some activities match your preferences';
    return 'Activities differ from your usual preferences';
  }
  
  /**
   * Get description for budget match
   */
  private getBudgetDescription(score: number, price: number): string {
    if (score >= 90) return `The price ($${price}) is well within your budget`;
    if (score >= 70) return `The price ($${price}) is close to your budget`;
    if (score >= 50) return `The price ($${price}) is somewhat above your budget`;
    return `The price ($${price}) is significantly above your budget`;
  }
  
  /**
   * Get description for duration match
   */
  private getDurationDescription(score: number, duration: number): string {
    if (score >= 90) return `The ${duration} day duration is perfect for your needs`;
    if (score >= 70) return `The ${duration} day duration is close to your preference`;
    if (score >= 50) return `The ${duration} day duration is somewhat different from your preference`;
    return `The ${duration} day duration is very different from your preference`;
  }
  
  /**
   * Get description for season match
   */
  private getSeasonDescription(score: number, season: string): string {
    if (score >= 90) return `${season} is your preferred travel season`;
    return `${season} is different from your preferred travel seasons`;
  }
}

export default HolidayScorer;
