/**
 * Subscription and monetization related types
 */

export type SubscriptionTier = 'free' | 'pro' | 'agency';

export interface SubscriptionFeatures {
  maxJobMates: number;
  realTimeMatching: boolean;
  autoAlerts: boolean;
  chatInterface: boolean;
  aiInsights: boolean;
  teamSharing: boolean;
  scheduling: boolean;
  apiAccess: boolean;
  autoPosting: boolean;
  autoNegotiation: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number; // Monthly price in USD
  features: SubscriptionFeatures;
  description: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  credits: number; // For credit-based features
}

export interface PurchasedAddon {
  id: string;
  userId: string;
  addonId: string;
  purchaseDate: Date;
  expiryDate?: Date;
  status: 'active' | 'expired';
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  creditCost: number;
  type: 'agent_category' | 'feature' | 'boost' | 'credits';
  duration?: number; // Duration in days, if applicable
}
