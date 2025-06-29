"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MarketplacePreviewCardProps {
  title: string;
  description: string;
  category: string;
  price?: string;
  location?: string;
  imageUrl?: string;
  avatarUrl?: string;
  userName?: string;
  rating?: number;
  type: 'task' | 'service' | 'rental' | 'gig' | 'job';
  className?: string;
  onClick?: () => void;
}

export function MarketplacePreviewCard({
  title,
  description,
  category,
  price,
  location,
  imageUrl,
  avatarUrl,
  userName,
  rating = 0,
  type,
  className = '',
  onClick
}: MarketplacePreviewCardProps) {
  // Type styling and icons
  const typeConfig = {
    task: {
      color: 'bg-blue-500',
      label: 'Task',
      icon: '🔧'
    },
    service: {
      color: 'bg-purple-500',
      label: 'Service',
      icon: '👨‍💼'
    },
    rental: {
      color: 'bg-green-500',
      label: 'Rental',
      icon: '📦'
    },
    gig: {
      color: 'bg-amber-500',
      label: 'Gig',
      icon: '🎸'
    },
    job: {
      color: 'bg-indigo-500',
      label: 'Job',
      icon: '💼'
    }
  };

  return (
    <motion.div
      className={cn(
        'glass-card rounded-xl overflow-hidden hover-lift',
        className
      )}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Image section */}
      <div className="relative h-40 w-full bg-gray-100 dark:bg-gray-800">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">{typeConfig[type]?.icon || '📋'}</span>
          </div>
        )}
        
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${typeConfig[type]?.color || 'bg-gray-500'} text-white`}>
            {typeConfig[type]?.label || 'Listing'}
          </Badge>
        </div>
        
        {/* Price badge if available */}
        {price && (
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm">
              {price}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Content section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{title}</h3>
          
          {/* Category */}
          <Badge variant="outline" className="ml-2 shrink-0">
            {category}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {description}
        </p>
        
        {/* Location if available */}
        {location && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
        )}
        
        {/* User info if available */}
        {userName && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userName} />
                ) : (
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-xs text-gray-600 dark:text-gray-300">{userName}</span>
            </div>
            
            {/* Rating if available */}
            {rating > 0 && (
              <div className="flex items-center">
                <span className="text-xs text-amber-500 mr-1">★</span>
                <span className="text-xs text-gray-600 dark:text-gray-300">{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
