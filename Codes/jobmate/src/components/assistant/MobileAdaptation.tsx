'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { useAssistant } from '@/contexts/AssistantContext/AssistantContext';

interface MobileAdaptationProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const MobileAdaptation: React.FC<MobileAdaptationProps> = ({ 
  children, 
  isOpen, 
  onClose 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { state } = useAssistant();
  const { currentMode } = state;

  // Mode color mapping
  const modeColors = {
    MATCHING: 'bg-blue-500',
    PROJECT_SETUP: 'bg-green-500',
    PAYMENTS: 'bg-purple-500',
    PROFILE: 'bg-orange-500',
    MARKETPLACE: 'bg-pink-500',
    GENERAL: 'bg-gray-500',
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If not mobile or not open, just render children
  if (!isMobile || !isOpen) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Mobile panel */}
          <motion.div
            className={`fixed inset-x-0 z-50 md:hidden ${
              isMinimized ? 'bottom-0' : 'bottom-0 top-20'
            }`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header bar */}
            <div className={`flex items-center justify-between p-3 ${modeColors[currentMode]} text-white`}>
              <div className="text-sm font-medium">
                JobMate Assistant
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 rounded-full hover:bg-white/20"
                >
                  {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/20"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Content */}
            {!isMinimized && (
              <div className="bg-white dark:bg-gray-900 h-full overflow-y-auto">
                {children}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileAdaptation;
