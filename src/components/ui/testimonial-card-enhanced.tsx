"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatarUrl?: string;
  badges?: string[];
  rating?: number;
  variant?: 'default' | 'highlight' | 'minimal';
  className?: string;
}

export function TestimonialCard({
  quote,
  name,
  role,
  avatarUrl,
  badges = [],
  rating = 5,
  variant = 'default',
  className = ''
}: TestimonialCardProps) {
  // Glassmorphism style
  const glassmorphismStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    transition: 'all 0.3s ease-in-out'
  };
  
  // Variant styling
  const variantStyles = {
    default: 'bg-white/70 dark:bg-gray-800/70',
    highlight: 'bg-white/80 dark:bg-gray-800/80 border-2 border-blue-500/20 shadow-lg shadow-blue-500/10',
    minimal: 'bg-transparent border border-gray-200 dark:border-gray-700'
  };

  return (
    <motion.div
      className={cn(
        'p-6 rounded-xl overflow-hidden',
        variantStyles[variant],
        className
      )}
      style={glassmorphismStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.2)' }}
    >
      {/* Quote marks */}
      <div className="text-4xl text-blue-500/30 dark:text-blue-400/30 font-serif mb-2">
        "
      </div>
      
      {/* Quote text */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 relative">
        {quote}
      </p>
      
      {/* User info */}
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-3 border-2 border-blue-500/20 ring-2 ring-white/50 shadow-md">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{role}</div>
          
          {/* Star rating */}
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>⭐️</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Badges */}
      {badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 rounded-full px-3">
              {badge}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
}
