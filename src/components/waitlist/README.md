# Waitlist Components

This directory contains components related to the JobMate waitlist system, which manages user registrations before the full platform launch.

## Overview

The waitlist system allows users to:
1. Register for early access to the platform
2. Refer friends to join the waitlist
3. Earn points and rewards for successful referrals
4. Track their position and status on the waitlist
5. View leaderboards and achievements

## Component Structure

### Dashboard Components

Components in the `/dashboard` subdirectory handle the waitlist user dashboard experience:

- `navigation.tsx` - Navigation bar for the waitlist dashboard
- `glassmorphism.tsx` - Glassmorphic UI components for the dashboard
- `charts.tsx` - Data visualization components for waitlist statistics
- `growth-chart.tsx` - Chart showing waitlist growth over time
- `achievement-badges.tsx` - Display of user badges and achievements
- `points-legend.tsx` - Legend explaining the points system
- `progress-tracker.tsx` - Component tracking user progress and milestones

### Registration Components

Components for the waitlist registration process:

- `registration-form.tsx` - Form for collecting user information
- `referral-input.tsx` - Input for referral codes
- `success-message.tsx` - Confirmation message after successful registration
- `share-buttons.tsx` - Social media sharing buttons for referrals

### Shared Components

Reusable components across the waitlist system:

- `leaderboard.tsx` - Display of top users by referral points
- `countdown-timer.tsx` - Timer showing time until platform launch
- `referral-link.tsx` - Component for displaying and copying referral links

## Integration with Backend

These components interact with the waitlist API endpoints located in `/src/app/api/waitlist/`:

- Registration: `/join` endpoint
- User status: `/status` endpoint
- Leaderboard: `/leaderboard` endpoint
- User badges: `/user/[id]/badges` endpoint

## Database Schema

The waitlist system uses the following database tables (defined in `/src/services/waitlist/schema.sql`):

- `waitlist_users` - Stores user information and referral codes
- `waitlist_referrals` - Tracks referral relationships between users
- `waitlist_rewards` - Records rewards earned by users
- `waitlist_badges` - Stores badges earned by users

## Usage Example

```tsx
import { WaitlistRegistrationForm } from '@/components/waitlist/registration-form';
import { WaitlistLeaderboard } from '@/components/waitlist/leaderboard';

export default function WaitlistPage() {
  return (
    <div className="container mx-auto">
      <h1>Join Our Waitlist</h1>
      <WaitlistRegistrationForm />
      
      <h2>Top Referrers</h2>
      <WaitlistLeaderboard limit={5} />
    </div>
  );
}
```
