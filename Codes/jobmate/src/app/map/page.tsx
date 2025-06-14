"use client";

import { useEffect, useState } from 'react';
import { MapViewPage } from '@/components/pages/map-view-page';
import { Spinner } from '@/components/ui/spinner';
import { usePathname, useSearchParams } from 'next/navigation';

export default function MapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(Date.now()); // Unique key for forcing remount
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset component when pathname or search params change
  useEffect(() => {
    // Force component to remount with a new key
    setKey(Date.now());
    setIsLoading(true);
    
    // Short timeout to ensure component mounts properly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Slightly longer timeout to ensure Google Maps API loads properly

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-brand-500 mb-4" />
          <p className="text-lg font-medium">Loading map view...</p>
        </div>
      </div>
    );
  }

  // Use the key to force a complete remount of MapViewPage
  return <MapViewPage key={key} />;
}
