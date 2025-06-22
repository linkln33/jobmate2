"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AIRobotFaceProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'glow';
  className?: string;
}

export function AIRobotFace({ 
  size = 'md', 
  variant = 'default',
  className = '' 
}: AIRobotFaceProps) {
  // Size mapping
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
  // Variant styling
  const variantMap = {
    default: 'bg-gradient-to-br from-blue-500 to-purple-500',
    minimal: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    glow: 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-purple-500/30'
  };

  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      {/* Main circle */}
      <motion.div
        className={`absolute inset-0 rounded-full ${variantMap[variant]}`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* AI Robot Face */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center text-white"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-3/4 h-3/4"
        >
          {/* Robot Head */}
          <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" opacity="0.7" />
          
          {/* Robot Eyes */}
          <motion.circle 
            cx="8" 
            cy="10" 
            r="2" 
            fill="white"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle 
            cx="16" 
            cy="10" 
            r="2" 
            fill="white"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          
          {/* Robot Mouth */}
          <motion.path 
            d="M7 15h10" 
            stroke="white" 
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ 
              d: ["M7 15h10", "M7 16h10", "M7 14h10", "M7 15h10"] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          {/* Antenna */}
          <motion.path 
            d="M12 4v-2" 
            stroke="white" 
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle 
            cx="12" 
            cy="1" 
            r="1" 
            fill="white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Circuit Lines */}
          <path 
            d="M5 7h14M5 17h14" 
            stroke="white" 
            strokeWidth="0.5" 
            strokeDasharray="1 2"
            opacity="0.7"
          />
        </svg>
      </motion.div>
      
      {/* Glowing effect */}
      {variant === 'glow' && (
        <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-md -z-10"></div>
      )}
    </div>
  );
}
