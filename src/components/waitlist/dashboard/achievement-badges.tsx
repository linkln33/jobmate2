"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Users, Zap, Trophy, Crown, Clock, Share2 } from 'lucide-react';

// Define badge types and their properties
const BADGE_CONFIGS = {
  earlyBird: {
    name: 'Early Bird',
    description: 'Joined during the early access period',
    icon: Clock,
    colors: {
      primary: '#EF4444', // red-500
      secondary: '#FCA5A5', // red-300
      background: 'bg-red-500',
    }
  },
  referrer: {
    name: 'Referrer',
    description: 'Successfully referred at least one person',
    icon: Share2,
    colors: {
      primary: '#F97316', // orange-500
      secondary: '#FDBA74', // orange-300
      background: 'bg-orange-500',
    }
  },
  influencer: {
    name: 'Influencer',
    description: 'Referred 5 or more people to join',
    icon: Users,
    colors: {
      primary: '#EAB308', // yellow-500
      secondary: '#FDE68A', // yellow-300
      background: 'bg-yellow-500',
    }
  },
  champion: {
    name: 'Champion',
    description: 'Referred 10 or more people to join',
    icon: Trophy,
    colors: {
      primary: '#22C55E', // green-500
      secondary: '#86EFAC', // green-300
      background: 'bg-green-500',
    }
  },
  topTen: {
    name: 'Top 10',
    description: 'Reached the top 10 on the leaderboard',
    icon: Award,
    colors: {
      primary: '#38BDF8', // light blue-500
      secondary: '#7DD3FC', // light blue-300
      background: 'bg-sky-500',
    }
  },
  vip: {
    name: 'VIP',
    description: 'Earned 100+ points on the waitlist',
    icon: Star,
    colors: {
      primary: '#3B82F6', // blue-500
      secondary: '#93C5FD', // blue-300
      background: 'bg-blue-500',
    }
  },
  legend: {
    name: 'Legend',
    description: 'Earned 250+ points on the waitlist',
    icon: Crown,
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
  points?: number;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  type, 
  earned = false, 
  size = 'md',
  showDescription = false,
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
      <span className={`${currentSize.nameText} font-medium mt-2 text-center ${earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
        {config.name}
      </span>
      
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
    <div className="grid grid-cols-3 gap-2">
      <AchievementBadge 
        type="earlyBird" 
        earned={true}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="referrer" 
        earned={userStats.referrals > 0}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="influencer" 
        earned={userStats.referrals >= 5}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="champion" 
        earned={userStats.referrals >= 10}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="topTen" 
        earned={userStats.rank <= 10}
        size={size}
        showDescription={showDescriptions}
      />
      <AchievementBadge 
        type="vip" 
        earned={userStats.points >= 100}
        size={size}
        showDescription={showDescriptions}
      />
    </div>
  );
};
