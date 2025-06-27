"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { marketplaceService, MarketplaceListing as ServiceListing } from "@/services/marketplaceService";
import { MarketplaceListing } from "@/types/marketplace";
import { MarketplaceListingCard } from "@/components/marketplace/marketplace-listing-card";

interface ListingSimilarProps {
  currentListingId: string;
  currentListingType: string;
  maxItems?: number;
}

// Helper function to map service listing type to MarketplaceListingCardProps type
function mapListingType(type: string): 'job' | 'service' | 'item' | 'rental' | undefined {
  switch (type) {
    case 'service':
      return 'service';
    case 'job':
      return 'job';
    case 'item':
    case 'product': // Handle 'product' type from service
      return 'item';
    case 'rental':
    case 'equipment': // Handle 'equipment' type from service
      return 'rental';
    default:
      return undefined;
  }
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
    const fetchSimilarListings = async () => {
      try {
        const allListings = await marketplaceService.getAllListings();
        const similar = allListings
          .filter(listing => 
            listing.id !== currentListingId && 
            listing.type === currentListingType
          )
          .slice(0, maxItems);
        
        setSimilarListings(similar as unknown as MarketplaceListing[]);
      } catch (error) {
        console.error('Error fetching similar listings:', error);
        setSimilarListings([]);
      }
    };
    
    fetchSimilarListings();
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
            price={String(listing.pricing?.price || '0')}
            priceUnit={listing.pricing?.unit}
            imageUrl={listing.media && listing.media.length > 0 ? listing.media[0].url : '/placeholder-image.jpg'}
            tags={listing.tags || []}
            type={mapListingType(listing.type)}
            user={{
              name: listing.contactInfo?.email || 'Unknown Seller',
              avatar: '/images/avatars/avatar-1.png'
            }}
            onClick={() => handleListingClick(listing.id)}
          />
        ))}
      </div>
    </div>
  );
}
