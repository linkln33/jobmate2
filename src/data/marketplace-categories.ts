/**
 * Represents a subcategory within a marketplace category.
 * 
 * Subcategories provide more specific classification of listings within a parent category,
 * allowing for more precise filtering and organization of marketplace content.
 * 
 * @interface MarketplaceSubcategory
 * @property {string} id - Unique identifier for the subcategory
 * @property {string} name - Display name of the subcategory
 * @property {string} [description] - Optional description of the subcategory
 * @property {string} [icon] - Optional emoji or icon identifier for the subcategory
 */
export interface MarketplaceSubcategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

/**
 * Represents a top-level category in the marketplace.
 * 
 * Categories are used to organize listings into logical groups, each with its own
 * set of subcategories. Categories are displayed with emoji icons in the UI for
 * better visual identification.
 * 
 * @interface MarketplaceCategory
 * @property {string} id - Unique identifier for the category
 * @property {string} name - Display name of the category
 * @property {string} icon - Emoji or icon identifier for visual representation
 * @property {string} [description] - Optional description of the category
 * @property {MarketplaceSubcategory[]} subcategories - Array of subcategories within this category
 */
export interface MarketplaceCategory {
  id: string;
  name: string;
  icon: string; // Emoji or icon name
  description?: string;
  subcategories: MarketplaceSubcategory[];
}

/**
 * Comprehensive list of marketplace categories and their subcategories.
 * 
 * This constant defines the complete category structure used throughout the JobMate
 * marketplace. Each category includes an emoji icon for visual identification and
 * a set of related subcategories.
 * 
 * Categories cover various service domains including:
 * - Home Services
 * - Skilled Trades
 * - Outdoor & Garden
 * - Transport & Driving
 * - Digital & Creative
 * - Personal & Lifestyle
 * - Care & Assistance
 * - Education & Learning
 * - Events & Entertainment
 * - Business Services
 * 
 * This data structure is used for:
 * - Populating category dropdowns in search components
 * - Filtering marketplace listings
 * - Organizing the marketplace browsing experience
 * - Tagging and categorizing user listings
 * 
 * @type {MarketplaceCategory[]}
 */
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

/**
 * Helper function to get all subcategories flattened into a single array.
 * 
 * This utility function extracts all subcategories from all parent categories
 * and returns them as a single flat array, which is useful for search functionality,
 * dropdown population, and other UI components that need access to all subcategories.
 * 
 * @returns {MarketplaceSubcategory[]} A flattened array of all subcategories across all categories
 * 
 * @example
 * ```typescript
 * const allSubcategories = getAllSubcategories();
 * // Use for populating a complete subcategory dropdown
 * const subcategoryOptions = allSubcategories.map(sub => ({
 *   value: sub.id,
 *   label: sub.name
 * }));
 * ```
 */
export function getAllSubcategories(): MarketplaceSubcategory[] {
  return MARKETPLACE_CATEGORIES.flatMap(category => 
    category.subcategories.map(subcategory => ({
      ...subcategory,
      categoryId: category.id
    }))
  );
}

/**
 * Helper function to find a parent category by a subcategory ID.
 * 
 * This function searches through all categories to find the one containing
 * the specified subcategory ID. Useful for determining the parent category
 * when only the subcategory ID is known.
 * 
 * @param {string} subcategoryId - The ID of the subcategory to search for
 * @returns {MarketplaceCategory | undefined} The parent category if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * // Find which category contains the 'web-development' subcategory
 * const parentCategory = findCategoryBySubcategory('web-development');
 * if (parentCategory) {
 *   console.log(`Web Development belongs to ${parentCategory.name}`);
 * }
 * ```
 */
export function findCategoryBySubcategory(subcategoryId: string): MarketplaceCategory | undefined {
  return MARKETPLACE_CATEGORIES.find(category => 
    category.subcategories.some(sub => sub.id === subcategoryId)
  );
}

/**
 * Helper function to get a subcategory by its ID.
 * 
 * This function searches through all categories and their subcategories
 * to find and return the subcategory with the matching ID.
 * 
 * @param {string} id - The ID of the subcategory to retrieve
 * @returns {MarketplaceSubcategory | undefined} The subcategory if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * // Get details about the 'graphic-design' subcategory
 * const graphicDesign = getSubcategoryById('graphic-design');
 * if (graphicDesign) {
 *   console.log(`Found: ${graphicDesign.name}`);
 * }
 * ```
 */
export function getSubcategoryById(id: string): MarketplaceSubcategory | undefined {
  for (const category of MARKETPLACE_CATEGORIES) {
    const subcategory = category.subcategories.find(sub => sub.id === id);
    if (subcategory) return subcategory;
  }
  return undefined;
}
