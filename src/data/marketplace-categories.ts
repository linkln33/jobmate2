export interface MarketplaceSubcategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  icon: string; // Emoji or icon name
  description?: string;
  subcategories: MarketplaceSubcategory[];
}

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
  {
    id: 'skilled-trades',
    name: 'Skilled Trades',
    icon: '🔧',
    description: 'Professional skilled trade services',
    subcategories: [
      { id: 'plumbing', name: 'Plumbing' },
      { id: 'electrical', name: 'Electrical' },
      { id: 'carpentry', name: 'Carpentry' },
      { id: 'painting', name: 'Painting' },
      { id: 'roofing', name: 'Roofing' }
    ]
  },
  {
    id: 'outdoor-garden',
    name: 'Outdoor & Garden',
    icon: '🌱',
    description: 'Outdoor and garden services',
    subcategories: [
      { id: 'landscaping', name: 'Landscaping' },
      { id: 'lawn-care', name: 'Lawn Care' },
      { id: 'gardening', name: 'Gardening' },
      { id: 'tree-service', name: 'Tree Service' }
    ]
  },
  {
    id: 'transport-driving',
    name: 'Transport & Driving',
    icon: '🚗',
    description: 'Transportation and driving services',
    subcategories: [
      { id: 'moving', name: 'Moving Services' },
      { id: 'delivery', name: 'Delivery' },
      { id: 'rideshare', name: 'Rideshare' },
      { id: 'furniture-delivery', name: 'Furniture Delivery' }
    ]
  },
  {
    id: 'digital-creative',
    name: 'Digital & Creative',
    icon: '💻',
    description: 'Digital and creative services',
    subcategories: [
      { id: 'web-development', name: 'Web Development' },
      { id: 'graphic-design', name: 'Graphic Design' },
      { id: 'content-writing', name: 'Content Writing' },
      { id: 'video-editing', name: 'Video Editing' }
    ]
  },
  {
    id: 'personal-lifestyle',
    name: 'Personal & Lifestyle',
    icon: '💆',
    description: 'Personal and lifestyle services',
    subcategories: [
      { id: 'personal-training', name: 'Personal Training' },
      { id: 'beauty', name: 'Beauty Services' },
      { id: 'wellness', name: 'Wellness' },
      { id: 'nutrition', name: 'Nutrition' }
    ]
  },
  {
    id: 'care-assistance',
    name: 'Care & Assistance',
    icon: '👨‍⚕️',
    description: 'Care and assistance services',
    subcategories: [
      { id: 'childcare', name: 'Childcare' },
      { id: 'senior-care', name: 'Senior Care' },
      { id: 'pet-care', name: 'Pet Care' },
      { id: 'healthcare', name: 'Healthcare' }
    ]
  },
  {
    id: 'business-services',
    name: 'Business Services',
    icon: '💼',
    description: 'Business and professional services',
    subcategories: [
      { id: 'consulting', name: 'Consulting' },
      { id: 'accounting', name: 'Accounting' },
      { id: 'legal', name: 'Legal Services' },
      { id: 'marketing', name: 'Marketing' }
    ]
  },
  {
    id: 'education-coaching',
    name: 'Education & Coaching',
    icon: '🎓',
    description: 'Education and coaching services',
    subcategories: [
      { id: 'tutoring', name: 'Tutoring' },
      { id: 'language', name: 'Language Learning' },
      { id: 'career-coaching', name: 'Career Coaching' },
      { id: 'life-coaching', name: 'Life Coaching' }
    ]
  },
  {
    id: 'errands-daily-help',
    name: 'Errands & Daily Help',
    icon: '🛒',
    description: 'Help with errands and daily tasks',
    subcategories: [
      { id: 'grocery-shopping', name: 'Grocery Shopping' },
      { id: 'personal-assistant', name: 'Personal Assistant' },
      { id: 'waiting-in-line', name: 'Waiting in Line' },
      { id: 'pickup-dropoff', name: 'Pickup & Dropoff' }
    ]
  },
  {
    id: 'niche-services',
    name: 'Niche Services',
    icon: '🔍',
    description: 'Specialized niche services',
    subcategories: [
      { id: 'event-planning', name: 'Event Planning' },
      { id: 'photography', name: 'Photography' },
      { id: 'music-lessons', name: 'Music Lessons' },
      { id: 'custom-crafts', name: 'Custom Crafts' }
    ]
  },
  {
    id: 'community-services',
    name: 'Community Services',
    icon: '🤝',
    description: 'Community-oriented services',
    subcategories: [
      { id: 'volunteer', name: 'Volunteer Work' },
      { id: 'community-events', name: 'Community Events' },
      { id: 'neighborhood-help', name: 'Neighborhood Help' },
      { id: 'local-groups', name: 'Local Groups' }
    ]
  }
];

// Helper function to get all subcategories flattened
export function getAllSubcategories(): MarketplaceSubcategory[] {
  return MARKETPLACE_CATEGORIES.flatMap(category => 
    category.subcategories.map(subcategory => ({
      ...subcategory,
      categoryId: category.id
    }))
  );
}

// Helper function to find a category by subcategory id
export function findCategoryBySubcategory(subcategoryId: string): MarketplaceCategory | undefined {
  return MARKETPLACE_CATEGORIES.find(category => 
    category.subcategories.some(sub => sub.id === subcategoryId)
  );
}

// Helper function to get a subcategory by id
export function getSubcategoryById(id: string): MarketplaceSubcategory | undefined {
  for (const category of MARKETPLACE_CATEGORIES) {
    const subcategory = category.subcategories.find(sub => sub.id === id);
    if (subcategory) return subcategory;
  }
  return undefined;
}
