import { MainCategory } from './compatibility';

export interface IntentOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  categories: MainCategory[];
}

export const INTENT_OPTIONS: IntentOption[] = [
  {
    id: 'earn-money',
    name: 'Earn some money',
    icon: '💰',
    description: 'Find opportunities to earn income through jobs, gigs, or services',
    categories: [
      'business', 'digital', 'skilled-trades', 'home-services', 
      'care-assistance', 'transport', 'education', 'personal', 
      'outdoor-garden', 'errands', 'niche'
    ]
  },
  {
    id: 'hire-someone',
    name: 'Hire someone',
    icon: '👥',
    description: 'Find talent or help for your projects, business, or personal needs',
    categories: [
      'professional', 'tech-talent', 'creative', 'trade-workers', 
      'home-help', 'caregivers', 'education-staff', 'hospitality', 
      'retail-staff', 'drivers', 'admin-support', 'seasonal'
    ]
  },
  {
    id: 'sell-something',
    name: 'Sell something',
    icon: '🏷️',
    description: 'List items or products you want to sell to others',
    categories: [
      'electronics', 'home-goods', 'clothing', 'collectibles', 
      'sports-equipment', 'toys-games', 'vehicles', 'books-media',
      'handmade', 'business-equipment', 'services-offered', 'other-items'
    ]
  },
  {
    id: 'rent-something',
    name: 'Rent something',
    icon: '🔑',
    description: 'List property, equipment, or items available for rent',
    categories: [
      'apartments', 'houses', 'rooms', 'vacation-rentals', 
      'commercial-space', 'event-venues', 'parking-storage', 
      'equipment-rental', 'vehicle-rental', 'electronics-rental',
      'furniture-rental', 'specialty-items'
    ]
  },
  {
    id: 'find-help',
    name: 'Find help/favor',
    icon: '🤝',
    description: 'Get assistance with tasks, errands, or specific needs',
    categories: [
      'household', 'tech-help', 'pet-care', 'plant-care', 
      'transportation', 'childcare', 'elder-care', 'tutoring', 
      'event-help', 'creative-help', 'community-service'
    ]
  },
  {
    id: 'explore-learn',
    name: 'Explore or learn',
    icon: '🔍',
    description: 'Discover new skills, knowledge, or educational opportunities',
    categories: [
      'academic', 'tech-skills', 'creative-arts', 'business-skills', 
      'trades-crafts', 'cooking-food', 'fitness-health', 'languages', 
      'personal-dev', 'hobbies', 'parenting-family', 'specialized-topics'
    ]
  },
  {
    id: 'holiday-travel',
    name: 'Holiday & Travel',
    icon: '✈️',
    description: 'Find travel services, accommodations, or experiences',
    categories: [
      'beach-resorts', 'city-breaks', 'adventure-travel', 'cultural-tours', 
      'luxury-travel', 'budget-travel', 'family-trips', 'road-trips', 
      'cruises', 'wellness-retreats', 'food-wine', 'special-events'
    ]
  },
  {
    id: 'just-browsing',
    name: 'Just browsing',
    icon: '👀',
    description: 'Explore what\'s available without a specific goal in mind',
    categories: [
      'trending', 'local-events', 'job-market', 'housing', 
      'learning-resources', 'community-groups', 'creative-showcase', 
      'travel-destinations', 'deals-discounts', 'new-listings'
    ]
  }
];

// Helper function to get an intent by ID
export function getIntentById(id: string): IntentOption | undefined {
  return INTENT_OPTIONS.find(intent => intent.id === id);
}

// Helper function to get categories for an intent
export function getCategoriesForIntent(intentId: string): MainCategory[] {
  const intent = getIntentById(intentId);
  return intent ? intent.categories : [];
}
