"use client";

import React from 'react';
import { MarketplaceListingCard, MarketplaceListingCardProps } from './marketplace-listing-card';

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
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {listings.map((listing) => (
        <MarketplaceListingCard
          key={listing.id}
          {...listing}
          onClick={() => onListingClick?.(listing.id)}
        />
      ))}
    </div>
  );
}
