"use client";

import { useEffect, useRef } from 'react';
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

// Routes that should be prefetched immediately on any page load
const HIGH_PRIORITY_ROUTES = [
  '/dashboard',
  '/profile',
  '/jobs',
  '/messages'
];

/**
 * A component that prefetches common routes in the background
 * to improve navigation performance between sidebar tabs
 */
export function RoutePrefetcher() {
  const router = useRouter();
  const pathname = usePathname();
  const prefetchedRoutes = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    // Only run prefetching once per session
    if (prefetchedRoutes.current.size > 0) return;
    
    if (typeof window !== 'undefined') {
      // Immediately prefetch high priority routes without any delay
      HIGH_PRIORITY_ROUTES.forEach(route => {
        if (route !== pathname && !prefetchedRoutes.current.has(route)) {
          router.prefetch(route);
          prefetchedRoutes.current.add(route);
        }
      });
      
      // Use intersection observer to prefetch remaining routes when browser is idle
      if ('IntersectionObserver' in window) {
        // Create a dummy element to observe
        const dummyElement = document.createElement('div');
        dummyElement.style.position = 'absolute';
        dummyElement.style.bottom = '200px';
        dummyElement.style.width = '1px';
        dummyElement.style.height = '1px';
        dummyElement.style.opacity = '0';
        document.body.appendChild(dummyElement);
        
        // Create observer to trigger prefetching when user scrolls near bottom
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            // Prefetch all remaining routes
            COMMON_ROUTES.forEach(route => {
              if (route !== pathname && !prefetchedRoutes.current.has(route)) {
                router.prefetch(route);
                prefetchedRoutes.current.add(route);
              }
            });
            
            // Cleanup
            observer.disconnect();
            document.body.removeChild(dummyElement);
          }
        }, { rootMargin: '200px' });
        
        observer.observe(dummyElement);
        
        // Fallback: If user doesn't scroll, prefetch immediately
        setTimeout(() => {
          if (prefetchedRoutes.current.size <= HIGH_PRIORITY_ROUTES.length) {
            COMMON_ROUTES.forEach(route => {
              if (route !== pathname && !prefetchedRoutes.current.has(route)) {
                router.prefetch(route);
                prefetchedRoutes.current.add(route);
              }
            });
            
            // Cleanup if not already cleaned up
            if (document.body.contains(dummyElement)) {
              observer.disconnect();
              document.body.removeChild(dummyElement);
            }
          }
        }, 500); // Reduced to 500ms for faster prefetching
      } else {
        // Fallback for browsers without IntersectionObserver - prefetch immediately
        setTimeout(() => {
          COMMON_ROUTES.forEach(route => {
            if (route !== pathname && !prefetchedRoutes.current.has(route)) {
              router.prefetch(route);
              prefetchedRoutes.current.add(route);
            }
          });
        }, 200); // Reduced to 200ms for faster prefetching
      }
    }
  }, [router, pathname]);
  
  // This component doesn't render anything
  return null;
}
