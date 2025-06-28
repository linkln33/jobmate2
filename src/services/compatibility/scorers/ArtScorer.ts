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
 * Art & Creativity compatibility scorer
 */
export class ArtScorer extends BaseScorer {
  /**
   * Calculate compatibility score for art & creativity listings
   */
  calculateScore(
    userPreferences: UserPreferences,
    listing: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult {
    const dimensions: CompatibilityDimension[] = [];
    
    // If no art preferences, return default moderate score
    if (!userPreferences.categoryPreferences?.art) {
      return this.createDefaultResult('art', listing.subcategory, userPreferences.userId, listing.id);
    }
    
    const prefs = userPreferences.categoryPreferences.art;
    
    // 1. Art medium match
    const mediumScore = this.calculateMediumMatch(
      prefs.preferredMediums || [],
      listing.medium
    );
    
    dimensions.push({
      name: 'Medium',
      score: mediumScore,
      weight: 0.3,
      description: this.getMediumDescription(mediumScore, listing.medium)
    });
    
    // 2. Style match
    const styleScore = this.calculateStyleMatch(
      prefs.preferredStyles || [],
      listing.style || []
    );
    
    dimensions.push({
      name: 'Style',
      score: styleScore,
      weight: 0.25,
      description: this.getStyleDescription(styleScore)
    });
    
    // 3. Price match
    const priceScore = this.calculatePriceMatch(
      prefs.maxPrice,
      listing.price
    );
    
    dimensions.push({
      name: 'Price',
      score: priceScore,
      weight: 0.2,
      description: this.getPriceDescription(priceScore, listing.price)
    });
    
    // 4. Artist match
    const artistScore = this.calculateArtistMatch(
      prefs.favoriteArtists || [],
      listing.artist
    );
    
    dimensions.push({
      name: 'Artist',
      score: artistScore,
      weight: 0.15,
      description: this.getArtistDescription(artistScore, listing.artist)
    });
    
    // 5. Format match (physical/digital)
    const formatScore = this.calculateFormatMatch(
      prefs.preferredFormat,
      listing.format
    );
    
    dimensions.push({
      name: 'Format',
      score: formatScore,
      weight: 0.1,
      description: this.getFormatDescription(formatScore, listing.format)
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
      category: 'art',
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
      improvementSuggestions: ['Add art preferences to get more accurate matches']
    };
  }
  
  /**
   * Calculate medium match score
   */
  private calculateMediumMatch(preferredMediums: string[], actualMedium: string): number {
    if (!preferredMediums.length || !actualMedium) return 50;
    
    // Check for exact medium match
    if (preferredMediums.some(medium => 
      medium.toLowerCase() === actualMedium.toLowerCase()
    )) {
      return 100;
    }
    
    // Check for partial medium match
    const partialMatches = preferredMediums.filter(medium => 
      medium.toLowerCase().includes(actualMedium.toLowerCase()) ||
      actualMedium.toLowerCase().includes(medium.toLowerCase())
    );
    
    if (partialMatches.length > 0) {
      return 80;
    }
    
    // No match
    return 30;
  }
  
  /**
   * Calculate style match score
   */
  private calculateStyleMatch(preferredStyles: string[], actualStyles: string[]): number {
    if (!preferredStyles.length || !actualStyles.length) return 50;
    
    // Calculate overlap between preferred and actual styles
    return super.calculateArrayOverlap(preferredStyles, actualStyles);
  }
  
  /**
   * Calculate price match score
   */
  private calculatePriceMatch(maxPrice: number, actualPrice: number): number {
    if (isNaN(maxPrice) || isNaN(actualPrice) || maxPrice <= 0) return 50;
    
    // Perfect match if price is below budget
    if (actualPrice <= maxPrice) {
      // Even better if it's significantly below budget
      const percentOfBudget = actualPrice / maxPrice;
      if (percentOfBudget <= 0.7) {
        return 100; // Great deal
      }
      return 90; // Good price
    }
    
    // Calculate how much it exceeds the budget
    const excess = actualPrice - maxPrice;
    const percentExcess = excess / maxPrice;
    
    // Penalty for exceeding budget
    return Math.max(0, Math.round(100 - (percentExcess * 100)));
  }
  
  /**
   * Calculate artist match score
   */
  private calculateArtistMatch(favoriteArtists: string[], actualArtist: string): number {
    if (!favoriteArtists.length || !actualArtist) return 50;
    
    // Check if actual artist is in favorite artists
    if (favoriteArtists.some(artist => 
      artist.toLowerCase() === actualArtist.toLowerCase()
    )) {
      return 100;
    }
    
    // No match - but not necessarily a negative
    return 50;
  }
  
  /**
   * Calculate format match score (physical vs digital)
   */
  private calculateFormatMatch(preferredFormat: string, actualFormat: string): number {
    if (!preferredFormat || !actualFormat) return 50;
    
    // Check if formats match
    return preferredFormat.toLowerCase() === actualFormat.toLowerCase() ? 100 : 30;
  }
  
  /**
   * Get description for medium match
   */
  private getMediumDescription(score: number, medium: string): string {
    if (score >= 90) return `${medium} is one of your preferred mediums`;
    if (score >= 70) return `${medium} is similar to your preferred mediums`;
    return `${medium} is different from your usual preferences`;
  }
  
  /**
   * Get description for style match
   */
  private getStyleDescription(score: number): string {
    if (score >= 90) return 'Style matches your preferences perfectly';
    if (score >= 70) return 'Style mostly aligns with your preferences';
    if (score >= 50) return 'Style somewhat matches your preferences';
    return 'Style differs from your usual preferences';
  }
  
  /**
   * Get description for price match
   */
  private getPriceDescription(score: number, price: number): string {
    if (score >= 90) return `The price ($${price}) is well within your budget`;
    if (score >= 70) return `The price ($${price}) is close to your budget`;
    if (score >= 50) return `The price ($${price}) is somewhat above your budget`;
    return `The price ($${price}) is significantly above your budget`;
  }
  
  /**
   * Get description for artist match
   */
  private getArtistDescription(score: number, artist: string): string {
    if (score >= 90) return `${artist} is one of your favorite artists`;
    return `${artist} is not in your list of favorite artists`;
  }
  
  /**
   * Get description for format match
   */
  private getFormatDescription(score: number, format: string): string {
    if (score >= 90) return `${format} format matches your preference`;
    return `${format} format differs from your preferred format`;
  }
}

export default ArtScorer;
