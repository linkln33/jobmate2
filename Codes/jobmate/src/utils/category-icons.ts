import { JOB_CATEGORIES } from '@/data/job-categories';

// Map category IDs to icon names (using Lucide icon names)
export const CATEGORY_ICONS: Record<string, string> = {
  'home-services': 'Home',
  'skilled-trades': 'Hammer',
  'outdoor-garden': 'Flower2',
  'care-assistance': 'Heart',
  'transport': 'Truck',
  'business': 'Briefcase',
  'digital': 'Laptop',
  'education': 'GraduationCap',
  'personal': 'User',
  'errands': 'ShoppingCart',
  'niche': 'Puzzle',
  'community': 'Users'
};

// Map subcategory IDs to icon names (using Lucide icon names)
export const SUBCATEGORY_ICONS: Record<string, string> = {
  // Home Services
  'plumbing': 'Droplet',
  'electrical': 'Zap',
  'hvac': 'Fan',
  'house-cleaning': 'Spray',
  'deep-cleaning': 'Sparkles',
  'carpet-cleaning': 'Brush',
  'window-cleaning': 'Square',
  'pest-control': 'Bug',
  'home-repairs': 'Wrench',
  'handyman': 'Tools',
  'appliance-repair': 'Refrigerator',
  'furniture-assembly': 'Sofa',
  'painting': 'Paintbrush',
  'smart-home': 'Wifi',
  
  // Skilled Trades
  'carpentry': 'Hammer',
  'masonry': 'Building',
  'roofing': 'Home',
  'drywall': 'Square',
  'flooring': 'Layers',
  'welding': 'FlameKindling',
  'locksmith': 'Key',
  'contracting': 'ClipboardCheck',
  'construction': 'HardHat',
  
  // Outdoor & Garden
  'landscaping': 'Flower2',
  'lawn-care': 'Scissors',
  'tree-service': 'TreePine',
  'snow-removal': 'Snowflake',
  'pool-maintenance': 'Waves',
  'fence-repair': 'SplitSquareVertical',
  'gutter-cleaning': 'PipeLine',
  
  // Default
  'default': 'MapPin'
};

/**
 * Get the appropriate icon name for a job based on its category and subcategory
 */
export function getJobIconName(job: { category?: string; subcategory?: string }): string {
  // If the job has a subcategory and we have an icon for it, use that
  if (job.subcategory && SUBCATEGORY_ICONS[job.subcategory]) {
    return SUBCATEGORY_ICONS[job.subcategory];
  }
  
  // If the job has a category and we have an icon for it, use that
  if (job.category && CATEGORY_ICONS[job.category]) {
    return CATEGORY_ICONS[job.category];
  }
  
  // Default icon
  return 'MapPin';
}

/**
 * Get category name by ID
 */
export function getCategoryNameById(categoryId: string): string {
  const category = JOB_CATEGORIES.find(c => c.id === categoryId);
  return category?.name || categoryId;
}

/**
 * Get subcategory name by ID
 */
export function getSubcategoryNameById(subcategoryId: string): string {
  for (const category of JOB_CATEGORIES) {
    const subcategory = category.subcategories.find(s => s.id === subcategoryId);
    if (subcategory) {
      return subcategory.name;
    }
  }
  return subcategoryId;
}
