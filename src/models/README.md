# Data Models

This directory contains the core data models used throughout the JobMate application. These models provide TypeScript interfaces and types that define the shape of data used across the application.

## Purpose

The models directory serves as a central location for all data structure definitions, promoting:

1. **Consistency** - Single source of truth for data structures
2. **Documentation** - Well-documented models with JSDoc comments
3. **Reusability** - Easy import of models across the application
4. **Type Safety** - Strong TypeScript typing for better developer experience

## Models Organization

Models are organized by domain and functionality:

- `user.ts` - User-related models (profiles, authentication)
- `job.ts` - Job listing models and related types
- `marketplace.ts` - Marketplace listing models (services, items, rentals)
- `specialist.ts` - Specialist profile and service models
- `location.ts` - Location and geographic models
- `messaging.ts` - Messaging and communication models
- `payment.ts` - Payment and transaction models
- `review.ts` - Review and rating models

## Usage

Import models directly from this directory:

```typescript
import { User } from '@/models/user';
import { Job } from '@/models/job';
import { MarketplaceListing } from '@/models/marketplace';
```

## Model Documentation

Each model file includes comprehensive JSDoc comments explaining:

- The purpose of each model
- Required and optional fields
- Relationships between models
- Usage examples
- Validation rules where applicable

## Relationship with `/src/types`

While the `/src/types` directory contains various TypeScript type definitions, the `/src/models` directory specifically focuses on data structure models that represent business entities in the application.

Some types may be duplicated between these directories during the transition period, but the goal is to eventually have all business entity models in this directory.

## Database Relationship

These models closely mirror the database schema defined in `database_schema.md`, but are adapted for frontend use with TypeScript. They may include additional computed properties or client-side specific fields not present in the database.
