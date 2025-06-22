# Component Structure

This document outlines the component structure of the JobMate platform, focusing on the Smart Job Match System and related components.

## Smart Job Match Components

### Job Match Card

The `JobMatchCard` component displays job information with match indicators and badges.

```jsx
<JobMatchCard
  job={jobData}
  specialist={specialistData}
  matchResult={matchResult}
  isPremium={true}
  onSelect={() => {}}
/>
```

**Props:**
- `job`: Job object with details about the job posting
- `specialist`: Specialist object with details about the current user
- `matchResult`: Result object from the match service
- `isPremium`: Boolean indicating if the specialist has premium status
- `onSelect`: Callback function when the card is selected

**Key Features:**
- Displays job title, description, budget, and location
- Shows match score with visual indicator
- Renders relevant badges based on match factors
- Includes button to trigger auto-reply generation
- Handles job selection and navigation

### Match Badge

The `MatchBadge` component renders visual indicators for job matches.

```jsx
<MatchBadge
  type="perfect-match"
  label="Perfect Match"
  tooltip="This job perfectly matches your skills and preferences"
/>
```

**Props:**
- `type`: Badge type identifier (e.g., "perfect-match", "urgent", "verified")
- `label`: Text to display on the badge
- `tooltip`: Tooltip text explaining the badge meaning
- `icon`: Optional icon component to display

**Badge Types:**
- Match quality badges (perfect, great, good)
- Urgency badges (urgent, time-sensitive)
- Trust badges (verified payment, top client)
- Special badges (premium, neighbor)

### Auto-Reply Generator

The `AutoReplyGenerator` component provides an interface for generating and customizing response templates.

```jsx
<AutoReplyGenerator
  job={jobData}
  specialist={specialistData}
  matchResult={matchResult}
  onClose={() => {}}
/>
```

**Props:**
- `job`: Job object with details about the job posting
- `specialist`: Specialist object with details about the current user
- `matchResult`: Result object from the match service
- `onClose`: Callback function when the generator is closed

**Key Features:**
- Modal dialog interface with tabs for different response sections
- Text area for editing generated responses
- Copy-to-clipboard functionality
- Regenerate button for creating new responses
- Loading state during response generation

## Page Components

### Smart Match Demo Page

The `SmartMatchDemo` component showcases the Smart Job Match System features.

```jsx
<SmartMatchDemo />
```

**Key Features:**
- Toggles for premium membership status and level
- Display of mock job matches with badges
- Integration with auto-reply generator
- Explanation modal for the match system

### Map View Page

The `MapViewPage` component provides a map-based interface for browsing jobs.

```jsx
<MapViewPage initialJobs={jobs} />
```

**Props:**
- `initialJobs`: Array of job objects to display on the map

**Key Features:**
- Interactive map with job markers
- Animated markers for urgent jobs
- Filtering controls for job categories and attributes
- Synchronized selection between list and map views
- Mobile-responsive layout

## Component Hierarchy

```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Footer
├── Pages
│   ├── HomePage
│   ├── JobsPage
│   │   └── JobsList
│   │       └── JobMatchCard
│   │           ├── MatchBadge
│   │           └── AutoReplyGenerator
│   ├── MapViewPage
│   │   └── EnhancedJobMap
│   │       └── JobMarkers (with animations)
│   └── SmartMatchDemo
│       ├── JobMatchCard
│       ├── MatchExplainer
│       └── PremiumToggle
└── Shared Components
    ├── Button
    ├── Card
    ├── Dialog
    └── Tabs
```

## Component Communication

Components in the Smart Job Match System communicate through:

1. **Props**: Direct parent-to-child communication
2. **Callbacks**: Child-to-parent communication
3. **Context**: Global state management for user data and settings
4. **Services**: Shared service instances for match calculations and auto-replies

## Styling Approach

Components use a combination of:

- **Tailwind CSS**: For responsive layouts and utility classes
- **CSS Modules**: For component-specific styles
- **Global Styles**: For animations and shared styling elements

## Component Best Practices

When extending or creating new components:

1. Use TypeScript interfaces for prop definitions
2. Implement proper loading and error states
3. Use React.memo for performance optimization when appropriate
4. Keep components focused on a single responsibility
5. Extract reusable logic into custom hooks
6. Document props and component behavior
