"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedAIAssistantProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'glow';
  className?: string;
}

export function AnimatedAIAssistant({ 
  size = 'md', 
  variant = 'default',
  className = '' 
}: AnimatedAIAssistantProps) {
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
      
      {/* Orbiting particles */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full"
            initial={{ 
              x: 0, 
              y: 0,
              opacity: 0.7
            }}
            animate={{
              x: [0, Math.cos(i * Math.PI * 2 / 3) * 20, 0],
              y: [0, Math.sin(i * Math.PI * 2 / 3) * 20, 0],
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>
      
      {/* AI Icon */}
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
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-1/2 h-1/2"
        >
          <path d="M12 2a2 2 0 0 0-2 2c0 .74.4 1.39 1 1.73V7h-2a2 2 0 0 0-2 2v2H5.73c-.34-.6-1-.99-1.73-.99a2 2 0 0 0 0 4c.74 0 1.39-.4 1.73-1H7v2a2 2 0 0 0 2 2h2v1.27c-.6.34-.99 1-.99 1.73a2 2 0 0 0 4 0c0-.74-.4-1.39-1-1.73V16h2a2 2 0 0 0 2-2v-2h1.27c.34.6 1 .99 1.73.99a2 2 0 0 0 0-4c-.74 0-1.39.4-1.73 1H15V7a2 2 0 0 0-2-2h-2V4.27c.6-.34.99-1 .99-1.73a2 2 0 0 0-2-2z"></path>
        </svg>
      </motion.div>
    </div>
  );
}
