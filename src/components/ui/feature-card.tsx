"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'default' | 'gradient' | 'outline';
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

export function FeatureCard({
  icon,
  title,
  description,
  variant = 'default',
  className = '',
  iconClassName = '',
  onClick
}: FeatureCardProps) {
  // Variant styling
  const variantStyles = {
    default: 'glass-card',
    gradient: 'glass-card bg-gradient-to-br from-blue-500/10 to-purple-500/10',
    outline: 'glass-card border-2 border-blue-500/20'
  };

  return (
    <motion.div
      className={cn(
        'p-6 rounded-xl cursor-pointer hover-lift',
        variantStyles[variant],
        className
      )}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className={cn(
        'w-12 h-12 mb-4 rounded-full flex items-center justify-center',
        variant === 'gradient' ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-blue-500',
        iconClassName
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}
