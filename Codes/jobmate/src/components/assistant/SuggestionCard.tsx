'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { AssistantSuggestion } from '@/contexts/AssistantContext/types';

interface SuggestionCardProps {
  suggestion: AssistantSuggestion;
  onDismiss: () => void;
}

// Priority color mapping
const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 3:
      return 'border-red-500';
    case 2:
      return 'border-yellow-500';
    case 1:
    default:
      return 'border-blue-500';
  }
};

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onDismiss }) => {
  const { title, content, priority, actionUrl } = suggestion;
  
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${getPriorityColor(priority)}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Dismiss suggestion"
          >
            <X size={16} />
          </button>
        </div>
        
        <p className="mt-2 text-sm text-gray-600">{content}</p>
        
        {actionUrl && (
          <div className="mt-3">
            <Link 
              href={actionUrl} 
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Take action
              <ExternalLink size={14} className="ml-1" />
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
