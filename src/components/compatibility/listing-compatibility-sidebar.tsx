import React from 'react';
import { useListingCompatibility } from '@/hooks/use-listing-compatibility';
import { CompatibilityBreakdown } from '@/components/compatibility/compatibility-breakdown';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { MainCategory } from '@/types/compatibility';

interface ListingCompatibilitySidebarProps {
  listingId: string;
  category: MainCategory;
  listingData: any;
  className?: string;
}

/**
 * A sidebar component that shows detailed compatibility information for a listing
 */
export function ListingCompatibilitySidebar({
  listingId,
  category,
  listingData,
  className = ''
}: ListingCompatibilitySidebarProps) {
  const { compatibilityResult, loading, error } = useListingCompatibility({
    listingId,
    category,
    listingData
  });

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="space-y-2 mt-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load compatibility information. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!compatibilityResult) {
    return (
      <Alert className={className}>
        <AlertTitle>No compatibility data</AlertTitle>
        <AlertDescription>
          Complete your preferences to see how well this listing matches your needs.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      <CompatibilityBreakdown result={compatibilityResult} />
    </div>
  );
}
