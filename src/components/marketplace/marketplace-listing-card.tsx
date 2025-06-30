"use client";

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { CompatibilityBadge } from '@/components/ui/compatibility-badge';
import { EnhancedCompatibilityBadge } from '@/components/ui/enhanced-compatibility-badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface MarketplaceListingCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  priceUnit?: string;
  imageUrl: string;
  tags: string[];
  type?: 'job' | 'service' | 'item' | 'rental';
  isFeatured?: boolean;
  isVerified?: boolean;
  isVip?: boolean;
  user: {
    name: string;
    avatar?: string;
  };
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
  compatibilityScore?: number;
  compatibilityReason?: string;
  className?: string;
  onClick?: () => void;
}

export function MarketplaceListingCard({
  id,
  title,
  description,
  price,
  priceUnit = 'hr',
  imageUrl,
  tags,
  type,
  isFeatured = false,
  isVerified = false,
  isVip = false,
  user,
  stats,
  compatibilityScore,
  compatibilityReason,
  className,
  onClick
}: MarketplaceListingCardProps) {
  // Enhanced glassmorphism effect with subtler colors
  const glassmorphismStyle = {
    background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.65) 0%, rgba(173, 216, 230, 0.45) 100%)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(173, 216, 230, 0.4)',
    boxShadow: '0 10px 25px 0 rgba(31, 38, 135, 0.2), 0 5px 10px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease-in-out'
  };

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden glassmorphism-container h-[470px] flex flex-col hover:translate-y-[-10px] hover:shadow-xl transition-all duration-300",
        className
      )}
      style={glassmorphismStyle}
      onClick={onClick}
    >
      {/* Image with badges */}
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <div className="relative h-full w-full">
            <Image 
              src={imageUrl} 
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No Image</span>
          </div>
        )}
        
        {/* Type badge - top left */}
        {type && (
          <div className="absolute top-2 left-2">
            <Badge 
              className={cn(
                "capitalize",
                type === 'job' ? "bg-purple-500 text-white" :
                type === 'service' ? "bg-green-500 text-white" :
                type === 'item' ? "bg-amber-500 text-white" :
                "bg-blue-500 text-white"
              )}
            >
              {type}
            </Badge>
          </div>
        )}
        
        {/* Status badges - top right */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isFeatured && (
            <Badge className="bg-red-500 text-white">
              Featured
            </Badge>
          )}
          {isVerified && (
            <Badge className="bg-blue-600 text-white">
              Verified
            </Badge>
          )}
          {isVip && (
            <Badge className="bg-amber-600 text-white">
              VIP
            </Badge>
          )}
        </div>
        
        {/* Price badge - bottom right */}
        <div className="absolute bottom-2 right-2">
          <Badge className="bg-blue-500 text-white text-lg px-3 py-1">
            ${price}{priceUnit ? `/${priceUnit}` : ''}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{description}</p>
        
        {/* Tags - limited to 5 with consistent sizing */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 h-[60px] overflow-hidden">
            {tags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-3 py-1 min-w-[80px] max-w-[120px] h-[28px] flex items-center justify-center border border-gray-300 dark:border-gray-600 mb-1 truncate">
                {tag}
              </Badge>
            ))}
            {tags.length > 5 && (
              <Badge variant="outline" className="text-xs px-3 py-1 min-w-[80px] max-w-[120px] h-[28px] flex items-center justify-center border border-gray-300 dark:border-gray-600">+{tags.length - 5} more</Badge>
            )}
          </div>
        )}
        
        {/* Compatibility Score */}
        {compatibilityScore !== undefined && (
          <div className="mb-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <EnhancedCompatibilityBadge 
                      score={compatibilityScore} 
                      size="md" 
                      primaryReason={compatibilityReason}
                    />
                    {compatibilityReason && (
                      <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                        {compatibilityReason}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-medium">Compatibility Score: {Math.round(compatibilityScore * 100)}%</p>
                  {compatibilityReason && (
                    <p className="text-sm">{compatibilityReason}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        {/* Share button replacing user info */}
        <div className="flex items-center justify-center">
          {/* Share button */}
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
        
        {/* Stats - moved to separate div */}
        {stats && (
          <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            {stats.views !== undefined && (
              <span className="mr-2">{stats.views} views</span>
            )}
            {stats.likes !== undefined && (
              <span>{stats.likes} likes</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
