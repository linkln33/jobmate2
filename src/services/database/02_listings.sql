-- JobMate Core Schema: Listings Table
-- This file defines the marketplace listings table and related functions

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('job', 'gig', 'project')),
  category TEXT NOT NULL,
  subcategory TEXT,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  budget_type TEXT CHECK (budget_type IN ('fixed', 'hourly', 'range')),
  location TEXT,
  remote BOOLEAN DEFAULT TRUE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'filled', 'closed', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS listings_category_idx ON listings (category);
CREATE INDEX IF NOT EXISTS listings_type_idx ON listings (type);
CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings (user_id);
CREATE INDEX IF NOT EXISTS listings_status_idx ON listings (status);

-- Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can view active listings
CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  USING (status = 'active' OR status = 'filled');

-- Users can view their own listings regardless of status
CREATE POLICY "Users can view all their own listings"
  ON listings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own listings
CREATE POLICY "Users can create listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update their own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete their own listings"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);

-- Create listing attachments table for files/images
CREATE TABLE IF NOT EXISTS listing_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for attachments
ALTER TABLE listing_attachments ENABLE ROW LEVEL SECURITY;

-- Anyone can view attachments for active listings
CREATE POLICY "Anyone can view attachments for active listings"
  ON listing_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = listing_attachments.listing_id 
      AND (listings.status = 'active' OR listings.status = 'filled')
    )
  );

-- Users can view attachments for their own listings
CREATE POLICY "Users can view attachments for their own listings"
  ON listing_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = listing_attachments.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Users can insert attachments for their own listings
CREATE POLICY "Users can add attachments to their own listings"
  ON listing_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = listing_attachments.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Users can delete attachments for their own listings
CREATE POLICY "Users can delete attachments from their own listings"
  ON listing_attachments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = listing_attachments.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Create listing tags table
CREATE TABLE IF NOT EXISTS listing_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id, tag)
);

-- Row Level Security for tags
ALTER TABLE listing_tags ENABLE ROW LEVEL SECURITY;

-- Anyone can view tags
CREATE POLICY "Anyone can view listing tags"
  ON listing_tags FOR SELECT
  USING (true);

-- Users can insert tags for their own listings
CREATE POLICY "Users can add tags to their own listings"
  ON listing_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = listing_tags.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Users can delete tags from their own listings
CREATE POLICY "Users can delete tags from their own listings"
  ON listing_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = listing_tags.listing_id 
      AND listings.user_id = auth.uid()
    )
  );
