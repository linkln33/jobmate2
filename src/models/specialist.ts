/**
 * @file Specialist data models
 * @module models/specialist
 * 
 * This file contains data models for specialists in the JobMate platform,
 * including interfaces for specialist profiles, availability, and premium features.
 */

/**
 * Represents a service provider (specialist) on the JobMate platform
 * 
 * Specialists are professionals who offer services through the platform.
 * They have profiles with skills, experience, location, and availability information.
 * 
 * @example
 * ```typescript
 * const specialist: Specialist = {
 *   id: '123',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   bio: 'Professional web developer with 5 years of experience',
 *   profileImage: '/images/specialists/jane-smith.jpg',
 *   skills: ['React', 'Node.js', 'TypeScript'],
 *   primaryCategory: 'development',
 *   rating: 4.8,
 *   completedJobs: 42
 * };
 * ```
 */
export interface Specialist {
  /** Unique identifier for the specialist */
  id: string;
  
  /** First name of the specialist */
  firstName: string;
  
  /** Last name of the specialist */
  lastName: string;
  
  /** Professional biography or description */
  bio?: string;
  
  /** URL to the specialist's profile image */
  profileImage?: string;
  
  /** Average rating on a scale of 1-5 */
  rating?: number;
  
  /** Number of jobs successfully completed */
  completedJobs?: number;
  
  /** Array of skills the specialist possesses */
  skills: string[];
  
  /** Primary service category */
  primaryCategory?: string;
  
  /** Years of professional experience */
  yearsOfExperience?: number;
  
  /** Latitude coordinate for location */
  lat?: number;
  
  /** Longitude coordinate for location */
  lng?: number;
  
  /** City name */
  city?: string;
  
  /** State or province */
  state?: string;
  
  /** Postal/ZIP code */
  zipCode?: string;
  
  /** Distance (in km) the specialist is willing to travel for jobs */
  serviceRadius?: number;
  
  /** Minimum hourly rate charged */
  hourlyRateMin?: number;
  
  /** Maximum hourly rate charged */
  hourlyRateMax?: number;
  
  /** Specialist's availability for booking */
  availability?: SpecialistAvailability;
  
  /** Premium features the specialist has access to */
  premium?: PremiumFeatures;
  
  /** Verification status */
  isVerified?: boolean;
  
  /** Date when the specialist joined the platform */
  joinedDate?: string;
  
  /** Specialist's response rate to job inquiries (percentage) */
  responseRate?: number;
  
  /** Average response time to inquiries (in hours) */
  responseTime?: number;
  
  /** Certifications and credentials */
  certifications?: Certification[];
  
  /** Languages spoken */
  languages?: Language[];
  
  /** Education history */
  education?: Education[];
  
  /** Work experience history */
  workExperience?: WorkExperience[];
  
  /** Portfolio items showcasing past work */
  portfolio?: PortfolioItem[];
}

/**
 * Represents a specialist's availability for booking
 */
export interface SpecialistAvailability {
  /** Days of the week when the specialist is available */
  days: WeekDay[];
  
  /** Time slots during which the specialist is available */
  timeSlots: TimeSlot[];
  
  /** Specific dates when the specialist is unavailable */
  unavailableDates?: string[];
  
  /** Whether the specialist is available for urgent jobs */
  availableForUrgent?: boolean;
  
  /** Whether the specialist is available for remote work */
  availableRemotely?: boolean;
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
 * Premium features available to specialists
 */
export interface PremiumFeatures {
  /** Whether the specialist has a premium subscription */
  isPremium: boolean;
  
  /** Whether the specialist appears in featured listings */
  featuredListing?: boolean;
  
  /** Whether the specialist has priority in search results */
  prioritySearch?: boolean;
  
  /** Whether the specialist has access to advanced analytics */
  advancedAnalytics?: boolean;
  
  /** Whether the specialist can send unlimited proposals */
  unlimitedProposals?: boolean;
  
  /** Whether the specialist has a verified badge */
  verifiedBadge?: boolean;
  
  /** Date when premium subscription expires */
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
  
  /** Date when the certification was issued */
  issueDate: string;
  
  /** Date when the certification expires (if applicable) */
  expiryDate?: string;
  
  /** URL to credential verification */
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
  /** Institution name */
  institution: string;
  
  /** Degree or qualification obtained */
  degree: string;
  
  /** Field of study */
  fieldOfStudy: string;
  
  /** Start date of education */
  startDate: string;
  
  /** End date of education (or expected) */
  endDate?: string;
  
  /** Whether this is the current education */
  current?: boolean;
}

/**
 * Represents a work experience entry
 */
export interface WorkExperience {
  /** Company or organization name */
  company: string;
  
  /** Job title or position */
  title: string;
  
  /** Job description */
  description?: string;
  
  /** Start date of employment */
  startDate: string;
  
  /** End date of employment */
  endDate?: string;
  
  /** Whether this is the current position */
  current?: boolean;
}

/**
 * Represents a portfolio item
 */
export interface PortfolioItem {
  /** Title of the portfolio item */
  title: string;
  
  /** Description of the project or work */
  description?: string;
  
  /** URL to the project or work */
  projectUrl?: string;
  
  /** Array of image URLs showcasing the work */
  images?: string[];
  
  /** Date when the project was completed */
  completionDate?: string;
  
  /** Client or company the work was done for */
  client?: string;
}
