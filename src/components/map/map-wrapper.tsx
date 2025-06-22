"use client";

import React, { useState, useEffect } from 'react';
import { InteractiveMapWithFilters } from './interactive-map-with-filters';
import { Job } from '@/types/job';

interface MapWrapperProps {
  height?: string;
}

/**
 * This wrapper component isolates the map from the rest of the UI
 * to prevent infinite update loops caused by Radix UI ref conflicts
 */
export function MapWrapper({ height = "100%" }: MapWrapperProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only render the map component after the component has mounted
  // This helps prevent ref-related issues during initial render
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleJobSelect = (job: Job) => {
    console.log('Selected job:', job);
  };
  
  if (!mounted) {
    return (
      <div 
        style={{ height }} 
        className="w-full flex items-center justify-center bg-purple-50 dark:bg-gray-900"
      >
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <InteractiveMapWithFilters
      height={height}
      onJobSelect={handleJobSelect}
    />
  );
}
