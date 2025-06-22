import { sql } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  varchar, 
  timestamp, 
  integer, 
  boolean, 
  text, 
  decimal, 
  uuid, 
  unique 
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { jobs } from './jobs';

// Affiliate referral links table
export const affiliateLinks = pgTable('affiliate_links', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  code: varchar('code', { length: 20 }).notNull(),
  type: varchar('type', { length: 20 }).notNull().default('user'), // 'user' or 'service'
  serviceId: integer('service_id').references(() => jobs.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).default('10'),
  expiresAt: timestamp('expires_at'),
  clicks: integer('clicks').default(0).notNull(),
  conversions: integer('conversions').default(0).notNull(),
}, (table) => {
  return {
    userCodeUnique: unique().on(table.userId, table.code),
  };
});

// Affiliate referral tracking table
export const affiliateReferrals = pgTable('affiliate_referrals', {
  id: serial('id').primaryKey(),
  linkId: integer('link_id').references(() => affiliateLinks.id).notNull(),
  referrerId: integer('referrer_id').references(() => users.id).notNull(),
  referredUserId: integer('referred_user_id').references(() => users.id),
  referredServiceId: integer('referred_service_id').references(() => jobs.id),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, converted, paid, rejected
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  convertedAt: timestamp('converted_at'),
  paidAt: timestamp('paid_at'),
  commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }),
  transactionId: varchar('transaction_id', { length: 100 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
});

// Affiliate earnings table
export const affiliateEarnings = pgTable('affiliate_earnings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  referralId: integer('referral_id').references(() => affiliateReferrals.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, available, withdrawn, cancelled
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  availableAt: timestamp('available_at'),
  description: text('description'),
});

// Affiliate tiers table
export const affiliateTiers = pgTable('affiliate_tiers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  minReferrals: integer('min_referrals').notNull(),
  maxReferrals: integer('max_referrals'),
  bonusRate: decimal('bonus_rate', { precision: 5, scale: 2 }).notNull(),
  benefits: text('benefits'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User affiliate profile table
export const userAffiliateProfiles = pgTable('user_affiliate_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  tierId: integer('tier_id').references(() => affiliateTiers.id).notNull(),
  totalReferrals: integer('total_referrals').default(0).notNull(),
  totalEarnings: decimal('total_earnings', { precision: 10, scale: 2 }).default('0').notNull(),
  availableBalance: decimal('available_balance', { precision: 10, scale: 2 }).default('0').notNull(),
  pendingBalance: decimal('pending_balance', { precision: 10, scale: 2 }).default('0').notNull(),
  lifetimeBalance: decimal('lifetime_balance', { precision: 10, scale: 2 }).default('0').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastReferralAt: timestamp('last_referral_at'),
});

// Affiliate badges table
export const affiliateBadges = pgTable('affiliate_badges', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('image_url', { length: 255 }),
  requirement: text('requirement').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User affiliate badges table (many-to-many)
export const userAffiliateBadges = pgTable('user_affiliate_badges', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  badgeId: integer('badge_id').references(() => affiliateBadges.id).notNull(),
  awardedAt: timestamp('awarded_at').defaultNow().notNull(),
}, (table) => {
  return {
    userBadgeUnique: unique().on(table.userId, table.badgeId),
  };
});
