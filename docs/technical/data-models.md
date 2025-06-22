# Data Models

This document outlines the key data models and TypeScript interfaces used in the JobMate platform, with a focus on the Smart Job Match System.

## Core Data Models

### Job

The `Job` interface represents a job posting on the platform.

```typescript
interface Job {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  
  // Location
  lat: number;
  lng: number;
  city: string;
  state?: string;
  zipCode: string;
  
  // Budget
  budgetMin?: number;
  budgetMax?: number;
  
  // Timing
  createdAt: string;
  scheduledDate?: string;
  urgencyLevel?: 'low' | 'medium' | 'high';
  
  // Verification
  isVerifiedPayment: boolean;
  isNeighborPosted: boolean;
  
  // Category
  serviceCategory: {
    id: string;
    name: string;
  };
  
  // Skills required
  requiredSkills?: string[];
  
  // Customer
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    rating?: number;
    jobsPosted?: number;
  };
}
```

### Specialist

The `Specialist` interface represents a service provider on the platform.

```typescript
interface Specialist {
  id: string;
  firstName: string;
  lastName: string;
  
  // Profile
  bio?: string;
  profileImage?: string;
  rating?: number;
  completedJobs?: number;
  
  // Skills
  skills: string[];
  primaryCategory?: string;
  yearsOfExperience?: number;
  
  // Location
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  serviceRadius?: number;
  
  // Pricing
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  
  // Availability
  availability?: {
    days: string[];
    timeSlots: string[];
  };
  
  // Premium status
  premium?: PremiumFeatures;
}
```

### Match Result

The `MatchResult` interface represents the outcome of matching a specialist with a job.

```typescript
interface MatchResult {
  // Overall match score (0-100)
  score: number;
  
  // Human-readable explanation
  explanation: string;
  
  // Individual factor scores
  factors: {
    skills: number;
    location: number;
    price: number;
    availability: number;
    rating: number;
    responseTime?: number;
  };
  
  // Match quality category
  matchQuality: 'perfect' | 'great' | 'good' | 'average' | 'poor';
  
  // Applicable badges
  badges: string[];
  
  // Improvement suggestions
  improvementSuggestions?: string[];
}
```

### Premium Features

The `PremiumFeatures` interface represents a specialist's premium membership status and benefits.

```typescript
interface PremiumFeatures {
  // Premium status
  isPremium: boolean;
  
  // Premium tier level
  level: 'none' | 'premium' | 'premium_plus';
  
  // Premium benefits
  matchBoost: number;
  priorityListing: boolean;
  verifiedOnlyAccess: boolean;
  
  // Premium Plus benefits
  featuredProfile?: boolean;
  instantBooking?: boolean;
  clientReputationInsights?: boolean;
  
  // Subscription details
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
}
```

### Client Reputation

The `ClientReputation` interface provides insights about a customer's history and behavior.

```typescript
interface ClientReputation {
  // Basic info
  clientId: string;
  overallScore: number;
  
  // History
  jobsPosted: number;
  completionRate: number;
  averageJobValue: number;
  
  // Ratings
  averageRating: number;
  ratingCount: number;
  
  // Payment
  paymentReliability: number;
  averagePaymentSpeed: number;
  
  // Communication
  responseTime: number;
  communicationQuality: number;
}
```

## Helper Types

### Badge Type

```typescript
type BadgeType = 
  | 'perfect-match'
  | 'great-match'
  | 'good-match'
  | 'premium'
  | 'urgent'
  | 'verified-payment'
  | 'top-client'
  | 'neighbor';
```

### Auto-Reply Template Type

```typescript
type AutoReplyTemplateType = 
  | 'introduction'
  | 'skills'
  | 'availability'
  | 'pricing'
  | 'questions'
  | 'full';
```

## Type Utilities

### Match Factor Weights

```typescript
const MATCH_FACTOR_WEIGHTS = {
  skills: 0.3,      // 30%
  location: 0.2,    // 20%
  price: 0.15,      // 15%
  availability: 0.15, // 15%
  rating: 0.1,      // 10%
  responseTime: 0.1 // 10%
};
```

### Match Quality Thresholds

```typescript
const MATCH_QUALITY_THRESHOLDS = {
  perfect: 90,  // 90-100%
  great: 75,    // 75-89%
  good: 60,     // 60-74%
  average: 40,  // 40-59%
  poor: 0       // 0-39%
};
```

## Type Relationships

The data models are related in the following ways:

1. A `Job` can be matched with multiple `Specialist` profiles
2. Each match produces a `MatchResult`
3. A `Specialist` may have `PremiumFeatures`
4. A `Job` is associated with a `Customer` who may have `ClientReputation`

## Type Usage Examples

### Calculating a Match

```typescript
function calculateMatch(job: Job, specialist: Specialist): MatchResult {
  // Calculate individual factor scores
  const skillsScore = calculateSkillsMatch(job.requiredSkills, specialist.skills);
  const locationScore = calculateLocationMatch(
    { lat: job.lat, lng: job.lng }, 
    { lat: specialist.lat, lng: specialist.lng }
  );
  // ... other factor calculations
  
  // Calculate weighted overall score
  const overallScore = (
    skillsScore * MATCH_FACTOR_WEIGHTS.skills +
    locationScore * MATCH_FACTOR_WEIGHTS.location +
    // ... other weighted factors
  );
  
  // Determine match quality
  let matchQuality: MatchResult['matchQuality'] = 'poor';
  if (overallScore >= MATCH_QUALITY_THRESHOLDS.perfect) {
    matchQuality = 'perfect';
  } else if (overallScore >= MATCH_QUALITY_THRESHOLDS.great) {
    matchQuality = 'great';
  } // ... other thresholds
  
  return {
    score: overallScore,
    explanation: generateExplanation(job, specialist, overallScore),
    factors: {
      skills: skillsScore,
      location: locationScore,
      // ... other factors
    },
    matchQuality,
    badges: determineBadges(job, specialist, overallScore)
  };
}
```

### Applying Premium Benefits

```typescript
function applyPremiumBenefits(matchResult: MatchResult, specialist: Specialist): MatchResult {
  if (!specialist.premium || !specialist.premium.isPremium) {
    return matchResult;
  }
  
  // Apply match boost based on premium level
  const boostPercentage = specialist.premium.matchBoost / 100;
  const boostedScore = Math.min(100, matchResult.score * (1 + boostPercentage));
  
  // Add premium badge
  const updatedBadges = [...matchResult.badges, 'premium'];
  
  return {
    ...matchResult,
    score: boostedScore,
    badges: updatedBadges,
    explanation: `${matchResult.explanation} (Includes ${specialist.premium.matchBoost}% premium boost)`
  };
}
```
