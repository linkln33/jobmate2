# Phase 2: Extended Features

This document details the extended features of the JobMate database schema, which build upon the core functionality to provide a richer platform experience.

## 1. Skills and Categories (`06_skills_categories.sql`)

### Tables

#### `skills`

Stores standardized skill definitions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Skill name |
| description | TEXT | Skill description |
| category | TEXT | Skill category |
| popularity | INTEGER | Popularity ranking |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `user_skills`

Associates skills with users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| skill_id | UUID | References skills(id) |
| proficiency_level | INTEGER | Proficiency level (1-5) |
| years_experience | DECIMAL | Years of experience |
| is_featured | BOOLEAN | Whether skill is featured on profile |
| created_at | TIMESTAMP | Creation timestamp |

#### `categories`

Stores job and gig categories.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Category name |
| description | TEXT | Category description |
| parent_id | UUID | References categories(id) for hierarchy |
| icon | TEXT | Icon identifier |
| slug | TEXT | URL-friendly identifier |
| is_active | BOOLEAN | Whether category is active |
| display_order | INTEGER | Display order priority |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Key Features

- **Standardized Skills**: Provides a consistent taxonomy of skills
- **Hierarchical Categories**: Supports nested categories for better organization
- **Skill Proficiency**: Allows users to specify their level of expertise
- **Featured Skills**: Enables users to highlight their most important skills
- **Automatic Slug Generation**: Creates URL-friendly identifiers for categories

### RLS Policies

- `Anyone can view skills`
- `Only admins can modify skills`
- `Users can view their own skills`
- `Anyone can view user skills`
- `Users can add/update/delete their own skills`
- `Anyone can view categories`
- `Only admins can modify categories`

## 2. Bookmarks and Saved Searches (`07_bookmarks_searches.sql`)

### Tables

#### `bookmarks`

Stores saved listings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| listing_id | UUID | References listings(id) |
| notes | TEXT | User notes about the bookmark |
| created_at | TIMESTAMP | Creation timestamp |

#### `saved_searches`

Stores saved search queries.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| name | TEXT | Search name |
| search_params | JSONB | Search parameters |
| is_alert | BOOLEAN | Whether to send alerts for new results |
| alert_frequency | TEXT | Alert frequency (daily, weekly, instant) |
| last_alerted_at | TIMESTAMP | When last alert was sent |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `user_follows`

Stores user follow relationships.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| follower_id | UUID | References profiles(id) |
| following_id | UUID | References profiles(id) |
| created_at | TIMESTAMP | Creation timestamp |

#### `collections`

Stores organized collections of bookmarks.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| name | TEXT | Collection name |
| description | TEXT | Collection description |
| is_private | BOOLEAN | Whether collection is private |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `collection_items`

Associates bookmarks with collections.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| collection_id | UUID | References collections(id) |
| listing_id | UUID | References listings(id) |
| notes | TEXT | Notes about the item |
| created_at | TIMESTAMP | Creation timestamp |

### Key Features

- **Bookmark Management**: Allows users to save and organize listings
- **Saved Searches**: Enables users to save search criteria for future use
- **Search Alerts**: Notifies users of new listings matching their criteria
- **User Following**: Allows users to follow other users
- **Collections**: Enables organizing bookmarks into themed collections
- **Private/Public Collections**: Supports both private and public collections

### RLS Policies

- `Users can view/create/update/delete their own bookmarks`
- `Users can view/create/update/delete their own saved searches`
- `Users can view who they follow and who follows them`
- `Users can create/delete their own follows`
- `Users can view/create/update/delete their own collections`
- `Anyone can view public collections`
- `Users can view/add/update/delete items in their own collections`
- `Anyone can view items in public collections`

## 3. Notifications System (`08_notifications.sql`)

### Tables

#### `notifications`

Stores user notifications.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| type | TEXT | Notification type |
| title | TEXT | Notification title |
| message | TEXT | Notification message |
| data | JSONB | Additional notification data |
| is_read | BOOLEAN | Whether notification has been read |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `notification_types`

Stores standardized notification templates.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key |
| description | TEXT | Type description |
| template | TEXT | Message template |
| icon | TEXT | Icon identifier |
| color | TEXT | Color identifier |
| category | TEXT | Notification category |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `notification_preferences`

Stores user notification settings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| type | TEXT | References notification_types(id) |
| email | BOOLEAN | Whether to send email notifications |
| push | BOOLEAN | Whether to send push notifications |
| in_app | BOOLEAN | Whether to show in-app notifications |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `notification_devices`

Stores user devices for push notifications.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| device_token | TEXT | Device token for push notifications |
| device_type | TEXT | Device type (ios, android, web) |
| is_active | BOOLEAN | Whether device is active |
| last_used_at | TIMESTAMP | When device was last used |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Key Features

- **Comprehensive Notification System**: Supports in-app, email, and push notifications
- **Notification Templates**: Standardized templates for consistent messaging
- **User Preferences**: Allows users to control which notifications they receive
- **Multi-Device Support**: Supports notifications across multiple devices
- **Automatic Notifications**: Triggers notifications for various events
- **Notification Categories**: Organizes notifications into categories

### RLS Policies

- `Users can view their own notifications`
- `Users can update their own notifications`
- `Users can delete their own notifications`
- `Anyone can view notification types`
- `Only admins can modify notification types`
- `Users can view/create/update their own notification preferences`
- `Users can view/register/update/delete their own notification devices`

### Functions and Triggers

- `send_notification()`: Sends a notification to a user
- `handle_notification_events()`: Handles automatic notifications for various events
- Triggers for messages, applications, and reviews to generate notifications

## 4. Payments and Transactions (`09_payments.sql`)

### Tables

#### `payment_methods`

Stores user payment methods.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| type | TEXT | Payment method type |
| provider | TEXT | Payment provider |
| is_default | BOOLEAN | Whether this is the default method |
| last_four | TEXT | Last four digits (for cards) |
| expiry_date | TEXT | Expiration date |
| billing_address | JSONB | Billing address information |
| metadata | JSONB | Additional metadata |
| is_verified | BOOLEAN | Whether method is verified |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `transactions`

Stores financial transactions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| type | TEXT | Transaction type |
| status | TEXT | Transaction status |
| amount | DECIMAL | Transaction amount |
| currency | TEXT | Currency code |
| description | TEXT | Transaction description |
| payment_method_id | UUID | References payment_methods(id) |
| external_id | TEXT | External transaction ID |
| metadata | JSONB | Additional metadata |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `invoices`

Stores billing invoices.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| number | TEXT | Invoice number |
| user_id | UUID | References profiles(id) |
| client_id | UUID | References profiles(id) |
| listing_id | UUID | References listings(id) |
| application_id | UUID | References applications(id) |
| amount | DECIMAL | Invoice amount |
| tax_amount | DECIMAL | Tax amount |
| currency | TEXT | Currency code |
| status | TEXT | Invoice status |
| due_date | DATE | Due date |
| issued_date | DATE | Issue date |
| paid_date | DATE | Payment date |
| notes | TEXT | Invoice notes |
| items | JSONB | Invoice line items |
| transaction_id | UUID | References transactions(id) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `escrow`

Stores escrow accounts for secure payments.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| listing_id | UUID | References listings(id) |
| application_id | UUID | References applications(id) |
| client_id | UUID | References profiles(id) |
| freelancer_id | UUID | References profiles(id) |
| amount | DECIMAL | Escrow amount |
| currency | TEXT | Currency code |
| status | TEXT | Escrow status |
| funded_transaction_id | UUID | References transactions(id) |
| released_transaction_id | UUID | References transactions(id) |
| release_conditions | TEXT | Conditions for release |
| due_date | DATE | Due date |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `subscription_plans`

Stores available subscription plans.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key |
| name | TEXT | Plan name |
| description | TEXT | Plan description |
| price | DECIMAL | Plan price |
| currency | TEXT | Currency code |
| interval | TEXT | Billing interval |
| features | JSONB | Plan features |
| is_active | BOOLEAN | Whether plan is active |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `subscriptions`

Stores user subscriptions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| plan_id | TEXT | References subscription_plans(id) |
| status | TEXT | Subscription status |
| current_period_start | TIMESTAMP | Current period start date |
| current_period_end | TIMESTAMP | Current period end date |
| cancel_at_period_end | BOOLEAN | Whether to cancel at period end |
| canceled_at | TIMESTAMP | Cancellation date |
| payment_method_id | UUID | References payment_methods(id) |
| external_id | TEXT | External subscription ID |
| metadata | JSONB | Additional metadata |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Key Features

- **Comprehensive Payment System**: Supports various payment methods and providers
- **Transaction Tracking**: Records all financial transactions
- **Invoice Generation**: Creates and manages invoices with automatic numbering
- **Escrow System**: Provides secure payments for project completion
- **Subscription Management**: Handles recurring payments and subscription plans
- **Multi-Currency Support**: Supports transactions in different currencies

### RLS Policies

- `Users can view/create/update/delete their own payment methods`
- `Users can view their own transactions`
- `Users can view invoices they created or received`
- `Users can create/update their own invoices`
- `Users can view escrow where they are client or freelancer`
- `Anyone can view active subscription plans`
- `Only admins can modify subscription plans`
- `Users can view their own subscriptions`

### Functions

- `generate_invoice_number()`: Automatically generates sequential invoice numbers

## Default Data

The schema includes default data for:

- Categories
- Skills
- Notification types
- Subscription plans

This provides a starting point for the platform without requiring manual data entry.
