// utils/compatibility.ts

import { UserPreferences, CompatibilityResult as TypedCompatibilityResult } from "@/types/compatibility";

interface User {
  id: string;
  skills?: string[];
  location?: string;
  availability?: string[];
  budget?: number;
  preferences?: Record<string, any>;
  categoryPreferences?: Record<string, any>;
  dailyPreferences?: Record<string, any>;
  generalPreferences?: Record<string, any>;
}

interface Listing {
  id: string;
  tags?: string[];
  location?: string;
  schedule?: string[];
  price?: number;
  category?: string;
  creatorId?: string;
};

export interface CompatibilityResult {
  score: number;
  primaryReason: string;
  breakdown: {
    [key: string]: {
      score: number;
      weight: number;
      description: string;
    }
  };
}

/**
 * Calculate compatibility score between a user and a listing
 * @param user User data or preferences
 * @param listing Listing data
 * @param weights Optional custom weights for different factors
 * @returns Compatibility score (0-100) and breakdown
 */
export function calculateCompatibilityScore(
  user: User | UserPreferences, 
  listing: Listing,
  weights?: Record<string, number>
): CompatibilityResult {
  // Default weights if not provided
  const defaultWeights = {
    skills: 0.3,
    location: 0.15,
    availability: 0.1,
    price: 0.2,
    category: 0.15,
    reputation: 0.1
  };
  
  // Use provided weights or defaults
  const w = weights || defaultWeights;
  
  // Initialize scores object
  const scores: Record<string, { score: number; weight: number; description: string }> = {};
  
  // Calculate individual dimension scores
  
  // Skills/Tags match
  const userSkills = 'skills' in user ? user.skills || [] : 
                    (user.categoryPreferences?.jobs?.desiredSkills || []);
  const listingTags = listing.tags || [];
  if (userSkills.length && listingTags.length) {
    const matchCount = listingTags.filter(tag => 
      userSkills.some((skill: string) => skill.toLowerCase() === tag.toLowerCase())
    ).length;
    const skillScore = listingTags.length > 0 ? matchCount / listingTags.length : 0;
    scores.skills = { 
      score: skillScore * 100, 
      weight: w.skills,
      description: matchCount > 0 
        ? `Matched ${matchCount} of your skills` 
        : 'No skill matches found'
    };
  } else {
    scores.skills = { score: 50, weight: w.skills, description: 'No skill data available' };
  }
  
  // Location match
  const userLocation = 'location' in user ? user.location : 
                      (user.dailyPreferences?.location || '');
  if (userLocation && listing.location) {
    const locationScore = userLocation === listing.location ? 1 : 0.5;
    scores.location = { 
      score: locationScore * 100, 
      weight: w.location,
      description: locationScore > 0.8 
        ? 'Location is a perfect match' 
        : 'Location is nearby'
    };
  } else {
    scores.location = { score: 50, weight: w.location, description: 'Location data incomplete' };
  }
  
  // Availability match
  const userAvailability = 'availability' in user ? user.availability || [] : 
                          (user.generalPreferences?.availability as string[] || []);
  const listingSchedule = listing.schedule || [];
  if (userAvailability.length && listingSchedule.length) {
    const matchCount = listingSchedule.filter(time => 
      userAvailability.includes(time)
    ).length;
    const availScore = listingSchedule.length > 0 ? matchCount / listingSchedule.length : 0;
    scores.availability = { 
      score: availScore * 100, 
      weight: w.availability,
      description: matchCount > 0 
        ? `Schedule compatibility: ${Math.round(availScore * 100)}%` 
        : 'Schedules do not align'
    };
  } else {
    scores.availability = { score: 50, weight: w.availability, description: 'Schedule data incomplete' };
  }
  
  // Price/Budget match
  const userBudget = 'budget' in user ? user.budget : 
                    (user.dailyPreferences?.budget || 
                     user.categoryPreferences?.marketplace?.maxPrice || 
                     user.categoryPreferences?.services?.maxPrice);
  if (userBudget && listing.price) {
    let priceScore = 0;
    if (listing.price <= userBudget) {
      priceScore = 1;
    } else if (listing.price <= userBudget * 1.2) {
      priceScore = 0.7;
    } else if (listing.price <= userBudget * 1.5) {
      priceScore = 0.4;
    } else {
      priceScore = 0.2;
    }
    
    scores.price = { 
      score: priceScore * 100, 
      weight: w.price,
      description: priceScore > 0.8 
        ? 'Within your budget' 
        : priceScore > 0.5 
          ? 'Slightly above your budget' 
          : 'Significantly above your budget'
    };
  } else {
    scores.price = { score: 50, weight: w.price, description: 'Price data incomplete' };
  }
  
  // Category preference match
  const userPrefs = 'preferences' in user ? user.preferences || {} : 
                   (user.categoryPreferences || {});
  
  // Extract preferred category from user preferences
  let preferredCategory: string | undefined;
  
  if ('category' in userPrefs) {
    preferredCategory = userPrefs.category as string;
  } else {
    // Check if any of the main categories exist as keys
    const mainCategoryKey = Object.keys(userPrefs).find(key => 
      ['jobs', 'services', 'marketplace', 'rentals'].includes(key));
    
    if (mainCategoryKey) {
      preferredCategory = mainCategoryKey;
    } else if (user.dailyPreferences && 'intent' in user.dailyPreferences) {
      // Try to get from intent
      preferredCategory = user.dailyPreferences.intent;
    }
  }
  
  if (preferredCategory && listing.category) {
    const categoryScore = preferredCategory === listing.category ? 1 : 0.3;
    scores.category = { 
      score: categoryScore * 100, 
      weight: w.category,
      description: categoryScore > 0.8 
        ? 'Matches your preferred category' 
        : 'Different from your preferred category'
    };
  } else {
    scores.category = { score: 50, weight: w.category, description: 'Category preference data incomplete' };
  }
  
  // Reputation score (simplified mock)
  scores.reputation = { 
    score: 70, 
    weight: w.reputation,
    description: 'Based on creator reputation'
  };
  
  // Calculate weighted average
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.values(scores).forEach(({ score, weight }) => {
    totalScore += score * weight;
    totalWeight += weight;
  });
  
  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
  
  // Determine primary reason for match
  let primaryReason = '';
  let highestWeightedScore = 0;
  
  Object.entries(scores).forEach(([key, { score, weight, description }]) => {
    const weightedScore = score * weight;
    if (weightedScore > highestWeightedScore) {
      highestWeightedScore = weightedScore;
      primaryReason = description;
    }
  });
  
  return {
    score: finalScore,
    primaryReason,
    breakdown: scores
  };
}

/**
 * Sort listings by compatibility score
 * @param listings Array of listings with compatibility scores
 * @returns Sorted array of listings
 */
export function sortByCompatibility<T extends { compatibilityScore?: number }>(
  listings: T[]
): T[] {
  return [...listings].sort((a, b) => {
    const scoreA = a.compatibilityScore ?? 0;
    const scoreB = b.compatibilityScore ?? 0;
    return scoreB - scoreA;
  });
}
