# Utility Functions

This directory contains utility functions and helper modules used throughout the JobMate application. These utilities provide reusable functionality for common tasks, data manipulation, and integrations.

## Overview

The utility functions serve several important purposes:

1. **Code reusability** - Prevent duplication by centralizing common operations
2. **Abstraction** - Hide implementation details behind clean interfaces
3. **Separation of concerns** - Keep business logic separate from UI components
4. **Integration** - Provide interfaces to external services and APIs

## Available Utilities

### Algolia Integration

- `algolia.ts` - Core Algolia client initialization and search utilities
- `algolia-indexer.ts` - Functions for indexing and managing Algolia records

### Matching and Compatibility

- `compatibility.ts` - Core compatibility scoring algorithms
- `compatibilityUtils.ts` - Helper functions for compatibility calculations
- `api/match-api.ts` - API client for the matching service

### UI Helpers

- `category-icons.ts` - Mapping between categories and their icon representations
- `formAutoInsert.ts` - Utilities for form auto-completion and suggestions

### Geolocation

- `geo-utils.ts` - Geolocation utilities for distance calculation and mapping

## Usage Examples

### Algolia Search Client

```tsx
import { searchClient } from '@/utils/algolia';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';

function SearchPage() {
  return (
    <InstantSearch searchClient={searchClient} indexName="jobmate_listings">
      <SearchBox />
      <Hits />
    </InstantSearch>
  );
}
```

### Compatibility Calculation

```tsx
import { calculateCompatibility } from '@/utils/compatibility';

function MatchDisplay({ job, specialist }) {
  const compatibilityScore = calculateCompatibility(job, specialist);
  
  return (
    <div>
      <h3>Match Score: {compatibilityScore}%</h3>
      {/* Additional UI */}
    </div>
  );
}
```

### Geolocation Utilities

```tsx
import { calculateDistance, formatAddress } from '@/utils/geo-utils';

function LocationInfo({ userLocation, serviceLocation }) {
  const distance = calculateDistance(userLocation, serviceLocation);
  const formattedAddress = formatAddress(serviceLocation);
  
  return (
    <div>
      <p>Distance: {distance} km</p>
      <p>Address: {formattedAddress}</p>
    </div>
  );
}
```

## Best Practices

When working with utility functions:

1. **Pure functions** - Prefer pure functions that don't have side effects
2. **TypeScript typing** - Use strong typing for parameters and return values
3. **JSDoc comments** - Document the purpose, parameters, and return values
4. **Unit testing** - Ensure utilities have comprehensive test coverage
5. **Error handling** - Implement proper error handling and fallbacks

## Organization

Utilities are organized by functionality:

- **API clients** - Functions for interacting with external APIs
- **Data transformation** - Functions for manipulating and transforming data
- **Calculations** - Mathematical and algorithmic utilities
- **Formatting** - Text and data formatting helpers
- **Validation** - Input validation functions

## Environment Variables

Some utilities require environment variables:

- Algolia API keys and application ID
- API endpoints and credentials
- Feature flags and configuration settings

These are typically loaded from `.env` files and accessed via `process.env`.

## Security Considerations

When working with sensitive utilities:

1. **API keys** - Never expose admin API keys in client-side code
2. **User data** - Be cautious with personally identifiable information
3. **Rate limiting** - Implement rate limiting for external API calls
4. **Error messages** - Don't expose sensitive details in error messages

## Testing Utilities

Many utilities have corresponding test files in the `__tests__` directory:

- Unit tests for individual functions
- Integration tests for API clients
- Mock implementations for testing components

## Adding New Utilities

When adding new utility functions:

1. Choose the appropriate file based on functionality
2. Create a new file if the functionality is distinct
3. Export named functions (avoid default exports)
4. Add comprehensive JSDoc comments
5. Write tests for the new functionality
