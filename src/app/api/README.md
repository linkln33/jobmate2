# API Routes Directory

This directory contains all the API routes for the JobMate application using Next.js App Router. These routes follow the Next.js App Router convention with route handlers in `route.ts` files and dynamic routes using folder names with square brackets (e.g., `[id]`).

## API Structure Overview

- `/applications`: Job application management endpoints
- `/assistant`: AI assistant interaction endpoints
- `/auth`: Authentication and authorization endpoints
- `/categories`: Service category management endpoints
- `/compatibility`: User compatibility matching endpoints
- `/jobs`: Job listing and management endpoints
- `/listings`: Service listing endpoints
- `/matches`: Match management endpoints
- `/messages`: Messaging system endpoints
- `/notifications`: Notification system endpoints
- `/payments`: Payment processing endpoints
- `/preferences`: User preference management endpoints
- `/profile`: User profile management endpoints
- `/referrals`: Referral system endpoints

## Key API Endpoints

### Applications API

```
GET /api/applications - Get all applications for the current user
POST /api/applications - Create a new application
GET /api/applications/[id] - Get application by ID
PUT /api/applications/[id] - Update application status
DELETE /api/applications/[id] - Delete an application
```

### Listings API

```
GET /api/listings - Get all listings with filtering options
POST /api/listings - Create a new listing
GET /api/listings/[id] - Get listing by ID
PUT /api/listings/[id] - Update a listing
DELETE /api/listings/[id] - Delete a listing
POST /api/listings/[id]/publish - Publish a listing
```

### Compatibility API

```
POST /api/compatibility - Calculate compatibility scores for listings
GET /api/compatibility/preferences - Get user compatibility preferences
PUT /api/compatibility/preferences - Update user compatibility preferences
```

### Messages API

```
GET /api/messages - Get all messages for the current user
POST /api/messages - Send a new message
GET /api/messages/conversations - Get all conversations
GET /api/messages/conversations/[id] - Get messages in a conversation
POST /api/messages/conversations/[id]/read - Mark conversation as read
```

### Profile API

```
GET /api/profile - Get current user profile
PUT /api/profile - Update user profile
POST /api/profile/avatar - Upload profile avatar
GET /api/profile/[id] - Get public profile by ID
```
- `/reviews`: Review management endpoints
- `/skills`: Skill management endpoints
- `/specialists`: Specialist management endpoints
- `/users`: User management endpoints
- `/waitlist`: Waitlist system endpoints

## API Documentation Standards

All API routes should follow these documentation standards:

1. **JSDoc Comments**: Each route handler should have JSDoc comments explaining:
   - Purpose of the endpoint
   - Request parameters
   - Response format
   - Possible error responses

2. **Example Format**:
```typescript
/**
 * @file API route for [feature]
 * @module app/api/[path]
 * 
 * This API endpoint [brief description of what it does].
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * [HTTP Method] handler for [feature]
 * @param request The incoming request object
 * @returns API response with [response data] or error
 */
export async function [METHOD](request: NextRequest) {
  // Implementation
}
```

## Best Practices

1. **Error Handling**: Always include proper error handling with appropriate status codes
2. **Validation**: Validate all incoming request data
3. **Authentication**: Secure endpoints that require authentication
4. **Rate Limiting**: Implement rate limiting for public endpoints
5. **Response Format**: Use consistent response format across all endpoints
6. **Logging**: Include appropriate logging for debugging and monitoring
