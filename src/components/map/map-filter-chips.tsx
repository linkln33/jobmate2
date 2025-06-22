"use client";

import { Button } from '@/components/ui/button';

// Import marketplace categories
const MARKETPLACE_CATEGORIES = [
  { id: 'handy-man', name: 'Handy Man', color: '#4CAF50' },  // Green
  { id: 'skilled-jobs', name: 'Skilled Jobs', color: '#2196F3' }, // Blue
  { id: 'digital-plus', name: 'Digital +', color: '#9C27B0' }, // Purple
  { id: 'healthcare', name: 'Healthcare', color: '#F44336' }, // Red
  { id: 'transport', name: 'Transport', color: '#A1887F' }, // Light Brown
  { id: 'other', name: 'Other', color: '#FF9800' }, // Orange
];

interface MapFilterChipsProps {
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  chipStyle?: {
    chipWidth?: string;
    useFullName?: boolean;
    paddingLeft?: string;
    paddingRight?: string;
  };
}


export function MapFilterChips({
  selectedCategories,
  onToggleCategory,
  setSelectedCategories,
  chipStyle
}: MapFilterChipsProps) {
  return (
    <div className="absolute bottom-4 left-0 right-0 z-10 px-4 overflow-x-auto">
      <div className="flex flex-col items-start ml-2">
        <div className="flex gap-1 flex-wrap">
          {/* All categories in one row */}
          {MARKETPLACE_CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            // Get display name based on chipStyle
            const displayName = chipStyle?.useFullName ? category.name : category.name.split(' ')[0];
            
            return (
              <button 
                key={category.id}
                className={`rounded-md flex items-center text-xs transition-all duration-200`}
                style={{
                  backgroundColor: isSelected ? category.color : 'rgba(255,255,255,0.9)',
                  color: isSelected ? 'white' : category.color,
                  borderLeft: `3px solid ${category.color}`,
                  width: chipStyle?.chipWidth || '60px',
                  height: '24px',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  boxShadow: isSelected ? '0 2px 4px rgba(0, 0, 0, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.1)',
                  paddingLeft: chipStyle?.paddingLeft || '6px',
                  paddingRight: chipStyle?.paddingRight || '2px',
                  justifyContent: 'flex-start'
                }}
                onClick={() => onToggleCategory(category.id)}
                title={category.name}
                aria-pressed={isSelected}
              >
                <span 
                  className="h-2 w-2 rounded-full mr-1 flex-shrink-0" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="truncate">{displayName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
