/**
 * @file Job data models
 * @module models/job
 * 
 * This file contains data models for jobs in the JobMate platform,
 * including interfaces for job listings, proposals, and job-related types.
 */

/**
 * Represents a job posting on the JobMate platform
 * 
 * Jobs are tasks or projects posted by customers seeking specialists.
 * They include details about requirements, budget, location, and timing.
 * 
 * @example
 * ```typescript
 * const job: Job = {
 *   id: '123',
 *   title: 'Website Development for Small Business',
 *   description: 'Need a responsive website with 5 pages and contact form',
 *   status: 'open',
 *   lat: 37.7749,
 *   lng: -122.4194,
 *   city: 'San Francisco',
 *   zipCode: '94103',
 *   budgetMin: 500,
 *   budgetMax: 1000,
 *   createdAt: '2023-06-15T10:30:00Z',
 *   isVerifiedPayment: true,
 *   serviceCategory: {
 *     id: 'web-dev',
 *     name: 'Web Development'
 *   },
 *   customer: {
 *     id: 'cust123',
 *     firstName: 'Alex',
 *     lastName: 'Johnson',
 *     rating: 4.7
 *   }
 * };
 * ```
 */
export interface Job {
  /** Unique identifier for the job */
  id: string;
  
  /** Title of the job posting */
  title: string;
  
  /** Detailed description of the job */
  description: string;
  
  /** Current status of the job */
  status: JobStatus;
  
  /** Latitude coordinate for job location */
  lat: number;
  
  /** Longitude coordinate for job location */
  lng: number;
  
  /** City name */
  city: string;
  
  /** State or province */
  state?: string;
  
  /** Postal/ZIP code */
  zipCode: string;
  
  /** Minimum budget amount */
  budgetMin?: number;
  
  /** Maximum budget amount */
  budgetMax?: number;
  
  /** Timestamp when the job was created */
  createdAt: string;
  
  /** Date when the job is scheduled to be performed */
  scheduledDate?: string;
  
  /** Level of urgency for the job */
  urgencyLevel?: UrgencyLevel;
  
  /** Whether the customer has a verified payment method */
  isVerifiedPayment: boolean;
  
  /** Whether the job was posted by a verified neighbor */
  isNeighborPosted: boolean;
  
  /** Service category information */
  serviceCategory: {
    /** Unique identifier for the service category */
    id: string;
    
    /** Name of the service category */
    name: string;
  };
  
  /** Skills required for the job */
  requiredSkills?: string[];
  
  /** Customer who posted the job */
  customer: {
    /** Unique identifier for the customer */
    id: string;
    
    /** First name of the customer */
    firstName: string;
    
    /** Last name of the customer */
    lastName: string;
    
    /** Customer's average rating (1-5) */
    rating?: number;
    
    /** Number of jobs the customer has posted */
    jobsPosted?: number;
  };
  
  /** Number of proposals received */
  proposalCount?: number;
  
  /** Number of views the job posting has received */
  viewCount?: number;
  
  /** Timestamp when the job posting expires */
  expiresAt?: string;
  
  /** Attachments related to the job */
  attachments?: JobAttachment[];
  
  /** Preferred communication method */
  preferredCommunication?: CommunicationMethod;
  
  /** Whether the job is featured in search results */
  isFeatured?: boolean;
  
  /** Whether the job is remote or requires physical presence */
  isRemote?: boolean;
  
  /** Estimated duration to complete the job */
  estimatedDuration?: string;
  
  /** Payment terms for the job */
  paymentTerms?: PaymentTerms;
}

/**
 * Possible status values for a job
 */
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled' | 'expired';

/**
 * Urgency levels for jobs
 */
export type UrgencyLevel = 'low' | 'medium' | 'high';

/**
 * Represents an attachment for a job
 */
export interface JobAttachment {
  /** Unique identifier for the attachment */
  id: string;
  
  /** File name */
  fileName: string;
  
  /** URL to the file */
  fileUrl: string;
  
  /** MIME type of the file */
  mimeType: string;
  
  /** Size of the file in bytes */
  fileSize: number;
  
  /** Timestamp when the attachment was uploaded */
  uploadedAt: string;
}

/**
 * Communication method preferences
 */
export type CommunicationMethod = 'email' | 'phone' | 'messaging' | 'video_call';

/**
 * Payment terms for a job
 */
export interface PaymentTerms {
  /** Payment structure type */
  type: 'hourly' | 'fixed' | 'milestone';
  
  /** Whether a deposit is required */
  requiresDeposit?: boolean;
  
  /** Deposit percentage if required */
  depositPercentage?: number;
  
  /** Payment schedule for milestone-based jobs */
  milestones?: JobMilestone[];
}

/**
 * Represents a milestone in a job's payment schedule
 */
export interface JobMilestone {
  /** Unique identifier for the milestone */
  id: string;
  
  /** Title or name of the milestone */
  title: string;
  
  /** Description of what the milestone entails */
  description?: string;
  
  /** Amount to be paid upon completion of this milestone */
  amount: number;
  
  /** Due date for the milestone */
  dueDate?: string;
  
  /** Current status of the milestone */
  status: 'pending' | 'in_progress' | 'completed' | 'paid';
}

/**
 * Represents a proposal submitted by a specialist for a job
 */
export interface JobProposal {
  /** Unique identifier for the proposal */
  id: string;
  
  /** ID of the job the proposal is for */
  jobId: string;
  
  /** ID of the specialist who submitted the proposal */
  specialistId: string;
  
  /** Cover letter or message */
  coverLetter: string;
  
  /** Proposed bid amount */
  bidAmount: number;
  
  /** Estimated time to complete the job */
  estimatedTime?: string;
  
  /** Timestamp when the proposal was submitted */
  submittedAt: string;
  
  /** Current status of the proposal */
  status: ProposalStatus;
  
  /** Specialist's availability for the job */
  availability?: {
    /** Earliest date the specialist can start */
    startDate: string;
    
    /** Proposed completion date */
    endDate?: string;
  };
  
  /** Whether the specialist has viewed the job details */
  isViewed: boolean;
  
  /** Attachments included with the proposal */
  attachments?: JobAttachment[];
}

/**
 * Possible status values for a proposal
 */
export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

/**
 * Represents the result of matching a job with a specialist
 */
export interface MatchResult {
  /** Overall match score (0-100) */
  score: number;
  
  /** Individual factor scores */
  factors: {
    /** Score for skills match (0-100) */
    skills: number;
    
    /** Score for location match (0-100) */
    location: number;
    
    /** Score for budget match (0-100) */
    budget: number;
    
    /** Score for availability match (0-100) */
    availability: number;
    
    /** Score for experience match (0-100) */
    experience: number;
  };
  
  /** Job being matched */
  job: Job;
  
  /** Specialist being matched */
  specialist: Specialist;
  
  /** Timestamp when the match was calculated */
  calculatedAt: string;
}

/**
 * Import the Specialist type for reference in MatchResult
 */
import { Specialist } from './specialist';
