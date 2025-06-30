# Phase 3: Supabase Configuration

This document details the Supabase-specific configuration for the JobMate platform, including authentication, storage, and advanced database functions.

## 1. Authentication Configuration (`10_auth_config.sql`)

### Authentication Hooks

#### `handle_new_user()`

Automatically creates a profile and default settings when a user signs up.

```sql
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
  
  -- Create default notification preferences
  INSERT INTO public.notification_preferences (user_id, type)
  SELECT NEW.id, id FROM public.notification_types;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `handle_user_delete()`

Cleans up user data when an account is deleted.

```sql
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete user profile and related data (cascades to other tables)
  DELETE FROM public.profiles WHERE id = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### User Role Functions

#### `is_admin()`

Checks if the current user has admin privileges.

```sql
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
```

### Subscription Functions

#### `has_subscription()`

Checks if the current user has an active subscription.

```sql
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
```

### Helper Functions

- `get_my_profile()`: Returns the current user's profile
- `get_my_settings()`: Returns the current user's settings
- `can_create_listing()`: Checks if the user can create more listings based on their subscription
- `get_my_plan_features()`: Returns the features available in the user's subscription plan

## 2. Storage Configuration (`11_storage_config.sql`)

### Storage Buckets

The JobMate platform uses four main storage buckets:

1. **avatars**: For user profile pictures
2. **listing_attachments**: For files attached to listings
3. **application_attachments**: For resumes and portfolios
4. **message_attachments**: For files shared in conversations

### RLS Policies for Storage

#### Avatars Bucket

```sql
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

#### Listing Attachments Bucket

```sql
CREATE POLICY "Listing attachments are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing_attachments');

CREATE POLICY "Users can upload attachments to their own listings"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing_attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

Similar policies exist for application_attachments and message_attachments.

### Storage Helper Functions

- `storage.get_presigned_url()`: Generates presigned URLs for file uploads
- `get_avatar_path()`: Returns the storage path for a user's avatar

## 3. Advanced Functions (`12_advanced_functions.sql`)

### Search Functions

#### `search_listings()`

Powerful search function with support for text, category, budget, location, and tag filters.

```sql
CREATE OR REPLACE FUNCTION search_listings(
  search_term TEXT DEFAULT NULL,
  category_id UUID DEFAULT NULL,
  min_budget DECIMAL DEFAULT NULL,
  max_budget DECIMAL DEFAULT NULL,
  location TEXT DEFAULT NULL,
  max_distance INTEGER DEFAULT NULL,
  user_location POINT DEFAULT NULL,
  status TEXT[] DEFAULT ARRAY['open'],
  tags TEXT[] DEFAULT NULL,
  sort_by TEXT DEFAULT 'created_at',
  sort_direction TEXT DEFAULT 'desc',
  page_size INTEGER DEFAULT 10,
  page_number INTEGER DEFAULT 1
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  user_id UUID,
  category_id UUID,
  budget_min DECIMAL,
  budget_max DECIMAL,
  budget_type TEXT,
  location TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  status TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  distance DECIMAL,
  total_count BIGINT
) AS $$
-- Function body
$$ LANGUAGE plpgsql;
```

### Statistics Functions

#### `get_user_stats()`

Returns comprehensive statistics for a user.

```sql
CREATE OR REPLACE FUNCTION get_user_stats(target_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_listings', (SELECT COUNT(*) FROM listings WHERE user_id = target_user_id),
    'active_listings', (SELECT COUNT(*) FROM listings WHERE user_id = target_user_id AND status = 'open'),
    'total_applications', (SELECT COUNT(*) FROM applications WHERE applicant_id = target_user_id),
    'accepted_applications', (SELECT COUNT(*) FROM applications WHERE applicant_id = target_user_id AND status = 'accepted'),
    'average_rating', (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviewee_id = target_user_id),
    'total_reviews', (SELECT COUNT(*) FROM reviews WHERE reviewee_id = target_user_id),
    'member_since', (SELECT created_at FROM profiles WHERE id = target_user_id),
    'completion_rate', (
      -- Calculation for completion rate
    ),
    'response_time', (
      -- Calculation for average response time
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

#### `get_listing_stats()`

Returns statistics for a listing.

```sql
CREATE OR REPLACE FUNCTION get_listing_stats(target_listing_id UUID)
RETURNS JSONB AS $$
-- Function body
$$ LANGUAGE plpgsql;
```

### Recommendation Functions

#### `get_recommended_listings()`

Returns personalized listing recommendations for a user based on their skills and activity.

```sql
CREATE OR REPLACE FUNCTION get_recommended_listings(
  for_user_id UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  budget_min DECIMAL,
  budget_max DECIMAL,
  budget_type TEXT,
  location TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  relevance_score DECIMAL
) AS $$
-- Function body
$$ LANGUAGE plpgsql;
```

#### `get_similar_listings()`

Returns listings similar to a given listing.

```sql
CREATE OR REPLACE FUNCTION get_similar_listings(
  listing_id UUID,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  budget_min DECIMAL,
  budget_max DECIMAL,
  budget_type TEXT,
  location TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  similarity_score DECIMAL
) AS $$
-- Function body
$$ LANGUAGE plpgsql;
```

### Automated Functions

#### `auto_expire_listings()`

Automatically expires listings that have reached their expiration date.

```sql
CREATE OR REPLACE FUNCTION auto_expire_listings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE listings
  SET status = 'expired'
  WHERE expires_at < NOW() AND status = 'open';
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

#### `calculate_reputation_score()`

Calculates a reputation score for a user based on reviews, completion rate, and account age.

```sql
CREATE OR REPLACE FUNCTION calculate_reputation_score(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  review_score DECIMAL;
  completion_rate DECIMAL;
  account_age INTEGER;
  total_score INTEGER;
BEGIN
  -- Get average review rating (0-5)
  SELECT COALESCE(AVG(rating), 0) INTO review_score
  FROM reviews
  WHERE reviewee_id = user_id;
  
  -- Get completion rate (0-1)
  SELECT 
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)::DECIMAL
    END INTO completion_rate
  FROM applications 
  WHERE applicant_id = user_id AND status IN ('completed', 'cancelled');
  
  -- Get account age in months (capped at 24)
  SELECT 
    LEAST(24, EXTRACT(MONTH FROM AGE(NOW(), created_at)) + 
    EXTRACT(YEAR FROM AGE(NOW(), created_at)) * 12)::INTEGER INTO account_age
  FROM profiles
  WHERE id = user_id;
  
  -- Calculate total score (0-100)
  total_score := (
    -- Reviews contribute up to 50 points
    (review_score * 10) +
    -- Completion rate contributes up to 30 points
    (completion_rate * 30) +
    -- Account age contributes up to 20 points
    (account_age * 0.8)
  )::INTEGER;
  
  RETURN GREATEST(0, LEAST(100, total_score));
END;
$$ LANGUAGE plpgsql;
```

## Implementation Notes

### Authentication Setup

To complete the authentication setup:

1. Enable email confirmations in the Supabase Dashboard
2. Configure OAuth providers if needed (Google, GitHub, etc.)
3. Set up email templates for authentication emails

### Storage Setup

To set up the storage buckets:

1. Create the four buckets in the Supabase Dashboard
2. Apply the RLS policies from the SQL file
3. Configure CORS settings to allow uploads from your frontend

### Scheduled Functions

To implement scheduled functions:

1. Use the Supabase Edge Functions feature
2. Create a cron job to call `auto_expire_listings()` daily
3. Set up webhooks for external integrations

## Security Considerations

- All functions use `SECURITY DEFINER` to ensure they run with the necessary permissions
- RLS policies are carefully designed to prevent unauthorized access
- Storage policies ensure users can only access their own files or public files
- Authentication hooks maintain data integrity during user creation and deletion
