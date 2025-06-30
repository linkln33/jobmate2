-- JobMate Extended Features: Skills and Categories Tables
-- This file defines the skills, categories, and related tables

-- Create skills table for standardized skill definitions
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create user_skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
  years_experience DECIMAL(4, 1),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Create categories table for job/gig categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  icon TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug
CREATE OR REPLACE TRIGGER categories_generate_slug
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW EXECUTE PROCEDURE generate_slug();

-- Row Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for skills
-- Anyone can view skills
CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  USING (true);

-- Only admins can modify skills (will need to be customized based on your admin system)
CREATE POLICY "Only admins can insert skills"
  ON skills FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE metadata->>'is_admin' = 'true'));

CREATE POLICY "Only admins can update skills"
  ON skills FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE metadata->>'is_admin' = 'true'));

-- Policies for user_skills
-- Users can view their own skills
CREATE POLICY "Users can view their own skills"
  ON user_skills FOR SELECT
  USING (user_id = auth.uid());

-- Users can view other users' skills
CREATE POLICY "Anyone can view user skills"
  ON user_skills FOR SELECT
  USING (true);

-- Users can add their own skills
CREATE POLICY "Users can add their own skills"
  ON user_skills FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own skills
CREATE POLICY "Users can update their own skills"
  ON user_skills FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own skills
CREATE POLICY "Users can delete their own skills"
  ON user_skills FOR DELETE
  USING (user_id = auth.uid());

-- Policies for categories
-- Anyone can view categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

-- Only admins can modify categories
CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE metadata->>'is_admin' = 'true'));

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE metadata->>'is_admin' = 'true'));

-- Insert some default categories
INSERT INTO categories (name, description, slug, display_order)
VALUES 
  ('Web Development', 'Web development services and projects', 'web-development', 1),
  ('Mobile Development', 'Mobile app development for iOS and Android', 'mobile-development', 2),
  ('Design', 'Graphic design, UI/UX, and visual content creation', 'design', 3),
  ('Writing', 'Content writing, copywriting, and editing', 'writing', 4),
  ('Marketing', 'Digital marketing, SEO, and social media', 'marketing', 5),
  ('Business', 'Business consulting, strategy, and management', 'business', 6),
  ('Data', 'Data analysis, science, and engineering', 'data', 7),
  ('IT & Networking', 'IT support, system administration, and networking', 'it-networking', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert some default skills
INSERT INTO skills (name, description, category)
VALUES 
  ('JavaScript', 'Programming language for web development', 'Web Development'),
  ('React', 'JavaScript library for building user interfaces', 'Web Development'),
  ('Node.js', 'JavaScript runtime for server-side applications', 'Web Development'),
  ('Python', 'General-purpose programming language', 'Programming'),
  ('SQL', 'Language for managing relational databases', 'Data'),
  ('UI Design', 'User interface design for digital products', 'Design'),
  ('UX Design', 'User experience design for digital products', 'Design'),
  ('Content Writing', 'Creating written content for various purposes', 'Writing'),
  ('SEO', 'Search engine optimization', 'Marketing'),
  ('Social Media Marketing', 'Marketing through social media platforms', 'Marketing')
ON CONFLICT (name) DO NOTHING;
