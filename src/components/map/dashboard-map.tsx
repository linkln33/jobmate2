"use client";

import React from 'react';
import { InteractiveMapWithFilters } from './interactive-map-with-filters';

interface DashboardMapProps {
  className?: string;
  onJobSelect?: (job: any) => void;
}

export function DashboardMap({ className, onJobSelect }: DashboardMapProps) {
  // Initial map settings
  const initialCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
  const initialZoom = 12;
  
  // Custom styles for dashboard filter chips
  const dashboardFilterStyle = {
    chipWidth: '110px',  // Wider than homepage for full names
    useFullName: true,   // Use full category names
    paddingLeft: '10px', // More padding on the left
    paddingRight: '8px', // Add padding on the right
  };

  // Custom map options for dashboard
  const dashboardMapOptions = {
    zoomControl: true,   // Keep zoom controls for dashboard
    scrollwheel: true,   // Keep zoom with scroll functionality
  };

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <InteractiveMapWithFilters 
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        showSearchBar={true}
        showActivityDotsOnMap={true}
        showLegend={true}
        height="100%"
        filterChipStyle={dashboardFilterStyle}
        mapOptions={dashboardMapOptions}
        onJobSelect={onJobSelect}
      />
    </div>
  );
}
