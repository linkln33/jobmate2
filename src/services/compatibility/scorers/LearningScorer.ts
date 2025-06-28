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
 * Learning & Courses compatibility scorer
 */
export class LearningScorer extends BaseScorer {
  /**
   * Calculate compatibility score for learning & courses listings
   */
  calculateScore(
    userPreferences: UserPreferences,
    listing: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult {
    const dimensions: CompatibilityDimension[] = [];
    
    // If no learning preferences, return default moderate score
    if (!userPreferences.categoryPreferences?.learning) {
      return this.createDefaultResult('learning', listing.subcategory, userPreferences.userId, listing.id);
    }
    
    const prefs = userPreferences.categoryPreferences.learning;
    
    // 1. Subject match
    const subjectScore = this.calculateSubjectMatch(
      prefs.interestedSubjects || [],
      listing.subject
    );
    
    dimensions.push({
      name: 'Subject',
      score: subjectScore,
      weight: 0.35,
      description: this.getSubjectDescription(subjectScore, listing.subject)
    });
    
    // 2. Format match
    const formatScore = this.calculateFormatMatch(
      prefs.preferredFormats || [],
      listing.format
    );
    
    dimensions.push({
      name: 'Format',
      score: formatScore,
      weight: 0.2,
      description: this.getFormatDescription(formatScore, listing.format)
    });
    
    // 3. Level match
    const levelScore = this.calculateLevelMatch(
      prefs.preferredLevel || 'any',
      listing.level
    );
    
    dimensions.push({
      name: 'Level',
      score: levelScore,
      weight: 0.2,
      description: this.getLevelDescription(levelScore, listing.level)
    });
    
    // 4. Price match
    const priceScore = this.calculatePriceMatch(
      prefs.maxPrice,
      listing.price
    );
    
    dimensions.push({
      name: 'Price',
      score: priceScore,
      weight: 0.15,
      description: this.getPriceDescription(priceScore, listing.price)
    });
    
    // 5. Duration match
    const durationScore = this.calculateDurationMatch(
      prefs.preferredDuration || { min: 1, max: 52 },
      listing.durationWeeks
    );
    
    dimensions.push({
      name: 'Duration',
      score: durationScore,
      weight: 0.1,
      description: this.getDurationDescription(durationScore, listing.durationWeeks)
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
      category: 'learning',
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
      improvementSuggestions: ['Add learning preferences to get more accurate matches']
    };
  }
  
  /**
   * Calculate subject match score
   */
  private calculateSubjectMatch(interestedSubjects: string[], actualSubject: string): number {
    if (!interestedSubjects.length || !actualSubject) return 50;
    
    // Check for exact subject match
    if (interestedSubjects.some(subject => 
      subject.toLowerCase() === actualSubject.toLowerCase()
    )) {
      return 100;
    }
    
    // Check for partial subject match
    const partialMatches = interestedSubjects.filter(subject => 
      subject.toLowerCase().includes(actualSubject.toLowerCase()) ||
      actualSubject.toLowerCase().includes(subject.toLowerCase())
    );
    
    if (partialMatches.length > 0) {
      return 80;
    }
    
    // No match
    return 30;
  }
  
  /**
   * Calculate format match score
   */
  private calculateFormatMatch(preferredFormats: string[], actualFormat: string): number {
    if (!preferredFormats.length || !actualFormat) return 50;
    
    // Check if actual format is in preferred formats
    return preferredFormats.some(format => 
      format.toLowerCase() === actualFormat.toLowerCase()
    ) ? 100 : 30;
  }
  
  /**
   * Calculate level match score
   */
  private calculateLevelMatch(preferredLevel: string, actualLevel: string): number {
    if (!preferredLevel || !actualLevel) return 50;
    
    // If preferred level is 'any', any level is acceptable
    if (preferredLevel.toLowerCase() === 'any') {
      return 100;
    }
    
    // Exact match
    if (preferredLevel.toLowerCase() === actualLevel.toLowerCase()) {
      return 100;
    }
    
    // Level progression from beginner to advanced
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    
    const preferredIndex = levels.indexOf(preferredLevel.toLowerCase());
    const actualIndex = levels.indexOf(actualLevel.toLowerCase());
    
    if (preferredIndex === -1 || actualIndex === -1) return 50;
    
    // Calculate how far apart they are
    const difference = Math.abs(preferredIndex - actualIndex);
    const maxDifference = levels.length - 1;
    
    return Math.round(100 - ((difference / maxDifference) * 100));
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
   * Get description for subject match
   */
  private getSubjectDescription(score: number, subject: string): string {
    if (score >= 90) return `${subject} is one of your interested subjects`;
    if (score >= 70) return `${subject} is similar to your interested subjects`;
    return `${subject} is different from your usual interests`;
  }
  
  /**
   * Get description for format match
   */
  private getFormatDescription(score: number, format: string): string {
    if (score >= 90) return `${format} format matches your preference`;
    return `${format} format differs from your preferred formats`;
  }
  
  /**
   * Get description for level match
   */
  private getLevelDescription(score: number, level: string): string {
    if (score >= 90) return `The ${level} level is perfect for you`;
    if (score >= 70) return `The ${level} level is close to your preference`;
    if (score >= 50) return `The ${level} level is somewhat different from your preference`;
    return `The ${level} level is very different from your preference`;
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
   * Get description for duration match
   */
  private getDurationDescription(score: number, duration: number): string {
    if (score >= 90) return `The ${duration} week duration is perfect for your needs`;
    if (score >= 70) return `The ${duration} week duration is close to your preference`;
    if (score >= 50) return `The ${duration} week duration is somewhat different from your preference`;
    return `The ${duration} week duration is very different from your preference`;
  }
}

export default LearningScorer;
