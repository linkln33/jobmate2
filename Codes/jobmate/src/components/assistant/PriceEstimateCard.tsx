'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { AssistantSuggestion } from '@/contexts/AssistantContext/types';

interface PriceEstimateCardProps {
  suggestion: AssistantSuggestion;
  onDismiss: () => void;
}

const PriceEstimateCard: React.FC<PriceEstimateCardProps> = ({ suggestion, onDismiss }) => {
  const { title, content, actionUrl } = suggestion;
  const [expanded, setExpanded] = useState(false);
  
  // Extract price range from content if available
  const priceMatch = content.match(/\$(\d+,?\d*)-(\d+,?\d*)/);
  const minPrice = priceMatch ? priceMatch[1] : null;
  const maxPrice = priceMatch ? priceMatch[2] : null;
  
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-emerald-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <DollarSign size={18} className="text-emerald-500 mr-2" />
            <h3 className="font-medium text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Dismiss suggestion"
          >
            <X size={16} />
          </button>
        </div>
        
        {minPrice && maxPrice ? (
          <div className="mt-3">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-emerald-600">
                ${minPrice} - ${maxPrice}
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                aria-label={expanded ? "Show less" : "Show more"}
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-sm text-gray-600"
              >
                <p>{content}</p>
              </motion.div>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-600">{content}</p>
        )}
        
        {actionUrl && (
          <div className="mt-3">
            <Link 
              href={actionUrl} 
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-emerald-50 text-sm font-medium text-emerald-600 hover:bg-emerald-100"
            >
              <Calculator size={14} className="mr-1" />
              Get detailed estimate
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PriceEstimateCard;
