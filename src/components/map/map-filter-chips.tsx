"use client";

import { Flame, CheckCircle, Home, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapFilterChipsProps {
  showUrgent: boolean;
  showVerified: boolean;
  showNeighbors: boolean;
  showCategories: boolean;
  onToggleUrgent: () => void;
  onToggleVerified: () => void;
  onToggleNeighbors: () => void;
  onToggleCategories: () => void;
}

export function MapFilterChips({
  showUrgent,
  showVerified,
  showNeighbors,
  showCategories,
  onToggleUrgent,
  onToggleVerified,
  onToggleNeighbors,
  onToggleCategories
}: MapFilterChipsProps) {
  return (
    <div className="absolute top-16 left-0 right-0 z-10 px-4 overflow-x-auto">
      <div className="flex justify-center sm:justify-start gap-2 pb-2">
        <Button 
          variant={showUrgent ? "default" : "outline"}
          size="sm"
          className={`whitespace-nowrap text-xs sm:text-sm h-8 sm:h-10 ${showUrgent ? 'bg-red-500 hover:bg-red-600' : 'bg-white/90 backdrop-blur-sm'}`}
          onClick={onToggleUrgent}
        >
          <Flame className="mr-1 h-4 w-4 text-red-500" />
          Hot
        </Button>
        <Button 
          variant={showVerified ? "default" : "outline"}
          size="sm"
          className={`whitespace-nowrap text-xs sm:text-sm h-8 sm:h-10 ${showVerified ? 'bg-green-500 hover:bg-green-600' : 'bg-white/90 backdrop-blur-sm'}`}
          onClick={onToggleVerified}
        >
          <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
          Verified
        </Button>
        <Button 
          variant={showNeighbors ? "default" : "outline"}
          size="sm"
          className={`whitespace-nowrap text-xs sm:text-sm h-8 sm:h-10 ${showNeighbors ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/90 backdrop-blur-sm'}`}
          onClick={onToggleNeighbors}
        >
          <Home className="mr-1 h-4 w-4 text-orange-500" />
          Neighbors
        </Button>
        <Button 
          variant={showCategories ? "default" : "outline"}
          size="sm"
          className={`whitespace-nowrap text-xs sm:text-sm h-8 sm:h-10 ${showCategories ? 'bg-purple-500 hover:bg-purple-600' : 'bg-white/90 backdrop-blur-sm'}`}
          onClick={onToggleCategories}
        >
          <TagIcon className="mr-1 h-4 w-4 text-purple-800" />
          Categories
        </Button>
      </div>
    </div>
  );
}
