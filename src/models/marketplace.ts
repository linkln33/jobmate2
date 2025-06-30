/**
 * @file Marketplace data models
 * @module models/marketplace
 * 
 * This file contains data models for marketplace listings in the JobMate platform,
 * including common interfaces and type definitions for jobs, services, items, and rentals.
 */

/**
 * Represents a marketplace listing in the JobMate platform
 * 
 * A marketplace listing can be a job, service, item for sale, or rental.
 * This interface defines the common properties shared across all listing types.
 * 
 * @example
 * ```typescript
 * const listing: MarketplaceListing = {
 *   id: '123',
 *   title: 'Professional Web Development',
 *   description: 'Full-stack web development services',
 *   price: 75,
 *   priceUnit: 'hour',
 *   imageUrl: '/images/listings/web-dev.jpg',
 *   tags: ['React', 'Node.js', 'Full Stack'],
 *   type: 'service',
 *   category: 'development',
 *   user: {
 *     name: 'John Doe',
 *     avatar: '/images/avatars/john-doe.jpg'
 *   }
 * };
 * ```
 */
export interface MarketplaceListing {
  /** Unique identifier for the listing */
  id: string;
  
  /** Title of the listing */
  title: string;
  
  /** Detailed description of the listing */
  description: string;
  
  /** Price amount (in the default currency) */
  price: number;
  
  /** Unit for the price (e.g., 'hour', 'day', 'fixed', 'item') */
  priceUnit?: string;
  
  /** URL to the main image for the listing */
  imageUrl: string;
  
  /** Array of tags/keywords associated with the listing */
  tags: string[];
  
  /** Type of listing */
  type: MarketplaceListingType;
  
  /** Category identifier (corresponds to marketplace categories) */
  category: string;
  
  /** Whether this is a featured listing (receives special visibility) */
  isFeatured?: boolean;
  
  /** Whether this listing has been verified by JobMate */
  isVerified?: boolean;
  
  /** Whether this listing belongs to a VIP seller */
  isVip?: boolean;
  
  /** Type of pricing model used */
  pricingType?: MarketplacePricingType;
  
  /** Original price before discount (if applicable) */
  originalPrice?: number;
  
  /** End time for auctions */
  auctionEndTime?: string;
  
  /** Minimum bid amount for auctions */
  minimumBid?: number;
  
  /** Current highest bid for auctions */
  currentHighestBid?: number;
  
  /** Number of bids placed for auctions */
  bidCount?: number;
  
  /** Physical address of the listing */
  address?: string;
  
  /** Latitude coordinate for map integration */
  lat?: number;
  
  /** Longitude coordinate for map integration */
  lng?: number;
  
  /** ID of the seller/creator */
  sellerId?: string;
  
  /** Name of the seller/creator */
  sellerName?: string;
  
  /** URL to the seller's profile image */
  sellerImage?: string;
  
  /** Average rating of the seller (1-5 scale) */
  sellerRating?: number;
  
  /** Average response time of the seller (e.g., "within 1 hour") */
  sellerResponseTime?: string;
  
  /** Contact phone number */
  contactPhone?: string;
  
  /** Timestamp when the listing was created */
  createdAt?: string;
  
  /** Timestamp when the listing was last updated */
  updatedAt?: string;
  
  /** Timestamp when the listing expires */
  expiresAt?: string;
  
  /** Current status of the listing */
  status?: MarketplaceListingStatus;
  
  /** Number of views the listing has received */
  viewCount?: number;
  
  /** Number of users who have favorited this listing */
  favoriteCount?: number;
  
  /** User information (required for compatibility with UI components) */
  user: {
    /** Name of the user who created the listing */
    name: string;
    
    /** URL to the user's avatar image */
    avatar: string;
  };
}

/**
 * Types of marketplace listings
 */
export type MarketplaceListingType = 'job' | 'service' | 'item' | 'rental';

/**
 * Pricing models for marketplace listings
 */
export type MarketplacePricingType = 'fixed' | 'auction' | 'hourly' | 'daily' | 'negotiable';

/**
 * Status options for marketplace listings
 */
export type MarketplaceListingStatus = 'active' | 'pending' | 'sold' | 'expired';

/**
 * Tab types for marketplace navigation
 */
export type MarketplaceTabType = 'all' | 'items' | 'services' | 'rentals' | 'jobs';

/**
 * Represents a job listing in the marketplace
 * Extends the base MarketplaceListing with job-specific properties
 */
export interface JobListing extends MarketplaceListing {
  /** Always 'job' for job listings */
  type: 'job';
  
  /** Urgency level of the job */
  urgencyLevel?: 'low' | 'medium' | 'high';
  
  /** Estimated duration to complete the job */
  estimatedDuration?: string;
  
  /** Required skills for the job */
  requiredSkills?: string[];
  
  /** Deadline for job applications */
  applicationDeadline?: string;
  
  /** Number of applicants so far */
  applicantCount?: number;
}

/**
 * Represents a service listing in the marketplace
 * Extends the base MarketplaceListing with service-specific properties
 */
export interface ServiceListing extends MarketplaceListing {
  /** Always 'service' for service listings */
  type: 'service';
  
  /** Years of experience providing this service */
  yearsOfExperience?: number;
  
  /** Whether the service provider is available remotely */
  isRemoteAvailable?: boolean;
  
  /** Service radius in kilometers (if applicable) */
  serviceRadius?: number;
  
  /** Available time slots for booking */
  availabilitySlots?: string[];
  
  /** Certifications or qualifications */
  certifications?: string[];
}

/**
 * Represents an item for sale in the marketplace
 * Extends the base MarketplaceListing with item-specific properties
 */
export interface ItemListing extends MarketplaceListing {
  /** Always 'item' for item listings */
  type: 'item';
  
  /** Condition of the item */
  condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  
  /** Brand of the item */
  brand?: string;
  
  /** Model number or name */
  model?: string;
  
  /** Year of manufacture */
  year?: number;
  
  /** Whether price is negotiable */
  isNegotiable?: boolean;
  
  /** Array of additional image URLs */
  additionalImages?: string[];
}

/**
 * Represents a rental listing in the marketplace
 * Extends the base MarketplaceListing with rental-specific properties
 */
export interface RentalListing extends MarketplaceListing {
  /** Always 'rental' for rental listings */
  type: 'rental';
  
  /** Minimum rental duration */
  minDuration?: string;
  
  /** Maximum rental duration */
  maxDuration?: string;
  
  /** Deposit amount required */
  depositAmount?: number;
  
  /** Whether insurance is required */
  requiresInsurance?: boolean;
  
  /** Available dates for rental */
  availableDates?: {
    start: string;
    end: string;
  }[];
  
  /** Cancellation policy */
  cancellationPolicy?: string;
}
