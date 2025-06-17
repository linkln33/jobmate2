# Match Badge System

## Overview

The Match Badge System provides visual indicators on job listings to help specialists quickly identify high-quality matches and special job attributes. Badges appear on job cards throughout the platform and provide at-a-glance information about match quality, job urgency, verification status, and more.

## Badge Types

| Badge | Icon | Description |
|-------|------|-------------|
| Perfect Match | ⭐ | 90-100% match between specialist skills and job requirements |
| Great Match | 👍 | 75-89% match between specialist skills and job requirements |
| Good Match | ✓ | 60-74% match between specialist skills and job requirements |
| Premium | 💎 | Job from a premium customer or accessible to premium specialists |
| Urgent | 🔥 | Job marked as urgent or time-sensitive |
| Verified Payment | ✅ | Customer has verified payment method on file |
| Top Client | 👑 | Customer with high ratings and repeat business |
| Neighbor | 🏠 | Job posted by someone in specialist's neighborhood |

## Implementation

The badge system is implemented through the following components:

1. **Match Service** - Calculates match scores and determines which badges to display
2. **Badge Component** - Reusable UI component for rendering badges
3. **Job Match Card** - Displays relevant badges for each job

## Badge Priority and Display

When multiple badges apply to a job, they are displayed in the following priority order:

1. Match quality badges (Perfect/Great/Good Match)
2. Urgency badges (Urgent)
3. Trust badges (Verified Payment, Top Client)
4. Special badges (Premium, Neighbor)

For space reasons, a maximum of 3-4 badges are typically shown on a job card, with the most important badges taking precedence.

## Badge Colors and Styling

Badges use a consistent color scheme to help users quickly recognize their meaning:

- **Blue** - Match quality indicators
- **Red** - Urgency indicators
- **Green** - Verification and trust indicators
- **Purple** - Premium status indicators
- **Yellow/Orange** - Special relationship indicators (like Neighbor)

## Badge Behavior

Badges are dynamically generated based on:

1. The specialist's profile and preferences
2. The job's requirements and attributes
3. The customer's status and history
4. Premium membership status of both parties

This ensures that badges are personalized and relevant to each specialist viewing the job listings.

## Technical Integration

The badge system integrates with:

- **Job Match Card Component** - For displaying badges on job listings
- **Match Service** - For determining which badges to show
- **Premium Membership System** - For premium-specific badges
- **Map View** - For showing badge indicators on map markers
