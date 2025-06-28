"use client";

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CompatibilityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  primaryReason?: string;
}

export function CompatibilityBadge({
  score,
  size = 'md',
  showTooltip = true,
  primaryReason
}: CompatibilityBadgeProps) {
  // Size dimensions
  const dimensions = {
    sm: { width: 30, height: 30, fontSize: 10, strokeWidth: 2 },
    md: { width: 40, height: 40, fontSize: 12, strokeWidth: 3 },
    lg: { width: 50, height: 50, fontSize: 14, strokeWidth: 4 }
  };
  
  const { width, height, fontSize, strokeWidth } = dimensions[size];
  
  // Calculate the score percentage and visual elements
  const percentage = Math.round(score * 100);
  const radius = (width / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score);
  
  // Determine color based on score
  const getColor = () => {
    if (score >= 0.8) return '#22c55e'; // Green for high match
    if (score >= 0.6) return '#3b82f6'; // Blue for good match
    if (score >= 0.4) return '#f59e0b'; // Yellow for moderate match
    return '#ef4444'; // Red for low match
  };
  
  const badgeElement = (
    <div className="relative inline-flex items-center justify-center">
      <svg width={width} height={height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span 
        className="absolute font-medium"
        style={{ fontSize: `${fontSize}px` }}
      >
        {percentage}%
      </span>
    </div>
  );
  
  if (!showTooltip || !primaryReason) {
    return badgeElement;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeElement}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{primaryReason || `${percentage}% compatibility match`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
