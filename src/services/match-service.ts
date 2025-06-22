import { Job as JobType, Specialist as SpecialistType, MatchResult as SharedMatchResult } from '@/types/job-match-types';

// Re-export types for use in other services
export type Job = JobType;
export type Specialist = SpecialistType;

// Local match result interface for backward compatibility
export interface MatchResult {
  score: number; // 0-100 overall score
  factors: {
    skillMatch: number;
    locationProximity: number;
    reputationScore: number;
    priceMatch: number;
    availabilityMatch: number;
    urgencyCompatibility: number;
  };
  explanations?: string[]; // Explanation messages for match factors
}

export class MatchService {
  // Constants for calculations
  private readonly MAX_DISTANCE_KM = 50; // Maximum distance to consider for proximity
  private readonly EARTH_RADIUS_KM = 6371; // Earth radius in kilometers

  /**
   * Calculate match score between a job and specialist
   */
  calculateMatchScore(job: Job, specialist: Specialist): MatchResult {
    // Calculate individual factor scores
    const skillMatch = this.calculateSkillMatch(
      job.serviceCategory ? [job.serviceCategory.name] : [], 
      specialist.skills || []
    );
    
    const locationProximity = specialist.location ? this.calculateLocationProximity(
      { lat: job.lat, lng: job.lng }, 
      specialist.location
    ) : 0.5; // Default score if no location data
    
    const reputationScore = this.calculateReputationCompatibility(job, specialist);
    const priceMatch = this.calculatePriceMatch(job, specialist);
    const availabilityMatch = this.calculateAvailabilityMatch(job, specialist);
    const urgencyCompatibility = this.calculateUrgencyCompatibility(job, specialist);
    
    // Apply the match formula
    const score = Math.min(100, Math.max(0, Math.round(
      (skillMatch * 0.3) +
      (locationProximity * 0.2) +
      (reputationScore * 0.15) +
      (priceMatch * 0.15) +
      (availabilityMatch * 0.1) +
      (urgencyCompatibility * 0.1)
    ) * 100));
    
    // Generate explanations
    const explanations = this.generateExplanations({
      skillMatch,
      locationProximity,
      reputationScore,
      priceMatch,
      availabilityMatch,
      urgencyCompatibility
    }, job, specialist);
    
    // Convert to shared match result format with explanations
    const result: MatchResult = {
      score,
      factors: {
        skillMatch,
        locationProximity,
        reputationScore,
        priceMatch,
        availabilityMatch,
        urgencyCompatibility
      }
    };
    
    return result;
  }
  
  /**
   * Calculate skill match score (0-1)
   * Uses simple keyword matching for now, can be enhanced with embeddings
   */
  private calculateSkillMatch(jobSkills: string[], specialistSkills: string[]): number {
    if (!jobSkills.length || !specialistSkills.length) return 0.5; // Neutral score if no data
    
    // Normalize skills for comparison
    const normalizeSkill = (skill: string) => skill.toLowerCase().trim();
    const normalizedJobSkills = jobSkills.map(normalizeSkill);
    const normalizedSpecialistSkills = specialistSkills.map(normalizeSkill);
    
    // Count exact matches
    let exactMatches = 0;
    for (const jobSkill of normalizedJobSkills) {
      if (normalizedSpecialistSkills.includes(jobSkill)) {
        exactMatches++;
      }
    }
    
    // Calculate partial matches (contains)
    let partialMatches = 0;
    for (const jobSkill of normalizedJobSkills) {
      for (const specialistSkill of normalizedSpecialistSkills) {
        if (specialistSkill.includes(jobSkill) || jobSkill.includes(specialistSkill)) {
          partialMatches++;
          break;
        }
      }
    }
    
    // Calculate match score
    const exactMatchScore = normalizedJobSkills.length ? exactMatches / normalizedJobSkills.length : 0;
    const partialMatchScore = normalizedJobSkills.length ? partialMatches / normalizedJobSkills.length : 0;
    
    return (exactMatchScore * 0.7) + (partialMatchScore * 0.3);
  }
  
  /**
   * Calculate location proximity score (0-1)
   * 1 = very close, 0 = far away
   */
  private calculateLocationProximity(
    jobLocation: { lat: number; lng: number }, 
    specialistLocation: { lat: number; lng: number }
  ): number {
    const distance = this.calculateDistance(
      jobLocation.lat, jobLocation.lng,
      specialistLocation.lat, specialistLocation.lng
    );
    
    // Convert distance to score (closer = higher score)
    // Score decreases linearly with distance, reaching 0 at MAX_DISTANCE_KM
    return Math.max(0, 1 - (distance / this.MAX_DISTANCE_KM));
  }
  
  /**
   * Calculate reputation compatibility (0-1)
   */
  private calculateReputationCompatibility(job: Job, specialist: Specialist): number {
    // For high-value or verified jobs, prioritize specialists with higher ratings
    const jobImportance = job.isVerifiedPayment ? 0.8 : 0.5;
    const specialistRatingNormalized = (specialist.rating || 0) / 5; // Assuming 5-star rating system
    const jobsCompletedFactor = Math.min(1, (specialist.completedJobs || 0) / 20); // Max out at 20 jobs
    
    return (specialistRatingNormalized * 0.7) + (jobsCompletedFactor * 0.3);
  }
  
  /**
   * Calculate price match score (0-1)
   */
  private calculatePriceMatch(job: Job, specialist: Specialist): number {
    // If no budget info, return neutral score
    if (!job.budgetMin && !job.budgetMax) return 0.5;
    if (!specialist.ratePreferences && !specialist.hourlyRate) return 0.5;
    
    const jobBudgetMin = job.budgetMin || 0;
    const jobBudgetMax = job.budgetMax || jobBudgetMin * 2; // Estimate max if not provided
    
    // Get specialist's rate
    const specialistRate = specialist.hourlyRate || 
      (specialist.ratePreferences ? specialist.ratePreferences.min : 0); // Use min rate as fallback
    
    if (specialistRate === 0) return 0.5; // No rate info
    
    // Perfect match if specialist rate is within job budget
    if (specialistRate >= jobBudgetMin && specialistRate <= jobBudgetMax) {
      return 1.0;
    }
    
    // Calculate how far outside the budget the specialist is
    if (specialistRate < jobBudgetMin) {
      // Specialist charges less than minimum budget
      // This could be good or bad depending on quality expectations
      const ratio = specialistRate / jobBudgetMin;
      return 0.5 + (ratio * 0.3); // Max 0.8 for lower rates
    } else {
      // Specialist charges more than maximum budget
      const overBudgetRatio = (specialistRate - jobBudgetMax) / jobBudgetMax;
      return Math.max(0, 1 - overBudgetRatio);
    }
  }
  
  /**
   * Calculate availability match (0-1)
   * Placeholder implementation - would need actual calendar data
   */
  private calculateAvailabilityMatch(job: Job, specialist: Specialist): number {
    // For now, return a default score since we don't have calendar data
    // In a real implementation, this would check job timing against specialist availability
    return 0.7; // Slightly positive assumption
  }
  
  /**
   * Calculate urgency compatibility (0-1)
   */
  private calculateUrgencyCompatibility(job: Job, specialist: Specialist): number {
    // For urgent jobs, prioritize specialists with fast response times
    const jobUrgency = job.urgencyLevel === 'high' ? 0.9 : 
                      job.urgencyLevel === 'medium' ? 0.6 : 0.3;
    
    // If we have response time data, use it
    if (specialist.responseTime) {
      // Convert response time to hours and normalize (faster is better)
      const responseTimeHours = specialist.responseTime / 60;
      const responseScore = Math.max(0, 1 - (responseTimeHours / 24)); // 24 hour max
      
      // For urgent jobs, response time is more important
      return jobUrgency * responseScore;
    }
    
    // Default moderate score if no response data
    return 0.5;
  }
  
  /**
   * Calculate distance between two points using Haversine formula
   * Returns distance in kilometers
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return this.EARTH_RADIUS_KM * c;
  }
  
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  
  /**
   * Generate human-readable explanations for the match
   */
  private generateExplanations(
    factors: MatchResult['factors'], 
    job: Job, 
    specialist: Specialist
  ): string[] {
    const explanations: string[] = [];
    
    // Skill match explanation
    if (factors.skillMatch > 0.8) {
      explanations.push(`Strong skills match for ${job.serviceCategory?.name || 'this job'}`);
    } else if (factors.skillMatch > 0.5) {
      explanations.push(`Good skills match for ${job.serviceCategory?.name || 'this job'}`);
    } else if (factors.skillMatch > 0) {
      explanations.push(`Some relevant skills for ${job.serviceCategory?.name || 'this job'}`);
    }
    
    // Location explanation
    if (specialist.location) {
      const distance = this.calculateDistance(
        job.lat, job.lng,
        specialist.location.lat, specialist.location.lng
      );
    
      if (distance < 2) {
        explanations.push(`Very close to job location (${distance.toFixed(1)} km)`);
      } else if (distance < 10) {
        explanations.push(`Near job location (${distance.toFixed(1)} km)`);
      } else {
        explanations.push(`${distance.toFixed(1)} km from job location`);
      }
    } else {
      explanations.push('Location information not available');
    }
    
    // Reputation explanation
    if (factors.reputationScore > 0.8 && specialist.rating) {
      explanations.push(`Highly rated specialist (${specialist.rating}/5)`);
    } else if (factors.reputationScore > 0.6 && specialist.rating) {
      explanations.push(`Well-rated specialist (${specialist.rating}/5)`);
    }
    
    // Price match explanation
    if (factors.priceMatch > 0.9) {
      explanations.push('Perfect price match');
    } else if (factors.priceMatch > 0.7) {
      explanations.push('Good price match');
    } else if (factors.priceMatch < 0.3) {
      explanations.push('Price may be outside your budget');
    }
    
    // Urgency explanation
    if (job.urgencyLevel === 'high' && factors.urgencyCompatibility > 0.7) {
      explanations.push('Quick response time for your urgent job');
    }
    
    return explanations;
  }
}

// Export singleton instance
export const matchService = new MatchService();
