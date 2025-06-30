-- JobMate Complete Database Schema
-- This file combines all core tables and functions for the JobMate platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Common Functions
-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Import schema files in order:
-- Phase 1: Core Database Schema
-- 1. Users/Profiles
-- 2. Listings
-- 3. Applications
-- 4. Messages
-- 5. Reviews

-- Phase 2: Extended Features
-- 6. Skills and Categories
-- 7. Bookmarks and Saved Searches
-- 8. Notifications System
-- 9. Payments and Transactions

-- Phase 3: Supabase Configuration
-- 10. Authentication Configuration
-- 11. Storage Configuration
-- 12. Advanced Functions and Triggers

-- Note: To execute this file in Supabase SQL Editor, run:
-- BEGIN;
--   \ir 01_users.sql
--   \ir 02_listings.sql
--   \ir 03_applications.sql
--   \ir 04_messages.sql
--   \ir 05_reviews.sql
--   \ir 06_skills_categories.sql
--   \ir 07_bookmarks_searches.sql
--   \ir 08_notifications.sql
--   \ir 09_payments.sql
--   \ir 10_auth_config.sql
--   \ir 11_storage_config.sql
--   \ir 12_advanced_functions.sql
-- COMMIT;

-- Alternatively, you can copy and paste the contents of each file here
-- or use the Supabase migration system for more controlled deployments.
