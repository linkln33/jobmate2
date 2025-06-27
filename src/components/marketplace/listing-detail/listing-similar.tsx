"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { marketplaceListings } from "@/data/marketplace-listings";
import { MarketplaceListing } from "@/types/marketplace";
import { MarketplaceListingCard } from "@/components/marketplace/marketplace-listing-card";

interface ListingSimilarProps {
  currentListingId: string;
  currentListingType: string;
  maxItems?: number;
}

export function ListingSimilar({
  currentListingId,
  currentListingType,
  maxItems = 4
}: ListingSimilarProps) {
  const router = useRouter();
  const [similarListings, setSimilarListings] = useState<MarketplaceListing[]>([]);
  
  useEffect(() => {
    // Find similar listings based on type, excluding the current listing
    const similar = marketplaceListings
      .filter(listing => 
        listing.id !== currentListingId && 
        listing.type === currentListingType
      )
      .slice(0, maxItems);
    
    setSimilarListings(similar);
  }, [currentListingId, currentListingType, maxItems]);
  
  const handleListingClick = (id: string) => {
    router.push(`/marketplace/listing/${id}`);
  };

  if (similarListings.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Similar Listings</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {similarListings.map((listing) => (
          <MarketplaceListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            description={listing.description}
            price={String(listing.price)}
            priceUnit={listing.priceUnit}
            imageUrl={listing.imageUrl}
            tags={listing.tags || []}
            type={listing.type}
            user={{
              name: listing.seller?.name || 'Unknown Seller',
              avatar: listing.seller?.avatar
            }}
            onClick={() => handleListingClick(listing.id)}
          />
        ))}
      </div>
    </div>
  );
}
