"use client";

import React, { useState } from 'react';
import { Flame, CheckCircle2, Users, Filter, Wallet, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface MapFilters {
  showUrgent: boolean;
  showVerifiedPay: boolean;
  showNeighbors: boolean;
  minPayRate: number;
  maxDistance: number;
  categories: string[];
}

interface MapFiltersProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  availableCategories: Array<{ id: string; name: string }>;
}

export function MapFilters({ filters, onFiltersChange, availableCategories }: MapFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<MapFilters>(filters);
  
  // Count active filters
  const activeFilterCount = [
    filters.showUrgent,
    filters.showVerifiedPay,
    filters.showNeighbors,
    filters.categories.length > 0
  ].filter(Boolean).length;
  
  // Update a single filter
  const updateFilter = <K extends keyof MapFilters>(key: K, value: MapFilters[K]) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Apply filters
  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setIsFilterOpen(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    const defaultFilters: MapFilters = {
      showUrgent: false,
      showVerifiedPay: false,
      showNeighbors: false,
      minPayRate: 0,
      maxDistance: 50,
      categories: []
    };
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    setIsFilterOpen(false);
  };
  
  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setTempFilters(prev => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories };
    });
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Quick Filter Badges */}
      <Badge
        variant={filters.showUrgent ? "default" : "outline"}
        className={`cursor-pointer ${filters.showUrgent ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-100'}`}
        onClick={() => onFiltersChange({ ...filters, showUrgent: !filters.showUrgent })}
      >
        <Flame className="h-3 w-3 mr-1" />
        Hot Now
      </Badge>
      
      <Badge
        variant={filters.showVerifiedPay ? "default" : "outline"}
        className={`cursor-pointer ${filters.showVerifiedPay ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-100'}`}
        onClick={() => onFiltersChange({ ...filters, showVerifiedPay: !filters.showVerifiedPay })}
      >
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Verified Pay
      </Badge>
      
      <Badge
        variant={filters.showNeighbors ? "default" : "outline"}
        className={`cursor-pointer ${filters.showNeighbors ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-blue-100'}`}
        onClick={() => onFiltersChange({ ...filters, showNeighbors: !filters.showNeighbors })}
      >
        <Users className="h-3 w-3 mr-1" />
        My Neighbors
      </Badge>
      
      {/* Categories Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-7">
            Categories
            {filters.categories.length > 0 && (
              <Badge className="ml-1 bg-brand-500">{filters.categories.length}</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableCategories.map(category => (
            <DropdownMenuItem 
              key={category.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                toggleCategory(category.id);
              }}
            >
              {category.name}
              {filters.categories.includes(category.id) && (
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Advanced Filters Popover */}
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 relative">
            <Filter className="h-3.5 w-3.5 mr-1" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Advanced Filters</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pay-rate" className="text-sm">Minimum Pay Rate</Label>
                <span className="text-sm font-medium">${tempFilters.minPayRate}/hr</span>
              </div>
              <Slider
                id="pay-rate"
                min={0}
                max={100}
                step={5}
                value={[tempFilters.minPayRate]}
                onValueChange={(value) => updateFilter('minPayRate', value[0])}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="distance" className="text-sm">Maximum Distance</Label>
                <span className="text-sm font-medium">{tempFilters.maxDistance} km</span>
              </div>
              <Slider
                id="distance"
                min={1}
                max={100}
                step={1}
                value={[tempFilters.maxDistance]}
                onValueChange={(value) => updateFilter('maxDistance', value[0])}
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Quick Filters</h5>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-red-500" />
                  <Label htmlFor="show-urgent" className="text-sm">Urgent Jobs</Label>
                </div>
                <Switch
                  id="show-urgent"
                  checked={tempFilters.showUrgent}
                  onCheckedChange={(checked) => updateFilter('showUrgent', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <Label htmlFor="show-verified" className="text-sm">Verified Payment</Label>
                </div>
                <Switch
                  id="show-verified"
                  checked={tempFilters.showVerifiedPay}
                  onCheckedChange={(checked) => updateFilter('showVerifiedPay', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="show-neighbors" className="text-sm">Posted by Neighbors</Label>
                </div>
                <Switch
                  id="show-neighbors"
                  checked={tempFilters.showNeighbors}
                  onCheckedChange={(checked) => updateFilter('showNeighbors', checked)}
                />
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
