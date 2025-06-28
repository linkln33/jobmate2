// Compatibility Score System Types

export type MainCategory = 
  | 'jobs'
  | 'services'
  | 'rentals'
  | 'marketplace'
  | 'favors'
  | 'holiday'
  | 'art'
  | 'giveaways'
  | 'learning'
  | 'community';

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
  userId: string;
  generalPreferences: {
    priceImportance: number;
    locationImportance: number;
    qualityImportance: number;
    [key: string]: any;
  };
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
  dailyPreferences?: {
    intent: string;
    budget?: number;
    location?: string;
    urgency?: number;
    [key: string]: any;
  };
  weightPreferences?: WeightPreferences;
}

// Category-specific preference interfaces
export interface JobPreferences {
  desiredSkills: string[];
  minSalary: number;
  maxSalary: number;
  workArrangement: JobSubcategory[];
  experienceLevel: string;
  [key: string]: any;
}

export interface ServicePreferences {
  serviceTypes: ServiceSubcategory[];
  maxPrice: number;
  preferredDistance: number;
  minProviderRating: number;
  [key: string]: any;
}

export interface RentalPreferences {
  rentalTypes: RentalSubcategory[];
  maxPrice: number;
  location: string;
  minDuration: number;
  maxDuration: number;
  requiredAmenities: string[];
  [key: string]: any;
}

export interface MarketplacePreferences {
  itemTypes: MarketplaceSubcategory[];
  maxPrice: number;
  minCondition: string;
  maxDistance: number;
  preferredBrands: string[];
  [key: string]: any;
}

export interface FavorPreferences {
  favorTypes: FavorSubcategory[];
  maxTimeCommitment: number;
  maxDistance: number;
  reciprocityImportance: number;
  [key: string]: any;
}

export interface HolidayPreferences {
  holidayTypes: HolidaySubcategory[];
  budget: number;
  preferredDestinations: string[];
  duration: number;
  [key: string]: any;
}

export interface ArtPreferences {
  artTypes: ArtSubcategory[];
  budget: number;
  preferredStyles: string[];
  [key: string]: any;
}

export interface GiveawayPreferences {
  giveawayTypes: GiveawaySubcategory[];
  maxDistance: number;
  interests: string[];
  [key: string]: any;
}

export interface LearningPreferences {
  learningTypes: LearningSubcategory[];
  maxPrice: number;
  skillLevel: string;
  format: string[];
  [key: string]: any;
}

export interface CommunityPreferences {
  communityTypes: CommunitySubcategory[];
  interests: string[];
  maxDistance: number;
  frequency: string;
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
  skills: number;       // Weight for skills/tags match
  location: number;     // Weight for location proximity
  availability: number; // Weight for availability match
  price: number;        // Weight for price expectation match
  userPreferences: number; // Weight for user preferences match
  previousInteractions: number; // Weight for previous interactions
  reputation: number;   // Weight for reputation/affinity score
  aiTrend: number;      // Weight for AI trend boost
}
