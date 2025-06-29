import { MainCategory } from '../types/compatibility';
import { IntentOption } from '../types/intent';

// Interface for category details
export interface CategoryDetail {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories?: CategoryDetail[];
}

// Interface for mapping intent to categories
export interface IntentCategoryMapping {
  intentId: string;
  categories: CategoryDetail[];
}

// Main category mapping data
export const INTENT_CATEGORY_MAPPING: IntentCategoryMapping[] = [
  {
    intentId: 'earn-money',
    categories: [
      {
        id: 'digital',
        name: 'Digital & Creative',
        description: 'Offer digital and creative services',
        icon: '💻',
        subcategories: [
          { id: 'web-development', name: 'Web Development', description: 'Create and maintain websites', icon: '🌐' },
          { id: 'design', name: 'Design', description: 'Graphic, UI/UX, and visual design services', icon: '🎨' },
          { id: 'content', name: 'Content Creation', description: 'Writing, editing, and content production', icon: '✍️' },
          { id: 'marketing', name: 'Digital Marketing', description: 'SEO, SEM, and social media marketing', icon: '📊' },
          { id: 'video', name: 'Video & Animation', description: 'Video editing and animation services', icon: '🎬' },
          { id: 'development', name: 'Software Development', description: 'Programming and app development', icon: '👨‍💻' }
        ]
      },
      {
        id: 'business',
        name: 'Business Services',
        description: 'Offer professional business services',
        icon: '💼',
        subcategories: [
          { id: 'administrative', name: 'Administrative', description: 'Virtual assistance and admin support', icon: '📋' },
          { id: 'financial', name: 'Financial Services', description: 'Bookkeeping, accounting, and financial analysis', icon: '📈' },
          { id: 'business-consulting', name: 'Business Consulting', description: 'Business strategy and operations', icon: '🤝' },
          { id: 'hr', name: 'HR Services', description: 'Recruiting and HR management', icon: '👥' },
          { id: 'sales', name: 'Sales Support', description: 'Lead generation and sales assistance', icon: '📞' },
          { id: 'legal', name: 'Legal Services', description: 'Legal research and document preparation', icon: '⚖️' }
        ]
      },
      {
        id: 'skilled-trades',
        name: 'Skilled Trades',
        description: 'Offer skilled trade services',
        icon: '🔧',
        subcategories: [
          { id: 'construction', name: 'Construction', description: 'Building and construction services', icon: '🏗️' },
          { id: 'electrical', name: 'Electrical', description: 'Electrical installation and repair', icon: '⚡' },
          { id: 'plumbing', name: 'Plumbing', description: 'Plumbing installation and repair', icon: '🚿' },
          { id: 'carpentry', name: 'Carpentry', description: 'Woodworking and furniture making', icon: '🪚' },
          { id: 'painting', name: 'Painting', description: 'Interior and exterior painting', icon: '🖌️' },
          { id: 'hvac', name: 'HVAC', description: 'Heating, ventilation, and air conditioning', icon: '❄️' }
        ]
      },
      // Additional categories omitted for brevity
    ]
  },
  {
    intentId: 'hire-someone',
    categories: [
      {
        id: 'tech-talent',
        name: 'Tech Talent',
        description: 'Find technology professionals',
        icon: '💻',
        subcategories: [
          { id: 'developers', name: 'Developers', description: 'Software and web developers', icon: '👨‍💻' },
          { id: 'designers', name: 'Designers', description: 'UI/UX and graphic designers', icon: '🎨' },
          { id: 'data-specialists', name: 'Data Specialists', description: 'Data scientists and analysts', icon: '📊' },
          { id: 'devops', name: 'DevOps Engineers', description: 'Infrastructure and deployment specialists', icon: '🔄' },
          { id: 'security', name: 'Security Specialists', description: 'Cybersecurity professionals', icon: '🔒' },
          { id: 'product-managers', name: 'Product Managers', description: 'Digital product management', icon: '📱' }
        ]
      },
      {
        id: 'home-help',
        name: 'Home Services',
        description: 'Find help for your home',
        icon: '🏠',
        subcategories: [
          { id: 'cleaning', name: 'Cleaning', description: 'Home cleaning services', icon: '🧹' },
          { id: 'maintenance', name: 'Maintenance', description: 'General home maintenance', icon: '🔧' },
          { id: 'renovation', name: 'Renovation', description: 'Home improvement and renovation', icon: '🏗️' },
          { id: 'outdoor', name: 'Outdoor', description: 'Landscaping and garden care', icon: '🌱' },
          { id: 'specialty', name: 'Specialty', description: 'Specialized home services', icon: '🔍' }
        ]
      },
      // Additional categories omitted for brevity
    ]
  },
  {
    intentId: 'find-help',
    categories: [
      {
        id: 'pet-care',
        name: 'Pet Care',
        description: 'Find help with your pets',
        icon: '🐾',
        subcategories: [
          { id: 'dog-walking', name: 'Dog Walking', description: 'Dog walking services', icon: '🐕' },
          { id: 'pet-sitting', name: 'Pet Sitting', description: 'In-home pet care', icon: '🏠' },
          { id: 'pet-transportation', name: 'Pet Transportation', description: 'Pet transport services', icon: '🚗' },
          { id: 'pet-grooming', name: 'Pet Grooming', description: 'Grooming and bathing', icon: '✂️' },
          { id: 'pet-training', name: 'Pet Training', description: 'Behavior and obedience training', icon: '🦮' },
          { id: 'specialty-care', name: 'Specialty Care', description: 'Special needs pet care', icon: '💊' }
        ]
      },
      {
        id: 'childcare',
        name: 'Childcare',
        description: 'Find childcare services',
        icon: '👶',
        subcategories: [
          { id: 'babysitting', name: 'Babysitting', description: 'Occasional childcare', icon: '🧸' },
          { id: 'nanny', name: 'Nanny Services', description: 'Regular childcare', icon: '👩‍👧' },
          { id: 'tutoring', name: 'Tutoring', description: 'Educational support', icon: '📚' },
          { id: 'activities', name: 'Activities', description: 'Enrichment and activities', icon: '🎭' },
          { id: 'transportation', name: 'Transportation', description: 'Child transportation services', icon: '🚗' },
          { id: 'special-needs', name: 'Special Needs', description: 'Special needs childcare', icon: '❤️' }
        ]
      },
      // Additional categories omitted for brevity
    ]
  },
  {
    intentId: 'just-browsing',
    categories: [
      {
        id: 'trending',
        name: 'Trending',
        description: 'Explore popular categories and services',
        icon: '🔥',
        subcategories: [
          { id: 'popular-services', name: 'Popular Services', description: 'Most booked services', icon: '⭐' },
          { id: 'trending-skills', name: 'Trending Skills', description: 'In-demand skills', icon: '📈' },
          { id: 'seasonal', name: 'Seasonal Opportunities', description: 'Season-specific services', icon: '🍂' },
          { id: 'local', name: 'Local Highlights', description: 'Services in your area', icon: '📍' },
          { id: 'deals', name: 'Special Deals', description: 'Limited-time offers', icon: '🏷️' },
          { id: 'featured', name: 'Featured Profiles', description: 'Highlighted service providers', icon: '👤' }
        ]
      },
      // Additional categories omitted for brevity
    ]
  }
  // Other intent categories omitted for brevity
];

// Helper functions

// Get categories for a specific intent
export function getCategoriesForIntent(intentId: string): CategoryDetail[] {
  const mapping = INTENT_CATEGORY_MAPPING.find(m => m.intentId === intentId);
  return mapping ? mapping.categories : [];
}

// Get subcategories for a specific category within an intent
export function getSubcategoriesForCategory(intentId: string, categoryId: string): CategoryDetail[] | undefined {
  const categories = getCategoriesForIntent(intentId);
  const category = categories.find(c => c.id === categoryId);
  return category?.subcategories;
}

// Get a specific category by ID within an intent
export function getCategoryById(intentId: string, categoryId: string): CategoryDetail | undefined {
  const categories = getCategoriesForIntent(intentId);
  return categories.find(c => c.id === categoryId);
}

// Get a specific subcategory by ID within a category and intent
export function getSubcategoryById(intentId: string, categoryId: string, subcategoryId: string): CategoryDetail | undefined {
  const subcategories = getSubcategoriesForCategory(intentId, categoryId);
  return subcategories?.find(sc => sc.id === subcategoryId);
}
