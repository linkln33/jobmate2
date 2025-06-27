"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { marketplaceService, MarketplaceListing as ServiceListing } from "@/services/marketplaceService";
import { UnifiedDashboardLayout } from "@/components/layout/unified-dashboard-layout";
import { MarketplaceListingDetail } from "@/components/marketplace/listing-detail/marketplace-listing-detail";
import { MarketplaceListing } from "@/types/marketplace";

export default function MarketplaceListingPage() {
  const params = useParams();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.id as string;
        const foundListing = await marketplaceService.getListingById(listingId);
        setListing(foundListing as unknown as MarketplaceListing || null);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setListing(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
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
