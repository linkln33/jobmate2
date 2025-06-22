# JobMate Database Schema

## Core Tables

### `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL, -- 'customer', 'specialist', 'admin'
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_image_url VARCHAR(255),
  date_of_birth DATE,
  bio TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  notification_preferences JSONB DEFAULT '{}'
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### `customer_profiles`
```sql
CREATE TABLE customer_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  location GEOGRAPHY(POINT), -- PostGIS point
  preferred_communication VARCHAR(20), -- 'email', 'sms', 'app'
  saved_payment_methods JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_customer_profiles_location ON customer_profiles USING GIST(location);
```

### `specialist_profiles`
```sql
CREATE TABLE specialist_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255),
  business_description TEXT,
  years_of_experience INTEGER,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  base_location GEOGRAPHY(POINT), -- PostGIS point
  service_radius INTEGER, -- in kilometers
  availability_status VARCHAR(20) DEFAULT 'offline', -- 'online', 'offline', 'busy'
  hourly_rate DECIMAL(10, 2),
  is_featured BOOLEAN DEFAULT FALSE,
  average_rating DECIMAL(3, 2),
  total_reviews INTEGER DEFAULT 0,
  total_jobs_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_specialist_profiles_base_location ON specialist_profiles USING GIST(base_location);
CREATE INDEX idx_specialist_profiles_availability ON specialist_profiles(availability_status);
CREATE INDEX idx_specialist_profiles_rating ON specialist_profiles(average_rating);
```

### `specialist_services`
```sql
CREATE TABLE specialist_services (
  id SERIAL PRIMARY KEY,
  specialist_id INTEGER NOT NULL REFERENCES specialist_profiles(id) ON DELETE CASCADE,
  service_category_id INTEGER NOT NULL REFERENCES service_categories(id),
  price_type VARCHAR(20) NOT NULL, -- 'hourly', 'fixed', 'quote'
  base_price DECIMAL(10, 2),
  description TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_specialist_services_specialist ON specialist_services(specialist_id);
CREATE INDEX idx_specialist_services_category ON specialist_services(service_category_id);
```

### `specialist_locations`
```sql
CREATE TABLE specialist_locations (
  id SERIAL PRIMARY KEY,
  specialist_id INTEGER NOT NULL REFERENCES specialist_profiles(id) ON DELETE CASCADE,
  location GEOGRAPHY(POINT) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'on_duty', 'off_duty', 'on_job'
  heading DECIMAL(5, 2), -- direction in degrees
  accuracy DECIMAL(10, 2), -- accuracy in meters
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_specialist_locations_location ON specialist_locations USING GIST(location);
CREATE INDEX idx_specialist_locations_specialist ON specialist_locations(specialist_id);
CREATE INDEX idx_specialist_locations_status ON specialist_locations(status);
```

### `specialist_availability`
```sql
CREATE TABLE specialist_availability (
  id SERIAL PRIMARY KEY,
  specialist_id INTEGER NOT NULL REFERENCES specialist_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_specialist_availability_specialist ON specialist_availability(specialist_id);
```

### `specialist_certifications`
```sql
CREATE TABLE specialist_certifications (
  id SERIAL PRIMARY KEY,
  specialist_id INTEGER NOT NULL REFERENCES specialist_profiles(id) ON DELETE CASCADE,
  certification_name VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  verification_status VARCHAR(20) NOT NULL, -- 'pending', 'verified', 'rejected'
  certificate_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_specialist_certifications_specialist ON specialist_certifications(specialist_id);
CREATE INDEX idx_specialist_certifications_status ON specialist_certifications(verification_status);
```

### `service_categories`
```sql
CREATE TABLE service_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  parent_category_id INTEGER REFERENCES service_categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_categories_parent ON service_categories(parent_category_id);
```

### `jobs`
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES users(id),
  service_category_id INTEGER NOT NULL REFERENCES service_categories(id),
  status VARCHAR(20) NOT NULL, -- 'draft', 'open', 'assigned', 'in_progress', 'completed', 'cancelled', 'disputed'
  location GEOGRAPHY(POINT) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  scheduled_start_time TIMESTAMP,
  scheduled_end_time TIMESTAMP,
  estimated_duration INTEGER, -- in minutes
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  urgency_level VARCHAR(20), -- 'low', 'medium', 'high', 'emergency'
  specialist_id INTEGER REFERENCES users(id),
  is_remote BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  ai_generated_tags JSONB
);

CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_jobs_specialist ON jobs(specialist_id);
CREATE INDEX idx_jobs_category ON jobs(service_category_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs USING GIST(location);
CREATE INDEX idx_jobs_scheduled_time ON jobs(scheduled_start_time);
```

### `job_media`
```sql
CREATE TABLE job_media (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  media_type VARCHAR(20) NOT NULL, -- 'image', 'video', 'audio', 'document'
  media_url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255),
  description TEXT,
  ai_analysis JSONB, -- Stores AI-generated insights about the media
  is_before BOOLEAN DEFAULT TRUE, -- Before or after job completion
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_media_job ON job_media(job_id);
CREATE INDEX idx_job_media_type ON job_media(media_type);
```

### `job_proposals`
```sql
CREATE TABLE job_proposals (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  specialist_id INTEGER NOT NULL REFERENCES users(id),
  price DECIMAL(10, 2) NOT NULL,
  message TEXT,
  status VARCHAR(20) NOT NULL, -- 'pending', 'accepted', 'rejected', 'withdrawn'
  estimated_start_time TIMESTAMP,
  estimated_duration INTEGER, -- in minutes
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_proposals_job ON job_proposals(job_id);
CREATE INDEX idx_job_proposals_specialist ON job_proposals(specialist_id);
CREATE INDEX idx_job_proposals_status ON job_proposals(status);
```

### `job_milestones`
```sql
CREATE TABLE job_milestones (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'paid'
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_milestones_job ON job_milestones(job_id);
CREATE INDEX idx_job_milestones_status ON job_milestones(status);
```

### `messages`
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  recipient_id INTEGER NOT NULL REFERENCES users(id),
  message_type VARCHAR(20) NOT NULL, -- 'text', 'image', 'video', 'audio', 'location', 'system'
  content TEXT,
  media_url VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_job ON messages(job_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### `wallets`
```sql
CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_wallets_user ON wallets(user_id);
```

### `transactions`
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER NOT NULL REFERENCES wallets(id),
  job_id INTEGER REFERENCES jobs(id),
  transaction_type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'job_payment', 'refund', 'platform_fee'
  amount DECIMAL(10, 2) NOT NULL,
  fee_amount DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed', 'cancelled'
  payment_method VARCHAR(50), -- 'credit_card', 'bank_transfer', 'wallet'
  payment_provider_reference VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_job ON transactions(job_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

### `reviews`
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  reviewer_id INTEGER NOT NULL REFERENCES users(id),
  reviewee_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL, -- 1-5
  comment TEXT,
  response TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_job ON reviews(job_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

### `notifications`
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'job_request', 'message', 'payment', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data related to the notification
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

## Feature-Specific Tables

### `badges`
```sql
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  criteria JSONB, -- Rules for earning this badge
  category VARCHAR(50), -- 'achievement', 'certification', 'special'
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### `user_badges`
```sql
CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER NOT NULL REFERENCES badges(id),
  awarded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
```

### `guilds`
```sql
CREATE TABLE guilds (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(255),
  founder_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guilds_founder ON guilds(founder_id);
```

### `guild_members`
```sql
CREATE TABLE guild_members (
  id SERIAL PRIMARY KEY,
  guild_id INTEGER NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'founder', 'admin', 'member'
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(guild_id, user_id)
);

CREATE INDEX idx_guild_members_guild ON guild_members(guild_id);
CREATE INDEX idx_guild_members_user ON guild_members(user_id);
```

### `disputes`
```sql
CREATE TABLE disputes (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id),
  opened_by_id INTEGER NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'open', 'under_review', 'resolved', 'closed'
  resolution TEXT,
  resolved_by_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX idx_disputes_job ON disputes(job_id);
CREATE INDEX idx_disputes_status ON disputes(status);
```

### `dispute_messages`
```sql
CREATE TABLE dispute_messages (
  id SERIAL PRIMARY KEY,
  dispute_id INTEGER NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  attachment_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dispute_messages_dispute ON dispute_messages(dispute_id);
```

### `user_devices`
```sql
CREATE TABLE user_devices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_token VARCHAR(255) NOT NULL,
  device_type VARCHAR(50) NOT NULL, -- 'ios', 'android', 'web'
  is_active BOOLEAN DEFAULT TRUE,
  last_used TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, device_token)
);

CREATE INDEX idx_user_devices_user ON user_devices(user_id);
CREATE INDEX idx_user_devices_token ON user_devices(device_token);
```

### `search_history`
```sql
CREATE TABLE search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB,
  results_count INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_history_user ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);
```

### `user_preferences`
```sql
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);
```

### `system_settings`
```sql
CREATE TABLE system_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(setting_key)
);
```

## PostGIS Extension
```sql
-- Enable PostGIS extension for geospatial features
CREATE EXTENSION IF NOT EXISTS postgis;
```
