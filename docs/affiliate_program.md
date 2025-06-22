# JobMate Affiliate & Referral Program

## Overview

The JobMate Affiliate & Referral Program creates powerful growth loops by incentivizing users to refer others to the platform and specific services. This document outlines the architecture, implementation details, and features of the program.

## ✅ Core Referral System Architecture

### 🔁 1. User-to-User Referrals (Global Growth Loop)

**Goal**: Grow platform user base organically through existing user networks.

**Mechanism**: Users refer other users to join the platform through unique referral links or codes.

**Rewards**:
- **Option A**: Store credit or cash back based on referred user's spend
- **Option B**: Discount codes (e.g., 15% off services, goods, bookings)

**Dashboard**: Shows total invites, converted users, total earnings or credits.

**Incentives**:
- Referral tiers (100+, 500+, etc.)
- Limited-time multiplier bonuses (holiday boosts, "3 in 24 hours" challenge)

**Abuse Protection**: 
- 1 device/email/IP per referral
- Spend threshold before payout
- AI-driven fraud detection

### 🧰 2. User-to-Specialist Referrals (Service-Specific Loop)

**Goal**: Drive bookings for specific providers/gigs.

**Mechanism**: Users share links or codes tied to specific services/gigs/specialists.

**Rewards**: Earn a commission percentage of the booking value when the referred user completes a booking.

**Specialist Setup**:
- When posting a gig/service, a specialist sets an affiliate commission percentage
- Can opt-in/out per listing

**Tracking**:
- Link or QR code contains both the service ID and referrer ID
- Earnings tracked per service, per specialist

**Post-booking Logic**:
- Only paid/completed bookings trigger commission
- Optional satisfaction feedback before payout

## 📊 Referral Dashboard Design (for All Users)

### Features:
- Referral code / deep links / QR generator
- Stats: invites sent, conversions, earnings
- Tier status (e.g., Bronze, Silver, Gold, Platinum)
- Badge system for milestones (e.g., "Top Referrer")
- Withdrawal / spendable balance history
- "Refer more to unlock..." progress meter
- Leaderboard (daily, weekly, all-time)

## 💼 Affiliate Setup for Specialists

When creating a service or job listing, specialists see:

| Field | Description |
|-------|-------------|
| Enable Affiliate Referrals? | Toggle on/off |
| Commission % | Choose from 0–30% (platform may set min/max) |
| Cap per Referral (optional) | Max payout per booking |
| Referral Expiry | How long after a click it's still valid (e.g., 7 days) |

**Example**: A yoga instructor sets 10% referral commission on a $100 class. User A shares it → User B books → User A earns $10.

## 🏆 Tier & Badge System

| Tier | Referred Users | Bonus |
|------|---------------|-------|
| Bronze | 0–99 | Basic discount/cash |
| Silver | 100–499 | +5% bonus on rewards |
| Gold | 500–999 | Priority support, bonus campaigns |
| Platinum | 1000+ | Highest % commission, featured user |

### 🎖 Badges:
- "First 10 Referrals"
- "Top 10 Referrer This Month"
- "Service Influencer"
- "Referral Champion"
- "Specialist Promoter"

## ⚠️ Referral Abuse Protection

- One reward per IP/email/device
- Referrals must spend a minimum amount before rewards trigger
- AI-driven fraud detection (VPN, fake accounts, unusual behavior)
- Manual flag & review system
- Option to revoke referral earnings post-refund
- Cooldown periods between referrals from same source

## 🚀 Referral Sharing Tools

### In-app sharing via:
- WhatsApp
- SMS
- Instagram Stories
- Facebook / Twitter
- Email

### Auto-filled messages:
- "Use my code JANE15 to get 15% off your first booking!"
- "I loved this handyman – book via my link and save 10%"

### QR Code generation for offline or real-world use:
- Print on business cards
- Display at physical locations
- Include in marketing materials

## 🎯 Final Feature List (Updated & Streamlined)

### 🔄 Referral Mechanics
- User-to-user referrals (platform-wide)
- User-to-service referrals (specialist gigs)
- Earnings: store credit or % commission
- Discount codes (category-based or general)
- QR codes for referrals

### 🧑‍💻 Specialist-Side Tools
- Add affiliate commission to gigs
- See referral traffic & conversion stats
- Customize referral messaging
- Set commission caps and expiration

### 💰 Earnings System
- Referral balance (credit or cash)
- Use for bookings or withdraw
- Tier-based reward boosts
- Earnings history and analytics

### 📊 Motivation & Growth
- Tiers: Bronze → Platinum
- Badges for milestones
- Leaderboard (gamified + social proof)
- Flash campaigns / urgency boosters
- "Refer 3 in 24 hours" or holiday multipliers

### 🔐 Safety
- Anti-abuse mechanisms
- Fraud detection and threshold logic
- Manual review process for suspicious activity
- Automated flagging system

### 💬 Sharing UX
- Referral dashboard
- Share buttons with templates
- QR code generator
- Deep link support (service-specific)
- Custom referral messaging

## Technical Implementation

### Database Schema Additions

```sql
CREATE TABLE referral_codes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  code VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL, -- 'user' or 'service'
  service_id UUID REFERENCES services(id), -- NULL for user-to-user referrals
  discount_percentage INT,
  commission_percentage INT,
  cap_amount DECIMAL(10,2),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE referrals (
  id SERIAL PRIMARY KEY,
  referral_code_id INT NOT NULL REFERENCES referral_codes(id),
  referred_user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL, -- 'pending', 'converted', 'paid', 'rejected'
  booking_id UUID REFERENCES bookings(id), -- For service referrals
  commission_earned DECIMAL(10,2),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  converted_at TIMESTAMP,
  paid_at TIMESTAMP
);

CREATE TABLE referral_tiers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  min_referrals INT NOT NULL,
  max_referrals INT,
  bonus_percentage INT NOT NULL,
  additional_perks TEXT
);

CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  badge_type VARCHAR(50) NOT NULL,
  earned_at TIMESTAMP NOT NULL DEFAULT NOW(),
  metadata JSONB -- Additional badge-specific data
);
```

### API Endpoints

- `POST /api/referrals/generate` - Generate a new referral code
- `GET /api/referrals/stats` - Get referral statistics for current user
- `GET /api/referrals/leaderboard` - Get referral leaderboard
- `POST /api/referrals/redeem` - Redeem a referral code
- `GET /api/referrals/earnings` - Get earnings history
- `POST /api/referrals/withdraw` - Withdraw earnings to wallet
- `GET /api/specialists/referrals` - Get referral statistics for specialist services

## Dashboard Integration

The referral program will be integrated into the unified dashboard with:

1. A dedicated "Referrals" tab in the main navigation
2. A referral widget on the dashboard homepage showing quick stats
3. Notification badges for new referral conversions and earnings
4. Gamification elements integrated with the overall user experience

## Rollout Strategy

1. **Phase 1**: User-to-user referrals with basic rewards
2. **Phase 2**: Service-specific referrals for specialists
3. **Phase 3**: Advanced tier system and badges
4. **Phase 4**: Gamification elements and leaderboards
5. **Phase 5**: Advanced analytics and optimization tools
