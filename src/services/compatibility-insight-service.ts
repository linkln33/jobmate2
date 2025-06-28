import { CompatibilityEngine } from './compatibility/engine';
import { UserPreferences, CompatibilityResult, MainCategory } from '@/types/compatibility';
import { aiService } from './ai-service';

export interface ListingWithCompatibility {
  id: string;
  title: string;
  description: string;
  category: MainCategory;
  subcategory: string;
  price?: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  owner: {
    id: string;
    name: string;
  };
  createdAt: string;
  compatibilityScore?: number;
  compatibilityReason?: string;
}

export interface CompatibilityInsight {
  title: string;
  description: string;
  listings: ListingWithCompatibility[];
}

class CompatibilityInsightService {
  private compatibilityEngine: CompatibilityEngine;
  
  constructor() {
    this.compatibilityEngine = new CompatibilityEngine();
  }
  
  /**
   * Get personalized listing recommendations based on user preferences and compatibility scores
   */
  async getPersonalizedRecommendations(
    userPreferences: UserPreferences,
    listings: ListingWithCompatibility[],
    limit: number = 5
  ): Promise<ListingWithCompatibility[]> {
    // Calculate compatibility for each listing
    const listingsWithScores = await Promise.all(
      listings.map(async (listing) => {
        try {
          const compatibilityResult = this.compatibilityEngine.calculateCompatibility(
            userPreferences,
            listing
          );
          
          return {
            ...listing,
            compatibilityScore: compatibilityResult.overallScore,
            compatibilityReason: compatibilityResult.primaryMatchReason
          };
        } catch (error) {
          console.error(`Error calculating compatibility for listing ${listing.id}:`, error);
          return listing;
        }
      })
    );
    
    // Sort by compatibility score (highest first)
    const sortedListings = listingsWithScores
      .filter(listing => listing.compatibilityScore !== undefined)
      .sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
    
    // Return top N recommendations
    return sortedListings.slice(0, limit);
  }
  
  /**
   * Generate insights based on user preferences and listing compatibility
   */
  async generateCompatibilityInsights(
    userPreferences: UserPreferences,
    listings: ListingWithCompatibility[]
  ): Promise<CompatibilityInsight[]> {
    const insights: CompatibilityInsight[] = [];
    
    // Get top matches across all categories
    const topMatches = await this.getPersonalizedRecommendations(userPreferences, listings, 5);
    
    if (topMatches.length > 0) {
      insights.push({
        title: "Top Matches For You",
        description: "Listings with the highest compatibility to your preferences",
        listings: topMatches
      });
    }
    
    // Group listings by category
    const listingsByCategory = this.groupListingsByCategory(listings);
    
    // Get top matches for each category (if user has preferences for that category)
    for (const [category, categoryListings] of Object.entries(listingsByCategory)) {
      // Skip if no category preferences
      if (!userPreferences.categoryPreferences?.[category as MainCategory]) {
        continue;
      }
      
      const topCategoryMatches = await this.getPersonalizedRecommendations(
        userPreferences,
        categoryListings,
        3
      );
      
      if (topCategoryMatches.length > 0) {
        insights.push({
          title: `Best ${this.formatCategoryName(category)} For You`,
          description: `${this.formatCategoryName(category)} listings that match your preferences`,
          listings: topCategoryMatches
        });
      }
    }
    
    return insights;
  }
  
  /**
   * Generate AI-powered insights based on compatibility patterns
   */
  async generateAIInsights(
    userPreferences: UserPreferences,
    compatibilityResults: CompatibilityResult[],
    listings: ListingWithCompatibility[]
  ): Promise<string[]> {
    try {
      // Extract key information for AI analysis
      const userPreferencesSummary = this.summarizeUserPreferences(userPreferences);
      const compatibilityPatterns = this.extractCompatibilityPatterns(compatibilityResults);
      
      // Use AI service to generate insights
      const insights = await aiService.getPersonalizedInsights({
        userPreferences: userPreferencesSummary,
        compatibilityPatterns,
        listingCount: listings.length,
        topCategories: this.getTopCategories(compatibilityResults)
      });
      
      return insights;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return [
        "Based on your preferences, you might enjoy exploring more listings in your favorite categories.",
        "Your compatibility scores are highest with listings that match your location and price preferences."
      ];
    }
  }
  
  /**
   * Helper method to group listings by category
   */
  private groupListingsByCategory(listings: ListingWithCompatibility[]): Record<string, ListingWithCompatibility[]> {
    return listings.reduce((acc, listing) => {
      const category = listing.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(listing);
      return acc;
    }, {} as Record<string, ListingWithCompatibility[]>);
  }
  
  /**
   * Helper method to format category name for display
   */
  private formatCategoryName(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  
  /**
   * Helper method to summarize user preferences for AI analysis
   */
  private summarizeUserPreferences(userPreferences: UserPreferences): Record<string, any> {
    const summary: Record<string, any> = {
      categories: Object.keys(userPreferences.categoryPreferences || {}),
      location: userPreferences.location ? {
        lat: userPreferences.location.lat,
        lng: userPreferences.location.lng
      } : undefined
    };
    
    return summary;
  }
  
  /**
   * Helper method to extract compatibility patterns from results
   */
  private extractCompatibilityPatterns(results: CompatibilityResult[]): Record<string, any> {
    // Calculate average scores by dimension across all results
    const dimensionScores: Record<string, number[]> = {};
    
    results.forEach(result => {
      result.dimensions.forEach(dimension => {
        if (!dimensionScores[dimension.name]) {
          dimensionScores[dimension.name] = [];
        }
        dimensionScores[dimension.name].push(dimension.score);
      });
    });
    
    // Calculate averages
    const averageDimensionScores: Record<string, number> = {};
    for (const [dimension, scores] of Object.entries(dimensionScores)) {
      averageDimensionScores[dimension] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
    
    return {
      averageDimensionScores,
      overallAverageScore: results.reduce((sum, result) => sum + result.overallScore, 0) / results.length
    };
  }
  
  /**
   * Helper method to get top categories based on compatibility results
   */
  private getTopCategories(results: CompatibilityResult[]): string[] {
    // Group results by category
    const scoresByCategory: Record<string, number[]> = {};
    
    results.forEach(result => {
      const category = result.category;
      if (!scoresByCategory[category]) {
        scoresByCategory[category] = [];
      }
      scoresByCategory[category].push(result.overallScore);
    });
    
    // Calculate average score per category
    const categoryAverages = Object.entries(scoresByCategory).map(([category, scores]) => ({
      category,
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }));
    
    // Sort by average score and return top 3 categories
    return categoryAverages
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3)
      .map(item => item.category);
  }
}

export const compatibilityInsightService = new CompatibilityInsightService();
