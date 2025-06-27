"use client";

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceListings } from '@/data/marketplace-listings';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { MarketplaceHeader } from '@/components/marketplace/marketplace-header';
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { MarketplaceTabs } from '@/components/marketplace/marketplace-tabs';
import { MarketplaceGrid } from '@/components/marketplace/marketplace-grid';
import { Button } from '@/components/ui/button';
import { Grid, Map, Plus } from 'lucide-react';
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

const tabToListingTypeMap: Record<string, string> = {
  items: 'item',
  services: 'service',
  rentals: 'rental',
  jobs: 'job',
  all: 'all'
};

export default function MarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MarketplaceTabType>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // We'll use the useMemo hook instead of this state
  // const [filteredListings, setFilteredListings] = useState(marketplaceListings);
  
  // Handle listing click
  const handleListingClick = useCallback((id: string) => {
    router.push(`/marketplace/listing/${id}`);
  }, [router]);
  
  // Handle create listing
  const handleCreateListing = useCallback(() => {
    router.push('/marketplace/create');
  }, [router]);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };  
  
  // Filter listings based on search query, active tab, and selected categories
  const filteredListings = useMemo(() => {
    return marketplaceListings
      .filter(listing => {
        // Filter by tab
        if (activeTab !== 'all') {
          return listing.type === tabToListingTypeMap[activeTab];
        }
        return true;
      })
      .filter(listing => {
        // Filter by selected categories
        if (selectedCategories.length > 0) {
          return selectedCategories.some(cat => {
            // Match either by listing type or category
            return listing.type === cat || listing.category === cat;
          });
        }
        return true;
      })
      .filter(listing => {
        // Filter by search query
        if (!searchQuery) return true;
        
        const query = searchQuery.toLowerCase();
        return (
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query) ||
          listing.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
  }, [activeTab, searchQuery, selectedCategories]);
  
  // Handle tab change
  const handleTabChange = useCallback((tab: MarketplaceTabType) => {
    setActiveTab(tab);
    setSelectedCategories([]);
    // We no longer need to set filtered listings here as we're using useMemo
  }, []);
  
  // Handle view map
  const handleViewMap = useCallback(() => {
    router.push('/marketplace/map');
  }, [router]);
  
  // Convert listings to the format expected by MarketplaceGrid
  const cardProps = useMemo(() => {
    return convertToCardProps(filteredListings);
  }, [filteredListings]);
  
  return (
    <UnifiedDashboardLayout title="Marketplace" showMap={false}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push('/marketplace/create')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Listing
            </Button>
            
            <Button
              variant="default"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={handleViewMap}
            >
              <Map className="h-4 w-4" />
              Map View
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <MarketplaceSearch 
            onSearch={handleSearch} 
            selectedCategories={selectedCategories}
            onCategorySelect={handleCategorySelect}
          />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <MarketplaceTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        
        <MarketplaceGrid 
          listings={cardProps} 
          onListingClick={handleListingClick} 
        />
      </div>
    </UnifiedDashboardLayout>
  );
}
