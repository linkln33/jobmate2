'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { MarketplaceListingCard, MarketplaceListingCardProps } from './marketplace-listing-card';
import { ReferralLinkGenerator } from '@/components/referrals/referral-link-generator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EnhancedMarketplaceListingCardProps extends MarketplaceListingCardProps {
  // Additional props if needed
}

export function EnhancedMarketplaceListingCard(props: EnhancedMarketplaceListingCardProps) {
  const [showReferral, setShowReferral] = useState(false);
  
  // Extract the listing type from props, defaulting to 'item' if not provided
  const listingType = props.type || 'item';
  
  // Create a custom onClick handler that will wrap the original onClick and also handle the share button click
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was on the share button
    const target = e.target as HTMLElement;
    const isShareButton = target.closest('.share-button-container');
    
    if (isShareButton) {
      // Prevent the card click from triggering
      e.stopPropagation();
      // Toggle the referral panel
      setShowReferral(!showReferral);
    } else if (props.onClick) {
      // If not clicking on share button, call the original onClick
      props.onClick();
    }
  };
  
  return (
    <div className="relative" onClick={handleCardClick}>
      {/* Original marketplace listing card */}
      <MarketplaceListingCard {...props} onClick={undefined} />
      
      {/* Referral panel */}
      {showReferral && (
        <div className="absolute top-full left-0 right-0 z-10 mt-2">
          <ReferralLinkGenerator 
            listingId={props.id}
            listingType={listingType}
          />
        </div>
      )}
    </div>
  );
}
