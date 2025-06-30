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

/**
 * Props for the EnhancedMarketplacePreviewCard component.
 * Extends the MarketplacePreviewCardProps but ensures id is required
 * for referral link generation functionality.
 * 
 * @interface EnhancedMarketplacePreviewCardProps
 * @extends {Omit<MarketplacePreviewCardProps, 'id'>}
 * @property {string} id - Unique identifier for the listing, required for referral link generation
 */
interface EnhancedMarketplacePreviewCardProps extends Omit<MarketplacePreviewCardProps, 'id'> {
  id: string; // Add listing ID for referral link generation
}

/**
 * EnhancedMarketplacePreviewCard Component
 * 
 * An enhanced version of the MarketplacePreviewCard that adds referral link generation
 * functionality through a popover interface. This component allows users to easily
 * share marketplace listings with others through generated referral links.
 * 
 * The component wraps the standard MarketplacePreviewCard and adds a popover that
 * contains the ReferralLinkGenerator component when triggered.
 * 
 * Features:
 * - All standard MarketplacePreviewCard functionality
 * - Integrated referral link generation
 * - Type mapping between marketplace listing types and referral system types
 * 
 * @param {EnhancedMarketplacePreviewCardProps} props - Component props including all MarketplacePreviewCard props plus required id
 * @returns {JSX.Element} An enhanced marketplace card with referral functionality
 * 
 * @example
 * ```tsx
 * <EnhancedMarketplacePreviewCard
 *   id="listing-123"
 *   title="Professional House Cleaning"
 *   description="Thorough cleaning service for homes of all sizes"
 *   price="35"
 *   image="/images/house-cleaning.jpg"
 *   rating={4.8}
 *   reviewCount={24}
 *   type="service"
 *   location="San Francisco, CA"
 * />
 * ```
 */
export function EnhancedMarketplacePreviewCard(props: EnhancedMarketplacePreviewCardProps) {
  /**
   * Maps the marketplace listing type to the referral system's expected type values
   * 
   * @param {string | undefined} type - The marketplace listing type
   * @returns {string} The corresponding referral system type ('job', 'service', 'rental', or 'item')
   */
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
  
  /**
   * The mapped listing type for the referral system
   */
  const listingType = getListingType(props.type);
  
  /**
   * Extract id from props to avoid passing it to MarketplacePreviewCard
   * This is necessary because the base MarketplacePreviewCard doesn't expect an id prop
   */
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
