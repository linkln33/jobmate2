"use client";

import React, { useState, useEffect } from 'react';
import { MobileMapView } from './mobile-map-view';
import { Job } from '@/types/job';

interface MobileMapViewWrapperProps {
  jobs: Job[];
  onJobSelect?: (job: Job) => void;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

/**
 * This wrapper component isolates the MobileMapView from Radix UI components
 * to prevent infinite update loops caused by ref conflicts
 */
export function MobileMapViewWrapper(props: MobileMapViewWrapperProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only render the map component after the component has mounted
  // This helps prevent ref-related issues during initial render
  useEffect(() => {
    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-purple-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading map view...</p>
        </div>
      </div>
    );
  }
  
  return <MobileMapView {...props} />;
}
