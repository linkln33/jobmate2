"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Users, Zap, Trophy, Crown, Clock, Share2 } from 'lucide-react';

// Define badge types and their properties
const BADGE_CONFIGS = {
  earlyAccess: {
    name: 'Early Access',
    description: 'Early access to platform (10+ points)',
    icon: Zap,
    colors: {
      primary: '#EF4444', // red-500
      secondary: '#FCA5A5', // red-300
      background: 'bg-red-500',
    }
  },
  freeProMonth: {
    name: 'Free Pro - 1 Month',
    description: 'Free pro plan for the 1st month (50+ points)',
    icon: Award,
    colors: {
      primary: '#F97316', // orange-500
      secondary: '#FDBA74', // orange-300
      background: 'bg-orange-500',
    }
  },
  proYearDiscount: {
    name: 'Free Pro - 3 Months',
    description: 'Free pro plan for 3 months (150+ points)',
    icon: Star,
    colors: {
      primary: '#EAB308', // yellow-500
      secondary: '#FDE68A', // yellow-300
      background: 'bg-yellow-500',
    }
  },
  proSixMonths: {
    name: 'Pro - 6 Months',
    description: 'Free pro plan for 6 months (350+ points)',
    icon: Trophy,
    colors: {
      primary: '#22C55E', // green-500
      secondary: '#86EFAC', // green-300
      background: 'bg-green-500',
    }
  },
  proOneYear: {
    name: 'Pro - 1 Year',
    description: 'Free pro plan for 1 year (540+ points)',
    icon: Users,
    colors: {
      primary: '#38BDF8', // light blue-500
      secondary: '#7DD3FC', // light blue-300
      background: 'bg-sky-500',
    }
  },
  proTwoYears: {
    name: 'Pro - 2 Years',
    description: 'Free pro plan for two years (1000+ points)',
    icon: Crown,
    colors: {
      primary: '#3B82F6', // blue-500
      secondary: '#93C5FD', // blue-300
      background: 'bg-blue-500',
    }
  },
  proLifetime: {
    name: 'Pro Lifetime',
    description: 'Free pro plan lifetime with special perks (3000+ points)',
    icon: Share2,
    colors: {
      primary: '#8B5CF6', // purple-500
      secondary: '#C4B5FD', // purple-300
      background: 'bg-purple-500',
    }
  }
};

export type BadgeType = keyof typeof BADGE_CONFIGS;

interface AchievementBadgeProps {
  type: BadgeType;
  earned: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  showName?: boolean;
  points?: number;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  type, 
  earned = false, 
  size = 'md',
  showDescription = false,
  showName = true,
  points
}) => {
  const config = BADGE_CONFIGS[type];
  const IconComponent = config.icon;
  
  // Size configurations
  const sizes = {
    sm: {
      wrapper: 'w-16 h-16',
      icon: 16,
      badge: 'w-14 h-14',
      nameText: 'text-xs',
      descText: 'text-[10px]',
    },
    md: {
      wrapper: 'w-24 h-24',
      icon: 24,
      badge: 'w-20 h-20',
      nameText: 'text-sm',
      descText: 'text-xs',
    },
    lg: {
      wrapper: 'w-32 h-32',
      icon: 32,
      badge: 'w-28 h-28',
      nameText: 'text-base',
      descText: 'text-sm',
    }
  };

  const currentSize = sizes[size];
  
  return (
    <div className="flex flex-col items-center justify-center p-2 transition-all duration-300 hover:transform hover:scale-105">
    
      <div className={`relative ${currentSize.wrapper} flex items-center justify-center`}>
        
        {/* Badge circle */}
        <div 
          className={`${currentSize.badge} rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
            earned 
              ? `${config.colors.background} shadow-md hover:shadow-lg` 
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {/* Badge icon */}
          <IconComponent 
            size={currentSize.icon} 
            className={earned ? 'text-white' : 'text-gray-400 dark:text-gray-500'} 
            strokeWidth={earned ? 2 : 1.5}
          />
        </div>
        
        {/* No shine effect */}
      </div>
      
      {/* Badge name */}
      {showName && (
        <span className={`${currentSize.nameText} font-medium mt-2 text-center ${earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          {config.name}
        </span>
      )}
      
      {/* Badge description - optional */}
      {showDescription && (
        <span className={`${currentSize.descText} text-gray-500 dark:text-gray-400 text-center mt-1 max-w-[150px]`}>
          {config.description}
        </span>
      )}
      
      {/* Points - optional */}
      {points !== undefined && (
        <span className={`${currentSize.descText} font-medium mt-1 ${earned ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {points} points
        </span>
      )}
    </div>
  );
};

interface BadgeGridProps {
  userStats: {
    referrals: number;
    points: number;
    rank: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showDescriptions?: boolean;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ 
  userStats, 
  size = 'md',
  showDescriptions = false
}) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
      <AchievementBadge 
        type="earlyAccess" 
        earned={userStats.points >= 10}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="freeProMonth" 
        earned={userStats.points >= 50}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="proYearDiscount" 
        earned={userStats.points >= 150}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="proSixMonths" 
        earned={userStats.points >= 350}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="proOneYear" 
        earned={userStats.points >= 540}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="proTwoYears" 
        earned={userStats.points >= 1000}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="proLifetime" 
        earned={userStats.points >= 3000}
        size={size}
        showDescription={showDescriptions}
      />
    </div>
  );
};
