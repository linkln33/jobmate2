import { 
  CompatibilityResult, 
  CompatibilityDimension, 
  UserPreferences, 
  ContextualFactors,
  ServiceSubcategory,
  Subcategory,
  MainCategory
} from '@/types/compatibility';
import { BaseScorer } from '../BaseScorer';

/**
 * ServiceScorer calculates compatibility between user preferences and service listings
 */
export class ServiceScorer extends BaseScorer {
  /**
   * Calculate compatibility score for service listings
   */
  calculateScore(
    userPreferences: UserPreferences,
    service: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult {
    const dimensions: CompatibilityDimension[] = [];
    
    // If no service preferences, return a moderate score
    if (!userPreferences.categoryPreferences?.services) {
      return this.createDefaultResult('services', service.type as ServiceSubcategory, userPreferences.userId, service.id);
    }
    
    const prefs = userPreferences.categoryPreferences.services;
    
    // 1. Service type match
    const serviceTypeScore = this.calculateServiceTypeMatch(
      prefs.serviceTypes || [],
      service.type as ServiceSubcategory
    );
    
    dimensions.push({
      name: 'Service Type',
      score: serviceTypeScore,
      weight: 0.3,
      description: this.getServiceTypeDescription(serviceTypeScore, service.type)
    });
    
    // 2. Price match
    const priceScore = this.calculatePriceMatch(
      prefs.maxPrice,
      service.price
    );
    
    dimensions.push({
      name: 'Price',
      score: priceScore,
      weight: 0.25,
      description: this.getPriceDescription(priceScore, service.price)
    });
    
    // 3. Provider rating match
    const ratingScore = this.calculateRatingMatch(
      prefs.minProviderRating,
      service.providerRating
    );
    
    dimensions.push({
      name: 'Provider Rating',
      score: ratingScore,
      weight: 0.25,
      description: this.getRatingDescription(ratingScore, service.providerRating)
    });
    
    // 4. Location/distance match
    const distanceScore = this.calculateDistanceForServices(
      service.distance || 10, // Default distance if not provided
      prefs.preferredDistance || 20 // Default preferred distance
    );
    
    dimensions.push({
      name: 'Location',
      score: distanceScore,
      weight: 0.2,
      description: this.getDistanceDescription(distanceScore, service.distance)
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
      category: 'services',
      subcategory: service.type as ServiceSubcategory,
      listingId: service.id,
      userId: userPreferences.userId,
      timestamp: new Date(),
      primaryMatchReason,
      improvementSuggestions
    };
  }
  
  /**
   * Create a default result when no preferences are available
   */
  private createDefaultResult(category: MainCategory, subcategory: Subcategory | undefined, userId: string, serviceId: string): CompatibilityResult {
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
      listingId: serviceId,
      userId: userId,
      timestamp: new Date(),
      primaryMatchReason: 'Limited preference data available',
      improvementSuggestions: ['Add service preferences to get more accurate matches']
    };
  }
  
  /**
   * Calculate service type match score
   */
  private calculateServiceTypeMatch(
    preferredTypes: ServiceSubcategory[],
    serviceType: ServiceSubcategory
  ): number {
    if (!preferredTypes.length || !serviceType) return 50;
    
    // Check if service type is in preferred types
    return preferredTypes.includes(serviceType) ? 100 : 0;
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
      if (percentOfMax <= 0.7) {
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
   * Calculate provider rating match score
   */
  private calculateRatingMatch(minRating: number, actualRating: number): number {
    if (isNaN(minRating) || isNaN(actualRating)) return 50;
    
    // Normalize ratings to 0-100 scale (assuming 0-5 star rating)
    const normalizedMinRating = (minRating / 5) * 100;
    const normalizedActualRating = (actualRating / 5) * 100;
    
    // Perfect match if rating meets or exceeds minimum
    if (normalizedActualRating >= normalizedMinRating) {
      // Even better if it significantly exceeds minimum
      const difference = normalizedActualRating - normalizedMinRating;
      return Math.min(100, Math.round(90 + difference / 2));
    }
    
    // Calculate how far below minimum
    const shortfall = normalizedMinRating - normalizedActualRating;
    return Math.max(0, Math.round(100 - shortfall * 2));
  }
  
  /**
   * Calculate distance match score for services
   * This is a wrapper to avoid signature conflicts with BaseScorer.calculateDistanceMatch
   */
  private calculateDistanceForServices(actualDistance: number, preferredMaxDistance: number): number {
    if (isNaN(actualDistance) || isNaN(preferredMaxDistance)) return 50;
    
    return super.calculateDistanceMatch(actualDistance, preferredMaxDistance);
  }
  
  /**
   * Get description for service type match
   */
  private getServiceTypeDescription(score: number, type: string): string {
    if (score >= 90) return `This ${type} service matches your preferences`;
    return `This ${type} service is different from your usual preferences`;
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
   * Get description for rating match
   */
  private getRatingDescription(score: number, rating: number): string {
    if (score >= 90) return `The provider rating (${rating}/5) is excellent`;
    if (score >= 70) return `The provider rating (${rating}/5) meets your standards`;
    if (score >= 50) return `The provider rating (${rating}/5) is slightly below your preference`;
    return `The provider rating (${rating}/5) is below your minimum standard`;
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

export default ServiceScorer;
