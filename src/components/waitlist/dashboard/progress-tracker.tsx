"use client";

import React, { useEffect } from 'react';
import { trackProgress, loadUserStats, saveUserStats, UserStats } from '@/utils/progress-tracker';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProgressTrackerProps {
  userId: string;
  currentStats: UserStats;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ userId, currentStats }) => {
  useEffect(() => {
    // Load previous stats
    const previousStats = loadUserStats(userId);
    
    // Track progress and show notifications for new achievements
    if (previousStats) {
      const updatedStats = trackProgress(currentStats, previousStats);
      saveUserStats(userId, updatedStats);
    } else {
      // First time user, save initial stats
      saveUserStats(userId, currentStats);
    }
  }, [userId, currentStats]);

  // This is a utility component that doesn't render anything
  return null;
};
