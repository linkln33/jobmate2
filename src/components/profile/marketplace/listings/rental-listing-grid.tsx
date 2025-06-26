"use client";

import { useState, useEffect } from "react";
import { RentalListing, UserOffering } from "@/types/marketplace";
import { ListingCard } from "./listing-card";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data - will be replaced with actual API calls
import { mockListings } from "../../../../data/mock-listings";

interface RentalListingGridProps {
  userId: string;
}

export function RentalListingGrid({ userId }: RentalListingGridProps) {
  const [listings, setListings] = useState<RentalListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading state
    setLoading(true);
    
    // Using mock data - no artificial delay
    const userRentalListings = mockListings
      .filter((listing) => listing.userId === userId && listing.listingType === 'rental') as RentalListing[];
    setListings(userRentalListings);
    setLoading(false);
    
    // In a real implementation, this would be an API call
    // const fetchListings = async () => {
    //   try {
    //     const response = await fetch(`/api/users/${userId}/rentals`);
    //     const data = await response.json();
    //     setListings(data);
    //   } catch (error) {
    //     console.error("Error fetching rental listings:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchListings();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 min-h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No rentals found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {listings.map((listing) => (
        <ListingCard 
          key={listing.id} 
          listing={listing} 
          userName="User Name" // This would come from user data
          userAvatar="/path/to/avatar.jpg" // This would come from user data
        />
      ))}
    </div>
  );
}
