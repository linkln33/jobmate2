"use client";

import { useEffect, useState } from 'react';
import { MapViewPage } from '@/components/pages/map-view-page';
import { Spinner } from '@/components/ui/spinner';

export default function MapPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Short timeout to ensure component mounts properly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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

  return <MapViewPage />;
}
