"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { getJobIconName } from '@/utils/category-icons';
import { Job } from '@/types/job';

interface CategoryMarkerProps {
  job: Job;
  selected?: boolean;
  onClick?: () => void;
}

export const CategoryMarker: React.FC<CategoryMarkerProps> = ({ job, selected, onClick }) => {
  // Get the appropriate icon based on job category
  const iconName = getJobIconName(job);
  
  // Get color based on job status and urgency
  const getMarkerColor = (status: string, urgency: string): string => {
    if (status === 'completed') return '#4ade80'; // green
    if (status === 'in_progress') return '#3b82f6'; // blue
    if (status === 'accepted') return '#60a5fa'; // light blue
    if (urgency === 'high') return '#ef4444'; // red
    if (urgency === 'medium') return '#f97316'; // orange
    if (urgency === 'low') return '#10b981'; // teal
    return '#9333ea'; // purple default
  };
  
  const color = getMarkerColor(job.status, job.urgency);
  
  // Get the Lucide icon component if it exists
  const IconComponent = (LucideIcons as any)[iconName] || (LucideIcons as any).MapPin;
  
  return (
    <div 
      className={`
        relative flex items-center justify-center 
        w-10 h-10 rounded-full cursor-pointer
        transition-all duration-200 ease-in-out
        ${selected ? 'scale-125 shadow-lg z-10' : 'hover:scale-110'}
      `}
      onClick={onClick}
      style={{ 
        backgroundColor: color,
        boxShadow: selected ? '0 0 0 3px white, 0 0 0 5px ' + color : '0 2px 4px rgba(0,0,0,0.3)'
      }}
    >
      <IconComponent className="text-white" size={20} />
      
      {/* Pointer at bottom of marker */}
      <div 
        className="absolute -bottom-2 left-1/2 w-4 h-4 transform -translate-x-1/2 rotate-45"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

// This component would be used with the Google Maps API's OverlayView
// to render custom React components as markers on the map.
// For simplicity in this implementation, we're just defining the component
// that would be used in a more complete implementation.
