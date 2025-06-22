# Unified Adaptive AI Assistant Architecture

## Overview

The Unified Adaptive AI Assistant is a context-aware guidance system that adapts to the user's current workflow within JobMate. It provides personalized suggestions and assistance based on the user's role, current page context, and preferences.

## Core Components

### 1. Data Models

The assistant is built on the following Prisma models:

- **AssistantPreference**: Stores user preferences for the assistant, including enablement status, proactivity level, and preferred modes.
- **AssistantSuggestion**: Represents contextual suggestions provided to users based on their activities and needs.
- **AssistantMemoryLog**: Records user interactions with the assistant for analytics and personalization.
- **AssistantAnalytics**: Aggregates usage data for insights and improvements.

### 2. Backend Services

- **API Routes**:
  - `/api/assistant/preferences`: Manages user preferences for the assistant
  - `/api/assistant/suggestions`: Handles suggestion retrieval, creation, and updates
  - `/api/assistant/memory`: Logs user interactions with the assistant

- **Suggestion Engine**:
  - Rule-based system that generates contextual suggestions based on user data
  - Integrates with existing services like the matching service
  - Filters suggestions based on user's proactivity preferences

### 3. Frontend Components

- **AssistantContext Provider**: Manages assistant state and provides context to components
- **useAssistantMode Hook**: Detects and sets the assistant mode based on the current route
- **AIAdaptivePanel**: Main UI component for displaying suggestions and controls
- **ModeSelector**: Allows users to switch between different assistant modes
- **SuggestionCard**: Displays individual suggestions with actions

## Assistant Modes

The assistant operates in multiple modes, each tailored to specific workflows:

1. **MATCHING**: Job matching and search assistance
2. **PROJECT_SETUP**: Guidance for creating and managing projects/jobs
3. **PAYMENTS**: Help with payment processes and billing
4. **PROFILE**: Profile completion and optimization tips
5. **MARKETPLACE**: Service discovery and marketplace navigation
6. **GENERAL**: General platform usage and onboarding assistance

## Mode Detection

The assistant automatically detects the appropriate mode based on the current route:

- `/matches/*` or `/jobs/nearby/*` → MATCHING mode
- `/projects/*` or `/jobs/create/*` → PROJECT_SETUP mode
- `/payments/*` or `/billing/*` → PAYMENTS mode
- `/profile/*` or `/settings/*` → PROFILE mode
- `/marketplace/*` or `/services/*` → MARKETPLACE mode
- All other routes → GENERAL mode

Additionally, more specific contexts are detected based on deeper path patterns (e.g., `/profile/skills` → skills_management context).

## Proactivity Levels

Users can set their preferred level of assistant proactivity:

1. **Minimal (1)**: Only high-priority suggestions
2. **Balanced (2)**: Medium and high-priority suggestions
3. **Proactive (3)**: All suggestions

## Data Flow

1. **Route Change**:
   - `useAssistantMode` hook detects route change
   - Mode and context are updated in AssistantContext

2. **Suggestion Generation**:
   - AssistantContext fetches suggestions based on current mode and context
   - Suggestion engine generates personalized suggestions using user data and preferences

3. **User Interaction**:
   - User interactions are logged via AssistantMemoryLog
   - Preferences can be updated through the assistant panel
   - Suggestions can be dismissed or acted upon

## Integration Points

- **Matching Service**: Provides job match data for suggestions in MATCHING mode
- **User Profile**: Used to generate profile completion suggestions
- **Payment System**: Detects pending payments and payment method setup needs
- **Notification System**: Surfaces unread notifications as suggestions

## Future Enhancements

- **Machine Learning Integration**: Replace rule-based suggestion engine with ML-based personalization
- **GPT Integration**: Add natural language processing for more conversational assistance
- **Voice Interface**: Add voice commands and responses for hands-free operation
- **Expanded Analytics**: More detailed tracking of suggestion effectiveness and user engagement
