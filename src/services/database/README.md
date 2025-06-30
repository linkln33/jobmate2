# JobMate Supabase Database Configuration

This directory contains the complete Supabase database configuration for the JobMate platform. The schema is organized into multiple SQL files that can be executed in the Supabase SQL Editor to set up the entire database.

## Overview

The JobMate database schema is divided into three phases:

1. **Phase 1: Core Database Schema** - Essential tables for the basic functionality
2. **Phase 2: Extended Features** - Additional features to enhance the platform
3. **Phase 3: Supabase Configuration** - Authentication, storage, and advanced functions

## Schema Structure

```
database/
├── master.sql                  # Master file to execute all SQL files
├── 01_users.sql                # Users and profiles tables
├── 02_listings.sql             # Marketplace listings
├── 03_applications.sql         # Job applications
├── 04_messages.sql             # Messaging system
├── 05_reviews.sql              # User reviews
├── 06_skills_categories.sql    # Skills and categories
├── 07_bookmarks_searches.sql   # Bookmarks and saved searches
├── 08_notifications.sql        # Notifications system
├── 09_payments.sql             # Payments and transactions
├── 10_auth_config.sql          # Authentication configuration
├── 11_storage_config.sql       # Storage buckets configuration
├── 12_advanced_functions.sql   # Advanced database functions
└── docs/                       # Detailed documentation
    ├── schema_overview.md      # Database schema overview
    ├── phase1.md              # Phase 1 documentation
    ├── phase2.md              # Phase 2 documentation
    ├── phase3.md              # Phase 3 documentation
    └── security.md            # Security and RLS policies
```

## Installation

To set up the JobMate database in your Supabase project:

### Option 1: Execute SQL Files Individually

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Execute the SQL files in the following order:
   - `01_users.sql`
   - `02_listings.sql`
   - `03_applications.sql`
   - `04_messages.sql`
   - `05_reviews.sql`
   - `06_skills_categories.sql`
   - `07_bookmarks_searches.sql`
   - `08_notifications.sql`
   - `09_payments.sql`
   - `10_auth_config.sql`
   - `11_storage_config.sql`
   - `12_advanced_functions.sql`

### Option 2: Execute All Files in a Single Transaction

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Open `master.sql`
4. Uncomment the transaction block and the `\ir` commands
5. Execute the file

## Storage Buckets

After executing the SQL files, you need to create the following storage buckets in the Supabase dashboard:

1. `avatars` - For user profile pictures
2. `listing_attachments` - For files attached to listings
3. `application_attachments` - For resumes and portfolios
4. `message_attachments` - For files shared in conversations

## Authentication Configuration

The schema includes automatic triggers for:

- Creating user profiles when users sign up
- Cleaning up user data when accounts are deleted
- Setting default notification preferences

## Security

All tables are protected with Row Level Security (RLS) policies to ensure data is only accessible to authorized users. See `docs/security.md` for details on the security model.

## Advanced Features

The schema includes several advanced features:

- Full-text search for listings
- User and listing statistics
- Recommendation engine
- Automatic listing expiration
- User reputation scoring

For more details, see the documentation in the `docs` directory.

## Environment Variables

The following environment variables are required for the Supabase client:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## License

This schema is proprietary and owned by JobMate. All rights reserved.
