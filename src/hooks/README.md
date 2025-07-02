# Hooks Directory

This directory contains custom React hooks used throughout the JobMate application. These hooks encapsulate reusable logic, state management, and side effects to simplify component code and promote reusability.

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They allow you to use state and other React features without writing a class.

## Core Hooks

### Authentication & User

- `use-auth.ts` - Provides authentication state and methods (login, logout, registration)
- `use-user.ts` - Provides current user data and profile management functions
- `use-user-preferences.ts` - Manages user preferences for various features
- `use-permissions.ts` - Handles role-based permissions and access control

### Marketplace & Listings

- `use-listings.ts` - Fetches and manages marketplace listings with filtering
- `use-listing-form.ts` - Manages form state for creating/editing listings
- `use-listing-media.ts` - Handles media uploads and management for listings
- `use-listing-actions.ts` - Provides actions like save, share, report for listings

### Compatibility & Matching

- `use-compatibility-scores.ts` - Calculates and caches compatibility scores
- `use-weight-preferences.ts` - Manages dimension weight preferences for compatibility
- `use-match-suggestions.ts` - Provides personalized match suggestions
- `use-improvement-tips.ts` - Generates compatibility improvement suggestions

### Communication

- `use-conversations.ts` - Manages messaging conversations and threads
- `use-real-time-messages.ts` - Provides real-time message updates via Supabase
- `use-notifications.ts` - Handles system notifications and alerts
- `use-typing-indicator.ts` - Manages typing indicators in chat interfaces

### AI Features

- `use-ai-diagnosis.ts` - Provides AI-powered job diagnosis functionality
- `use-smart-scheduler.ts` - Handles AI scheduling recommendations
- `use-price-calculator.ts` - Manages AI price estimation features
- `use-content-generation.ts` - Provides AI-generated content for listings

### UI & Interaction

- `use-media-query.ts` - Responsive design hooks for different screen sizes
- `use-infinite-scroll.ts` - Implements infinite scrolling for lists
- `use-form.ts` - Form state management with validation
- `use-toast.ts` - Manages toast notifications
- `use-dialog.ts` - Controls dialog/modal state
- `use-clipboard.ts` - Provides clipboard functionality
- `use-geolocation.ts` - Handles user location detection and permissions

### Data & State

- `use-query.ts` - Wrapper around data fetching with caching and loading states
- `use-mutation.ts` - Handles data mutations with optimistic updates
- `use-local-storage.ts` - Persists state to localStorage with sync across tabs
- `use-debounce.ts` - Debounces rapidly changing values
- `use-async.ts` - Manages async operation state (loading, error, data)

## Usage Examples

### Authentication

```tsx
import { useAuth } from '@/hooks/use-auth';

function LoginButton() {
  const { user, login, isLoading } = useAuth();
  
  if (user) return <button>Logged in as {user.name}</button>;
  
  return (
    <button onClick={() => login()} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### Compatibility Scores

```tsx
import { useCompatibilityScores } from '@/hooks/use-compatibility-scores';

function ListingCard({ listing }) {
  const { score, isLoading } = useCompatibilityScores(listing.id, 'jobs');
  
  return (
    <div className="card">
      <h3>{listing.title}</h3>
      {isLoading ? (
        <span>Calculating compatibility...</span>
      ) : (
        <span>Compatibility: {score}%</span>
      )}
    </div>
  );
}
```

## Best Practices

1. **Naming Convention**: All hook files should be named with the prefix `use` (e.g., `use-auth.ts`)
2. **Single Responsibility**: Each hook should focus on a specific piece of functionality
3. **Documentation**: Include JSDoc comments explaining the hook's purpose, parameters, and return values
4. **Error Handling**: Implement proper error handling within hooks
5. **Testing**: Write unit tests for critical hooks
6. **Memoization**: Use `useMemo` and `useCallback` to optimize performance
7. **Dependencies**: Clearly specify and minimize effect dependencies
8. **Composition**: Compose complex hooks from simpler ones
9. **TypeScript**: Use proper TypeScript typing for parameters and return values

## Example Hook Documentation

```typescript
/**
 * Hook for managing user authentication state
 * @param options Configuration options for the auth hook
 * @returns Authentication state and methods
 * 
 * @example
 * const { user, login, logout } = useAuth();
 * 
 * // Check if user is logged in
 * if (user) {
 *   // User is authenticated
 * }
 * 
 * // Login user
 * await login(email, password);
 * 
 * // Logout user
 * logout();
 */
export function useAuth(options?: AuthOptions) {
  // Implementation
}
```

## Common Hooks

- **State Management**: Hooks for managing application state
- **API Interactions**: Hooks for fetching and manipulating data
- **Form Handling**: Hooks for form validation and submission
- **Authentication**: Hooks for user authentication and authorization
- **UI Effects**: Hooks for animations and UI interactions
