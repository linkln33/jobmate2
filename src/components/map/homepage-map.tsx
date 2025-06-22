"use client";

import React, { useState } from 'react';
import { InteractiveMapWithFilters } from './interactive-map-with-filters';

interface HomepageMapProps {
  className?: string;
}

export function HomepageMap({ className }: HomepageMapProps) {
  // Initial map settings
  const initialCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
  const initialZoom = 12;
  
  // Custom styles for homepage filter chips
  const homepageFilterStyle = {
    chipWidth: '90px',  // Shorter width for homepage
    useFullName: false,  // Use shorter names for better fit
    paddingLeft: '10px',  // Padding on the left
    paddingRight: '8px',  // Padding on the right
  };

  // Custom map options for homepage
  const homepageMapOptions = {
    zoomControl: false,  // Remove zoom +/- buttons
    scrollwheel: true,   // Keep zoom with scroll functionality
  };

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <InteractiveMapWithFilters 
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        showSearchBar={true}
        showActivityDotsOnMap={true}
        showLegend={false}
        height="100%"
        filterChipStyle={homepageFilterStyle}
        mapOptions={homepageMapOptions}
      />
    </div>
  );
}
