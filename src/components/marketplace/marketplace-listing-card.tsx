"use client";

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
  className,
  onClick
}: MarketplaceListingCardProps) {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
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
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* User info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 dark:text-gray-400">{user.name}</span>
          </div>
          
          {/* Stats */}
          {stats && (
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              {stats.views !== undefined && (
                <span>{stats.views} views</span>
              )}
              {stats.likes !== undefined && (
                <span>{stats.likes} likes</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
