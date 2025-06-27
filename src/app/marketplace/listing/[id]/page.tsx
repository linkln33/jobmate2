"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { marketplaceListings } from "@/data/marketplace-listings";
import { UnifiedDashboardLayout } from "@/components/layout/unified-dashboard-layout";
import { MarketplaceListingDetail } from "@/components/marketplace/listing-detail/marketplace-listing-detail";
import { MarketplaceListing } from "@/types/marketplace";

export default function MarketplaceListingPage() {
  const params = useParams();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const listingId = params.id as string;
    const foundListing = marketplaceListings.find((item) => item.id === listingId);
    
    setListing(foundListing || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <UnifiedDashboardLayout title="Loading..." showMap={false}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  if (!listing) {
    return (
      <UnifiedDashboardLayout title="Listing Not Found" showMap={false}>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <h2 className="text-2xl font-bold">Listing Not Found</h2>
          <p className="text-muted-foreground">The listing you are looking for does not exist or has been removed.</p>
        </div>
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout 
      title={listing.title} 
      showMap={false}
    >
      <MarketplaceListingDetail listing={listing} />
    </UnifiedDashboardLayout>
  );
}
