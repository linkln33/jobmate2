'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssistantMode } from '@/contexts/AssistantContext/types';

interface IdleAnimationProps {
  mode: AssistantMode;
  isActive: boolean;
}

// Mode-specific animation colors
const modeColors = {
  MATCHING: '#3b82f6', // blue-500
  PROJECT_SETUP: '#22c55e', // green-500
  PAYMENTS: '#a855f7', // purple-500
  PROFILE: '#f97316', // orange-500
  MARKETPLACE: '#ec4899', // pink-500
  GENERAL: '#6b7280', // gray-500
};

const IdleAnimation: React.FC<IdleAnimationProps> = ({ mode, isActive }) => {
  const [dotCount, setDotCount] = useState(0);
  const color = modeColors[mode];

  // Pulsing animation for the dots when active
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 600);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute bottom-20 right-6 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative p-2 rounded-full shadow-lg"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  opacity: i <= dotCount ? 1 : 0.3,
                  scale: i <= dotCount ? 1 : 0.8,
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IdleAnimation;
