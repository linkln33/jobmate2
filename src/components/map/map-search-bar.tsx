"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, Tag } from 'lucide-react';
import { JOB_CATEGORIES } from '@/data/job-categories';

interface MapSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories?: string[];
  onCategorySelect?: (categoryId: string) => void;
}

export function MapSearchBar({ 
  searchQuery, 
  onSearchChange,
  selectedCategories = [],
  onCategorySelect = () => {}
}: MapSearchBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Close dropdown when clicking outside
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
  
  const handleFocus = () => {
    setShowDropdown(true);
  };
  
  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
    // Focus back on input after selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <div className="absolute top-4 left-0 right-0 z-10 px-4">
      <div className="w-full relative" ref={dropdownRef}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search jobs, locations, or select a category..."
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-white/90 dark:bg-gray-800/90 dark:border-gray-700 dark:text-white backdrop-blur-sm shadow-md"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={handleFocus}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
        
        {showDropdown && (
          <div className="absolute left-0 right-0 mt-1 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-[9999] max-h-80 overflow-y-auto">
            <div className="py-1">
              <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Categories
              </div>
              <div className="grid grid-cols-2 gap-1 p-2">
                {JOB_CATEGORIES.map((category) => (
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
    </div>
  );
}
