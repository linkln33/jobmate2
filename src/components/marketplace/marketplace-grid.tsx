"use client";

import React from 'react';
import { MarketplaceListingCardProps } from './marketplace-listing-card';
import { EnhancedMarketplaceListingCard } from './enhanced-marketplace-listing-card';

interface MarketplaceGridProps {
  listings: MarketplaceListingCardProps[];
  onListingClick?: (id: string) => void;
  className?: string;
}

export function MarketplaceGrid({
  listings,
  onListingClick,
  className = ''
}: MarketplaceGridProps) {
  console.log('MarketplaceGrid received listings:', listings.length);
  console.log('Listing types in grid:', listings.map(l => l.type));
  console.log('First 3 listings:', listings.slice(0, 3));
  
  // Log detailed info about each type of listing
  const itemListings = listings.filter(l => l.type === 'item');
  const serviceListings = listings.filter(l => l.type === 'service');
  const rentalListings = listings.filter(l => l.type === 'rental');
  const jobListings = listings.filter(l => l.type === 'job');
  
  console.log('Items in grid:', itemListings.length, itemListings.map(l => l.id));
  console.log('Services in grid:', serviceListings.length, serviceListings.map(l => l.id));
  console.log('Rentals in grid:', rentalListings.length, rentalListings.map(l => l.id));
  console.log('Jobs in grid:', jobListings.length, jobListings.map(l => l.id));
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {listings.length > 0 ? listings.map((listing) => (
        <EnhancedMarketplaceListingCard
          key={listing.id}
          {...listing}
          onClick={() => onListingClick?.(listing.id)}
        />
      )) : <div className="col-span-4 text-center py-8">No listings found</div>}
    </div>
  );
}
