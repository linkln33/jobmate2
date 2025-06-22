"use client";

import React, { useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the MobileMapView component with no SSR and loading fallback
// This helps prevent ref conflicts by ensuring the component only renders on the client side
const DynamicMobileMapView = dynamic(
  () => import('./mobile-map-view').then((mod) => mod.MobileMapView),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-purple-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium">Loading map...</p>
        </div>
      </div>
    )
  }
);

interface IsolatedMapViewProps {
  jobs: any[];
  onJobSelect?: (job: any) => void;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

// Memoize the props to prevent unnecessary re-renders
const MemoizedMapView = memo(({ jobs, onJobSelect, onSearch, onFilter }: IsolatedMapViewProps) => {
  return <DynamicMobileMapView 
    jobs={jobs} 
    onJobSelect={onJobSelect} 
    onSearch={onSearch} 
    onFilter={onFilter} 
  />;
});

/**
 * This component isolates the map rendering from the rest of the UI
 * to prevent infinite update loops caused by Radix UI's compose-refs
 */
export function IsolatedMapView(props: IsolatedMapViewProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only render the map component after the component has mounted
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    // This prevents React from getting into an update loop
    let frameId: number;
    
    if (!mounted) {
      frameId = requestAnimationFrame(() => {
        setMounted(true);
      });
    }
    
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [mounted]);
  
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
  
  // Use a div container to further isolate the map component
  // The key prop ensures a fresh render when mounted changes
  return (
    <div className="h-full w-full" key={`map-container-${mounted}`}>
      <MemoizedMapView {...props} />
    </div>
  );
}

// Default export for dynamic import
export default IsolatedMapView;
