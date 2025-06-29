// Compatibility Score System Types

export type MainCategory = 
  // Original categories
  | 'jobs'
  | 'services'
  | 'rentals'
  | 'marketplace'
  | 'favors'
  | 'holiday'
  | 'art'
  | 'giveaways'
  | 'learning'
  | 'community'
  | 'events'
  
  // Earn money categories
  | 'business'
  | 'digital'
  | 'skilled-trades'
  | 'home-services'
  | 'care-assistance'
  | 'transport'
  | 'education'
  | 'personal'
  | 'outdoor-garden'
  | 'errands'
  | 'niche'
  
  // Hire someone categories
  | 'professional'
  | 'tech-talent'
  | 'creative'
  | 'trade-workers'
  | 'home-help'
  | 'caregivers'
  | 'education-staff'
  | 'hospitality'
  | 'retail-staff'
  | 'drivers'
  | 'admin-support'
  | 'seasonal'
  
  // Sell something categories
  | 'electronics'
  | 'home-goods'
  | 'clothing'
  | 'collectibles'
  | 'sports-equipment'
  | 'toys-games'
  | 'vehicles'
  | 'books-media'
  | 'handmade'
  | 'business-equipment'
  | 'services-offered'
  | 'other-items'
  
  // Rent something categories
  | 'apartments'
  | 'houses'
  | 'rooms'
  | 'vacation-rentals'
  | 'commercial-space'
  | 'event-venues'
  | 'parking-storage'
  | 'equipment-rental'
  | 'vehicle-rental'
  | 'electronics-rental'
  | 'furniture-rental'
  | 'specialty-items'
  
  // Find help/favor categories
  | 'household'
  | 'tech-help'
  | 'pet-care'
  | 'plant-care'
  | 'transportation'
  | 'childcare'
  | 'elder-care'
  | 'tutoring'
  | 'event-help'
  | 'creative-help'
  | 'community-service'
  
  // Explore or learn categories
  | 'academic'
  | 'tech-skills'
  | 'creative-arts'
  | 'business-skills'
  | 'trades-crafts'
  | 'cooking-food'
  | 'fitness-health'
  | 'languages'
  | 'personal-dev'
  | 'hobbies'
  | 'parenting-family'
  | 'specialized-topics'
  
  // Holiday & Travel categories
  | 'beach-resorts'
  | 'city-breaks'
  | 'adventure-travel'
  | 'cultural-tours'
  | 'luxury-travel'
  | 'budget-travel'
  | 'family-trips'
  | 'road-trips'
  | 'cruises'
  | 'wellness-retreats'
  | 'food-wine'
  | 'special-events'
  
  // Just browsing categories
  | 'trending'
  | 'local-events'
  | 'job-market'
  | 'housing'
  | 'learning-resources'
  | 'community-groups'
  | 'creative-showcase'
  | 'travel-destinations'
  | 'deals-discounts'
  | 'new-listings';

// Job subcategories
export type JobSubcategory = 
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'freelance'
  | 'internship'
  | 'remote'
  | 'hybrid'
  | 'on-site';

// Service subcategories
export type ServiceSubcategory = 
  | 'handyman'
  | 'development'
  | 'design'
  | 'writing'
  | 'marketing'
  | 'legal'
  | 'tutoring'
  | 'health'
  | 'events'
  | 'cleaning'
  | 'gardening'
  | 'pet-care'
  | 'moving'
  | 'photography';

// Rental subcategories
export type RentalSubcategory = 
  | 'apartments'
  | 'rooms'
  | 'houses'
  | 'offices'
  | 'event-spaces'
  | 'equipment'
  | 'vehicles'
  | 'party';

// Marketplace subcategories
export type MarketplaceSubcategory = 
  | 'electronics'
  | 'furniture'
  | 'clothing'
  | 'vehicles'
  | 'tools'
  | 'appliances'
  | 'sports'
  | 'media'
  | 'kids'
  | 'collectibles';

// Favor subcategories
export type FavorSubcategory = 
  | 'errands'
  | 'tech-help'
  | 'house-sitting'
  | 'pet-sitting'
  | 'local-advice'
  | 'event-help'
  | 'community'
  | 'companionship';

// Holiday subcategories
export type HolidaySubcategory = 
  | 'tours'
  | 'homestays'
  | 'adventures'
  | 'planning'
  | 'rideshares'
  | 'short-term'
  | 'cultural';

// Art subcategories
export type ArtSubcategory = 
  | 'commissioned'
  | 'music'
  | 'photography'
  | 'crafts'
  | 'writing'
  | 'collaborations'
  | 'digital';

// Giveaway subcategories
export type GiveawaySubcategory = 
  | 'free-items'
  | 'free-services'
  | 'sharing'
  | 'recycle'
  | 'pay-forward';

// Learning subcategories
export type LearningSubcategory = 
  | 'language'
  | 'coding'
  | 'creative'
  | 'exam-prep'
  | 'business'
  | 'wellness';

// Community subcategories
export type CommunitySubcategory = 
  | 'events'
  | 'groups'
  | 'volunteering'
  | 'co-living'
  | 'discussions';

// Union type of all subcategories
export type Subcategory = 
  | JobSubcategory
  | ServiceSubcategory
  | RentalSubcategory
  | MarketplaceSubcategory
  | FavorSubcategory
  | HolidaySubcategory
  | ArtSubcategory
  | GiveawaySubcategory
  | LearningSubcategory
  | CommunitySubcategory;

// Compatibility dimension interface
export interface CompatibilityDimension {
  name: string;
  score: number;
  weight: number;
  description?: string;
}

// Compatibility result interface
export interface CompatibilityResult {
  overallScore: number;
  dimensions: CompatibilityDimension[];
  category: MainCategory;
  subcategory?: Subcategory;
  listingId: string;
  userId: string;
  timestamp: Date;
  primaryMatchReason?: string;
  improvementSuggestions?: string[];
}

// User preferences interface
export interface UserPreferences {
  userId?: string;
  
  // General preference settings
  generalPreferences?: {
    priceImportance: number;
    locationImportance: number;
    qualityImportance: number;
    [key: string]: any;
  };
  
  // Category-specific preferences
  categoryPreferences?: {
    jobs?: JobPreferences;
    services?: ServicePreferences;
    rentals?: RentalPreferences;
    marketplace?: MarketplacePreferences;
    favors?: FavorPreferences;
    holiday?: HolidayPreferences;
    art?: ArtPreferences;
    giveaways?: GiveawayPreferences;
    learning?: LearningPreferences;
    community?: CommunityPreferences;
  };
  
  // Daily intent-based preferences
  dailyPreferences?: {
    intent: string;
    budget?: number;
    location?: string;
    urgency?: number;
    [key: string]: any;
  };
  
  // Weight preferences for compatibility factors
  weights?: {
    [key: string]: number;
  };
}

// Category-specific preference interfaces
export interface JobPreferences {
  desiredSkills: string[];
  minSalary: number;
  maxSalary: number;
  workArrangement: JobSubcategory[] | string;
  experienceLevel: string;
  companySize?: string;
  industries?: string[];
  benefits?: string[];
  workSchedule?: string;
  remotePreference?: boolean;
  [key: string]: any;
}

export interface ServicePreferences {
  serviceTypes: ServiceSubcategory[] | string[];
  minPrice?: number;
  maxPrice: number;
  preferredDistance?: number;
  minProviderRating: number;
  responseTime?: string;
  availability?: string[];
  experienceLevel?: string;
  location?: string;
  paymentMethods?: string[];
  specialRequirements?: string;
  [key: string]: any;
}

export interface RentalPreferences {
  rentalTypes: RentalSubcategory[] | string[];
  minPrice?: number;
  maxPrice: number;
  location?: string;
  minDuration?: number;
  maxDuration?: number;
  requiredAmenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  petFriendly?: boolean;
  furnished?: boolean;
  parking?: boolean;
  utilities?: string[];
  leaseLength?: string;
  moveInDate?: string;
  [key: string]: any;
}

export interface MarketplacePreferences {
  itemTypes: MarketplaceSubcategory[];
  maxPrice: number;
  minCondition?: string;
  maxDistance?: number;
  preferredBrands?: string[];
  [key: string]: any;
}

export interface FavorPreferences {
  favorTypes: FavorSubcategory[];
  maxTimeCommitment?: number;
  maxDistance?: number;
  reciprocityImportance?: number;
  [key: string]: any;
}

export interface HolidayPreferences {
  holidayTypes: HolidaySubcategory[];
  budget?: number;
  preferredDestinations?: string[];
  duration?: number;
  [key: string]: any;
}

export interface ArtPreferences {
  artTypes: ArtSubcategory[];
  budget?: number;
  preferredStyles?: string[];
  [key: string]: any;
}

export interface GiveawayPreferences {
  giveawayTypes: GiveawaySubcategory[];
  maxDistance?: number;
  interests?: string[];
  [key: string]: any;
}

export interface LearningPreferences {
  learningTypes: LearningSubcategory[];
  maxPrice?: number;
  skillLevel?: string;
  format?: string[];
  [key: string]: any;
}

export interface CommunityPreferences {
  communityTypes: CommunitySubcategory[];
  interests?: string[];
  maxDistance?: number;
  frequency?: string;
  [key: string]: any;
}

// Contextual factors that might affect compatibility
export interface ContextualFactors {
  timeOfDay?: string;
  dayOfWeek?: string;
  recentSearches?: string[];
  currentPath?: string;
  userLocation?: {
    lat: number;
    lng: number;
  };
}

// User-adjustable weights for different compatibility factors
export interface WeightPreferences {
  // Job weights
  salary?: number;
  skills?: number;
  location?: number;
  benefits?: number;
  companySize?: number;
  industry?: number;
  workSchedule?: number;
  remoteWork?: number;
  
  // Rental weights
  price?: number;
  propertyType?: number;
  amenities?: number;
  bedrooms?: number;
  bathrooms?: number;
  petFriendly?: number;
  furnished?: number;
  parking?: number;
  leaseLength?: number;
  
  // Service weights
  serviceType?: number;
  providerRating?: number;
  responseTime?: number;
  availability?: number;
  experience?: number;
  paymentMethods?: number;
  
  // General weights
  userPreferences?: number;
  previousInteractions?: number;
  reputation?: number;
  aiTrend?: number;
}
