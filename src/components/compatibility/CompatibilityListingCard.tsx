import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainCategory } from '@/types/compatibility';
import CompatibilityBadge from './CompatibilityBadge';
import CompatibilityBreakdown from './CompatibilityBreakdown';
import useCompatibility from '@/hooks/useCompatibility';

interface CompatibilityListingCardProps {
  listingId: string;
  category: MainCategory;
  listingData: any;
  children: React.ReactNode;
}

export const CompatibilityListingCard: React.FC<CompatibilityListingCardProps> = ({
  listingId,
  category,
  listingData,
  children
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { result, loading, error } = useCompatibility(listingId, category, listingData);

  return (
    <div className="relative">
      {/* The original listing card content */}
      <div className="relative">
        {children}
      </div>
      
      {/* Compatibility badge overlay */}
      <div className="absolute top-3 right-3 z-10">
        {loading ? (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        ) : error ? (
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <span className="text-red-500 text-xs">Error</span>
          </div>
        ) : result ? (
          <CompatibilityBadge 
            score={result.overallScore}
            size="md"
            animated={true}
            showDetails={true}
            dimensions={result.dimensions}
            onClick={() => setShowBreakdown(!showBreakdown)}
          />
        ) : null}
      </div>
      
      {/* Detailed compatibility breakdown modal */}
      <AnimatePresence>
        {showBreakdown && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBreakdown(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CompatibilityBreakdown result={result} />
              
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium"
                  onClick={() => setShowBreakdown(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompatibilityListingCard;
