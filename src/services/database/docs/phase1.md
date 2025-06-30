# Phase 1: Core Database Schema

This document details the core database schema for the JobMate platform, which forms the foundation of the entire system.

## 1. Users and Profiles (`01_users.sql`)

### Tables

#### `profiles`

Stores extended user information beyond authentication data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, references auth.users |
| email | TEXT | User's email address |
| full_name | TEXT | User's full name |
| avatar_url | TEXT | URL to user's profile picture |
| bio | TEXT | User's biography |
| location | TEXT | User's location (city, country) |
| location_lat | DECIMAL | Latitude coordinate |
| location_lng | DECIMAL | Longitude coordinate |
| website | TEXT | User's personal website |
| availability | TEXT | User's availability status |
| hourly_rate | DECIMAL | User's hourly rate |
| metadata | JSONB | Additional user metadata |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `user_settings`

Stores user preferences and settings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| email_notifications | BOOLEAN | Whether to send email notifications |
| push_notifications | BOOLEAN | Whether to send push notifications |
| theme | TEXT | UI theme preference |
| language | TEXT | Preferred language |
| timezone | TEXT | User's timezone |
| visibility | TEXT | Profile visibility settings |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Key Features

- **Automatic Profile Creation**: When a user signs up, a profile is automatically created via a trigger
- **Row Level Security**: Ensures users can only view and edit their own profiles
- **Public Profile Access**: Allows public access to limited profile information

### RLS Policies

- `Users can view their own profile`
- `Users can update their own profile`
- `Anyone can view basic profile information`
- `Users can view their own settings`
- `Users can update their own settings`

## 2. Marketplace Listings (`02_listings.sql`)

### Tables

#### `listings`

Stores job, gig, and project listings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| title | TEXT | Listing title |
| description | TEXT | Detailed description |
| category_id | UUID | References categories(id) |
| budget_min | DECIMAL | Minimum budget |
| budget_max | DECIMAL | Maximum budget |
| budget_type | TEXT | Type of budget (hourly, fixed, etc.) |
| location | TEXT | Location (city, country) |
| location_lat | DECIMAL | Latitude coordinate |
| location_lng | DECIMAL | Longitude coordinate |
| status | TEXT | Listing status (open, closed, etc.) |
| expires_at | TIMESTAMP | Expiration date |
| metadata | JSONB | Additional listing metadata |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `listing_attachments`

Stores files attached to listings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| listing_id | UUID | References listings(id) |
| file_name | TEXT | Original file name |
| file_path | TEXT | Storage path |
| file_type | TEXT | MIME type |
| file_size | INTEGER | Size in bytes |
| is_featured | BOOLEAN | Whether this is a featured attachment |
| created_at | TIMESTAMP | Creation timestamp |

#### `listing_tags`

Stores tags associated with listings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| listing_id | UUID | References listings(id) |
| tag | TEXT | Tag name |
| created_at | TIMESTAMP | Creation timestamp |

### Key Features

- **Comprehensive Listing Information**: Supports various job types with flexible budget options
- **Location-Based Listings**: Supports geographical coordinates for location-based searches
- **File Attachments**: Allows multiple files to be attached to listings
- **Tagging System**: Enables categorization and improved searchability

### RLS Policies

- `Anyone can view listings`
- `Users can create listings`
- `Users can update their own listings`
- `Users can delete their own listings`
- `Anyone can view listing attachments`
- `Users can manage attachments for their own listings`

## 3. Applications (`03_applications.sql`)

### Tables

#### `applications`

Stores job applications submitted by users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| listing_id | UUID | References listings(id) |
| applicant_id | UUID | References profiles(id) |
| cover_letter | TEXT | Application cover letter |
| proposal_data | JSONB | Additional proposal information |
| status | TEXT | Application status |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `application_attachments`

Stores files attached to applications.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| application_id | UUID | References applications(id) |
| file_name | TEXT | Original file name |
| file_path | TEXT | Storage path |
| file_type | TEXT | MIME type |
| file_size | INTEGER | Size in bytes |
| created_at | TIMESTAMP | Creation timestamp |

### Key Features

- **Status Tracking**: Tracks application status (pending, reviewing, accepted, rejected)
- **Proposal Data**: Flexible JSONB field for custom proposal information
- **File Attachments**: Supports resumes, portfolios, and other documents

### RLS Policies

- `Users can view their own applications`
- `Listing owners can view applications for their listings`
- `Users can create applications`
- `Users can update their own applications`
- `Users can delete their own applications`
- `Users can view their own application attachments`
- `Listing owners can view application attachments`

## 4. Messages (`04_messages.sql`)

### Tables

#### `conversations`

Stores conversation threads.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| listing_id | UUID | References listings(id) |
| application_id | UUID | References applications(id) |
| title | TEXT | Conversation title |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `conversation_participants`

Stores users participating in conversations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| conversation_id | UUID | References conversations(id) |
| user_id | UUID | References profiles(id) |
| last_read_at | TIMESTAMP | When user last read the conversation |
| created_at | TIMESTAMP | Creation timestamp |

#### `messages`

Stores individual messages within conversations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| conversation_id | UUID | References conversations(id) |
| sender_id | UUID | References profiles(id) |
| content | TEXT | Message content |
| attachments | JSONB | Attached files information |
| is_read | BOOLEAN | Whether message has been read |
| created_at | TIMESTAMP | Creation timestamp |

### Key Features

- **Conversation Threading**: Groups messages into conversations
- **Read Status Tracking**: Tracks which messages have been read
- **Participant Management**: Manages who is part of each conversation
- **Automatic Timestamps**: Updates conversation timestamp when new messages arrive

### RLS Policies

- `Users can view conversations they participate in`
- `Users can create conversations`
- `Users can view messages in their conversations`
- `Users can send messages to conversations they participate in`
- `Users can update their own messages`

## 5. Reviews (`05_reviews.sql`)

### Tables

#### `reviews`

Stores user reviews and ratings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| reviewer_id | UUID | References profiles(id) |
| reviewee_id | UUID | References profiles(id) |
| listing_id | UUID | References listings(id) |
| application_id | UUID | References applications(id) |
| rating | INTEGER | Rating (1-5) |
| content | TEXT | Review content |
| response | TEXT | Reviewee's response |
| is_public | BOOLEAN | Whether review is public |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `review_categories`

Stores categorized ratings for specific skills.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| review_id | UUID | References reviews(id) |
| category | TEXT | Rating category |
| rating | INTEGER | Rating (1-5) |
| created_at | TIMESTAMP | Creation timestamp |

### Key Features

- **Comprehensive Review System**: Allows users to rate each other
- **Response Capability**: Allows reviewees to respond to reviews
- **Categorized Ratings**: Supports ratings for specific skills or categories
- **Rating Aggregation**: Automatically calculates average ratings

### RLS Policies

- `Anyone can view public reviews`
- `Users can view reviews about them`
- `Users can create reviews`
- `Users can update their own reviews`
- `Users can respond to reviews about them`

## Database Triggers and Functions

- `update_updated_at_column()`: Automatically updates the `updated_at` timestamp
- `handle_new_user()`: Creates a profile when a user signs up
- `update_conversation_timestamp()`: Updates conversation timestamp when new messages arrive
- `update_last_read()`: Updates last read timestamp when users view messages
- `calculate_average_rating()`: Calculates average rating for users

## Indexes

Each table includes appropriate indexes for:
- Primary keys
- Foreign keys
- Frequently queried columns
- Full-text search columns

## Constraints

- Unique constraints to prevent duplicates
- Check constraints to validate data
- Foreign key constraints to maintain referential integrity
