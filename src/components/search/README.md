# Search Components

This directory contains components related to the search functionality in JobMate, specifically the Algolia integration for powerful, fast, and relevant search capabilities.

## Overview

The search components in this directory provide a complete solution for searching both specialists and jobs in the JobMate marketplace. They leverage Algolia's InstantSearch library to deliver a responsive and feature-rich search experience.

## Components

### AlgoliaSearchBar

`algolia-search-bar.tsx` - A debounced search input component that connects to Algolia's search functionality.

**Features:**
- Debounced input to prevent excessive API calls
- Clear button to reset search
- Styled according to JobMate design system
- Automatically syncs with Algolia's query state

**Usage:**
```jsx
<AlgoliaSearchBar />
```

### SpecialistsHits

`specialists-hits.tsx` - Displays search results for specialists from Algolia.

**Features:**
- Responsive grid layout for specialist cards
- Loading state with skeleton UI
- Empty state for no results
- Displays specialist information:
  - Profile image with fallback initials
  - Name and title
  - Rating and reviews
  - Location and hourly rate
  - Skills (with badges)
  - Job completion statistics

**Usage:**
```jsx
<SpecialistsHits />
```

### JobsHits

`jobs-hits.tsx` - Displays search results for jobs from Algolia.

**Features:**
- Vertical list layout for job cards
- Loading state with skeleton UI
- Empty state for no results
- Displays job information:
  - Job title and company
  - Job type badge
  - Location, duration, and posting date
  - Job description
  - Required skills (with badges)
  - Budget information

**Usage:**
```jsx
<JobsHits />
```

## Integration

These components are designed to be used within an Algolia InstantSearch context. Typically, they are integrated into a page component like this:

```jsx
import { InstantSearch, Configure } from 'react-instantsearch';
import { searchClient } from '@/utils/algolia';
import AlgoliaSearchBar from '@/components/search/algolia-search-bar';
import SpecialistsHits from '@/components/search/specialists-hits';
import JobsHits from '@/components/search/jobs-hits';

function SearchPage() {
  return (
    <InstantSearch searchClient={searchClient} indexName="jobmate_listings">
      <Configure hitsPerPage={12} distinct={true} />
      <AlgoliaSearchBar />
      
      {/* Tab or toggle to switch between these two */}
      <SpecialistsHits />
      <JobsHits />
    </InstantSearch>
  );
}
```

## Dependencies

- `react-instantsearch` - Algolia's React components library
- `algoliasearch` - Algolia JavaScript API client
- JobMate UI components (`@/components/ui/*`)
- Lucide React icons

## Environment Variables

These components require the following environment variables to be set:

- `NEXT_PUBLIC_ALGOLIA_APP_ID` - Algolia application ID
- `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` - Algolia search-only API key

For indexing operations (server-side only):
- `ALGOLIA_ADMIN_API_KEY` - Algolia admin API key (never expose client-side)
