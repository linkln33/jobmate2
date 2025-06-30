-- JobMate Core Schema: Reviews Table
-- This file defines the review system for the platform

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT,
  response TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_users CHECK (reviewer_id != reviewee_id),
  UNIQUE(reviewer_id, listing_id, application_id)
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS reviews_reviewer_id_idx ON reviews (reviewer_id);
CREATE INDEX IF NOT EXISTS reviews_reviewee_id_idx ON reviews (reviewee_id);
CREATE INDEX IF NOT EXISTS reviews_listing_id_idx ON reviews (listing_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON reviews (rating);

-- Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can view public reviews
CREATE POLICY "Anyone can view public reviews"
  ON reviews FOR SELECT
  USING (is_public = true);

-- Users can view all reviews they've given or received
CREATE POLICY "Users can view their own reviews"
  ON reviews FOR SELECT
  USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid());

-- Users can create reviews for listings they own or have applied to
CREATE POLICY "Users can create reviews for relevant listings"
  ON reviews FOR INSERT
  WITH CHECK (
    reviewer_id = auth.uid() AND
    (
      -- Listing owner reviewing an applicant
      EXISTS (
        SELECT 1 FROM listings 
        WHERE listings.id = reviews.listing_id 
        AND listings.user_id = auth.uid()
      ) OR
      -- Applicant reviewing a listing owner
      EXISTS (
        SELECT 1 FROM applications 
        JOIN listings ON applications.listing_id = listings.id
        WHERE applications.id = reviews.application_id 
        AND applications.applicant_id = auth.uid()
      )
    )
  );

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (reviewer_id = auth.uid());

-- Users can add a response to reviews about them
CREATE POLICY "Users can respond to their reviews"
  ON reviews FOR UPDATE
  USING (reviewee_id = auth.uid())
  WITH CHECK (
    reviewee_id = auth.uid() AND
    -- Only allow updating the response field
    response IS NOT NULL
  );

-- Create review_categories table for categorized ratings
CREATE TABLE IF NOT EXISTS review_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for review categories
ALTER TABLE review_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view review categories for public reviews
CREATE POLICY "Anyone can view categories for public reviews"
  ON review_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_categories.review_id 
      AND reviews.is_public = true
    )
  );

-- Users can view categories for their own reviews
CREATE POLICY "Users can view categories for their own reviews"
  ON review_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_categories.review_id 
      AND (reviews.reviewer_id = auth.uid() OR reviews.reviewee_id = auth.uid())
    )
  );

-- Users can add categories to their own reviews
CREATE POLICY "Users can add categories to their own reviews"
  ON review_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_categories.review_id 
      AND reviews.reviewer_id = auth.uid()
    )
  );

-- Create function to calculate and update user average rating
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate new average rating for the reviewee
  UPDATE profiles
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{average_rating}',
    (
      SELECT to_jsonb(AVG(rating))
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id
      AND is_public = true
    )
  )
  WHERE id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update user rating when review is added or updated
CREATE OR REPLACE TRIGGER on_review_change
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE PROCEDURE update_user_rating();

-- Add metadata column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
