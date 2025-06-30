-- JobMate Core Schema: Applications Table
-- This file defines the applications table for job/gig/project applications

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  proposed_rate DECIMAL(10, 2),
  proposed_timeline TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id, applicant_id)
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS applications_listing_id_idx ON applications (listing_id);
CREATE INDEX IF NOT EXISTS applications_applicant_id_idx ON applications (applicant_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications (status);

-- Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view applications they've submitted
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (auth.uid() = applicant_id);

-- Users can view applications for listings they own
CREATE POLICY "Listing owners can view applications for their listings"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = applications.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Users can submit applications
CREATE POLICY "Users can submit applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

-- Users can update their own applications if not accepted/rejected
CREATE POLICY "Users can update their own pending applications"
  ON applications FOR UPDATE
  USING (
    auth.uid() = applicant_id 
    AND status NOT IN ('accepted', 'rejected')
  );

-- Listing owners can update application status
CREATE POLICY "Listing owners can update application status"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = applications.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Create application attachments table
CREATE TABLE IF NOT EXISTS application_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for application attachments
ALTER TABLE application_attachments ENABLE ROW LEVEL SECURITY;

-- Applicants can view their own attachments
CREATE POLICY "Users can view their own application attachments"
  ON application_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_attachments.application_id 
      AND applications.applicant_id = auth.uid()
    )
  );

-- Listing owners can view application attachments
CREATE POLICY "Listing owners can view application attachments"
  ON application_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications 
      JOIN listings ON applications.listing_id = listings.id
      WHERE applications.id = application_attachments.application_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Users can add attachments to their own applications
CREATE POLICY "Users can add attachments to their own applications"
  ON application_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_attachments.application_id 
      AND applications.applicant_id = auth.uid()
    )
  );

-- Users can delete attachments from their own applications
CREATE POLICY "Users can delete attachments from their own applications"
  ON application_attachments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_attachments.application_id 
      AND applications.applicant_id = auth.uid()
    )
  );
