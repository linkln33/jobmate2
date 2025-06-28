"use client";

import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { SlidersHorizontal } from 'lucide-react';

interface CompatibilityFilterProps {
  onFilterChange: (minScore: number, prioritizeCompatibility: boolean) => void;
  className?: string;
}

export function CompatibilityFilter({
  onFilterChange,
  className = ''
}: CompatibilityFilterProps) {
  const [minCompatibility, setMinCompatibility] = useState(50);
  const [prioritizeCompatibility, setPrioritizeCompatibility] = useState(false);
  
  const handleCompatibilityChange = (value: number[]) => {
    setMinCompatibility(value[0]);
  };
  
  const handlePrioritizeChange = (checked: boolean) => {
    setPrioritizeCompatibility(checked);
  };
  
  const applyFilters = () => {
    onFilterChange(minCompatibility / 100, prioritizeCompatibility);
  };
  
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Compatibility</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Compatibility Settings</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="min-compatibility">Minimum Compatibility</Label>
                <span className="text-sm font-medium">{minCompatibility}%</span>
              </div>
              <Slider
                id="min-compatibility"
                defaultValue={[minCompatibility]}
                max={100}
                step={5}
                onValueChange={handleCompatibilityChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="prioritize-compatibility"
                checked={prioritizeCompatibility}
                onCheckedChange={handlePrioritizeChange}
              />
              <Label htmlFor="prioritize-compatibility">Prioritize compatibility in search results</Label>
            </div>
            
            <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
