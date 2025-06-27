"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceListings } from '@/data/marketplace-listings';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { MarketplaceHeader } from '@/components/marketplace/marketplace-header';
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { MarketplaceTabs } from '@/components/marketplace/marketplace-tabs';
import { MarketplaceGrid } from '@/components/marketplace/marketplace-grid';
import { Button } from '@/components/ui/button';
import { Grid, Map } from 'lucide-react';
import { MarketplaceTabType } from '@/components/marketplace/marketplace-tabs';
import { MarketplaceListing } from '@/types/marketplace';
import { MarketplaceListingCardProps } from '@/components/marketplace/marketplace-listing-card';

// Helper function to convert MarketplaceListing to MarketplaceListingCardProps
function convertToCardProps(listings: MarketplaceListing[]): MarketplaceListingCardProps[] {
  return listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: listing.price.toString(),
    priceUnit: listing.priceUnit,
    imageUrl: listing.imageUrl,
    tags: listing.tags || [],
    type: listing.type,
    isFeatured: listing.isFeatured,
    isVerified: listing.isVerified,
    isVip: listing.isVip,
    user: {
      name: listing.sellerName || listing.user?.name || 'Unknown',
      avatar: listing.sellerImage || listing.user?.avatar
    }
  }));
}

// Helper function to map MarketplaceTabType to listing type
function getListingTypeForTab(tab: MarketplaceTabType): string | null {
  switch (tab) {
    case 'items': return 'item';
    case 'services': return 'service';
    case 'rentals': return 'rental';
    case 'jobs': return 'job';
    case 'all': return null;
    default: return null;
  }
}

export default function MarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MarketplaceTabType>('all');
  const [filteredListings, setFilteredListings] = useState(marketplaceListings);
  
  // Handle listing click
  const handleListingClick = useCallback((id: string) => {
    router.push(`/marketplace/listing/${id}`);
  }, [router]);
  
  // Handle create listing
  const handleCreateListing = useCallback(() => {
    router.push('/marketplace/create');
  }, [router]);
  
  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      // If search is cleared, just filter by tab
      if (activeTab === 'all') {
        setFilteredListings(marketplaceListings);
      } else {
        const listingType = getListingTypeForTab(activeTab);
        setFilteredListings(marketplaceListings.filter(listing => 
          listingType ? listing.type === listingType : true
        ));
      }
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    let filtered = marketplaceListings;
    
    // First filter by tab if not 'all'
    if (activeTab !== 'all') {
      const listingType = getListingTypeForTab(activeTab);
      filtered = filtered.filter(listing => 
        listingType ? listing.type === listingType : true
      );
    }
    
    // Then filter by search query
    filtered = filtered.filter(listing => (
      listing.title.toLowerCase().includes(lowerQuery) ||
      listing.description.toLowerCase().includes(lowerQuery) ||
      (listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    ));
    
    setFilteredListings(filtered);
  }, [activeTab]);
  
  // Handle tab change
  const handleTabChange = useCallback((tab: MarketplaceTabType) => {
    setActiveTab(tab);
    
    // Reset search when changing tabs
    if (tab === 'all') {
      setFilteredListings(marketplaceListings);
    } else {
      const listingType = getListingTypeForTab(tab);
      setFilteredListings(marketplaceListings.filter(listing => 
        listingType ? listing.type === listingType : true
      ));
    }
  }, []);
  
  // Handle view map
  const handleViewMap = useCallback(() => {
    router.push('/marketplace/map');
  }, [router]);

  // Convert listings to the format expected by MarketplaceGrid
  const cardProps = convertToCardProps(filteredListings);
  
  return (
    <UnifiedDashboardLayout title="Marketplace" showMap={false}>
      <div className="flex flex-col h-full">
        <MarketplaceHeader onCreateListing={handleCreateListing} />
        
        <div className="flex justify-between items-center mb-4">
          <MarketplaceTabs activeTab={activeTab} onTabChange={handleTabChange} />
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewMap}
              className="flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              <span>Map View</span>
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <MarketplaceSearch onSearch={handleSearch} />
        </div>
        
        <MarketplaceGrid 
          listings={cardProps} 
          onListingClick={handleListingClick} 
        />
      </div>
    </UnifiedDashboardLayout>
  );
}
