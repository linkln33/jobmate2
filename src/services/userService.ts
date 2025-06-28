import { UserPreferences, CompatibilityResult, CompatibilityDimension } from '@/types/compatibility';

/**
 * Service for managing user data and preferences
 */
class UserService {
  /**
   * Get user preferences for compatibility calculations
   * @param userId User ID to fetch preferences for
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    // In a real app, this would fetch from an API
    // For now, we'll return mock data
    // In the future, this would be replaced with an actual API call
    return {
      userId,
      generalPreferences: {
        priceImportance: 8,
        locationImportance: 7,
        qualityImportance: 9,
      },
      categoryPreferences: {
        jobs: {
          desiredSkills: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
          minSalary: 70000,
          maxSalary: 130000,
          workArrangement: ['remote', 'hybrid'],
          experienceLevel: 'mid'
        },
        services: {
          serviceTypes: ['development', 'design', 'marketing'],
          maxPrice: 200,
          preferredDistance: 25,
          minProviderRating: 4.5
        }
      },
      dailyPreferences: {
        intent: 'Looking for remote development opportunities',
        budget: 100000,
        location: 'Remote',
        urgency: 3
      },
      weightPreferences: {
        skills: 0.3,
        location: 0.15,
        availability: 0.1,
        price: 0.1,
        userPreferences: 0.1,
        previousInteractions: 0.1,
        reputation: 0.1,
        aiTrend: 0.05
      }
    };
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    // In a real app, this would update the database
    console.log(`Updating preferences for user ${userId}:`, preferences);
    
    // Return the updated preferences (mock)
    const currentPrefs = await this.getUserPreferences(userId);
    
    // Handle weight preferences separately to ensure type safety
    let updatedWeightPrefs = currentPrefs.weightPreferences;
    if (preferences.weightPreferences) {
      updatedWeightPrefs = {
        skills: preferences.weightPreferences.skills ?? currentPrefs.weightPreferences!.skills,
        location: preferences.weightPreferences.location ?? currentPrefs.weightPreferences!.location,
        availability: preferences.weightPreferences.availability ?? currentPrefs.weightPreferences!.availability,
        price: preferences.weightPreferences.price ?? currentPrefs.weightPreferences!.price,
        userPreferences: preferences.weightPreferences.userPreferences ?? currentPrefs.weightPreferences!.userPreferences,
        previousInteractions: preferences.weightPreferences.previousInteractions ?? currentPrefs.weightPreferences!.previousInteractions,
        reputation: preferences.weightPreferences.reputation ?? currentPrefs.weightPreferences!.reputation,
        aiTrend: preferences.weightPreferences.aiTrend ?? currentPrefs.weightPreferences!.aiTrend
      };
    }
    
    return {
      ...currentPrefs,
      ...preferences,
      weightPreferences: updatedWeightPrefs
    };
  }

  /**
   * Calculate compatibility between two users based on their preferences
   * @param userA First user's preferences
   * @param userB Second user's preferences
   * @returns Compatibility result with dimensions and scores
   */
  async calculateUserToUserCompatibility(
    userA: UserPreferences,
    userB: UserPreferences
  ) {
    // In a real app, this would use a more sophisticated algorithm
    // For now, we'll implement a simple comparison of preferences
    
    const dimensions: CompatibilityDimension[] = [];
    
    // Compare skills (if both users have job preferences)
    if (userA.categoryPreferences?.jobs && userB.categoryPreferences?.jobs) {
      const userASkills = userA.categoryPreferences.jobs.desiredSkills || [];
      const userBSkills = userB.categoryPreferences.jobs.desiredSkills || [];
      
      // Calculate overlap
      const commonSkills = userASkills.filter(skill => userBSkills.includes(skill));
      const skillScore = userASkills.length > 0 ? 
        Math.round((commonSkills.length / Math.max(userASkills.length, 1)) * 100) : 50;
      
      dimensions.push({
        name: 'Skill Compatibility',
        score: skillScore,
        weight: 0.3,
        description: commonSkills.length > 0 ? 
          `You share ${commonSkills.length} skills including ${commonSkills.slice(0, 3).join(', ')}` :
          'You have different skill sets which could be complementary'
      });
    }
    
    // Compare work preferences
    if (userA.categoryPreferences?.jobs && userB.categoryPreferences?.jobs) {
      const userAArrangements = userA.categoryPreferences.jobs.workArrangement || [];
      const userBArrangements = userB.categoryPreferences.jobs.workArrangement || [];
      
      const commonArrangements = userAArrangements.filter(arr => userBArrangements.includes(arr));
      const arrangementScore = userAArrangements.length > 0 ? 
        Math.round((commonArrangements.length / Math.max(userAArrangements.length, 1)) * 100) : 50;
      
      dimensions.push({
        name: 'Work Style',
        score: arrangementScore,
        weight: 0.2,
        description: commonArrangements.length > 0 ?
          `You both prefer ${commonArrangements.join(', ')} work arrangements` :
          'You have different work style preferences'
      });
    }
    
    // Compare general preferences
    const generalPrefsScore = Math.round(
      (Math.abs(userA.generalPreferences.priceImportance - userB.generalPreferences.priceImportance) +
       Math.abs(userA.generalPreferences.locationImportance - userB.generalPreferences.locationImportance) +
       Math.abs(userA.generalPreferences.qualityImportance - userB.generalPreferences.qualityImportance)) / 0.3
    );
    
    dimensions.push({
      name: 'Value Alignment',
      score: 100 - Math.min(generalPrefsScore, 100),
      weight: 0.25,
      description: generalPrefsScore < 30 ?
        'You have similar values and priorities' :
        'You have somewhat different priorities'
    });
    
    // Calculate overall score as weighted average
    const totalWeight = dimensions.reduce((sum, dim) => sum + dim.weight, 0);
    const weightedScore = dimensions.reduce((sum, dim) => sum + (dim.score * dim.weight), 0);
    const overallScore = Math.round(weightedScore / (totalWeight || 1));
    
    // Generate primary match reason based on highest scoring dimension
    const highestDimension = [...dimensions].sort((a, b) => b.score - a.score)[0];
    const primaryMatchReason = highestDimension.score > 70 ?
      `Great match on ${highestDimension.name.toLowerCase()}` :
      'You have some complementary preferences';
    
    // Generate improvement suggestions
    const improvementSuggestions = [];
    const lowScoreDimensions = dimensions.filter(d => d.score < 50);
    
    if (lowScoreDimensions.length > 0) {
      improvementSuggestions.push(
        `Consider discussing your differences in ${lowScoreDimensions[0].name.toLowerCase()}`
      );
    }
    
    improvementSuggestions.push(
      'Complete your profile to improve match accuracy',
      'Add more specific preferences in your settings'
    );
    
    // Return compatibility result
    return {
      overallScore,
      dimensions,
      category: 'user-match' as any, // Using 'any' as this is not a standard category
      listingId: userB.userId, // Using the target user ID as the listing ID
      userId: userA.userId,
      timestamp: new Date(),
      primaryMatchReason,
      improvementSuggestions
    } as CompatibilityResult;
  }
}

export const userService = new UserService();
