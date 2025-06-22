"use client";

import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
}

export function MapSearchBar({ 
  searchQuery, 
  onSearchChange, 
  onFilterClick 
}: MapSearchBarProps) {
  return (
    <div className="absolute top-4 left-0 right-0 z-10 px-4 flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search jobs or locations..."
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-white/90 backdrop-blur-sm shadow-md"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 bg-white/90 backdrop-blur-sm shadow-md"
        onClick={onFilterClick}
      >
        <Filter className="h-5 w-5" />
      </Button>
    </div>
  );
}
