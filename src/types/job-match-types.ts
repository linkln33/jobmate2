/**
 * Shared types for the job matching system
 */

// Job type definition
export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  lat: number;
  lng: number;
  city: string;
  state?: string;
  zipCode: string;
  budgetMin?: number;
  budgetMax?: number;
  createdAt: string;
  urgencyLevel?: string;
  isVerifiedPayment?: boolean;
  isNeighborPosted?: boolean;
  serviceCategory?: {
    id: string;
    name: string;
  };
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    reputation?: ClientReputation;
  };
}

// Import the unified User model
import { User } from '@/models/user';

// Re-export User for backward compatibility
export type Specialist = User;

// Legacy location type for reference
interface SpecialistLocation {
  lat: number;
  lng: number;
  city: string;
  state: string;
  zipCode: string;
  radius?: number;
}

// Legacy specialist preferences types for reference
interface SpecialistPreferences {
  ratePreferences?: {
    min: number;
    max: number;
    negotiable?: boolean;
    preferred?: number;
  };
  availability?: {
    weekdays?: boolean;
    weekends?: boolean;
    evenings?: boolean;
    schedule?: Record<string, string[]>;
    preferredHours?: number[];
  };
  specialistSince?: Date;
  premium?: PremiumFeatures;
}

// Match result type
export interface MatchResult {
  score: number;
  factors: {
    skillMatch: number;
    locationProximity: number;
    reputationScore: number;
    priceMatch: number;
    availabilityMatch: number;
    urgencyCompatibility: number;
  };
  explanations?: string[];
}

// Premium features type
export interface PremiumFeatures {
  isPremium: boolean;
  premiumLevel?: 'basic' | 'pro' | 'elite';
  featuredProfile?: boolean;
  priorityMatching?: boolean;
  instantBooking?: boolean;
  verifiedOnly?: boolean;
  boostFactor?: number;
  premiumSince?: Date;
  premiumUntil?: Date;
}

// Client reputation type
export interface ClientReputation {
  overallRating: number; // 1-5 stars
  reliability?: number; // 1-5
  communication?: number; // 1-5
  fairPayment?: number; // 1-5
  respectfulness?: number; // 1-5
  totalRatings: number;
  badges?: string[]; // e.g., "Fair Payer", "Respectful", "Reliable"
}
