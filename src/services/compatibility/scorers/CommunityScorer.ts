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
 * Community & Social compatibility scorer
 */
export class CommunityScorer extends BaseScorer {
  /**
   * Calculate compatibility score for community & social listings
   */
  calculateScore(
    userPreferences: UserPreferences,
    listing: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult {
    const dimensions: CompatibilityDimension[] = [];
    
    // If no community preferences, return default moderate score
    if (!userPreferences.categoryPreferences?.community) {
      return this.createDefaultResult('community', listing.subcategory, userPreferences.userId, listing.id);
    }
    
    const prefs = userPreferences.categoryPreferences.community;
    
    // 1. Activity type match
    const activityTypeScore = this.calculateActivityTypeMatch(
      prefs.interestedActivities || [],
      listing.activityType
    );
    
    dimensions.push({
      name: 'Activity Type',
      score: activityTypeScore,
      weight: 0.3,
      description: this.getActivityTypeDescription(activityTypeScore, listing.activityType)
    });
    
    // 2. Location/distance match
    const distanceScore = this.calculateDistanceForCommunity(
      listing.distance || 10,
      prefs.maxDistance || 20
    );
    
    dimensions.push({
      name: 'Distance',
      score: distanceScore,
      weight: 0.25,
      description: this.getDistanceDescription(distanceScore, listing.distance)
    });
    
    // 3. Group size match
    const groupSizeScore = this.calculateGroupSizeMatch(
      prefs.preferredGroupSize || { min: 0, max: 100 },
      listing.groupSize
    );
    
    dimensions.push({
      name: 'Group Size',
      score: groupSizeScore,
      weight: 0.15,
      description: this.getGroupSizeDescription(groupSizeScore, listing.groupSize)
    });
    
    // 4. Age group match
    const ageGroupScore = this.calculateAgeGroupMatch(
      prefs.preferredAgeGroups || [],
      listing.ageGroup
    );
    
    dimensions.push({
      name: 'Age Group',
      score: ageGroupScore,
      weight: 0.15,
      description: this.getAgeGroupDescription(ageGroupScore, listing.ageGroup)
    });
    
    // 5. Frequency match
    const frequencyScore = this.calculateFrequencyMatch(
      prefs.preferredFrequency,
      listing.frequency
    );
    
    dimensions.push({
      name: 'Frequency',
      score: frequencyScore,
      weight: 0.15,
      description: this.getFrequencyDescription(frequencyScore, listing.frequency)
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
      category: 'community',
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
      improvementSuggestions: ['Add community preferences to get more accurate matches']
    };
  }
  
  /**
   * Calculate activity type match score
   */
  private calculateActivityTypeMatch(interestedActivities: string[], actualActivity: string): number {
    if (!interestedActivities.length || !actualActivity) return 50;
    
    // Check for exact activity match
    if (interestedActivities.some(activity => 
      activity.toLowerCase() === actualActivity.toLowerCase()
    )) {
      return 100;
    }
    
    // Check for partial activity match
    const partialMatches = interestedActivities.filter(activity => 
      activity.toLowerCase().includes(actualActivity.toLowerCase()) ||
      actualActivity.toLowerCase().includes(activity.toLowerCase())
    );
    
    if (partialMatches.length > 0) {
      return 80;
    }
    
    // No match
    return 30;
  }
  
  /**
   * Calculate distance match score for community events
   * This is a wrapper to avoid signature conflicts with BaseScorer.calculateDistanceMatch
   */
  private calculateDistanceForCommunity(actualDistance: number, maxDistance: number): number {
    if (isNaN(actualDistance) || isNaN(maxDistance)) return 50;
    
    return super.calculateDistanceMatch(actualDistance, maxDistance);
  }
  
  /**
   * Calculate group size match score
   */
  private calculateGroupSizeMatch(
    preferredSize: { min: number, max: number }, 
    actualSize: number
  ): number {
    if (!preferredSize || isNaN(actualSize)) return 50;
    
    return super.calculateRangeMatch(actualSize, preferredSize.min, preferredSize.max);
  }
  
  /**
   * Calculate age group match score
   */
  private calculateAgeGroupMatch(preferredAgeGroups: string[], actualAgeGroup: string): number {
    if (!preferredAgeGroups.length || !actualAgeGroup) return 50;
    
    // Check if actual age group is in preferred age groups
    return preferredAgeGroups.some(ageGroup => 
      ageGroup.toLowerCase() === actualAgeGroup.toLowerCase()
    ) ? 100 : 30;
  }
  
  /**
   * Calculate frequency match score
   */
  private calculateFrequencyMatch(preferredFrequency: string, actualFrequency: string): number {
    if (!preferredFrequency || !actualFrequency) return 50;
    
    // Exact match
    if (preferredFrequency.toLowerCase() === actualFrequency.toLowerCase()) {
      return 100;
    }
    
    // Frequency levels from least to most frequent
    const frequencies = ['one-time', 'yearly', 'quarterly', 'monthly', 'bi-weekly', 'weekly', 'daily'];
    
    const preferredIndex = frequencies.indexOf(preferredFrequency.toLowerCase());
    const actualIndex = frequencies.indexOf(actualFrequency.toLowerCase());
    
    if (preferredIndex === -1 || actualIndex === -1) return 50;
    
    // Calculate how far apart they are
    const difference = Math.abs(preferredIndex - actualIndex);
    const maxDifference = frequencies.length - 1;
    
    return Math.round(100 - ((difference / maxDifference) * 70));
  }
  
  /**
   * Get description for activity type match
   */
  private getActivityTypeDescription(score: number, activityType: string): string {
    if (score >= 90) return `${activityType} is one of your interested activities`;
    if (score >= 70) return `${activityType} is similar to your interested activities`;
    return `${activityType} is different from your usual interests`;
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
  
  /**
   * Get description for group size match
   */
  private getGroupSizeDescription(score: number, size: number): string {
    if (score >= 90) return `The group size (${size} people) is perfect for you`;
    if (score >= 70) return `The group size (${size} people) is close to your preference`;
    if (score >= 50) return `The group size (${size} people) is somewhat different from your preference`;
    return `The group size (${size} people) is very different from your preference`;
  }
  
  /**
   * Get description for age group match
   */
  private getAgeGroupDescription(score: number, ageGroup: string): string {
    if (score >= 90) return `The ${ageGroup} age group matches your preference`;
    return `The ${ageGroup} age group differs from your preferred age groups`;
  }
  
  /**
   * Get description for frequency match
   */
  private getFrequencyDescription(score: number, frequency: string): string {
    if (score >= 90) return `The ${frequency} frequency matches your preference`;
    if (score >= 70) return `The ${frequency} frequency is close to your preference`;
    if (score >= 50) return `The ${frequency} frequency is somewhat different from your preference`;
    return `The ${frequency} frequency is very different from your preference`;
  }
}

export default CommunityScorer;
