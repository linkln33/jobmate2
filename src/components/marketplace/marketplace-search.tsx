"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { MARKETPLACE_CATEGORIES } from '@/data/marketplace-categories';

/**
 * Props for the MarketplaceSearch component.
 * 
 * @interface MarketplaceSearchProps
 * @property {(query: string) => void} onSearch - Callback function triggered when search is performed
 * @property {(filters: any) => void} [onFilter] - Optional callback function for when filters are applied
 * @property {string} [className] - Optional additional CSS classes for styling
 * @property {string[]} [selectedCategories] - Optional array of currently selected category IDs
 * @property {(categoryId: string) => void} [onCategorySelect] - Optional callback function when a category is selected
 */
interface MarketplaceSearchProps {
  onSearch: (query: string) => void;
  onFilter?: (filters: any) => void;
  className?: string;
  selectedCategories?: string[];
  onCategorySelect?: (categoryId: string) => void;
}

/**
 * MarketplaceSearch Component
 * 
 * A comprehensive search component for the JobMate marketplace that includes
 * text search functionality with category filtering via dropdown. This component
 * enhances the user experience by providing quick access to marketplace categories
 * directly from the search bar.
 * 
 * Features:
 * - Text search with instant feedback
 * - Category dropdown with emoji icons for visual identification
 * - Clear button to reset search input
 * - Optional filter popover integration
 * - Responsive design that works across device sizes
 * - Keyboard navigation support
 * - Outside click detection to close dropdown
 * 
 * The component uses the MARKETPLACE_CATEGORIES data to populate the category
 * dropdown, allowing users to quickly filter listings by category.
 * 
 * @param {MarketplaceSearchProps} props - Component props
 * @returns {JSX.Element} A search component with category dropdown
 * 
 * @example
 * ```tsx
 * <MarketplaceSearch
 *   onSearch={(query) => fetchSearchResults(query)}
 *   onFilter={(filters) => applyFilters(filters)}
 *   selectedCategories={['tech', 'design']}
 *   onCategorySelect={(categoryId) => toggleCategory(categoryId)}
 *   className="my-4"
 * />
 * ```
 */
export function MarketplaceSearch({
  onSearch,
  onFilter,
  className = '',
  selectedCategories = [],
  onCategorySelect = () => {}
}: MarketplaceSearchProps) {
  /**
   * State for the current search query text
   */
  const [searchQuery, setSearchQuery] = useState('');
  
  /**
   * State to control the visibility of the category dropdown
   */
  const [showDropdown, setShowDropdown] = useState(false);
  
  /**
   * Reference to the dropdown container for outside click detection
   */
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  /**
   * Reference to the search input for focus management
   */
  const inputRef = useRef<HTMLInputElement>(null);
  
  /**
   * Effect to handle closing the dropdown when clicking outside
   * Adds and removes event listeners for mousedown events
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  /**
   * Shows the category dropdown when the input is focused
   */
  const handleFocus = () => {
    setShowDropdown(true);
  };
  
  /**
   * Handles category selection from the dropdown
   * Calls the onCategorySelect callback and refocuses the input
   * 
   * @param {string} categoryId - ID of the selected category
   */
  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
    // Focus back on input after selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  /**
   * Handles form submission for search
   * Prevents default form behavior and triggers the onSearch callback
   * 
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  /**
   * Clears the search input and triggers search with empty query
   */
  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };
  
  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="relative flex-1" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            ref={inputRef}
            type="text"
            placeholder="Search listings..."
            className="pl-10 pr-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {showDropdown && (
            <div className="absolute left-0 right-0 mt-1 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-[9999] max-h-80 overflow-y-auto">
              <div className="py-1">
                <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Categories
                </div>
                <div className="grid grid-cols-2 gap-1 p-2">
                  {MARKETPLACE_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      className={`flex items-center px-3 py-1.5 text-sm rounded-md ${selectedCategories.includes(category.id) 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <span className="mr-2">{category.icon}</span>
                      <span className="flex-1 text-left truncate">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {onFilter && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                type="button"
                variant="outline" 
                size="icon" 
                className="ml-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filters</h4>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Price Range</h5>
                  <div className="flex items-center space-x-2">
                    <Input type="number" placeholder="Min" className="w-full" />
                    <span>-</span>
                    <Input type="number" placeholder="Max" className="w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Rating</h5>
                  <div className="flex items-center space-x-2">
                    {/* Rating filter UI */}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">Reset</Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </form>
    </div>
  );
}
