"use client";

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';

interface MarketplaceSearchProps {
  onSearch: (query: string) => void;
  onFilter?: (filters: any) => void;
  className?: string;
}

export function MarketplaceSearch({
  onSearch,
  onFilter,
  className = ''
}: MarketplaceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };
  
  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input 
            type="text"
            placeholder="Search listings..."
            className="pl-10 pr-10 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
