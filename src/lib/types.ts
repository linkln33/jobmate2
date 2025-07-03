/**
 * Common types for the application
 * 
 * This file contains types that were previously imported from Prisma
 * and are now defined directly in the application for use with Supabase
 */

// User roles
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  SPECIALIST = 'SPECIALIST'
}

// Review types
export enum ReviewType {
  CUSTOMER_TO_SPECIALIST = 'CUSTOMER_TO_SPECIALIST',
  SPECIALIST_TO_CUSTOMER = 'SPECIALIST_TO_CUSTOMER'
}

// Application status
export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  COMPLETED = 'COMPLETED'
}

// Payment status
export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

// Listing status
export enum ListingStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Message status
export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ'
}

// Notification type
export enum NotificationType {
  MESSAGE = 'MESSAGE',
  APPLICATION = 'APPLICATION',
  REVIEW = 'REVIEW',
  PAYMENT = 'PAYMENT',
  SYSTEM = 'SYSTEM'
}

// Subscription tier
export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

// User type definition (simplified from Prisma User model)
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  isActive: boolean;
  profileImageUrl?: string | null;
  phone?: string | null;
};

// JSON types for API responses
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
export interface JsonObject { [Key: string]: JsonValue }
export type JsonArray = JsonValue[];
