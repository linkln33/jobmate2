"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/spinner';

// Dynamically import the UnifiedDashboardPage component with loading fallback
const UnifiedDashboardPage = dynamic(
  () => import('@/components/pages/unified-dashboard-page').then(mod => ({ default: mod.UnifiedDashboardPage })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12 text-brand-500" />
        <p className="ml-3 text-brand-500">Loading dashboard...</p>
      </div>
    ),
    ssr: false
  }
);

// Import the DashboardProvider
import { DashboardProvider } from '@/contexts/DashboardContext';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check authentication directly from localStorage
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get authentication data directly from localStorage
        const storedToken = localStorage.getItem('token');
        const storedUserJson = localStorage.getItem('user');
        
        // Reduce console logging
        if (storedToken && storedUserJson) {
          try {
            const userData = JSON.parse(storedUserJson);
            setUser(userData);
            setIsAuthenticated(true);
            
            // Remove any redirect parameters from URL if present
            if (window.location.search.includes('redirect')) {
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            }
          } catch (e) {
            console.error('Error parsing user data:', e);
            redirectToLogin();
          }
        } else {
          redirectToLogin();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        redirectToLogin();
      } finally {
        // Remove artificial delay completely
        setIsLoading(false);
      }
    };
    
    const redirectToLogin = () => {
      // Use Next.js router for client-side navigation
      router.push('/login');
    };
    
    // Run immediately to avoid flashing content
    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12 text-brand-500" />
      </div>
    );
  }

  // Show dashboard if authenticated
  if (isAuthenticated && user) {
    return (
      <DashboardProvider>
        <UnifiedDashboardPage />
      </DashboardProvider>
    );
  }
  
  // This should never be reached as we redirect in the useEffect
  return null;
}
