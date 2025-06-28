"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define the shape of our context
interface DashboardContextType {
  user: any;
  isLoading: boolean;
  refreshDashboard: () => void;
}

// Create the context with a default value
export const DashboardContext = createContext<DashboardContextType | null>(null);

// Custom hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Provider component
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to refresh dashboard data
  const refreshDashboard = () => {
    setIsLoading(true);
    // Here you would fetch any dashboard-specific data
    // For now, we'll just simulate a loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  // Initialize dashboard when auth state changes
  useEffect(() => {
    if (!authLoading) {
      refreshDashboard();
    }
  }, [authLoading, user?.id]);
  
  return (
    <DashboardContext.Provider value={{ user, isLoading, refreshDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
}
