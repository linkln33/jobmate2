# Unified Adaptive AI Assistant - Developer Usage Guide

This guide explains how to use and extend the Unified Adaptive AI Assistant in the JobMate application.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Integration](#integration)
3. [Creating Custom Suggestions](#creating-custom-suggestions)
4. [Extending the Suggestion Engine](#extending-the-suggestion-engine)
5. [Customizing the UI](#customizing-the-ui)
6. [Troubleshooting](#troubleshooting)

## Getting Started

The Unified Adaptive AI Assistant provides contextual guidance to users based on their current workflow. It automatically detects the current page context and provides relevant suggestions.

### Prerequisites

- Ensure the Prisma schema has been updated with the assistant models
- Ensure the database has been synchronized with the schema
- Verify that the API routes for the assistant are properly set up

## Integration

### Basic Integration

To integrate the assistant into a page or component:

1. Wrap your application with the `AssistantProvider` in your main layout:

```tsx
// src/app/layout.tsx
import { AssistantProvider } from '@/contexts/AssistantContext/AssistantContext';
import AIAdaptivePanel from '@/components/assistant/AIAdaptivePanel';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AssistantProvider>
          {children}
          <AIAdaptivePanel />
        </AssistantProvider>
      </body>
    </html>
  );
}
```

### Using the Assistant Hook

To access assistant functionality in your components:

```tsx
import { useAssistant } from '@/contexts/AssistantContext/AssistantContext';

function MyComponent() {
  const { state, actions } = useAssistant();
  
  // Access assistant state
  const { isEnabled, currentMode, suggestions } = state;
  
  // Use assistant actions
  const handleOpenPanel = () => {
    actions.openPanel();
  };
  
  return (
    <div>
      <button onClick={handleOpenPanel}>Open Assistant</button>
      {/* Your component content */}
    </div>
  );
}
```

### Using the Mode Detection Hook

For more specific control over the assistant mode:

```tsx
import { useAssistantMode } from '@/hooks/useAssistantMode';

function MyComponent() {
  const { currentMode, setMode, setContext } = useAssistantMode();
  
  // Override the detected mode
  const switchToMatchingMode = () => {
    setMode('MATCHING');
  };
  
  // Set a more specific context
  const setSpecificContext = () => {
    setContext('job_creation');
  };
  
  return (
    <div>
      <p>Current Mode: {currentMode}</p>
      <button onClick={switchToMatchingMode}>Switch to Matching Mode</button>
      <button onClick={setSpecificContext}>Set Job Creation Context</button>
    </div>
  );
}
```

## Creating Custom Suggestions

To create custom suggestions for users:

### Via API

```typescript
// Example: Creating a custom suggestion via API
const createSuggestion = async () => {
  try {
    await axios.post('/api/assistant/suggestions', {
      title: 'Complete your profile',
      content: 'Adding more details to your profile increases your chances of getting matched.',
      mode: 'PROFILE',
      context: 'profile_completion',
      priority: 2,
      actionUrl: '/profile'
    });
  } catch (error) {
    console.error('Error creating suggestion:', error);
  }
};
```

### Via Suggestion Engine

To extend the suggestion engine with custom rules:

1. Open `src/services/assistant/suggestionEngine.ts`
2. Add your custom suggestion generation logic to the appropriate mode-specific method
3. Or create a new method for a specific feature

Example:

```typescript
// Add to the generateProfileSuggestions method
if (user.role === 'SPECIALIST' && !user.hourlyRate) {
  suggestions.push({
    userId,
    title: 'Set your hourly rate',
    content: 'Specialists with an hourly rate get 40% more job inquiries.',
    mode: 'PROFILE',
    context: 'profile_completion',
    priority: 2,
    actionUrl: '/profile/rates',
    isActive: true
  });
}
```

## Extending the Suggestion Engine

To add support for new types of suggestions or integrate with additional services:

1. Create a new method in the suggestion engine for your specific use case
2. Call this method from the appropriate mode-specific generator

Example:

```typescript
// Add a new method to the suggestionEngine object
async generateSkillSuggestions(userId: string, user: any, suggestions: Partial<AssistantSuggestion>[]): Promise<void> {
  try {
    // Get trending skills in the user's industry
    const trendingSkills = await someExternalService.getTrendingSkills(user.industry);
    
    // Check if user has these skills
    const userSkills = user.skills.map((s: any) => s.skill.name.toLowerCase());
    const missingTrendingSkills = trendingSkills.filter(
      (skill: string) => !userSkills.includes(skill.toLowerCase())
    );
    
    if (missingTrendingSkills.length > 0) {
      suggestions.push({
        userId,
        title: 'Add trending skills',
        content: `Consider adding these trending skills to your profile: ${missingTrendingSkills.slice(0, 3).join(', ')}`,
        mode: 'PROFILE',
        context: 'skills_management',
        priority: 2,
        actionUrl: '/profile/skills',
        isActive: true
      });
    }
  } catch (error) {
    console.error('Error generating skill suggestions:', error);
  }
}

// Then call this from generateProfileSuggestions
if (context === 'skills_management') {
  await this.generateSkillSuggestions(userId, user, suggestions);
}
```

## Customizing the UI

### Modifying the Assistant Panel

To customize the appearance of the assistant panel:

1. Edit `src/components/assistant/AIAdaptivePanel.tsx` for major layout changes
2. Edit `src/components/assistant/SuggestionCard.tsx` to modify how suggestions are displayed
3. Edit `src/components/assistant/ModeSelector.tsx` to change the mode selection UI

### Adding New UI Components

To add new UI components to the assistant:

1. Create your component in the `src/components/assistant/` directory
2. Import and use it in the `AIAdaptivePanel.tsx` file

Example:

```tsx
// src/components/assistant/AssistantMetrics.tsx
import React from 'react';
import { useAssistant } from '@/contexts/AssistantContext/AssistantContext';

const AssistantMetrics: React.FC = () => {
  const { state } = useAssistant();
  
  return (
    <div className="p-3 border-t">
      <h4 className="text-sm font-medium">Assistant Metrics</h4>
      <p className="text-xs text-gray-500">
        Suggestions viewed: {state.suggestions.length}
      </p>
    </div>
  );
};

export default AssistantMetrics;

// Then in AIAdaptivePanel.tsx
import AssistantMetrics from './AssistantMetrics';

// Add to the panel
<div className="flex-1 overflow-y-auto p-4 space-y-4">
  {/* Existing content */}
  <AssistantMetrics />
</div>
```

## Troubleshooting

### Common Issues

1. **Assistant not detecting the correct mode**
   - Check that the path patterns in `detectModeFromPath` match your application routes
   - Manually set the mode using `setMode` if automatic detection fails

2. **Suggestions not appearing**
   - Verify that the user has the assistant enabled in their preferences
   - Check that the suggestion engine is generating suggestions for the current mode
   - Ensure the API routes are correctly configured and returning data

3. **Performance issues**
   - Consider lazy loading the assistant components
   - Implement pagination for suggestions if there are many
   - Add caching for frequently accessed data

### Debugging

To debug the assistant:

1. Enable debug logging in the AssistantContext:

```typescript
// Add to AssistantContext.tsx
const DEBUG = process.env.NODE_ENV === 'development';

// Then in functions
if (DEBUG) console.log('Assistant debug:', { state, action });
```

2. Use the browser console to monitor assistant state and actions

3. Check the network tab for API requests and responses

### Getting Help

If you encounter issues not covered in this guide:

1. Check the architecture documentation in `docs/technical/assistant/architecture.md`
2. Review the component diagrams in `docs/technical/assistant/component-diagram.md`
3. Contact the development team for assistance
