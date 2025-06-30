"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Props interface for the MarketplacePreviewCard component.
 * 
 * @interface MarketplacePreviewCardProps
 * @property {string} [id] - Optional unique identifier for the marketplace listing
 * @property {string} title - Title of the marketplace listing
 * @property {string} description - Description of the marketplace listing
 * @property {string} category - Category the listing belongs to
 * @property {string} price - Price of the item/service/rental/job
 * @property {string} [location] - Optional location information
 * @property {string} imageUrl - URL to the image representing the listing
 * @property {string} [userName] - Optional name of the user who posted the listing
 * @property {string} [avatarUrl] - Optional URL to the avatar of the user
 * @property {number} [rating] - Optional rating score (0-5)
 * @property {'job' | 'service' | 'item' | 'rental'} [type] - Type of listing
 * @property {string} [className] - Optional additional CSS classes
 * @property {() => void} [onClick] - Optional click handler for the card
 */
export interface MarketplacePreviewCardProps {
  id?: string;
  title: string;
  description: string;
  category: string;
  price: string;
  location?: string;
  imageUrl: string;
  userName?: string;
  avatarUrl?: string;
  rating?: number;
  type?: 'job' | 'service' | 'item' | 'rental';
  className?: string;
  onClick?: () => void;
}

/**
 * MarketplacePreviewCard Component
 * 
 * A visually appealing card component that displays marketplace listings with a
 * glassmorphism design. This component is used throughout the JobMate platform
 * to present jobs, services, items, and rentals in a consistent, attractive format.
 * 
 * Features:
 * - Glassmorphism styling with subtle gradients and blur effects
 * - Animated hover and tap interactions using Framer Motion
 * - Type-specific styling with appropriate icons and colors
 * - Responsive image display with fallback
 * - User information display with avatar
 * - Rating display with star visualization
 * - Price and location information
 * 
 * The card is designed to be used in grid layouts and marketplace search results,
 * providing users with an at-a-glance view of important listing information.
 * 
 * @param {MarketplacePreviewCardProps} props - Component props
 * @returns {JSX.Element} A marketplace preview card component
 * 
 * @example
 * ```tsx
 * <MarketplacePreviewCard
 *   title="Professional Web Development"
 *   description="Full-stack web development services for your business needs"
 *   category="Development"
 *   price="$75/hr"
 *   location="Remote"
 *   imageUrl="/images/web-dev.jpg"
 *   userName="Jane Smith"
 *   avatarUrl="/avatars/jane.jpg"
 *   rating={4.8}
 *   type="service"
 *   onClick={() => router.push('/listing/123')}
 * />
 * ```
 */
export function MarketplacePreviewCard({
  id,
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
  className,
  onClick,
  ...props
}: MarketplacePreviewCardProps) {
  /**
   * Custom glassmorphism style for the card
   * Creates a translucent, blurred effect with subtle gradients and shadows
   */
  const glassmorphismStyle = {
    background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.65) 0%, rgba(173, 216, 230, 0.45) 100%)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(173, 216, 230, 0.4)',
    boxShadow: '0 10px 25px 0 rgba(31, 38, 135, 0.2), 0 5px 10px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease-in-out'
  };

  /**
   * Configuration for different listing types
   * Each type has a specific color, label, and emoji icon
   * Used to visually differentiate between jobs, services, items, and rentals
   */
  const typeConfig: Record<string, { color: string, label: string, icon: string }> = {
    job: {
      color: 'bg-indigo-500',
      label: 'Job',
      icon: '💼'
    },
    service: {
      color: 'bg-purple-500',
      label: 'Service',
      icon: '👨‍💼'
    },
    item: {
      color: 'bg-blue-500',
      label: 'Item',
      icon: '📦'
    },
    rental: {
      color: 'bg-green-500',
      label: 'Rental',
      icon: '🏠'
    },
    // Fallback for other types
    task: {
      color: 'bg-blue-500',
      label: 'Task',
      icon: '🔧'
    },
    gig: {
      color: 'bg-amber-500',
      label: 'Gig',
      icon: '🎸'
    }
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl glassmorphism-container h-[480px] flex flex-col",
        className
      )}
      style={glassmorphismStyle}
      whileHover={{ y: -10, boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.3), 0 8px 15px rgba(0, 0, 0, 0.1)' }}
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
            <span className="text-4xl">{type && typeConfig[type] ? typeConfig[type].icon : '📋'}</span>
          </div>
        )}
        
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${type && typeConfig[type] ? typeConfig[type].color : 'bg-gray-500'} text-white`}>
            {type && typeConfig[type] ? typeConfig[type].label : 'Listing'}
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
          <Badge variant="outline" className="ml-2 shrink-0 px-3 py-1 min-w-[80px] max-w-[120px] h-[28px] flex items-center justify-center border border-gray-300 dark:border-gray-600 truncate">
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
        
        {/* Share button in place of user info */}
        <div className="flex items-center justify-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full shadow-sm text-xs cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all share-button-container mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>Share & get 5-15%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
