'use client';

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { MarketplacePreviewCard } from './marketplace-preview-card';
import { ReferralLinkGenerator } from '@/components/referrals/referral-link-generator';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

// Import the props type directly from the MarketplacePreviewCard component
import { MarketplacePreviewCardProps } from './marketplace-preview-card';

interface EnhancedMarketplacePreviewCardProps extends Omit<MarketplacePreviewCardProps, 'id'> {
  id: string; // Add listing ID for referral link generation
}

export function EnhancedMarketplacePreviewCard(props: EnhancedMarketplacePreviewCardProps) {
  // Map the type from MarketplacePreviewCard to the types expected by ReferralLinkGenerator
  const getListingType = (type?: string) => {
    if (!type) return 'item';
    
    switch (type) {
      case 'task':
      case 'gig':
      case 'job':
        return 'job';
      case 'service':
        return 'service';
      case 'rental':
        return 'rental';
      default:
        return 'item';
    }
  };
  
  const listingType = getListingType(props.type);
  
  // Extract id from props to avoid passing it to MarketplacePreviewCard
  const { id, ...marketplaceCardProps } = props;

  return (
    <div className="group relative">
      {/* Wrap the marketplace preview card in a Popover for the share functionality */}
      <Popover>
        <PopoverTrigger asChild>
          <div>
            <MarketplacePreviewCard 
              {...marketplaceCardProps} 
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="center" side="bottom">
          <ReferralLinkGenerator 
            listingId={id}
            listingType={listingType}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
