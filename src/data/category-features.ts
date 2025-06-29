import { MainCategory } from '../types/compatibility';

// Feature flags for category-specific UI components
export interface CategoryFeatures {
  showAvailabilityCalendar: boolean;
  showPriceRange: boolean;
  showSkillSelector: boolean;
  showIndustrySelector: boolean;
  showLocationSelector: boolean;
  showServiceTypeSelector: boolean;
  showExperienceLevel: boolean;
  showRatingFilter: boolean;
  showResponseTimeFilter: boolean;
  showPaymentMethods: boolean;
  showSpecialRequirements: boolean;
  showBenefits: boolean;
  showWorkArrangement: boolean;
  showCompanySize: boolean;
  showVerificationFilter: boolean;
}

// Default features (all disabled)
export const DEFAULT_FEATURES: CategoryFeatures = {
  showAvailabilityCalendar: false,
  showPriceRange: false,
  showSkillSelector: false,
  showIndustrySelector: false,
  showLocationSelector: false,
  showServiceTypeSelector: false,
  showExperienceLevel: false,
  showRatingFilter: false,
  showResponseTimeFilter: false,
  showPaymentMethods: false,
  showSpecialRequirements: false,
  showBenefits: false,
  showWorkArrangement: false,
  showCompanySize: false,
  showVerificationFilter: false,
};

// Interface for intent+category features mapping
export interface IntentCategoryFeatures {
  intentId: string;
  categoryId: string;
  features: CategoryFeatures;
}

// Main data structure for category features
export const CATEGORY_FEATURES: IntentCategoryFeatures[] = [
  // Earn Money + Digital
  {
    intentId: 'earn-money',
    categoryId: 'digital',
    features: {
      ...DEFAULT_FEATURES,
      showAvailabilityCalendar: true,
      showPriceRange: true,
      showSkillSelector: true,
      showIndustrySelector: true,
      showLocationSelector: true,
      showExperienceLevel: true,
      showServiceTypeSelector: true,
      showSpecialRequirements: true,
    }
  },
  
  // Earn Money + Business
  {
    intentId: 'earn-money',
    categoryId: 'business',
    features: {
      ...DEFAULT_FEATURES,
      showAvailabilityCalendar: true,
      showPriceRange: true,
      showSkillSelector: true,
      showIndustrySelector: true,
      showLocationSelector: true,
      showExperienceLevel: true,
      showServiceTypeSelector: true,
    }
  },
  
  // Earn Money + Skilled Trades
  {
    intentId: 'earn-money',
    categoryId: 'skilled-trades',
    features: {
      ...DEFAULT_FEATURES,
      showAvailabilityCalendar: true,
      showPriceRange: true,
      showSkillSelector: true,
      showLocationSelector: true,
      showExperienceLevel: true,
      showServiceTypeSelector: true,
      showVerificationFilter: true,
    }
  },
  
  // Hire Someone + Tech Talent
  {
    intentId: 'hire-someone',
    categoryId: 'tech-talent',
    features: {
      ...DEFAULT_FEATURES,
      showAvailabilityCalendar: true,
      showPriceRange: true,
      showSkillSelector: true,
      showIndustrySelector: true,
      showLocationSelector: true,
      showExperienceLevel: true,
      showRatingFilter: true,
      showResponseTimeFilter: true,
      showVerificationFilter: true,
    }
  },
  
  // Hire Someone + Home Help
  {
    intentId: 'hire-someone',
    categoryId: 'home-help',
    features: {
      ...DEFAULT_FEATURES,
      showAvailabilityCalendar: true,
      showPriceRange: true,
      showServiceTypeSelector: true,
      showLocationSelector: true,
      showRatingFilter: true,
      showResponseTimeFilter: true,
      showVerificationFilter: true,
      showPaymentMethods: true,
    }
  },
  
  // Find Help + Pet Care
  {
    intentId: 'find-help',
    categoryId: 'pet-care',
    features: {
      ...DEFAULT_FEATURES,
      showAvailabilityCalendar: true,
      showPriceRange: true,
      showServiceTypeSelector: true,
      showLocationSelector: true,
      showRatingFilter: true,
      showResponseTimeFilter: true,
      showSpecialRequirements: true,
      showPaymentMethods: true,
    }
  },
  
  // Find Help + Childcare
  {
    intentId: 'find-help',
    categoryId: 'childcare',
    features: {
      ...DEFAULT_FEATURES,
      showAvailabilityCalendar: true,
      showPriceRange: true,
      showServiceTypeSelector: true,
      showLocationSelector: true,
      showRatingFilter: true,
      showVerificationFilter: true,
      showSpecialRequirements: true,
    }
  },
  
  // Rent Something + Equipment
  {
    intentId: 'rent-something',
    categoryId: 'equipment-rental',
    features: {
      ...DEFAULT_FEATURES,
      showAvailabilityCalendar: true,
      showPriceRange: true,
      showServiceTypeSelector: true,
      showLocationSelector: true,
      showPaymentMethods: true,
      showSpecialRequirements: true,
    }
  },
  
  // Just Browsing + Trending
  {
    intentId: 'just-browsing',
    categoryId: 'trending',
    features: {
      ...DEFAULT_FEATURES,
      showLocationSelector: true,
      showServiceTypeSelector: true,
      showRatingFilter: true,
    }
  }
];

// Helper functions

// Get features for a specific intent and category
export function getFeaturesForCategory(intentId: string, categoryId: string): CategoryFeatures {
  const categoryFeatures = CATEGORY_FEATURES.find(
    cf => cf.intentId === intentId && cf.categoryId === categoryId
  );
  
  return categoryFeatures?.features || DEFAULT_FEATURES;
}

// Check if a specific feature is enabled for an intent and category
export function isFeatureEnabled(
  intentId: string, 
  categoryId: string, 
  featureName: keyof CategoryFeatures
): boolean {
  const features = getFeaturesForCategory(intentId, categoryId);
  return features[featureName] || false;
}
