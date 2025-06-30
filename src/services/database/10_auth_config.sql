-- JobMate Supabase Configuration: Authentication Providers
-- This file configures authentication settings and user management

-- Enable email confirmations for new sign-ups
-- Note: This is a placeholder as actual configuration is done through Supabase Dashboard
-- COMMENT ON TABLE auth.users IS 'Set enable_email_confirm to true in Supabase Dashboard';

-- Create auth hooks for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create empty profile for new user
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  
  -- Create default user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  -- Create default notification preferences for all notification types
  INSERT INTO public.notification_preferences (user_id, type)
  SELECT NEW.id, id FROM public.notification_types;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to handle user deletions
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete user profile and related data (cascades to other tables)
  DELETE FROM public.profiles WHERE id = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is deleted
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_user_delete();

-- Create admin role function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND metadata->>'is_admin' = 'true'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user has an active subscription
CREATE OR REPLACE FUNCTION public.has_subscription(plan_level TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  has_active BOOLEAN;
BEGIN
  IF plan_level IS NULL THEN
    -- Check if user has any active subscription
    SELECT EXISTS (
      SELECT 1 FROM subscriptions
      WHERE user_id = auth.uid()
      AND status = 'active'
      AND current_period_end > NOW()
    ) INTO has_active;
  ELSE
    -- Check if user has specific subscription level
    SELECT EXISTS (
      SELECT 1 FROM subscriptions s
      JOIN subscription_plans p ON s.plan_id = p.id
      WHERE s.user_id = auth.uid()
      AND s.status = 'active'
      AND s.current_period_end > NOW()
      AND (
        CASE 
          WHEN plan_level = 'pro' THEN p.id IN ('pro', 'pro-yearly', 'business', 'business-yearly')
          WHEN plan_level = 'business' THEN p.id IN ('business', 'business-yearly')
          ELSE FALSE
        END
      )
    ) INTO has_active;
  END IF;
  
  RETURN has_active;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current user's profile
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS SETOF profiles AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM profiles
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current user's settings
CREATE OR REPLACE FUNCTION public.get_my_settings()
RETURNS SETOF user_settings AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_settings
  WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can create more listings (based on subscription)
CREATE OR REPLACE FUNCTION public.can_create_listing()
RETURNS BOOLEAN AS $$
DECLARE
  listing_count INTEGER;
  max_listings INTEGER;
  user_plan TEXT;
BEGIN
  -- Get user's current subscription plan
  SELECT plan_id INTO user_plan
  FROM subscriptions
  WHERE user_id = auth.uid()
  AND status = 'active'
  AND current_period_end > NOW()
  ORDER BY current_period_end DESC
  LIMIT 1;
  
  -- Get max listings allowed for plan
  SELECT 
    CASE 
      WHEN user_plan IN ('basic', 'basic-yearly') THEN 5
      WHEN user_plan IN ('pro', 'pro-yearly') THEN 15
      WHEN user_plan IN ('business', 'business-yearly') THEN 50
      ELSE 3 -- Free tier
    END INTO max_listings;
  
  -- Count user's active listings
  SELECT COUNT(*) INTO listing_count
  FROM listings
  WHERE user_id = auth.uid()
  AND status NOT IN ('closed', 'expired');
  
  -- Return true if user can create more listings
  RETURN listing_count < max_listings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's plan features
CREATE OR REPLACE FUNCTION public.get_my_plan_features()
RETURNS JSONB AS $$
DECLARE
  plan_features JSONB;
BEGIN
  SELECT p.features INTO plan_features
  FROM subscriptions s
  JOIN subscription_plans p ON s.plan_id = p.id
  WHERE s.user_id = auth.uid()
  AND s.status = 'active'
  AND s.current_period_end > NOW()
  ORDER BY s.current_period_end DESC
  LIMIT 1;
  
  -- Return default features if no active subscription
  IF plan_features IS NULL THEN
    RETURN '{"listings": 3, "applications": "unlimited", "featured_profile": false, "priority_support": false}'::jsonb;
  END IF;
  
  RETURN plan_features;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
