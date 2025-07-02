# Services Directory

This directory contains service modules that handle business logic and external integrations for the JobMate application. Services act as the middle layer between the UI components and data sources, providing a clean separation of concerns.

## Directory Structure

- `/api`: Service clients for internal API endpoints
- `/compatibility`: Compatibility engine and scoring algorithms
- `/database`: Database access layer and query builders
- `/ai`: AI-powered services for diagnosis, scheduling, and content generation
- `/auth`: Authentication and authorization services
- `/messaging`: Real-time messaging and notification services
- `/payment`: Payment processing and financial services
- `/storage`: File storage and media management services
- `/geocoding`: Location-based services and geocoding
- `/search`: Search functionality and indexing services
- `/analytics`: Usage tracking and analytics services
- `/waitlist`: Waitlist system services and database schema

## Core Services

### Application Service

The `applicationService` handles job applications, including creation, retrieval, and status management. It provides methods for:

- Creating new applications
- Retrieving applications by user, listing, or status
- Updating application status
- Managing application attachments and messages

### Listing Service

The `listingService` manages marketplace listings across all categories. Key functionality includes:

- Creating and updating listings
- Search and filtering
- Category-specific validation
- Media management for listings
- Visibility and status control

### User Service

The `userService` handles user profiles, preferences, and account management:

- Profile creation and updates
- Preference management
- Verification and credentials
- Role-based permissions
- Account status and history

### Compatibility Engine

The `compatibilityEngine` is JobMate's proprietary matching system that:

- Calculates multi-dimensional compatibility scores
- Provides category-specific scoring algorithms
- Incorporates contextual factors and user preferences
- Generates improvement suggestions
- Caches results for performance

### Message Service

The `messageService` powers JobMate's real-time communication:

- Conversation management
- Message sending and retrieval
- Read receipts and status tracking
- Media attachments in messages
- Automated notifications

## Service Module Guidelines

Each service module should:

1. **Focus on Business Logic**: Separate business logic from UI components and API routes
2. **Handle External Integrations**: Manage connections to external APIs and services
3. **Provide Data Access**: Abstract database operations and data manipulation
4. **Include Documentation**: Document the purpose and usage of each service
5. **Error Handling**: Implement consistent error handling and logging
6. **Type Safety**: Use TypeScript interfaces for all inputs and outputs
7. **Testing**: Include unit tests for critical business logic

## Best Practices

1. **Modularity**: Keep services focused on specific domains or features
2. **Error Handling**: Implement proper error handling and logging
3. **Testing**: Write unit tests for critical service functions
4. **Configuration**: Use environment variables for configurable settings
5. **Documentation**: Include JSDoc comments for all exported functions

## Usage Example

```typescript
import { waitlistService } from '@/services/waitlist';

// Using a service in an API route
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await waitlistService.addUser(data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```
