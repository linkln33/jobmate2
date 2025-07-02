# AI Components

This directory contains React components related to JobMate's AI-powered features and interfaces.

## Overview

The AI components provide user interfaces for interacting with JobMate's artificial intelligence capabilities, including job diagnosis, smart scheduling, price estimation, and content generation. These components make complex AI functionality accessible and user-friendly.

## Key Components

### Job Diagnosis

- `ai-diagnosis-panel.tsx` - Panel for analyzing job photos and providing automated diagnosis
- `issue-detection-result.tsx` - Displays detected issues from uploaded media
- `confidence-indicator.tsx` - Visual indicator of AI confidence in diagnosis
- `diagnosis-explanation.tsx` - Detailed explanation of AI diagnosis with supporting evidence

### Smart Scheduling

- `ai-scheduler.tsx` - AI-powered scheduling assistant
- `availability-optimizer.tsx` - Suggests optimal time slots based on multiple factors
- `schedule-conflict-resolver.tsx` - Helps resolve scheduling conflicts
- `duration-estimator.tsx` - Estimates job duration based on job type and complexity

### Price Estimation

- `price-calculator.tsx` - AI-powered cost estimation tool
- `price-breakdown.tsx` - Detailed breakdown of estimated costs
- `price-range-slider.tsx` - Interactive slider for adjusting price parameters
- `comparable-jobs-list.tsx` - Shows similar jobs and their pricing for reference

### Content Generation

- `ai-description-generator.tsx` - Generates job or service descriptions
- `ai-title-suggestions.tsx` - Suggests effective titles for listings
- `keyword-optimizer.tsx` - Suggests keywords to improve listing visibility
- `content-improvement-tips.tsx` - Provides suggestions to improve listing content

### AI Assistant Interface

- `ai-chat-interface.tsx` - Chat interface for interacting with JobMate's AI assistant
- `voice-input-button.tsx` - Button for voice input to AI features
- `suggestion-chips.tsx` - Quick suggestion chips for common AI requests
- `ai-thinking-indicator.tsx` - Loading indicator for AI processing

## Usage Guidelines

### Using the AI Diagnosis Panel

```tsx
import { AIDiagnosisPanel } from '@/components/ai/ai-diagnosis-panel';

// In your component
<AIDiagnosisPanel 
  images={jobImages}
  onDiagnosisComplete={(diagnosis) => handleDiagnosis(diagnosis)}
  showExplanations={true}
/>
```

### Implementing the Price Calculator

```tsx
import { PriceCalculator } from '@/components/ai/price-calculator';

// In your component
<PriceCalculator 
  jobType="plumbing"
  complexity="medium"
  location={userLocation}
  onEstimateGenerated={(estimate) => setPriceEstimate(estimate)}
/>
```

### Using the AI Chat Interface

```tsx
import { AIChatInterface } from '@/components/ai/ai-chat-interface';

// In your component
<AIChatInterface 
  initialContext={{ jobType: "electrical", userRole: "customer" }}
  onMessageSent={(message) => trackUserInteraction(message)}
/>
```

## Integration with AI Services

These components work closely with the AI services located in the `src/services/ai` directory. The components handle user interaction and display, while the services perform the actual AI processing and API calls.

## Best Practices

1. **Error Handling**: Always provide graceful fallbacks when AI services are unavailable
2. **Transparency**: Clearly indicate when content is AI-generated
3. **User Control**: Allow users to override or adjust AI suggestions
4. **Performance**: Use streaming responses and progressive loading for better UX
5. **Privacy**: Be transparent about how user data is used for AI processing

## Related Hooks

- `use-ai-diagnosis.ts` - Hook for job diagnosis functionality
- `use-price-estimation.ts` - Hook for price estimation features
- `use-ai-assistant.ts` - Hook for interacting with the AI assistant
- `use-content-generation.ts` - Hook for AI content generation features

## Future Improvements

- Implement multimodal AI capabilities (text, image, audio)
- Add real-time diagnosis from video streams
- Develop specialized AI models for different job categories
- Implement federated learning to improve AI while preserving privacy
- Add explainable AI features to build user trust
