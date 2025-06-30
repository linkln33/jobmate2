-- JobMate Extended Features: Bookmarks and Saved Searches
-- This file defines the bookmarks, saved searches, and related tables

-- Create bookmarks table for users to save listings
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Create saved_searches table for users to save search queries
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  search_params JSONB NOT NULL,
  is_alert BOOLEAN DEFAULT FALSE,
  alert_frequency TEXT CHECK (alert_frequency IN ('daily', 'weekly', 'instant', NULL)),
  last_alerted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create user_follows table for users to follow other users
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Create collections table for organizing bookmarks
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create collection_items table for adding bookmarks to collections
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, listing_id)
);

-- Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- Policies for bookmarks
-- Users can view their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own bookmarks
CREATE POLICY "Users can create bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own bookmarks
CREATE POLICY "Users can update their own bookmarks"
  ON bookmarks FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (user_id = auth.uid());

-- Policies for saved_searches
-- Users can view their own saved searches
CREATE POLICY "Users can view their own saved searches"
  ON saved_searches FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own saved searches
CREATE POLICY "Users can create saved searches"
  ON saved_searches FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own saved searches
CREATE POLICY "Users can update their own saved searches"
  ON saved_searches FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own saved searches
CREATE POLICY "Users can delete their own saved searches"
  ON saved_searches FOR DELETE
  USING (user_id = auth.uid());

-- Policies for user_follows
-- Users can view who they follow and who follows them
CREATE POLICY "Users can view their own follows"
  ON user_follows FOR SELECT
  USING (follower_id = auth.uid() OR following_id = auth.uid());

-- Users can create their own follows
CREATE POLICY "Users can create follows"
  ON user_follows FOR INSERT
  WITH CHECK (follower_id = auth.uid());

-- Users can delete their own follows
CREATE POLICY "Users can delete their own follows"
  ON user_follows FOR DELETE
  USING (follower_id = auth.uid());

-- Policies for collections
-- Users can view their own collections
CREATE POLICY "Users can view their own collections"
  ON collections FOR SELECT
  USING (user_id = auth.uid());

-- Anyone can view public collections
CREATE POLICY "Anyone can view public collections"
  ON collections FOR SELECT
  USING (is_private = false);

-- Users can create their own collections
CREATE POLICY "Users can create collections"
  ON collections FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own collections
CREATE POLICY "Users can update their own collections"
  ON collections FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own collections
CREATE POLICY "Users can delete their own collections"
  ON collections FOR DELETE
  USING (user_id = auth.uid());

-- Policies for collection_items
-- Users can view items in their own collections
CREATE POLICY "Users can view their own collection items"
  ON collection_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_items.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Anyone can view items in public collections
CREATE POLICY "Anyone can view public collection items"
  ON collection_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_items.collection_id
      AND collections.is_private = false
    )
  );

-- Users can add items to their own collections
CREATE POLICY "Users can add items to their own collections"
  ON collection_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_items.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Users can update items in their own collections
CREATE POLICY "Users can update their own collection items"
  ON collection_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_items.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Users can delete items from their own collections
CREATE POLICY "Users can delete items from their own collections"
  ON collection_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_items.collection_id
      AND collections.user_id = auth.uid()
    )
  );
