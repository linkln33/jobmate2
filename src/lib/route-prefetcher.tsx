"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Common routes that should be prefetched for faster navigation
const COMMON_ROUTES = [
  '/dashboard',
  '/messages',
  '/map',
  '/finance',
  '/insights',
  '/jobs',
  '/profile',
  '/marketplace',
  '/verifications',
  '/settings',
  '/social-connections'
];

/**
 * A component that prefetches common routes in the background
 * to improve navigation performance between sidebar tabs
 */
export function RoutePrefetcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Wait until the page is fully loaded and idle
    if (typeof window !== 'undefined') {
      // Use requestIdleCallback for modern browsers or setTimeout as fallback
      const requestIdleCallback = 
        window.requestIdleCallback || 
        ((cb) => setTimeout(cb, 1));
      
      // Immediately prefetch the most likely next routes based on current path
      const currentIndex = COMMON_ROUTES.indexOf(pathname);
      if (currentIndex !== -1) {
        // Prefetch adjacent routes first (most likely to be clicked next)
        const adjacentRoutes = [
          COMMON_ROUTES[Math.max(0, currentIndex - 1)],
          COMMON_ROUTES[Math.min(COMMON_ROUTES.length - 1, currentIndex + 1)]
        ];
        
        // Immediately prefetch adjacent routes
        adjacentRoutes.forEach(route => {
          if (route !== pathname) {
            router.prefetch(route);
          }
        });
      }
      
      // Prefetch all other routes during idle time with priority
      requestIdleCallback(() => {
        // Sort routes by proximity to current route for prioritized loading
        const sortedRoutes = [...COMMON_ROUTES].sort((a, b) => {
          const aIndex = COMMON_ROUTES.indexOf(a);
          const bIndex = COMMON_ROUTES.indexOf(b);
          return Math.abs(aIndex - currentIndex) - Math.abs(bIndex - currentIndex);
        });
        
        // Prefetch all routes with a small delay between each to avoid network congestion
        sortedRoutes.forEach((route, index) => {
          if (route !== pathname) {
            setTimeout(() => {
              router.prefetch(route);
            }, index * 100); // Stagger prefetching by 100ms per route
          }
        });
      });
    }
  }, [router, pathname]);
  
  // This component doesn't render anything
  return null;
}
