-- JobMate Waitlist System Database Setup
-- Run this in the Supabase SQL Editor to set up your waitlist tables

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  
  CONSTRAINT waitlist_rewards_user_reward_key UNIQUE (user_id, reward_name)
);

-- Waitlist Badges Table
CREATE TABLE IF NOT EXISTS waitlist_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES waitlist_users(id),
  badge_name TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT waitlist_badges_user_badge_key UNIQUE (user_id, badge_name)
);

-- Create function to add points
CREATE OR REPLACE FUNCTION add_points(user_id UUID, points_to_add INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_points INTEGER;
BEGIN
  UPDATE waitlist_users 
  SET points = points + points_to_add
  WHERE id = user_id
  RETURNING points INTO new_points;
  
  RETURN new_points;
END;
$$ LANGUAGE plpgsql;

-- Set up Row Level Security (RLS) for all tables
-- First enable RLS on all tables
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_badges ENABLE ROW LEVEL SECURITY;

-- Then create policies that allow all operations for authenticated users
CREATE POLICY waitlist_users_policy ON waitlist_users FOR ALL TO authenticated USING (true);
CREATE POLICY waitlist_referrals_policy ON waitlist_referrals FOR ALL TO authenticated USING (true);
CREATE POLICY waitlist_rewards_policy ON waitlist_rewards FOR ALL TO authenticated USING (true);
CREATE POLICY waitlist_badges_policy ON waitlist_badges FOR ALL TO authenticated USING (true);

-- Create policies that allow all operations for anon users (for our waitlist system)
CREATE POLICY waitlist_users_anon_policy ON waitlist_users FOR ALL TO anon USING (true);
CREATE POLICY waitlist_referrals_anon_policy ON waitlist_referrals FOR ALL TO anon USING (true);
CREATE POLICY waitlist_rewards_anon_policy ON waitlist_rewards FOR ALL TO anon USING (true);
CREATE POLICY waitlist_badges_anon_policy ON waitlist_badges FOR ALL TO anon USING (true);
