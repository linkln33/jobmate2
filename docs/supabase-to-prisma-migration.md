# Supabase to Prisma Migration Guide

This document outlines the migration strategy from Supabase to Prisma in the JobMate application.

## Migration Strategy

The migration follows a gradual approach with parallel service implementations to minimize disruption:

1. **Dual Service Pattern**: Parallel service classes (e.g., `ListingService` for Supabase and `ListingPrismaService` for Prisma) maintain the same interface but use different database access methods.

2. **Field Mapping Layer**: Prisma services include mapping logic to translate between Supabase field names and Prisma schema fields.

3. **Enum Handling**: Helper methods convert between Supabase string statuses and Prisma enum values.

4. **Authentication Coexistence**: Supabase continues to handle authentication while data operations gradually move to Prisma.

## Field Mapping Reference

### Listings/Jobs

| Supabase Field | Prisma Field      | Notes                                    |
|----------------|-------------------|------------------------------------------|
| id             | id                | UUID format in both                      |
| user_id        | customerId        | References the User model                |
| category_id    | serviceCategoryId | References the ServiceCategory model     |
| title          | title             | Same in both                             |
| description    | description       | Same in both                             |
| budget_min     | budgetMin         | Number in Prisma, string in Supabase     |
| budget_max     | budgetMax         | Number in Prisma, string in Supabase     |
| budget_type    | N/A               | Not present in Prisma schema             |
| location       | address           | Location string                          |
| location_lat   | latitude          | Number in both                           |
| location_lng   | longitude         | Number in both                           |
| status         | status            | String in Supabase, Enum in Prisma       |

### Status Mapping

| Supabase Status | Prisma JobStatus |
|----------------|------------------|
| DRAFT          | DRAFT            |
| PUBLISHED      | OPEN             |
| ASSIGNED       | ASSIGNED         |
| IN_PROGRESS    | IN_PROGRESS      |
| COMPLETED      | COMPLETED        |
| CANCELLED      | CANCELLED        |
| DISPUTED       | DISPUTED         |

### Media/Attachments

| Supabase Field | Prisma Field | Notes                                |
|----------------|--------------|--------------------------------------|
| id             | id           | UUID format in both                  |
| listing_id     | jobId        | References the Job model             |
| file_path      | mediaUrl     | URL to the media file                |
| file_type      | mediaType    | Type of media (image, document, etc.)|
| name           | N/A          | Not present in Prisma schema         |

## API Routes Migration

All API routes have been updated to use the Prisma services instead of Supabase services:

- `/api/listings` - Uses `listingPrismaService` for CRUD operations
- `/api/listings/[id]` - Uses `listingPrismaService` for specific listing operations

## Testing

A test script is available to verify the Prisma services work correctly:

```bash
cd /Users/gl1/Codes/jobmate2 && npx tsx src/scripts/test-prisma-listing.ts
```

## Next Steps

1. **Schema Optimization**: Refactor the Prisma schema to take advantage of Prisma-specific features.

2. **Authentication Transition**: Consider migrating authentication from Supabase to a solution that integrates better with Prisma.

3. **Performance Monitoring**: Set up monitoring for database queries to ensure Prisma is performing optimally.

## Troubleshooting

Common issues and their solutions:

- **Field Type Mismatches**: Ensure proper type conversion between string and number fields.
- **Missing Relations**: Check that all necessary relations are included in Prisma queries.
- **Enum Conversion**: Use the mapping helper methods when converting between string statuses and enum values.
