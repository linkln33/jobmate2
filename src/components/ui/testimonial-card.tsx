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
  variant?: 'default' | 'highlight' | 'minimal';
  className?: string;
}

export function TestimonialCard({
  quote,
  name,
  role,
  avatarUrl,
  badges = [],
  variant = 'default',
  className = ''
}: TestimonialCardProps) {
  // Variant styling
  const variantStyles = {
    default: 'glass-card',
    highlight: 'glass-card border-2 border-blue-500/20 shadow-lg shadow-blue-500/10',
    minimal: 'bg-transparent border border-gray-200 dark:border-gray-700'
  };

  return (
    <motion.div
      className={cn(
        'p-6 rounded-xl',
        variantStyles[variant],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      {/* Quote marks */}
      <div className="text-4xl text-blue-500/20 dark:text-blue-400/20 font-serif mb-2">
        "
      </div>
      
      {/* Quote text */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 relative">
        {quote}
      </p>
      
      {/* User info */}
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3 border-2 border-blue-500/20">
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
        </div>
      </div>
      
      {/* Badges */}
      {badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              {badge}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
}
