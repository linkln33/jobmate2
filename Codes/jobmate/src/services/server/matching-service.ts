import { Prisma } from '@prisma/client';
import { calculateDistance } from '@/utils/geo-utils';

// Types for matching service
interface Location {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface Skill {
  id: string;
  name: string;
}

interface RatePreferences {
  min: number;
  max: number;
  preferred: number;
}

interface Availability {
  schedule: Array<{
    day: number;
    startHour: number;
    endHour: number;
  }>;
  preferredHours?: number[];
}

interface PremiumFeatures {
  isPremium: boolean;
  premiumLevel?: 'basic' | 'pro' | 'elite';
  boostFactor?: number;
}

interface Specialist {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  skills: Skill[];
  location?: Location;
  rating?: number;
  completedJobs?: number;
  hourlyRate?: number;
  ratePreferences?: RatePreferences;
  availability?: Availability;
  responseTime?: number;
  verificationLevel?: number;
  premium?: PremiumFeatures;
}

interface Customer {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  reputation?: {
    overallRating: number;
    reliability?: number;
    communication?: number;
    fairPayment?: number;
    respectfulness?: number;
    totalRatings: number;
  };
}

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  location: Location;
  budgetMin?: number;
  budgetMax?: number;
  createdAt: Date;
  urgencyLevel?: string;
  isVerifiedPayment?: boolean;
  isNeighborPosted?: boolean;
  category?: {
    id: string;
    name: string;
  };
  customer?: Customer;
}

interface MatchPreferences {
  prioritizeLocation?: boolean;
  prioritizeRate?: boolean;
  prioritizeUrgent?: boolean;
  maxDistance?: number;
}

interface MatchFactors {
  skillMatch: number;
  locationProximity: number;
  reputationScore: number;
  priceMatch: number;
  availabilityMatch: number;
  urgencyCompatibility: number;
}

interface MatchResult {
  score: number;
  factors: MatchFactors;
  explanations: string[];
}

interface JobMatch {
  job: Job;
  matchResult: MatchResult;
}

class MatchingService {
  // Constants for calculations
  private readonly MAX_DISTANCE_KM = 50; // Maximum distance to consider for proximity
  private readonly EARTH_RADIUS_KM = 6371; // Earth radius in kilometers
  
  /**
   * Calculate match scores for a specialist and a list of jobs
   */
  async calculateMatchesForSpecialist(
    specialist: Specialist,
    jobs: Job[],
    preferences: MatchPreferences = {}
  ): Promise<JobMatch[]> {
    return jobs.map(job => ({
      job,
      matchResult: this.calculateMatchScore(job, specialist, preferences)
    }));
  }

  /**
   * Calculate match score between a job and specialist
   */
  calculateMatchScore(
    job: Job,
    specialist: Specialist,
    preferences: MatchPreferences = {}
  ): MatchResult {
    // Calculate individual factor scores
    const skillMatch = this.calculateSkillMatch(
      job.category ? [job.category.name] : [],
      specialist.skills?.map(s => s.name) || []
    );
    
    const locationProximity = specialist.location && job.location ? 
      this.calculateLocationProximity(
        { lat: job.location.lat, lng: job.location.lng },
        { lat: specialist.location.lat, lng: specialist.location.lng },
        preferences.maxDistance
      ) : 0.5; // Default score if no location data
    
    const reputationScore = this.calculateReputationCompatibility(job, specialist);
    const priceMatch = this.calculatePriceMatch(job, specialist);
    const availabilityMatch = this.calculateAvailabilityMatch(job, specialist);
    const urgencyCompatibility = this.calculateUrgencyCompatibility(job, specialist);
    
    // Apply weighting based on preferences
    let weights = {
      skillMatch: 0.3,
      locationProximity: 0.2,
      reputationScore: 0.15,
      priceMatch: 0.15,
      availabilityMatch: 0.1,
      urgencyCompatibility: 0.1
    };
    
    // Adjust weights based on preferences
    if (preferences.prioritizeLocation) {
      weights.locationProximity += 0.1;
      weights.skillMatch -= 0.05;
      weights.priceMatch -= 0.05;
    }
    
    if (preferences.prioritizeRate) {
      weights.priceMatch += 0.1;
      weights.locationProximity -= 0.05;
      weights.reputationScore -= 0.05;
    }
    
    if (preferences.prioritizeUrgent) {
      weights.urgencyCompatibility += 0.1;
      weights.availabilityMatch += 0.05;
      weights.reputationScore -= 0.05;
      weights.locationProximity -= 0.05;
      weights.skillMatch -= 0.05;
    }
    
    // Apply premium boost if applicable
    const premiumBoost = this.calculatePremiumBoost(specialist);
    
    // Calculate final score
    const rawScore = (
      (skillMatch * weights.skillMatch) +
      (locationProximity * weights.locationProximity) +
      (reputationScore * weights.reputationScore) +
      (priceMatch * weights.priceMatch) +
      (availabilityMatch * weights.availabilityMatch) +
      (urgencyCompatibility * weights.urgencyCompatibility)
    );
    
    // Apply premium boost and normalize to 0-100
    const score = Math.min(100, Math.max(0, Math.round(rawScore * premiumBoost * 100)));
    
    // Generate explanations
    const explanations = this.generateMatchExplanations({
      skillMatch,
      locationProximity,
      reputationScore,
      priceMatch,
      availabilityMatch,
      urgencyCompatibility
    }, job, specialist);
    
    return {
      score,
      factors: {
        skillMatch,
        locationProximity,
        reputationScore,
        priceMatch,
        availabilityMatch,
        urgencyCompatibility
      },
      explanations
    };
  }
  
  /**
   * Calculate how well the specialist's skills match the job requirements
   */
  private calculateSkillMatch(jobSkills: string[], specialistSkills: string[]): number {
    if (!jobSkills.length || !specialistSkills.length) return 0.5; // Neutral score if no data
    
    // Count how many job skills the specialist has
    const matchedSkills = jobSkills.filter(skill => 
      specialistSkills.some(specSkill => 
        specSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(specSkill.toLowerCase())
      )
    );
    
    return matchedSkills.length / jobSkills.length;
  }
  
  /**
   * Calculate proximity score based on distance
   */
  private calculateLocationProximity(
    jobLocation: { lat: number; lng: number }, 
    specialistLocation: { lat: number; lng: number },
    maxDistance?: number
  ): number {
    const distance = calculateDistance(
      jobLocation.lat, 
      jobLocation.lng, 
      specialistLocation.lat, 
      specialistLocation.lng
    );
    
    const maxDist = maxDistance || this.MAX_DISTANCE_KM;
    
    // Convert distance to a 0-1 score (closer = higher score)
    return Math.max(0, 1 - (distance / maxDist));
  }
  
  /**
   * Calculate compatibility based on reputation
   */
  private calculateReputationCompatibility(job: Job, specialist: Specialist): number {
    // Default to neutral score if no data
    if (!specialist.rating || !job.customer?.reputation?.overallRating) return 0.5;
    
    // Higher scores for specialists with good ratings matched with customers with good ratings
    const specialistScore = (specialist.rating / 5); // Normalize to 0-1
    const customerScore = (job.customer.reputation.overallRating / 5); // Normalize to 0-1
    
    // Reputation compatibility is higher when both have good ratings
    return (specialistScore + customerScore) / 2;
  }
  
  /**
   * Calculate price match between job budget and specialist rates
   */
  private calculatePriceMatch(job: Job, specialist: Specialist): number {
    // Default to neutral score if missing data
    if (!job.budgetMin && !job.budgetMax) return 0.5;
    if (!specialist.hourlyRate && !specialist.ratePreferences) return 0.5;
    
    const specialistMin = specialist.ratePreferences?.min || specialist.hourlyRate || 0;
    const specialistMax = specialist.ratePreferences?.max || specialist.hourlyRate || 0;
    const specialistPreferred = specialist.ratePreferences?.preferred || specialist.hourlyRate || 0;
    
    const jobMin = job.budgetMin || 0;
    const jobMax = job.budgetMax || (job.budgetMin ? job.budgetMin * 1.5 : 0);
    
    // Perfect match: job budget contains specialist's preferred rate
    if (jobMin <= specialistPreferred && jobMax >= specialistPreferred) {
      return 1.0;
    }
    
    // Partial match: ranges overlap
    if (
      (jobMin <= specialistMax && jobMax >= specialistMin) ||
      (specialistMin <= jobMax && specialistMax >= jobMin)
    ) {
      return 0.7;
    }
    
    // Poor match: ranges close but don't overlap
    const gap = Math.min(
      Math.abs(jobMin - specialistMax),
      Math.abs(specialistMin - jobMax)
    );
    
    if (gap <= 10) return 0.5;
    if (gap <= 20) return 0.3;
    
    // Bad match: ranges far apart
    return 0.1;
  }
  
  /**
   * Calculate availability match
   */
  private calculateAvailabilityMatch(job: Job, specialist: Specialist): number {
    // Default to neutral score if no availability data
    if (!specialist.availability) return 0.5;
    
    // For now, just return a good score if the specialist has availability data
    // In a real implementation, this would check job timing against specialist schedule
    return 0.8;
  }
  
  /**
   * Calculate urgency compatibility
   */
  private calculateUrgencyCompatibility(job: Job, specialist: Specialist): number {
    if (!job.urgencyLevel) return 0.5; // Neutral if no urgency specified
    
    // Map urgency levels to numeric values
    const urgencyMap: Record<string, number> = {
      'low': 0.3,
      'medium': 0.6,
      'high': 0.9
    };
    
    const urgencyValue = urgencyMap[job.urgencyLevel.toLowerCase()] || 0.5;
    
    // Fast response specialists are better for urgent jobs
    if (specialist.responseTime) {
      // Response time in minutes, lower is better
      const responseScore = Math.max(0, 1 - (specialist.responseTime / 60));
      
      // For high urgency jobs, weight response time more heavily
      if (urgencyValue > 0.7) {
        return (urgencyValue * 0.4) + (responseScore * 0.6);
      }
    }
    
    return urgencyValue;
  }
  
  /**
   * Calculate premium boost factor
   */
  private calculatePremiumBoost(specialist: Specialist): number {
    if (!specialist.premium?.isPremium) return 1.0; // No boost for non-premium
    
    // Apply boost based on premium level
    switch (specialist.premium.premiumLevel) {
      case 'elite':
        return specialist.premium.boostFactor || 1.3;
      case 'pro':
        return specialist.premium.boostFactor || 1.2;
      case 'basic':
        return specialist.premium.boostFactor || 1.1;
      default:
        return 1.0;
    }
  }
  
  /**
   * Generate human-readable explanations for match factors
   */
  private generateMatchExplanations(
    factors: MatchFactors,
    job: Job,
    specialist: Specialist
  ): string[] {
    const explanations: string[] = [];
    
    // Skill match explanation
    if (factors.skillMatch > 0.8) {
      explanations.push(`Your skills are an excellent match for this ${job.category?.name || ''} job.`);
    } else if (factors.skillMatch > 0.5) {
      explanations.push(`You have some of the skills needed for this ${job.category?.name || ''} job.`);
    } else if (factors.skillMatch > 0) {
      explanations.push(`This job may require skills you don't currently list in your profile.`);
    }
    
    // Location explanation
    if (factors.locationProximity > 0.8) {
      explanations.push(`This job is very close to your location.`);
    } else if (factors.locationProximity > 0.5) {
      explanations.push(`This job is within a reasonable distance from your location.`);
    } else if (factors.locationProximity > 0.2) {
      explanations.push(`This job is somewhat far from your location.`);
    } else {
      explanations.push(`This job is quite far from your location.`);
    }
    
    // Price match explanation
    if (factors.priceMatch > 0.8) {
      explanations.push(`The job budget aligns perfectly with your rate preferences.`);
    } else if (factors.priceMatch > 0.5) {
      explanations.push(`The job budget is close to your preferred rates.`);
    } else {
      explanations.push(`The job budget differs from your preferred rates.`);
    }
    
    // Urgency explanation
    if (job.urgencyLevel?.toLowerCase() === 'high' && factors.urgencyCompatibility > 0.7) {
      explanations.push(`This is an urgent job that matches your quick response time.`);
    } else if (job.urgencyLevel?.toLowerCase() === 'high') {
      explanations.push(`This is an urgent job requiring immediate attention.`);
    }
    
    // Customer reputation
    if (job.customer?.reputation && job.customer.reputation.overallRating > 4) {
      explanations.push(`This client has an excellent reputation rating of ${job.customer.reputation.overallRating}/5.`);
    }
    
    return explanations;
  }
}

// Export singleton instance
export const matchingService = new MatchingService();
