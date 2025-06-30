-- JobMate Waitlist System Database Schema
-- This file contains the SQL schema for the waitlist system tables
-- Import this into your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Waitlist Users Table
CREATE TABLE waitlist_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES waitlist_users(id),
  points INTEGER NOT NULL DEFAULT 10,
  location TEXT,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add index on referral_code for faster lookups
  CONSTRAINT waitlist_users_referral_code_key UNIQUE (referral_code)
);

-- Waitlist Referrals Table
CREATE TABLE waitlist_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES waitlist_users(id),
  referred_email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'joined')),
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE,
  
  -- Add index on referrer_id for faster lookups
  CONSTRAINT waitlist_referrals_referrer_referred_key UNIQUE (referrer_id, referred_email)
);

-- Waitlist Rewards Table
CREATE TABLE waitlist_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES waitlist_users(id),
  reward_type TEXT NOT NULL CHECK (reward_type IN ('badge', 'credit', 'feature', 'perk')),
  reward_name TEXT NOT NULL,
  threshold INTEGER NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add index on user_id for faster lookups
  CONSTRAINT waitlist_rewards_user_reward_key UNIQUE (user_id, reward_name)
);

-- Create a function to increment a column value
CREATE OR REPLACE FUNCTION increment(row_id UUID, tbl text, col text, val integer)
RETURNS integer AS $$
DECLARE
  result integer;
BEGIN
  EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2 RETURNING %I', tbl, col, col, col)
  INTO result
  USING val, row_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security Policies
-- Enable RLS on all tables
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies for waitlist_users
CREATE POLICY "Allow public read access to waitlist_users"
  ON waitlist_users FOR SELECT
  USING (true);
  
CREATE POLICY "Allow insert for authenticated users only"
  ON waitlist_users FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policies for waitlist_referrals
CREATE POLICY "Allow public read access to waitlist_referrals"
  ON waitlist_referrals FOR SELECT
  USING (true);
  
CREATE POLICY "Allow insert for authenticated users only"
  ON waitlist_referrals FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policies for waitlist_rewards
CREATE POLICY "Allow public read access to waitlist_rewards"
  ON waitlist_rewards FOR SELECT
  USING (true);
  
CREATE POLICY "Allow insert for authenticated users only"
  ON waitlist_rewards FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
