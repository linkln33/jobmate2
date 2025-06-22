"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Common routes that should be prefetched for faster navigation
const COMMON_ROUTES = [
  '/dashboard',
  '/messages',
  '/map',
  '/finance',
  '/insights',
  '/jobs',
  '/profile'
];

/**
 * A component that prefetches common routes in the background
 * to improve navigation performance between sidebar tabs
 */
export function RoutePrefetcher() {
  const router = useRouter();
  
  useEffect(() => {
    // Wait until the page is fully loaded and idle
    if (typeof window !== 'undefined') {
      // Use requestIdleCallback for modern browsers or setTimeout as fallback
      const requestIdleCallback = 
        window.requestIdleCallback || 
        ((cb) => setTimeout(cb, 1));
      
      // Prefetch routes during idle time
      requestIdleCallback(() => {
        COMMON_ROUTES.forEach(route => {
          router.prefetch(route);
        });
      });
    }
  }, [router]);
  
  // This component doesn't render anything
  return null;
}
