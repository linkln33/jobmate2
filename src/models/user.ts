/**
 * @file Unified user data model
 * @module models/user
 * 
 * This file contains the unified user data model for the JobMate platform,
 * supporting the seamless role-switching between customer and specialist.
 */

/**
 * Represents a user on the JobMate platform with unified role capabilities
 * 
 * Users can act as both customers and specialists, with seamless switching between roles.
 * The profile contains all necessary information for both roles.
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   id: '123',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   email: 'jane.smith@example.com',
 *   bio: 'Professional web developer with 5 years of experience',
 *   profileImage: '/images/users/jane-smith.jpg',
 *   activeRole: 'specialist',
 *   skills: ['React', 'Node.js', 'TypeScript'],
 *   primaryCategory: 'development',
 *   rating: 4.8,
 *   completedJobs: 42
 * };
 * ```
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  
  /** First name of the user */
  firstName: string;
  
  /** Last name of the user */
  lastName: string;
  
  /** Email address of the user */
  email: string;
  
  /** Phone number of the user */
  phone?: string;
  
  /** Professional biography or description */
  bio?: string;
  
  /** URL to the user's profile image */
  profileImage?: string;
  
  /** Currently active role (customer or specialist) */
  activeRole?: 'customer' | 'specialist';
  
  /** Average rating on a scale of 1-5 */
  rating?: number;
  
  /** Number of jobs successfully completed as a specialist */
  completedJobs?: number;
  
  /** Number of jobs posted as a customer */
  postedJobs?: number;
  
  /** User's primary service category when acting as a specialist */
  primaryCategory?: string;
  
  /** List of skills the user has as a specialist */
  skills?: string[];
  
  /** User's location information */
  location?: UserLocation;
  
  /** User's availability settings when acting as a specialist */
  availability?: UserAvailability;
  
  /** User's service area when acting as a specialist */
  serviceArea?: ServiceArea;
  
  /** User's pricing information when acting as a specialist */
  pricing?: PricingInfo;
  
  /** User's verification status */
  verification?: VerificationInfo;
  
  /** Premium features the user has access to */
  premiumFeatures?: PremiumFeatures;
  
  /** User's professional credentials and certifications */
  certifications?: Certification[];
  
  /** Languages the user speaks */
  languages?: Language[];
  
  /** User's education history */
  education?: Education[];
  
  /** User's work experience */
  workExperience?: WorkExperience[];
  
  /** User's portfolio items */
  portfolio?: PortfolioItem[];
  
  /** User's preferences for both customer and specialist roles */
  preferences?: UserPreferences;
  
  /** User's payment methods */
  paymentMethods?: PaymentMethod[];
  
  /** User's notification preferences */
  notificationPreferences?: NotificationPreferences;
  
  /** Date the user joined the platform */
  joinedAt?: string;
  
  /** Date the user's profile was last updated */
  updatedAt?: string;
}

/**
 * Represents a user's location
 */
export interface UserLocation {
  /** Address line 1 */
  address1?: string;
  
  /** Address line 2 */
  address2?: string;
  
  /** City */
  city?: string;
  
  /** State or province */
  state?: string;
  
  /** Postal or ZIP code */
  postalCode?: string;
  
  /** Country */
  country?: string;
  
  /** Latitude coordinate */
  latitude?: number;
  
  /** Longitude coordinate */
  longitude?: number;
}

/**
 * Represents a user's availability for booking when acting as a specialist
 */
export interface UserAvailability {
  /** Days of the week the user is available */
  days: WeekDay[];
  
  /** Time slots the user is available */
  timeSlots: TimeSlot[];
  
  /** Specific dates the user is unavailable */
  unavailableDates?: string[];
  
  /** Whether the user is available for urgent requests */
  availableForUrgent?: boolean;
  
  /** Whether the user is available for remote work */
  availableRemotely?: boolean;
  
  /** Whether the user is currently "on duty" and visible to customers */
  isOnDuty?: boolean;
  
  /** When the user went on duty (if currently on duty) */
  onDutySince?: string;
}

/**
 * Days of the week
 */
export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * Represents a time slot for availability
 */
export interface TimeSlot {
  /** Start time in 24-hour format (HH:MM) */
  start: string;
  
  /** End time in 24-hour format (HH:MM) */
  end: string;
}

/**
 * Represents a service area for a specialist
 */
export interface ServiceArea {
  /** Radius in kilometers or miles */
  radius: number;
  
  /** Unit of measurement (km or mi) */
  unit: 'km' | 'mi';
  
  /** Center point of the service area */
  center: {
    latitude: number;
    longitude: number;
  };
  
  /** List of specific neighborhoods or areas served */
  specificAreas?: string[];
}

/**
 * Represents pricing information for a specialist
 */
export interface PricingInfo {
  /** Base hourly rate */
  hourlyRate?: number;
  
  /** Fixed price for specific services */
  fixedPrices?: {
    serviceName: string;
    price: number;
  }[];
  
  /** Minimum project size */
  minimumJob?: number;
  
  /** Currency code (USD, EUR, etc.) */
  currency: string;
}

/**
 * Represents verification information for a user
 */
export interface VerificationInfo {
  /** Whether the user's identity is verified */
  identityVerified: boolean;
  
  /** Whether the user's phone is verified */
  phoneVerified: boolean;
  
  /** Whether the user's email is verified */
  emailVerified: boolean;
  
  /** Whether the user's address is verified */
  addressVerified: boolean;
  
  /** Whether the user's professional credentials are verified */
  credentialsVerified: boolean;
  
  /** Overall verification level (0-3) */
  verificationLevel: number;
}

/**
 * Premium features available to users
 */
export interface PremiumFeatures {
  /** Whether the user has premium status */
  isPremium: boolean;
  
  /** Whether the user has featured listing */
  featuredListing?: boolean;
  
  /** Whether the user has priority in search results */
  prioritySearch?: boolean;
  
  /** Whether the user has access to advanced analytics */
  advancedAnalytics?: boolean;
  
  /** Whether the user has unlimited proposals */
  unlimitedProposals?: boolean;
  
  /** Whether the user has a verified badge */
  verifiedBadge?: boolean;
  
  /** When the premium features expire */
  expiresAt?: string;
}

/**
 * Represents a certification or credential
 */
export interface Certification {
  /** Name of the certification */
  name: string;
  
  /** Organization that issued the certification */
  issuingOrganization: string;
  
  /** Date the certification was issued */
  issueDate: string;
  
  /** Date the certification expires */
  expiryDate?: string;
  
  /** URL to verify the credential */
  credentialUrl?: string;
}

/**
 * Represents a language and proficiency level
 */
export interface Language {
  /** Name of the language */
  name: string;
  
  /** Proficiency level */
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

/**
 * Represents an education entry
 */
export interface Education {
  /** Name of the educational institution */
  institution: string;
  
  /** Degree obtained */
  degree: string;
  
  /** Field of study */
  fieldOfStudy: string;
  
  /** Start date of education */
  startDate: string;
  
  /** End date of education */
  endDate?: string;
  
  /** Whether this is the current education */
  current?: boolean;
}

/**
 * Represents a work experience entry
 */
export interface WorkExperience {
  /** Name of the company */
  company: string;
  
  /** Job title */
  title: string;
  
  /** Job description */
  description?: string;
  
  /** Start date of employment */
  startDate: string;
  
  /** End date of employment */
  endDate?: string;
  
  /** Whether this is the current job */
  current?: boolean;
}

/**
 * Represents a portfolio item
 */
export interface PortfolioItem {
  /** Title of the portfolio item */
  title: string;
  
  /** Description of the portfolio item */
  description?: string;
  
  /** URL to the project */
  projectUrl?: string;
  
  /** Images showcasing the project */
  images?: string[];
  
  /** Date the project was completed */
  completionDate?: string;
  
  /** Client for whom the project was completed */
  client?: string;
}

/**
 * Represents a user's preferences
 */
export interface UserPreferences {
  /** General preferences that apply to both roles */
  general?: {
    /** Dark mode preference */
    darkMode?: boolean;
    
    /** Language preference */
    language?: string;
    
    /** Email notification preferences */
    emailNotifications?: boolean;
    
    /** Push notification preferences */
    pushNotifications?: boolean;
  };
  
  /** Preferences when acting as a customer */
  customer?: {
    /** Preferred specialist rating */
    preferredRating?: number;
    
    /** Maximum distance for specialists */
    maxDistance?: number;
    
    /** Price range preferences */
    priceRange?: {
      min?: number;
      max?: number;
    };
    
    /** Preferred specialist characteristics */
    preferredCharacteristics?: string[];
  };
  
  /** Preferences when acting as a specialist */
  specialist?: {
    /** Preferred job types */
    preferredJobTypes?: string[];
    
    /** Preferred customer rating */
    preferredCustomerRating?: number;
    
    /** Minimum job price */
    minimumJobPrice?: number;
    
    /** Whether to automatically accept jobs that meet criteria */
    autoAcceptQualifiedJobs?: boolean;
  };
}

/**
 * Represents a payment method
 */
export interface PaymentMethod {
  /** ID of the payment method */
  id: string;
  
  /** Type of payment method */
  type: 'credit_card' | 'bank_account' | 'paypal' | 'other';
  
  /** Last 4 digits of the card or account */
  last4?: string;
  
  /** Whether this is the default payment method */
  isDefault: boolean;
  
  /** Expiration date for cards */
  expiryDate?: string;
}

/**
 * Represents notification preferences
 */
export interface NotificationPreferences {
  /** Email notification settings */
  email: {
    /** Job updates */
    jobUpdates: boolean;
    
    /** Messages */
    messages: boolean;
    
    /** Payments */
    payments: boolean;
    
    /** Marketing */
    marketing: boolean;
  };
  
  /** Push notification settings */
  push: {
    /** Job updates */
    jobUpdates: boolean;
    
    /** Messages */
    messages: boolean;
    
    /** Payments */
    payments: boolean;
    
    /** Marketing */
    marketing: boolean;
  };
}
