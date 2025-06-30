# Security and RLS Policies

This document details the security model and Row Level Security (RLS) policies implemented in the JobMate database schema.

## Security Model Overview

JobMate implements a comprehensive security model based on PostgreSQL's Row Level Security (RLS) feature. This ensures that:

1. Users can only access their own data
2. Public data is accessible to everyone
3. Shared data is accessible only to relevant parties
4. Administrative operations are properly secured

## Authentication Security

### User Authentication

JobMate uses Supabase Auth for user authentication, which provides:

- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- Email verification
- Password reset functionality
- JWT-based session management

### Security Definer Functions

Many database functions use the `SECURITY DEFINER` attribute, which means they execute with the privileges of the function creator rather than the caller. This allows controlled access to sensitive operations.

```sql
CREATE OR REPLACE FUNCTION function_name()
RETURNS return_type AS $$
BEGIN
  -- Function body
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Row Level Security (RLS) Policies

### Core Tables RLS

#### Profiles

```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Anyone can view basic profile information
CREATE POLICY "Anyone can view basic profile information"
  ON profiles FOR SELECT
  USING (true);
```

#### Listings

```sql
-- Anyone can view listings
CREATE POLICY "Anyone can view listings"
  ON listings FOR SELECT
  USING (true);

-- Users can create listings
CREATE POLICY "Users can create listings"
  ON listings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own listings
CREATE POLICY "Users can update their own listings"
  ON listings FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own listings
CREATE POLICY "Users can delete their own listings"
  ON listings FOR DELETE
  USING (user_id = auth.uid());
```

#### Applications

```sql
-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (applicant_id = auth.uid());

-- Listing owners can view applications for their listings
CREATE POLICY "Listing owners can view applications for their listings"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = applications.listing_id
      AND listings.user_id = auth.uid()
    )
  );
```

### Extended Features RLS

#### Bookmarks and Saved Searches

```sql
-- Users can view their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (user_id = auth.uid());

-- Users can create bookmarks
CREATE POLICY "Users can create bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

#### Notifications

```sql
-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());
```

#### Payments and Transactions

```sql
-- Users can view their own payment methods
CREATE POLICY "Users can view their own payment methods"
  ON payment_methods FOR SELECT
  USING (user_id = auth.uid());

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (user_id = auth.uid());

-- Users can view invoices they created or received
CREATE POLICY "Users can view invoices they created or received"
  ON invoices FOR SELECT
  USING (user_id = auth.uid() OR client_id = auth.uid());
```

## Storage Security

### Storage RLS Policies

```sql
-- Avatar images are publicly accessible
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Users can upload their own avatar
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### File Path Security

File paths in storage buckets follow a structured pattern to ensure security:

- Avatars: `{user_id}/{file_name}`
- Listing attachments: `{user_id}/{listing_id}/{file_name}`
- Application attachments: `{user_id}/{application_id}/{file_name}`
- Message attachments: `{conversation_id}/{message_id}/{file_name}`

## Function Security

### Admin-Only Functions

Some functions are restricted to admin users only:

```sql
CREATE OR REPLACE FUNCTION admin_only_function()
RETURNS return_type AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Function body
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Subscription-Based Access Control

Access to certain features is controlled by subscription level:

```sql
CREATE OR REPLACE FUNCTION check_feature_access(feature_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  feature_allowed BOOLEAN;
BEGIN
  -- Get user's subscription plan
  SELECT plan_id INTO user_plan
  FROM subscriptions
  WHERE user_id = auth.uid()
  AND status = 'active'
  AND current_period_end > NOW()
  LIMIT 1;
  
  -- Check if feature is allowed for this plan
  SELECT EXISTS (
    SELECT 1
    FROM subscription_plans
    WHERE id = user_plan
    AND features->feature_name = 'true'
  ) INTO feature_allowed;
  
  RETURN feature_allowed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Security Best Practices

### Password Security

- Passwords are never stored in the database
- Supabase Auth handles password hashing and security
- Password policies enforce minimum strength requirements

### Data Validation

- Check constraints ensure data integrity
- Triggers validate data before insertion or update
- Functions sanitize inputs to prevent SQL injection

### API Security

- All API endpoints are protected by JWT authentication
- Rate limiting prevents abuse
- CORS policies restrict access to authorized domains

## Security Testing

To ensure the security of your JobMate implementation:

1. Test RLS policies by attempting unauthorized access
2. Verify function permissions work as expected
3. Check that storage policies prevent unauthorized file access
4. Validate that subscription-based restrictions are enforced

## Security Monitoring

For ongoing security:

1. Enable PostgreSQL audit logging
2. Monitor failed login attempts
3. Set up alerts for suspicious activity
4. Regularly review access logs

## Security Recommendations

1. Keep Supabase libraries updated
2. Implement frontend validation in addition to backend security
3. Use environment variables for sensitive configuration
4. Regularly review and update security policies
