import { 
  CompatibilityResult, 
  CompatibilityDimension, 
  UserPreferences, 
  ContextualFactors,
  RentalSubcategory,
  Subcategory,
  MainCategory
} from '@/types/compatibility';
import { BaseScorer } from '../BaseScorer';

/**
 * RentalScorer calculates compatibility between user preferences and rental listings
 */
export class RentalScorer extends BaseScorer {
  /**
   * Calculate compatibility score for rental listings
   */
  calculateScore(
    userPreferences: UserPreferences,
    rental: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult {
    const dimensions: CompatibilityDimension[] = [];
    
    // If no rental preferences, return a moderate score
    if (!userPreferences.categoryPreferences?.rentals) {
      return this.createDefaultResult('rentals', rental.type as RentalSubcategory, userPreferences.userId, rental.id);
    }
    
    const prefs = userPreferences.categoryPreferences.rentals;
    
    // 1. Rental type match
    const typeScore = this.calculateTypeMatch(
      prefs.rentalTypes || [],
      rental.type as RentalSubcategory
    );
    
    dimensions.push({
      name: 'Rental Type',
      score: typeScore,
      weight: 0.25,
      description: this.getTypeDescription(typeScore, rental.type)
    });
    
    // 2. Price match
    const priceScore = this.calculatePriceMatch(
      prefs.maxPrice,
      rental.price
    );
    
    dimensions.push({
      name: 'Price',
      score: priceScore,
      weight: 0.3,
      description: this.getPriceDescription(priceScore, rental.price)
    });
    
    // 3. Location match
    const locationScore = this.calculateLocationMatch(
      prefs.location,
      rental.location
    );
    
    dimensions.push({
      name: 'Location',
      score: locationScore,
      weight: 0.25,
      description: this.getLocationDescription(locationScore)
    });
    
    // 4. Amenities match
    const amenitiesScore = this.calculateAmenitiesMatch(
      prefs.requiredAmenities || [],
      rental.amenities || []
    );
    
    dimensions.push({
      name: 'Amenities',
      score: amenitiesScore,
      weight: 0.1,
      description: this.getAmenitiesDescription(amenitiesScore)
    });
    
    // 5. Duration match
    const durationScore = this.calculateDurationMatch(
      prefs.minDuration,
      prefs.maxDuration,
      rental.duration
    );
    
    dimensions.push({
      name: 'Duration',
      score: durationScore,
      weight: 0.1,
      description: this.getDurationDescription(durationScore, rental.duration)
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
      category: 'rentals',
      subcategory: rental.type as RentalSubcategory,
      listingId: rental.id,
      userId: userPreferences.userId,
      timestamp: new Date(),
      primaryMatchReason,
      improvementSuggestions
    };
  }
  
  /**
   * Create a default result when no preferences are available
   */
  private createDefaultResult(category: MainCategory, subcategory: Subcategory | undefined, userId: string, rentalId: string): CompatibilityResult {
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
      listingId: rentalId,
      userId: userId,
      timestamp: new Date(),
      primaryMatchReason: 'Limited preference data available',
      improvementSuggestions: ['Add rental preferences to get more accurate matches']
    };
  }
  
  /**
   * Calculate rental type match score
   */
  private calculateTypeMatch(
    preferredTypes: RentalSubcategory[],
    rentalType: RentalSubcategory
  ): number {
    if (!preferredTypes.length || !rentalType) return 50;
    
    // Check if rental type is in preferred types
    return preferredTypes.includes(rentalType) ? 100 : 0;
  }
  
  /**
   * Calculate price match score
   */
  private calculatePriceMatch(maxPrice: number, actualPrice: number): number {
    if (isNaN(maxPrice) || isNaN(actualPrice) || maxPrice <= 0) return 50;
    
    // Perfect match if price is below max
    if (actualPrice <= maxPrice) {
      // Even better if it's significantly below max
      const percentOfMax = actualPrice / maxPrice;
      if (percentOfMax <= 0.8) {
        return 100; // Great deal
      }
      return 90; // Good price
    }
    
    // Calculate how much it exceeds the max price
    const excess = actualPrice - maxPrice;
    const percentExcess = excess / maxPrice;
    
    // Penalty for exceeding max price
    return Math.max(0, Math.round(100 - (percentExcess * 100)));
  }
  
  /**
   * Calculate location match score
   */
  private calculateLocationMatch(preferredLocation: string, actualLocation: string): number {
    if (!preferredLocation || !actualLocation) return 50;
    
    // Simple text similarity for now
    // In a real implementation, this would use geocoding and distance calculation
    return super.calculateTextSimilarity(preferredLocation, actualLocation);
  }
  
  /**
   * Calculate amenities match score
   */
  private calculateAmenitiesMatch(requiredAmenities: string[], actualAmenities: string[]): number {
    if (!requiredAmenities.length || !actualAmenities.length) return 50;
    
    // Count how many required amenities are present
    const matchingAmenities = requiredAmenities.filter(required => 
      actualAmenities.some(actual => 
        actual.toLowerCase().includes(required.toLowerCase()) ||
        required.toLowerCase().includes(actual.toLowerCase())
      )
    );
    
    return Math.round((matchingAmenities.length / requiredAmenities.length) * 100);
  }
  
  /**
   * Calculate duration match score
   */
  private calculateDurationMatch(
    minDuration: number, 
    maxDuration: number, 
    actualDuration: number
  ): number {
    if (isNaN(minDuration) || isNaN(maxDuration) || isNaN(actualDuration)) return 50;
    
    return super.calculateRangeMatch(actualDuration, minDuration, maxDuration);
  }
  
  /**
   * Get description for rental type match
   */
  private getTypeDescription(score: number, type: string): string {
    if (score >= 90) return `This ${type} matches your preferred rental type`;
    return `This ${type} differs from your usual rental preferences`;
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
   * Get description for location match
   */
  private getLocationDescription(score: number): string {
    if (score >= 90) return 'Located in your preferred area';
    if (score >= 70) return 'Located in an area similar to your preference';
    if (score >= 50) return 'Located somewhat far from your preferred area';
    return 'Located in an area different from your preference';
  }
  
  /**
   * Get description for amenities match
   */
  private getAmenitiesDescription(score: number): string {
    if (score >= 90) return 'Has all your required amenities';
    if (score >= 70) return 'Has most of your required amenities';
    if (score >= 50) return 'Has some of your required amenities';
    return 'Missing many of your required amenities';
  }
  
  /**
   * Get description for duration match
   */
  private getDurationDescription(score: number, duration: number): string {
    if (score >= 90) return `The ${duration} month duration is perfect for your needs`;
    if (score >= 70) return `The ${duration} month duration is close to your preference`;
    if (score >= 50) return `The ${duration} month duration is somewhat different from your preference`;
    return `The ${duration} month duration is very different from your preference`;
  }
}

export default RentalScorer;
