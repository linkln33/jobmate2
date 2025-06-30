# Marketplace Components

This directory contains components related to the JobMate marketplace functionality, including listing cards, filters, search, and detailed views.

## Overview

The marketplace components provide a complete solution for displaying, filtering, and interacting with marketplace listings across the JobMate platform. These components support various listing types including jobs, services, items, and rentals.

## Component Categories

### Listing Cards

- `marketplace-listing-card.tsx` - Standard card for displaying marketplace listings
- `enhanced-marketplace-listing-card.tsx` - Enhanced version with additional features and animations

**Features:**
- Responsive design for different screen sizes
- Support for different listing types (jobs, services, items, rentals)
- Display of pricing, location, and seller information
- Badge support for featured and verified listings
- Image handling with fallbacks

### Listing Creation

The `create-listing` directory contains components for the listing creation wizard:

- `listing-creation-wizard.tsx` - Main wizard component
- Steps:
  - `listing-type-step.tsx` - Select listing type (job, service, item, rental)
  - `listing-details-step.tsx` - Enter title, description, and category
  - `listing-media-step.tsx` - Upload images and videos
  - `listing-pricing-step.tsx` - Set pricing details
  - `listing-location-step.tsx` - Set location information
  - `listing-preview-step.tsx` - Preview the listing before publishing

### Listing Detail

The `listing-detail` directory contains components for the detailed view of a listing:

- `marketplace-listing-detail.tsx` - Main container component
- `listing-header.tsx` - Title, badges, and key information
- `listing-gallery.tsx` - Image gallery with thumbnails
- `listing-description.tsx` - Formatted description with details
- `listing-pricing.tsx` - Pricing information and options
- `listing-location.tsx` - Map and location details
- `listing-seller-info.tsx` - Seller profile and contact information
- `listing-reviews.tsx` - Reviews and ratings
- `listing-actions.tsx` - Action buttons (save, share, report)
- `listing-similar.tsx` - Similar listings suggestions

### Search and Filtering

- `marketplace-search.tsx` - Search input and functionality
- `marketplace-filters.tsx` - Filter controls for the marketplace
- `compatibility-filter.tsx` - Filter by compatibility score
- `marketplace-tabs.tsx` - Tab navigation for different listing types
- `marketplace-header.tsx` - Header with search and filter controls
- `marketplace-grid.tsx` - Grid layout for displaying listings

## Usage Examples

### Basic Listing Card

```jsx
import { MarketplaceListingCard } from '@/components/marketplace/marketplace-listing-card';

function ListingsGrid({ listings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map(listing => (
        <MarketplaceListingCard 
          key={listing.id} 
          listing={listing} 
          onSave={() => handleSave(listing.id)}
        />
      ))}
    </div>
  );
}
```

### Marketplace Search and Filters

```jsx
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { MarketplaceFilters } from '@/components/marketplace/marketplace-filters';
import { MarketplaceTabs } from '@/components/marketplace/marketplace-tabs';

function MarketplaceHeader() {
  return (
    <div className="mb-8">
      <MarketplaceSearch onSearch={handleSearch} />
      <MarketplaceFilters 
        categories={categories}
        priceRange={priceRange}
        onFilterChange={handleFilterChange}
      />
      <MarketplaceTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
```

## Integration with Algolia

Many of these components have been enhanced to work with Algolia search. The integration happens at the page level, with these components receiving data from Algolia's InstantSearch hooks.

## Dependencies

- JobMate UI components (`@/components/ui/*`)
- Lucide React icons
- Next.js Image and Link components
- React hooks for state management
- Optional Algolia integration

## Data Models

These components expect marketplace listings to conform to the `MarketplaceListing` interface defined in `/src/types/marketplace.ts`.
