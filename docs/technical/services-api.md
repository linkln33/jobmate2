# Services API

This document provides technical documentation for the service layer of the JobMate platform, focusing on the Smart Job Match System services.

## Match Service

The Match Service calculates compatibility scores between specialists and jobs based on multiple factors.

### Base Match Service

```typescript
// Import from src/services/match-service.ts
import { MatchService } from '@/services/match-service';

const matchService = new MatchService();
const matchResult = matchService.calculateMatch(job, specialist);
```

#### Key Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `calculateMatch` | `job: Job, specialist: Specialist` | `MatchResult` | Calculates match score and explanation |
| `getMatchExplanation` | `job: Job, specialist: Specialist, score: number` | `string` | Generates human-readable explanation |
| `calculateSkillsMatch` | `jobSkills: string[], specialistSkills: string[]` | `number` | Calculates skill compatibility score |
| `calculateLocationMatch` | `jobLocation: Location, specialistLocation: Location` | `number` | Calculates proximity score |
| `calculatePriceMatch` | `jobBudget: Budget, specialistRate: Rate` | `number` | Calculates price compatibility score |

#### MatchResult Interface

```typescript
interface MatchResult {
  score: number;          // Overall match score (0-100)
  explanation: string;    // Human-readable explanation
  factors: {              // Individual factor scores
    skills: number;       // Skills match score
    location: number;     // Location proximity score
    price: number;        // Price compatibility score
    availability: number; // Availability match score
    rating: number;       // Rating factor score
  };
  badges: string[];       // Array of applicable badge types
}
```

### AI Match Service

Extends the base Match Service with AI-powered features.

```typescript
// Import from src/services/ai-match-service.ts
import { AIMatchService } from '@/services/ai-match-service';

const aiMatchService = new AIMatchService();
const suggestions = await aiMatchService.getMatchImprovementSuggestions(job, specialist);
```

#### Key Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `getMatchImprovementSuggestions` | `job: Job, specialist: Specialist` | `Promise<string[]>` | AI-generated improvement suggestions |
| `getMatchExplanation` | `job: Job, specialist: Specialist, score: number` | `string` | Enhanced explanation with AI insights |
| `getProfileOptimizationTips` | `specialist: Specialist, jobCategory: string` | `Promise<string[]>` | Profile improvement suggestions |

## Auto-Reply Service

The Auto-Reply Service generates contextual response templates for job applications.

```typescript
// Import from src/services/auto-reply-service.ts
import { AutoReplyService } from '@/services/auto-reply-service';

const autoReplyService = new AutoReplyService();
const introTemplate = autoReplyService.generateIntroduction(job, specialist);
```

### Key Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `generateFullResponse` | `job: Job, specialist: Specialist, matchResult: MatchResult` | `string` | Generates complete response template |
| `generateIntroduction` | `job: Job, specialist: Specialist` | `string` | Generates introduction section |
| `generateSkillsHighlight` | `job: Job, specialist: Specialist` | `string` | Generates skills highlight section |
| `generateAvailability` | `job: Job, specialist: Specialist` | `string` | Generates availability section |
| `generatePricing` | `job: Job, specialist: Specialist` | `string` | Generates pricing section |
| `generateQuestions` | `job: Job` | `string` | Generates relevant questions section |
| `getRelevantSkills` | `jobCategory: string, jobDescription: string, specialistSkills: string[]` | `string[]` | Extracts relevant skills for the job |

### Usage Example

```typescript
// Generate a complete response
const fullResponse = autoReplyService.generateFullResponse(job, specialist, matchResult);

// Generate specific sections
const introduction = autoReplyService.generateIntroduction(job, specialist);
const skillsSection = autoReplyService.generateSkillsHighlight(job, specialist);
const availabilitySection = autoReplyService.generateAvailability(job, specialist);
const pricingSection = autoReplyService.generatePricing(job, specialist);
const questionsSection = autoReplyService.generateQuestions(job);
```

## Premium Service

The Premium Service manages premium membership features and access control.

```typescript
// Import from src/services/premium-service.ts
import { PremiumService } from '@/services/premium-service';

const premiumService = new PremiumService();
const isPremium = premiumService.checkPremiumStatus(specialistId);
```

### Key Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `checkPremiumStatus` | `specialistId: string` | `boolean` | Checks if specialist has premium status |
| `getPremiumLevel` | `specialistId: string` | `PremiumLevel` | Gets the premium tier level |
| `applyMatchBoost` | `score: number, premiumLevel: PremiumLevel` | `number` | Applies premium boost to match score |
| `canAccessVerifiedOnlyJob` | `specialistId: string, job: Job` | `boolean` | Checks if specialist can access verified-only job |
| `getClientReputationInsights` | `clientId: string` | `ClientReputation` | Gets reputation data for premium members |

### Premium Level Enum

```typescript
enum PremiumLevel {
  NONE = 'none',
  PREMIUM = 'premium',
  PREMIUM_PLUS = 'premium_plus'
}
```

## Integration Between Services

The services are designed to work together:

1. **Match Service → Auto-Reply Service**: Match results are used to customize auto-replies
2. **Premium Service → Match Service**: Premium status affects match scores and access
3. **AI Match Service → Auto-Reply Service**: AI insights enhance response templates

## Error Handling

All services implement consistent error handling:

```typescript
try {
  const result = matchService.calculateMatch(job, specialist);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
  } else if (error instanceof ServiceError) {
    // Handle service-specific errors
  } else {
    // Handle unexpected errors
  }
}
```

## Service Configuration

Services can be configured through environment variables:

- `NEXT_PUBLIC_OPENAI_API_KEY`: API key for OpenAI integration
- `NEXT_PUBLIC_PREMIUM_MATCH_BOOST`: Percentage boost for premium members
- `NEXT_PUBLIC_ENABLE_AI_FEATURES`: Toggle for AI-powered features
