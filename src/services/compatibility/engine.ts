import { 
  CompatibilityResult, 
  MainCategory, 
  UserPreferences, 
  ContextualFactors,
  WeightPreferences
} from '@/types/compatibility';
import { compatibilityCache } from '@/services/compatibility/cache';

import { JobScorer } from './scorers/JobScorer';
import { ServiceScorer } from './scorers/ServiceScorer';
import { RentalScorer } from './scorers/RentalScorer';
import { MarketplaceScorer } from './scorers/MarketplaceScorer';
import { FavorScorer } from './scorers/FavorScorer';
import { HolidayScorer } from './scorers/HolidayScorer';
import { ArtScorer } from './scorers/ArtScorer';
import { GiveawayScorer } from './scorers/GiveawayScorer';
import { LearningScorer } from './scorers/LearningScorer';
import { CommunityScorer } from './scorers/CommunityScorer';

/**
 * Options for calculating compatibility
 */
export interface CalculateCompatibilityOptions {
  listingId: string;
  category: MainCategory;
  listingData: any;
  userPreferences: UserPreferences;
  contextualFactors?: ContextualFactors;
  useCache?: boolean;
}

/**
 * Compatibility Engine that routes compatibility score calculations
 * to the appropriate category-specific scorer
 */
export class CompatibilityEngine {
  private jobScorer: JobScorer;
  private serviceScorer: ServiceScorer;
  private rentalScorer: RentalScorer;
  private marketplaceScorer: MarketplaceScorer;
  private favorScorer: FavorScorer;
  private holidayScorer: HolidayScorer;
  private artScorer: ArtScorer;
  private giveawayScorer: GiveawayScorer;
  private learningScorer: LearningScorer;
  private communityScorer: CommunityScorer;
  
  constructor() {
    this.jobScorer = new JobScorer();
    this.serviceScorer = new ServiceScorer();
    this.rentalScorer = new RentalScorer();
    this.marketplaceScorer = new MarketplaceScorer();
    this.favorScorer = new FavorScorer();
    this.holidayScorer = new HolidayScorer();
    this.artScorer = new ArtScorer();
    this.giveawayScorer = new GiveawayScorer();
    this.learningScorer = new LearningScorer();
    this.communityScorer = new CommunityScorer();
  }

  /**
   * Calculate compatibility score for a listing
   * @param options Options for calculating compatibility
   * @returns Compatibility result with overall score and dimensions
   */
  async calculateCompatibility(options: CalculateCompatibilityOptions): Promise<CompatibilityResult> {
    const {
      listingId,
      category,
      listingData,
      userPreferences,
      contextualFactors,
      useCache = true
    } = options;
    
    const userId = userPreferences.userId;
    
    // Check cache first if enabled
    if (useCache && userId && listingId && category) {
      const cachedResult = compatibilityCache.get(userId, listingId, category);
      if (cachedResult) {
        console.log(`Using cached compatibility score for ${category}:${listingId}`);
        return cachedResult;
      }
    }
    
    // Route to the appropriate scorer based on category
    let result: CompatibilityResult;
    
    switch (category) {
      case 'jobs':
        result = this.jobScorer.calculateScore(userPreferences, listingData, contextualFactors);
        break;
      case 'services':
        result = this.serviceScorer.calculateScore(userPreferences, listingData, contextualFactors);
        break;
      case 'rentals':
        result = this.rentalScorer.calculateScore(userPreferences, listingData, contextualFactors);
        break;
      case 'marketplace':
        result = this.marketplaceScorer.calculateScore(userPreferences, listingData, contextualFactors);
        break;
      case 'favors':
        result = this.favorScorer.calculateScore(userPreferences, listingData, contextualFactors);
        break;
      case 'holiday':
        result = this.holidayScorer.calculateScore(userPreferences, listingData, contextualFactors);
        break;
      case 'art':
        result = this.artScorer.calculateScore(userPreferences, listingData, contextualFactors);
        break;
      case 'giveaways':
        result = this.giveawayScorer.calculateScore(userPreferences, listingData, contextualFactors);
        break;
      case 'learning':
        result = this.learningScorer.calculateScore(userPreferences, listingData, contextualFactors);
        break;
      case 'community':
        result = this.communityScorer.calculateScore(userPreferences, listingData, contextualFactors);
        break;
      default:
        // Return a default compatibility result for unsupported categories
        result = {
          overallScore: 50,
          dimensions: [
            { name: 'Overall Match', score: 50, weight: 1, description: 'General compatibility score' }
          ],
          category,
          subcategory: listingData.subcategory || 'general',
          listingId: listingData.id || '',
          userId: userPreferences.userId,
          timestamp: new Date(),
          primaryMatchReason: 'Basic compatibility calculation',
          improvementSuggestions: ['Add more specific preferences to get better matches']
        };
    }
    
    // Cache the result if caching is enabled
    if (useCache && userId && listingId) {
      compatibilityCache.set(result);
    }
    
    return result;
  }

  /**
   * Calculate detailed compatibility score for a listing with improvement suggestions
   * @param options Options for calculating detailed compatibility
   * @returns Detailed compatibility result with dimensions and improvement suggestions
   */
  async calculateDetailedCompatibility(options: CalculateCompatibilityOptions & { 
    includeImprovementSuggestions?: boolean 
  }): Promise<CompatibilityResult> {
    const {
      listingId,
      category,
      listingData,
      userPreferences,
      contextualFactors,
      useCache = true,
      includeImprovementSuggestions = true
    } = options;
    
    // Get base compatibility result
    const baseResult = await this.calculateCompatibility({
      listingId,
      category,
      listingData,
      userPreferences,
      contextualFactors,
      useCache
    });
    
    // Generate improvement suggestions if requested
    if (includeImprovementSuggestions) {
      const suggestions = this.generateImprovementSuggestions(
        userPreferences,
        category,
        listingData,
        baseResult
      );
      
      return {
        ...baseResult,
        improvementSuggestions: suggestions
      };
    }
    
    return baseResult;
  }
  
  /**
   * Generate personalized improvement suggestions based on compatibility results
   * @private
   */
  private generateImprovementSuggestions(
    userPreferences: UserPreferences,
    category: MainCategory,
    listingData: any,
    result: CompatibilityResult
  ): string[] {
    const suggestions: string[] = [];
    
    // Find low-scoring dimensions
    const lowScoringDimensions = result.dimensions.filter(dim => dim.score < 50 && dim.weight > 0.3);
    
    // Generate suggestions based on category and low scores
    switch(category) {
      case 'jobs':
        if (lowScoringDimensions.some(d => d.name.toLowerCase().includes('skill'))) {
          suggestions.push('Consider adding more relevant skills to your profile that match this job listing.');
        }
        if (lowScoringDimensions.some(d => d.name.toLowerCase().includes('location'))) {
          suggestions.push('This job is outside your preferred location range. Consider expanding your location preferences.');
        }
        if (lowScoringDimensions.some(d => d.name.toLowerCase().includes('salary'))) {
          suggestions.push('The salary range for this job differs from your preferences. Adjust your expected salary range for better matches.');
        }
        break;
        
      case 'marketplace':
        if (lowScoringDimensions.some(d => d.name.toLowerCase().includes('price'))) {
          suggestions.push('This item is outside your preferred price range. Consider adjusting your budget preferences.');
        }
        if (lowScoringDimensions.some(d => d.name.toLowerCase().includes('category'))) {
          suggestions.push('This item category doesn\'t match your preferred categories. Update your interests for better matches.');
        }
        break;
        
      // Add cases for other categories...
      
      default:
        suggestions.push('Update your preferences to get more personalized matches.');
    }
    
    // Add general suggestions if none were generated
    if (suggestions.length === 0) {
      suggestions.push('Complete your profile to improve match accuracy.');
      suggestions.push('Add more specific preferences in your settings.');
    }
    
    return suggestions;
  }
}

// Create a singleton instance for use throughout the app
export const compatibilityEngine = new CompatibilityEngine();
