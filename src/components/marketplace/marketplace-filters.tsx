"use client";

import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  ArrowDownUp, 
  MapPin, 
  DollarSign, 
  Clock 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface FilterOptions {
  distance?: number;
  priceMin?: number;
  priceMax?: number;
  newlyListed?: boolean;
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'distance';
}

interface MarketplaceFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

export function MarketplaceFilters({
  onFilterChange,
  className = ''
}: MarketplaceFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    distance: 25,
    priceMin: 0,
    priceMax: 1000,
    newlyListed: false,
    sortBy: 'newest'
  });
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    
    // Update active filters badges
    updateActiveFiltersBadges(key, value);
  };
  
  const updateActiveFiltersBadges = (key: keyof FilterOptions, value: any) => {
    const newActiveFilters = [...activeFilters];
    
    // Remove existing filter of same type
    const existingIndex = newActiveFilters.findIndex(f => f.startsWith(`${key}:`));
    if (existingIndex !== -1) {
      newActiveFilters.splice(existingIndex, 1);
    }
    
    // Add new filter if it has a value
    if (value) {
      switch(key) {
        case 'distance':
          newActiveFilters.push(`distance: ${value} miles`);
          break;
        case 'priceMin':
        case 'priceMax':
          // Only add price range if both min and max are set
          if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
            const existingPriceIndex = newActiveFilters.findIndex(f => f.startsWith('price:'));
            if (existingPriceIndex !== -1) {
              newActiveFilters.splice(existingPriceIndex, 1);
            }
            newActiveFilters.push(`price: $${filters.priceMin} - $${filters.priceMax}`);
          }
          break;
        case 'newlyListed':
          if (value === true) {
            newActiveFilters.push('newly listed');
          }
          break;
        case 'sortBy':
          newActiveFilters.push(`sort: ${value}`);
          break;
      }
    }
    
    setActiveFilters(newActiveFilters);
  };
  
  const clearFilter = (filter: string) => {
    const newActiveFilters = activeFilters.filter(f => f !== filter);
    setActiveFilters(newActiveFilters);
    
    // Reset the corresponding filter value
    if (filter.startsWith('distance:')) {
      handleFilterChange('distance', undefined);
    } else if (filter.startsWith('price:')) {
      handleFilterChange('priceMin', undefined);
      handleFilterChange('priceMax', undefined);
    } else if (filter === 'newly listed') {
      handleFilterChange('newlyListed', false);
    } else if (filter.startsWith('sort:')) {
      handleFilterChange('sortBy', 'newest');
    }
  };
  
  const clearAllFilters = () => {
    setActiveFilters([]);
    setFilters({
      distance: undefined,
      priceMin: undefined,
      priceMax: undefined,
      newlyListed: false,
      sortBy: 'newest'
    });
    onFilterChange({});
  };
  
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="default" 
            className="h-10 flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h3 className="font-medium">Filters</h3>
            
            {/* Distance filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Distance
                </Label>
                <span className="text-sm text-muted-foreground">
                  {filters.distance || 0} miles
                </span>
              </div>
              <Slider
                defaultValue={[filters.distance || 25]}
                max={100}
                step={5}
                onValueChange={(value) => handleFilterChange('distance', value[0])}
              />
            </div>
            
            {/* Price range filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price Range
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="number"
                    className="w-full pl-6 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    placeholder="Min"
                    value={filters.priceMin || ''}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                <span>-</span>
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="number"
                    className="w-full pl-6 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    placeholder="Max"
                    value={filters.priceMax || ''}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>
            
            {/* Newly listed filter */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="newly-listed" 
                checked={filters.newlyListed}
                onCheckedChange={(checked) => handleFilterChange('newlyListed', checked)}
              />
              <Label htmlFor="newly-listed" className="flex items-center gap-2 cursor-pointer">
                <Clock className="h-4 w-4" />
                Newly Listed
              </Label>
            </div>
            
            {/* Sort options */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4" />
                Sort By
              </Label>
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
              <Button 
                size="sm" 
                onClick={() => setIsOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Active filter badges */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge 
              key={filter} 
              variant="outline"
              className="flex items-center gap-1"
            >
              {filter}
              <button 
                className="ml-1 h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center"
                onClick={() => clearFilter(filter)}
              >
                <span className="sr-only">Remove</span>
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path d="M1 1L5 5M1 5L5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
