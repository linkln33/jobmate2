-- JobMate Waitlist System Database Schema
-- Simplified schema focusing on email collection and referral tracking

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
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add index on referral_code for faster lookups
  CONSTRAINT waitlist_users_referral_code_key UNIQUE (referral_code)
);

-- Waitlist Referrals Table
CREATE TABLE waitlist_referrals (
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
CREATE TABLE waitlist_rewards (
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
CREATE TABLE waitlist_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES waitlist_users(id),
  badge_name TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add index on user_id for faster lookups
  CONSTRAINT waitlist_badges_user_badge_key UNIQUE (user_id, badge_name)
);

-- Create a function to increment points
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

-- Create a function to check and award badges based on referral count
CREATE OR REPLACE FUNCTION check_and_award_badges(user_id UUID)
RETURNS VOID AS $$
DECLARE
  referral_count INTEGER;
  badge_record RECORD;
BEGIN
  -- Count how many users were referred by this user
  SELECT COUNT(*) INTO referral_count
  FROM waitlist_users
  WHERE referred_by = user_id;
  
  -- Define badge thresholds and award them
  FOR badge_record IN (
    SELECT * FROM (VALUES
      (1, 'First Referral', 'You referred your first user!', '🥉'),
      (3, 'Growing Network', 'Your network is expanding!', '🥈'),
      (5, 'Referral Pro', 'You''re becoming a referral pro!', '🥇'),
      (10, 'Referral Master', 'You''re a master of referrals!', '👑'),
      (25, 'Referral Legend', 'Your referral game is legendary!', '🏆')
    ) AS badges(threshold, name, description, icon)
    WHERE badges.threshold <= referral_count
  ) LOOP
    -- Insert badge if it doesn't exist yet
    INSERT INTO waitlist_badges (user_id, badge_name, badge_description, badge_icon)
    VALUES (user_id, badge_record.name, badge_record.description, badge_record.icon)
    ON CONFLICT (user_id, badge_name) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
