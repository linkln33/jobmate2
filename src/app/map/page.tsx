"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { usePathname, useSearchParams } from 'next/navigation';
import { UnifiedMapViewPage } from '@/components/pages/unified-map-view-page';

export default function MapPage() {
  const { isLoading: authLoading } = useAuth();
  const [isMapLoading, setIsMapLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle map initialization without forcing remount
  useEffect(() => {
    // Only show loading indicator briefly when params change
    if (searchParams.toString()) {
      setIsMapLoading(true);
      const timer = setTimeout(() => {
        setIsMapLoading(false);
      }, 300); // Shorter timeout for better UX
      
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Show loading spinner while checking authentication or loading map
  if (authLoading || isMapLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-brand-500 mb-4" />
          <p className="text-lg font-medium">Loading map view...</p>
        </div>
      </div>
    );
  }

  // Render map without forcing remount
  return <UnifiedMapViewPage />;
}
