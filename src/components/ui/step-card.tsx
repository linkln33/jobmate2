"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function StepCard({
  step,
  title,
  description,
  icon,
  isActive = false,
  className = ''
}: StepCardProps) {
  return (
    <motion.div
      className={cn(
        'glass-card p-6 rounded-xl relative overflow-hidden',
        isActive ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : '',
        className
      )}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3',
          isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-blue-500'
        )}>
          {step}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      
      {icon && (
        <div className="absolute bottom-4 right-4 text-blue-500 opacity-20">
          {icon}
        </div>
      )}
      
      {isActive && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"
          animate={{ 
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
    </motion.div>
  );
}
