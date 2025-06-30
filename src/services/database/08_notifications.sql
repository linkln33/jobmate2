-- JobMate Extended Features: Notifications System
-- This file defines the notifications tables and related functions

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create notification_types table for standardized notification types
CREATE TABLE IF NOT EXISTS notification_types (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  template TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_notification_types_updated_at
  BEFORE UPDATE ON notification_types
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT REFERENCES notification_types(id) ON DELETE CASCADE NOT NULL,
  email BOOLEAN DEFAULT TRUE,
  push BOOLEAN DEFAULT TRUE,
  in_app BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, type)
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create notification_devices table for push notifications
CREATE TABLE IF NOT EXISTS notification_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  device_token TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('ios', 'android', 'web')),
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, device_token)
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_notification_devices_updated_at
  BEFORE UPDATE ON notification_devices
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_devices ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Only system can create notifications (will be handled through functions)
-- Users can update their own notifications (e.g., mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- Policies for notification_types
-- Anyone can view notification types
CREATE POLICY "Anyone can view notification types"
  ON notification_types FOR SELECT
  USING (true);

-- Only admins can modify notification types
CREATE POLICY "Only admins can insert notification types"
  ON notification_types FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE metadata->>'is_admin' = 'true'));

CREATE POLICY "Only admins can update notification types"
  ON notification_types FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE metadata->>'is_admin' = 'true'));

-- Policies for notification_preferences
-- Users can view their own notification preferences
CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own notification preferences
CREATE POLICY "Users can create notification preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own notification preferences
CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences FOR UPDATE
  USING (user_id = auth.uid());

-- Policies for notification_devices
-- Users can view their own notification devices
CREATE POLICY "Users can view their own notification devices"
  ON notification_devices FOR SELECT
  USING (user_id = auth.uid());

-- Users can register their own notification devices
CREATE POLICY "Users can register notification devices"
  ON notification_devices FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own notification devices
CREATE POLICY "Users can update their own notification devices"
  ON notification_devices FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own notification devices
CREATE POLICY "Users can delete their own notification devices"
  ON notification_devices FOR DELETE
  USING (user_id = auth.uid());

-- Create function to send notification
CREATE OR REPLACE FUNCTION send_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_user_preference RECORD;
BEGIN
  -- Check if user wants this type of notification
  SELECT * INTO v_user_preference
  FROM notification_preferences
  WHERE user_id = p_user_id AND type = p_type;
  
  -- If no preference found or in_app is true, create in-app notification
  IF v_user_preference IS NULL OR v_user_preference.in_app = TRUE THEN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (p_user_id, p_type, p_title, p_message, p_data)
    RETURNING id INTO v_notification_id;
  END IF;
  
  -- Note: Email and push notifications would typically be handled by external services
  -- This function just creates the in-app notification
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default notification types
INSERT INTO notification_types (id, description, template, icon, color, category)
VALUES 
  ('new_message', 'New message received', 'You have a new message from {{sender}}', 'message', 'blue', 'messages'),
  ('application_status', 'Application status change', 'Your application for {{listing}} has been {{status}}', 'application', 'green', 'applications'),
  ('new_application', 'New application received', 'You have a new application for {{listing}} from {{applicant}}', 'application', 'orange', 'listings'),
  ('new_review', 'New review received', 'You have a new review from {{reviewer}}', 'star', 'yellow', 'reviews'),
  ('listing_expiring', 'Listing about to expire', 'Your listing "{{title}}" will expire in {{days}} days', 'clock', 'red', 'listings'),
  ('saved_search_results', 'New results for saved search', 'Your saved search "{{name}}" has {{count}} new results', 'search', 'purple', 'searches')
ON CONFLICT (id) DO NOTHING;

-- Create function to handle automatic notifications for various events
CREATE OR REPLACE FUNCTION handle_notification_events()
RETURNS TRIGGER AS $$
BEGIN
  -- Different logic based on the table and operation
  IF TG_TABLE_NAME = 'messages' AND TG_OP = 'INSERT' THEN
    -- New message notification
    PERFORM send_notification(
      (SELECT user_id FROM conversation_participants 
       WHERE conversation_id = NEW.conversation_id AND user_id != NEW.sender_id),
      'new_message',
      'New message',
      'You have a new message',
      jsonb_build_object('conversation_id', NEW.conversation_id, 'sender_id', NEW.sender_id)
    );
  ELSIF TG_TABLE_NAME = 'applications' AND TG_OP = 'UPDATE' THEN
    -- Application status change
    IF OLD.status != NEW.status THEN
      -- Notify applicant
      PERFORM send_notification(
        NEW.applicant_id,
        'application_status',
        'Application status updated',
        'Your application status has changed to ' || NEW.status,
        jsonb_build_object('application_id', NEW.id, 'listing_id', NEW.listing_id, 'status', NEW.status)
      );
    END IF;
  ELSIF TG_TABLE_NAME = 'applications' AND TG_OP = 'INSERT' THEN
    -- New application notification for listing owner
    PERFORM send_notification(
      (SELECT user_id FROM listings WHERE id = NEW.listing_id),
      'new_application',
      'New application received',
      'You have a new application for your listing',
      jsonb_build_object('application_id', NEW.id, 'listing_id', NEW.listing_id, 'applicant_id', NEW.applicant_id)
    );
  ELSIF TG_TABLE_NAME = 'reviews' AND TG_OP = 'INSERT' THEN
    -- New review notification
    PERFORM send_notification(
      NEW.reviewee_id,
      'new_review',
      'New review received',
      'You have received a new review',
      jsonb_build_object('review_id', NEW.id, 'reviewer_id', NEW.reviewer_id, 'rating', NEW.rating)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic notifications
CREATE OR REPLACE TRIGGER on_message_sent_notification
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE PROCEDURE handle_notification_events();

CREATE OR REPLACE TRIGGER on_application_update_notification
  AFTER UPDATE ON applications
  FOR EACH ROW EXECUTE PROCEDURE handle_notification_events();

CREATE OR REPLACE TRIGGER on_application_created_notification
  AFTER INSERT ON applications
  FOR EACH ROW EXECUTE PROCEDURE handle_notification_events();

CREATE OR REPLACE TRIGGER on_review_created_notification
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE PROCEDURE handle_notification_events();
