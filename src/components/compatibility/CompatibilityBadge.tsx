import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CompatibilityResult } from '@/types/compatibility';

interface CompatibilityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showDetails?: boolean;
  dimensions?: Array<{
    name: string;
    score: number;
    weight: number;
    description?: string;
  }>;
  onClick?: () => void;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  score,
  size = 'md',
  animated = true,
  showDetails = false,
  dimensions = [],
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Size mapping
  const sizeMap = {
    sm: 40,
    md: 60,
    lg: 80
  };
  
  // Font size mapping
  const fontSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  // Color based on score
  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10B981'; // Green for excellent match
    if (score >= 70) return '#3B82F6'; // Blue for good match
    if (score >= 50) return '#F59E0B'; // Yellow for moderate match
    return '#EF4444'; // Red for poor match
  };
  
  // Create a circular progress indicator
  const radius = sizeMap[size] / 2;
  const strokeWidth = sizeMap[size] * 0.1;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.5 }}
        className="relative"
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      >
        {/* Background circle */}
        <svg
          height={sizeMap[size]}
          width={sizeMap[size]}
          className="absolute"
        >
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        
        {/* Progress circle */}
        <svg
          height={sizeMap[size]}
          width={sizeMap[size]}
          className="absolute"
        >
          <circle
            stroke={getScoreColor(score)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${fontSizeMap[size]}`}>
            {Math.round(score)}%
          </span>
        </div>
      </motion.div>
      
      {/* Details popup on hover */}
      {showDetails && isHovered && dimensions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 w-64 mt-2 left-1/2 transform -translate-x-1/2"
        >
          <h4 className="font-semibold text-sm mb-2">Compatibility Breakdown</h4>
          {dimensions.map((dim, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>{dim.name}</span>
                <span className="font-medium">{Math.round(dim.score)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full" 
                  style={{ 
                    width: `${dim.score}%`,
                    backgroundColor: getScoreColor(dim.score)
                  }}
                ></div>
              </div>
              {dim.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{dim.description}</p>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CompatibilityBadge;
