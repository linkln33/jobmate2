# Data Files

This directory contains static data files used throughout the JobMate application. These files provide structured data for categories, listings, configuration options, and mock data for development and testing.

## Overview

The data files serve several important purposes:

1. **Configuration data** - Define application settings and options
2. **Reference data** - Provide standardized lists and taxonomies
3. **Mock data** - Supply realistic data for development and testing
4. **Content data** - Store structured content for UI components

## Available Data Files

### Categories and Classifications

- `marketplace-categories.ts` - Defines the marketplace categories with emoji icons, names, and subcategories
- `job-categories.ts` - Job categories and their associated metadata
- `category-mapping.ts` - Maps between different category classification systems
- `service-types.ts` - Types of services offered on the platform
- `category-features.ts` - Features associated with different categories

### UI Content

- `onboarding-steps.tsx` - Steps and content for the onboarding wizard
- `suggested-skills.ts` - Predefined skills for user selection and autocomplete

### Mock Data

- `mock-data.ts` - General mock data for various entities
- `marketplace-listings.ts` - Sample marketplace listings for development
- `mock-marketplace-map-data.ts` - Geospatial data for map visualization testing

## Usage Examples

### Importing Category Data

```tsx
import { MARKETPLACE_CATEGORIES } from '@/data/marketplace-categories';

function CategorySelector() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {MARKETPLACE_CATEGORIES.map((category) => (
        <button key={category.id} className="category-button">
          <span className="category-icon">{category.icon}</span>
          <span className="category-name">{category.name}</span>
        </button>
      ))}
    </div>
  );
}
```

### Using Onboarding Steps

```tsx
import { ONBOARDING_STEPS } from '@/data/onboarding-steps';

function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = ONBOARDING_STEPS[currentStep];
  
  return (
    <div className="onboarding-wizard">
      <h2>{step.title}</h2>
      <p>{step.description}</p>
      {step.component}
      <button onClick={() => setCurrentStep(currentStep + 1)}>
        Next Step
      </button>
    </div>
  );
}
```

### Working with Mock Data

```tsx
import { MOCK_LISTINGS } from '@/data/marketplace-listings';

function DevelopmentPreview() {
  return (
    <div className="preview-grid">
      {MOCK_LISTINGS.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
```

## Data Structure Examples

### Marketplace Categories

```typescript
export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    id: 'home-services',
    name: 'Home Services',
    icon: '🏠',
    description: 'Services for home maintenance, cleaning, and repairs',
    subcategories: [
      { id: 'house-cleaning', name: 'House Cleaning' },
      { id: 'deep-cleaning', name: 'Deep Cleaning' },
      { id: 'home-repairs', name: 'Home Repairs' },
      { id: 'handyman', name: 'Handyman Services' },
      { id: 'appliance-repair', name: 'Appliance Repair' }
    ]
  },
  // Additional categories...
];
```

### Onboarding Steps

```tsx
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to JobMate',
    description: 'Let\'s get you set up in just a few steps',
    component: <WelcomeStep />
  },
  {
    id: 'profile',
    title: 'Create Your Profile',
    description: 'Tell us about yourself',
    component: <ProfileStep />
  },
  // Additional steps...
];
```

## Best Practices

When working with data files:

1. **Keep data files focused** - Each file should have a single, clear purpose
2. **Use TypeScript interfaces** - Define clear types for all data structures
3. **Add documentation** - Include JSDoc comments explaining the purpose and structure
4. **Consider internationalization** - For text content, consider i18n needs
5. **Optimize for bundle size** - Large data files should be loaded asynchronously

## Data vs. API

These static data files are different from dynamic data fetched from APIs:

- Static data files are bundled with the application
- They don't change without a code deployment
- They're suitable for reference data that rarely changes
- For frequently changing data, use API endpoints instead

## Environment-Specific Data

Some data files may have environment-specific variations:

- Development mock data
- Production configuration data
- Testing fixtures

Use environment variables or build-time configuration to manage these variations.
