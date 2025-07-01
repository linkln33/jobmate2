"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function BackToHomeButton() {
  const handleClick = () => {
    // Use direct window.location for navigation
    window.location.href = '/';
  };
  
  return (
    <button
      onClick={handleClick}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
    >
      <ArrowLeft size={16} />
      <span>Back to Home</span>
    </button>
  );
}
