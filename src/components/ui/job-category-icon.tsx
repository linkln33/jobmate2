import React from 'react';
import {
  Wrench,
  Zap,
  BookOpen,
  Pencil,
  Car,
  Truck,
  Leaf,
  Dog,
  Code,
  Terminal,
  Scissors,
  Hammer,
  Package,
  Heart,
  type LucideIcon,
  type LucideProps
} from 'lucide-react';

export type JobCategory = 
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'CLEANING'
  | 'BABYSITTING'
  | 'ELDERLY_CARE'
  | 'TUTORING'
  | 'DRIVING'
  | 'GARDENING'
  | 'PET_SERVICES'
  | 'DESIGN'
  | 'IT_HELP'
  | 'BEAUTY'
  | 'CONSTRUCTION'
  | 'MOVING'
  | 'OTHER';

interface JobCategoryIconProps extends LucideProps {
  category: JobCategory | string;
  useEmoji?: boolean;
}

// Map of category to emoji for text-based representation
export const categoryEmojis: Record<JobCategory, string> = {
  PLUMBING: '🛁',
  ELECTRICAL: '⚡',
  CLEANING: '🧹',
  BABYSITTING: '👶',
  ELDERLY_CARE: '🧓',
  TUTORING: '📚',
  DRIVING: '🚗',
  GARDENING: '🌿',
  PET_SERVICES: '🐶',
  DESIGN: '🎨',
  IT_HELP: '💻',
  BEAUTY: '💇',
  CONSTRUCTION: '👷',
  MOVING: '📦',
  OTHER: '🔧'
};

// Map of category to primary and secondary icons
export const categoryIcons: Record<JobCategory, { primary: LucideIcon, secondary?: LucideIcon }> = {
  PLUMBING: { primary: Wrench },
  ELECTRICAL: { primary: Zap },
  CLEANING: { primary: Wrench }, // Using Wrench as fallback for Broom
  BABYSITTING: { primary: Heart }, // Using Heart as fallback for Baby
  ELDERLY_CARE: { primary: Heart },
  TUTORING: { primary: BookOpen, secondary: Pencil },
  DRIVING: { primary: Car, secondary: Truck },
  GARDENING: { primary: Leaf },
  PET_SERVICES: { primary: Dog },
  DESIGN: { primary: Pencil }, // Using Pencil as fallback for Brush/Palette
  IT_HELP: { primary: Code, secondary: Terminal },
  BEAUTY: { primary: Scissors },
  CONSTRUCTION: { primary: Hammer },
  MOVING: { primary: Package, secondary: Truck },
  OTHER: { primary: Wrench }
};

export function JobCategoryIcon({ category, useEmoji = false, ...props }: JobCategoryIconProps) {
  // Normalize the category string to match our enum format
  const normalizedCategory = category.toUpperCase().replace(/\s+/g, '_') as JobCategory;
  
  // Default to OTHER if category is not recognized
  const safeCategory = Object.keys(categoryIcons).includes(normalizedCategory) 
    ? normalizedCategory 
    : 'OTHER';
  
  if (useEmoji) {
    return <span className="text-xl">{categoryEmojis[safeCategory as JobCategory]}</span>;
  }
  
  const Icon = categoryIcons[safeCategory as JobCategory].primary;
  return <Icon {...props} />;
}

export function JobCategoryBadge({ 
  category, 
  className, 
  ...props 
}: Omit<React.HTMLAttributes<HTMLDivElement>, 'category'> & { 
  category: JobCategory | string;
  className?: string;
}) {
  // Normalize the category string to match our enum format
  const normalizedCategory = category.toUpperCase().replace(/\s+/g, '_') as JobCategory;
  
  // Default to OTHER if category is not recognized
  const safeCategory = Object.keys(categoryIcons).includes(normalizedCategory) 
    ? normalizedCategory 
    : 'OTHER';
  
  const Icon = categoryIcons[safeCategory as JobCategory].primary;
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`} {...props}>
      <Icon className="h-3 w-3" />
      <span>{category.replace(/_/g, ' ')}</span>
    </div>
  );
}
