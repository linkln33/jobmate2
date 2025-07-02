# Compatibility Components

This directory contains React components related to JobMate's proprietary compatibility engine and matching system.

## Overview

The compatibility components provide user interfaces for displaying, configuring, and interacting with JobMate's AI-powered compatibility system. These components visualize compatibility scores, allow users to adjust their preferences, and provide explanations for match recommendations.

## Key Components

### Compatibility Score Display

- `compatibility-badge.tsx` - Displays a compatibility score as a badge with color coding
- `compatibility-score-card.tsx` - Card component showing overall compatibility with a listing
- `compatibility-breakdown.tsx` - Detailed breakdown of compatibility dimensions
- `compatibility-radar-chart.tsx` - Radar chart visualization of compatibility dimensions

### Preference Management

- `weight-preferences-panel.tsx` - Panel for adjusting the importance of different compatibility dimensions
- `preference-slider.tsx` - Slider component for setting preference values
- `preference-toggle.tsx` - Toggle component for binary preferences
- `preference-wizard.tsx` - Step-by-step wizard for setting up initial preferences

### Explanation Components

- `compatibility-explanation.tsx` - Explains why a particular listing was recommended
- `compatibility-improvement-tips.tsx` - Provides suggestions for improving compatibility
- `compatibility-dimension-detail.tsx` - Detailed explanation of a specific compatibility dimension
- `compatibility-factor-card.tsx` - Card showing the impact of a specific factor on compatibility

## Usage Guidelines

### Displaying Compatibility Scores

```tsx
import { CompatibilityBadge } from '@/components/compatibility/compatibility-badge';

// In your component
<CompatibilityBadge score={85} size="md" />
```

### Using the Weight Preferences Panel

```tsx
import { WeightPreferencesPanel } from '@/components/compatibility/weight-preferences-panel';
import { useUserPreferences } from '@/hooks/use-user-preferences';

// In your component
const { preferences, updatePreferences } = useUserPreferences();

<WeightPreferencesPanel 
  weights={preferences.weights} 
  onChange={updatePreferences} 
  category="jobs"
/>
```

### Showing Compatibility Breakdown

```tsx
import { CompatibilityBreakdown } from '@/components/compatibility/compatibility-breakdown';

// In your component
<CompatibilityBreakdown 
  result={compatibilityResult}
  showExplanations={true}
/>
```

## Integration with Compatibility Engine

These components work closely with the compatibility engine located at `src/services/compatibility/engine.ts`. The engine performs the actual compatibility calculations, while these components visualize the results and collect user preferences.

## Best Practices

1. **Performance Considerations**: Compatibility calculations can be intensive, so use memoization and caching where appropriate
2. **Accessibility**: Ensure all compatibility visualizations have proper ARIA attributes and are screen reader friendly
3. **Explanations**: Always provide clear explanations for compatibility scores to build user trust
4. **Preference Persistence**: Save user preferences to their profile for consistent experiences across sessions

## Related Hooks

- `use-compatibility-scores.ts` - Hook for calculating compatibility scores for listings
- `use-user-preferences.ts` - Hook for managing user preference state
- `use-weight-preferences.ts` - Hook for managing dimension weight preferences

## Future Improvements

- Add A/B testing framework for different compatibility visualization approaches
- Implement machine learning to automatically adjust weights based on user behavior
- Add more interactive visualizations for complex compatibility dimensions
- Develop personalized improvement recommendations based on user history
