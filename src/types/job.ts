/**
 * Unified Job interface to be used across the application
 * This combines properties from both the original Job type and the job-match-types Job
 */
export interface Job {
  // Core properties
  id: string; // Changed from string | number to just string for consistency
  title: string;
  status: string;
  
  // Location properties
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  
  // Timing properties
  time?: string;
  scheduledTime?: string;
  createdAt?: string;
  
  // Financial properties
  price?: string;
  budgetMin?: number;
  budgetMax?: number;
  
  // Category information
  category?: string; // Category ID
  subcategory?: string; // Subcategory ID
  serviceCategory?: {
    id: string;
    name: string;
  };
  
  // Customer information
  customer?: string | {
    id: string;
    firstName: string;
    lastName: string;
    reputation?: {
      overallRating: number;
      reliability?: number;
      communication?: number;
      fairPayment?: number;
      respectfulness?: number;
      totalRatings: number;
      badges?: string[];
    };
  };
  
  // Additional metadata
  description?: string;
  urgency?: string;
  urgencyLevel?: string;
  icon?: string; // Custom icon for the job
  
  // Matching and compatibility
  compatibilityScore?: number; // Compatibility score between 0 and 1
  compatibilityReason?: string; // Reason for the compatibility score
  isVerifiedPayment?: boolean;
  isNeighborPosted?: boolean;
}

/**
 * Legacy Job type for backward compatibility
 * @deprecated Use the unified Job interface instead
 */
export type LegacyJob = {
  id: string | number;
  title: string;
  status: string;
  urgency: string;
  address: string;
  price: string;
  time: string;
  scheduledTime?: string;
  customer: string;
  lat: number;
  lng: number;
  category?: string;
  subcategory?: string;
  icon?: string;
  compatibilityScore?: number;
  compatibilityReason?: string;
};
