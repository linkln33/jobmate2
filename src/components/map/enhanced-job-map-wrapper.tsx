"use client";

import React, { useState, useEffect, useRef } from 'react';
import { EnhancedJobMap } from './enhanced-job-map';
import { Job } from '@/types/job';

// Import the FilterState type from enhanced-job-map
type FilterState = {
  showUrgent: boolean;
  showVerifiedPay: boolean;
  showNeighbors: boolean;
  minPayRate: number;
  maxDistance: number;
  categories: string[];
  [key: string]: any; // Allow for additional properties
};

// Use the same props interface as EnhancedJobMap for consistency
interface EnhancedJobMapWrapperProps {
  initialJobs: Job[];
  selectedJobId?: string | null;
  onJobSelected?: (jobId: string) => void;
  height?: string;
  width?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  className?: string;
  categories: Array<{ id: string; name: string }>;
  showFilters?: boolean;
  filters?: FilterState;
}

/**
 * This wrapper component isolates the EnhancedJobMap from Radix UI components
 * to prevent infinite update loops caused by ref conflicts
 */
export function EnhancedJobMapWrapper(props: EnhancedJobMapWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
      <div 
        ref={containerRef}
        className={`${props.className || ''} bg-purple-50 dark:bg-gray-900 flex items-center justify-center`}
        style={{ 
          height: props.height || '100%', 
          width: props.width || '100%' 
        }}
      >
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={props.className || ''}
      style={{ 
        height: props.height || '100%', 
        width: props.width || '100%' 
      }}
    >
      <EnhancedJobMap {...props} />
    </div>
  );
}
