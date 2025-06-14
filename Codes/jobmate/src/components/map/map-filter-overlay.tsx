"use client";

import { useState } from 'react';
import { JOB_CATEGORIES } from '@/data/job-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapFilterOverlayProps {
  onFilterChange: (filters: {
    categories: string[];
    subcategories: string[];
    searchQuery: string;
  }) => void;
  onClose?: () => void;
  className?: string;
}

export function MapFilterOverlay({
  onFilterChange,
  onClose,
  className
}: MapFilterOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    // If category is already selected, remove it
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
      
      // Also remove all subcategories of this category
      const categorySubcategories = JOB_CATEGORIES.find(c => c.id === categoryId)?.subcategories.map(s => s.id) || [];
      setSelectedSubcategories(prev => prev.filter(id => !categorySubcategories.includes(id)));
    } else {
      // Add the category
      setSelectedCategories(prev => [...prev, categoryId]);
    }
    
    // Apply filters
    applyFilters();
  };

  // Toggle subcategory selection
  const toggleSubcategory = (subcategoryId: string, categoryId: string) => {
    if (selectedSubcategories.includes(subcategoryId)) {
      setSelectedSubcategories(prev => prev.filter(id => id !== subcategoryId));
      
      // If this was the last selected subcategory in this category, also deselect the category
      const remainingSubcategoriesInCategory = selectedSubcategories
        .filter(id => id !== subcategoryId)
        .filter(id => {
          const category = JOB_CATEGORIES.find(c => 
            c.subcategories.some(s => s.id === id)
          );
          return category?.id === categoryId;
        });
        
      if (remainingSubcategoriesInCategory.length === 0) {
        setSelectedCategories(prev => prev.filter(id => id !== categoryId));
      }
    } else {
      setSelectedSubcategories(prev => [...prev, subcategoryId]);
      
      // Also select the parent category if not already selected
      if (!selectedCategories.includes(categoryId)) {
        setSelectedCategories(prev => [...prev, categoryId]);
      }
    }
    
    // Apply filters
    applyFilters();
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      searchQuery
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSearchQuery('');
    onFilterChange({
      categories: [],
      subcategories: [],
      searchQuery: ''
    });
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-h-[80vh] overflow-y-auto",
      className
    )}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Jobs & Services</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
      
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search jobs or services..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1"
          />
          <Button type="submit" variant="default" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
      
      {/* Selected filters */}
      {(selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Selected Filters</h4>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(categoryId => {
              const category = JOB_CATEGORIES.find(c => c.id === categoryId);
              if (!category) return null;
              
              return (
                <Badge key={categoryId} variant="outline" className="bg-primary/10">
                  {category.icon} {category.name}
                  <button 
                    onClick={() => toggleCategory(categoryId)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            
            {selectedSubcategories.map(subcategoryId => {
              let subcategoryName = '';
              let categoryId = '';
              
              for (const category of JOB_CATEGORIES) {
                const subcategory = category.subcategories.find(s => s.id === subcategoryId);
                if (subcategory) {
                  subcategoryName = subcategory.name;
                  categoryId = category.id;
                  break;
                }
              }
              
              if (!subcategoryName) return null;
              
              return (
                <Badge key={subcategoryId} variant="outline" className="bg-secondary/10">
                  {subcategoryName}
                  <button 
                    onClick={() => toggleSubcategory(subcategoryId, categoryId)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Categories */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium mb-2">Categories</h4>
        {JOB_CATEGORIES.map(category => (
          <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <div 
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => toggleCategoryExpansion(category.id)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleCategory(category.id);
                  }}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor={`category-${category.id}`} className="flex items-center cursor-pointer">
                  <span className="mr-2">{category.icon}</span>
                  <span>{category.name}</span>
                </label>
              </div>
              <div>
                {expandedCategories.includes(category.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
            
            {/* Subcategories */}
            {expandedCategories.includes(category.id) && (
              <div className="p-3 pt-0 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {category.subcategories.map(subcategory => (
                    <div key={subcategory.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`subcategory-${subcategory.id}`}
                        checked={selectedSubcategories.includes(subcategory.id)}
                        onChange={() => toggleSubcategory(subcategory.id, category.id)}
                        className="mr-2 h-4 w-4"
                      />
                      <label 
                        htmlFor={`subcategory-${subcategory.id}`}
                        className="text-sm cursor-pointer truncate"
                      >
                        {subcategory.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Apply button */}
      <div className="mt-4">
        <Button onClick={applyFilters} className="w-full">
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
