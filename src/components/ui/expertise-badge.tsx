import React from 'react';
import { JobCategoryIcon } from './job-category-icon';
import { cn } from '@/lib/utils';

export interface ExpertiseBadgeProps {
  skill: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  yearsOfExperience?: number;
}

const levelColors = {
  BEGINNER: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  },
  INTERMEDIATE: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800'
  },
  ADVANCED: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800'
  },
  EXPERT: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800'
  }
};

const sizesMap = {
  sm: {
    badge: 'h-8 w-8',
    icon: 'h-4 w-4',
    text: 'text-xs'
  },
  md: {
    badge: 'h-12 w-12',
    icon: 'h-6 w-6',
    text: 'text-sm'
  },
  lg: {
    badge: 'h-16 w-16',
    icon: 'h-8 w-8',
    text: 'text-base'
  }
};

export function ExpertiseBadge({ 
  skill, 
  level, 
  className,
  size = 'md',
  showLabel = false,
  yearsOfExperience
}: ExpertiseBadgeProps) {
  const colors = levelColors[level];
  const sizeClasses = sizesMap[size];
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div 
        className={cn(
          "rounded-full flex items-center justify-center border-2",
          colors.bg,
          colors.border,
          sizeClasses.badge
        )}
      >
        <JobCategoryIcon 
          category={skill} 
          className={cn(colors.text, sizeClasses.icon)} 
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-center">
          <p className={cn("font-medium", sizeClasses.text)}>{skill}</p>
          <p className={cn("text-muted-foreground", sizeClasses.text)}>
            {level.charAt(0) + level.slice(1).toLowerCase()}
            {yearsOfExperience ? ` · ${yearsOfExperience}yr` : ''}
          </p>
        </div>
      )}
    </div>
  );
}

export function ExpertiseBadgeGroup({ 
  skills,
  expertise,
  className,
  size = 'md',
  showLabels = true
}: { 
  skills?: Array<{
    skill: { name: string };
    proficiencyLevel: string;
    yearsOfExperience?: number;
  }>;
  expertise?: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}) {
  // Handle both skills objects and expertise string arrays
  if (expertise && expertise.length > 0) {
    return (
      <div className={cn("flex flex-wrap gap-4", className)}>
        {expertise.map((item, index) => (
          <ExpertiseBadge
            key={index}
            skill={item}
            level="INTERMEDIATE" // Default level for string arrays
            size={size}
            showLabel={showLabels}
          />
        ))}
      </div>
    );
  }
  
  // Original implementation for skills objects
  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      {skills?.map((skillItem, index) => (
        <ExpertiseBadge
          key={index}
          skill={skillItem.skill.name}
          level={skillItem.proficiencyLevel as any}
          size={size}
          showLabel={showLabels}
          yearsOfExperience={skillItem.yearsOfExperience}
        />
      ))}
    </div>
  );
}
