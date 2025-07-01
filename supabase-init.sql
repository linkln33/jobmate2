-- JobMate Waitlist System Database Schema
-- Simplified schema focusing on email collection and referral tracking

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Waitlist Users Table
CREATE TABLE IF NOT EXISTS waitlist_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES waitlist_users(id),
  points INTEGER NOT NULL DEFAULT 10,
  location TEXT,
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add index on referral_code for faster lookups
  CONSTRAINT waitlist_users_referral_code_key UNIQUE (referral_code)
);

-- Waitlist Referrals Table
CREATE TABLE IF NOT EXISTS waitlist_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES waitlist_users(id),
  referred_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE,
  
  -- Add index on referrer_id for faster lookups
  CONSTRAINT waitlist_referrals_referrer_referred_key UNIQUE (referrer_id, referred_email)
);

-- Waitlist Rewards Table
CREATE TABLE IF NOT EXISTS waitlist_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES waitlist_users(id),
  reward_type TEXT NOT NULL,
  reward_name TEXT NOT NULL,
  threshold INTEGER NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add index on user_id for faster lookups
  CONSTRAINT waitlist_rewards_user_reward_key UNIQUE (user_id, reward_name)
);

-- Waitlist Badges Table (Simple rewards)
CREATE TABLE IF NOT EXISTS waitlist_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES waitlist_users(id),
  badge_name TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add index on user_id for faster lookups
  CONSTRAINT waitlist_badges_user_badge_key UNIQUE (user_id, badge_name)
);
