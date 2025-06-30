# JobMate Database Schema Overview

This document provides a high-level overview of the JobMate database schema, including the relationships between tables and the purpose of each component.

## Core Entities

### Users and Profiles

The user system is built on top of Supabase Auth with additional tables to store user-specific information:

- `profiles` - Extended user information beyond authentication
- `user_settings` - User preferences and settings
- `user_skills` - Skills associated with each user

### Marketplace Listings

The listing system forms the core of the marketplace:

- `listings` - Job, gig, and project listings
- `listing_attachments` - Files attached to listings
- `listing_tags` - Tags associated with listings

### Applications

The application system handles job applications:

- `applications` - Applications submitted by users
- `application_attachments` - Files attached to applications (resumes, portfolios)

### Messaging

The messaging system enables communication between users:

- `conversations` - Conversation threads
- `conversation_participants` - Users participating in conversations
- `messages` - Individual messages within conversations

### Reviews

The review system allows users to rate each other:

- `reviews` - Reviews and ratings
- `review_categories` - Categorized ratings for specific skills

## Extended Features

### Skills and Categories

- `skills` - Standardized skill definitions
- `categories` - Job and gig categories

### Bookmarks and Searches

- `bookmarks` - Saved listings
- `saved_searches` - Saved search queries
- `user_follows` - User follow relationships
- `collections` - Organized collections of listings

### Notifications

- `notifications` - User notifications
- `notification_types` - Standardized notification templates
- `notification_preferences` - User notification settings
- `notification_devices` - User devices for push notifications

### Payments and Transactions

- `payment_methods` - User payment methods
- `transactions` - Financial transactions
- `invoices` - Billing invoices
- `escrow` - Escrow accounts for secure payments
- `subscription_plans` - Available subscription plans
- `subscriptions` - User subscriptions

## Entity Relationship Diagram

```
┌─────────────┐       ┌───────────┐       ┌────────────────┐
│   profiles  │───┬───│  listings │───────│  applications  │
└─────────────┘   │   └───────────┘       └────────────────┘
       │          │         │                     │
       │          │         │                     │
┌─────────────┐   │   ┌───────────┐       ┌────────────────┐
│user_settings│   └───│conversations│─────│    messages    │
└─────────────┘       └───────────┘       └────────────────┘
       │                    │                     │
       │                    │                     │
┌─────────────┐       ┌───────────┐       ┌────────────────┐
│ user_skills │       │  reviews  │       │  notifications │
└─────────────┘       └───────────┘       └────────────────┘
       │                    │                     │
       │                    │                     │
┌─────────────┐       ┌───────────┐       ┌────────────────┐
│   skills    │       │ bookmarks │       │  transactions  │
└─────────────┘       └───────────┘       └────────────────┘
```

## Security Model

The database uses Row Level Security (RLS) policies to ensure that:

1. Users can only access their own data
2. Public data is accessible to everyone
3. Shared data is accessible only to relevant parties

## Automated Processes

The schema includes several automated processes:

1. Profile creation on user signup
2. Notification generation for various events
3. Listing expiration
4. Review aggregation
5. User reputation calculation

## Extensions and Functions

The schema uses several PostgreSQL extensions and custom functions:

- `uuid-ossp` - For UUID generation
- `pg_stat_statements` - For query performance monitoring
- Custom search functions for listings
- Recommendation algorithms
- Statistical calculations

For detailed information on each component, refer to the specific documentation files for each phase.
