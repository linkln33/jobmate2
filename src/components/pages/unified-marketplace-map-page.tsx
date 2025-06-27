"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceListings } from '@/data/marketplace-listings';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { MarketplaceHeader } from '@/components/marketplace/marketplace-header';
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { MarketplaceTabs } from '@/components/marketplace/marketplace-tabs';
import { MarketplaceGrid } from '@/components/marketplace/marketplace-grid';
import { MarketplaceMap } from '@/components/map/marketplace-map';
import { Button } from '@/components/ui/button';
import { Grid, Map } from 'lucide-react';
import { MarketplaceTabType as MarketplaceTypeTabType } from '@/types/marketplace';
import { MarketplaceTabType } from '@/components/marketplace/marketplace-tabs';

export function UnifiedMarketplaceMapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MarketplaceTabType>('all');
  const [filteredListings, setFilteredListings] = useState(marketplaceListings);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  
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
      filterListingsByTab(activeTab);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = marketplaceListings.filter(listing => {
      // Filter by active tab first
      if (activeTab !== 'all' && listing.type !== activeTab.slice(0, -1)) {
        return false;
      }
      
      // Then filter by search query
      return (
        listing.title.toLowerCase().includes(lowerQuery) ||
        listing.description.toLowerCase().includes(lowerQuery) ||
        listing.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    });
    
    setFilteredListings(filtered);
  }, [activeTab]);
  
  // Filter listings by tab
  const filterListingsByTab = useCallback((tab: MarketplaceTabType) => {
    if (tab === 'all') {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setFilteredListings(marketplaceListings);
      }
      return;
    }
    
    // Remove 's' from the end of the tab name to get the type
    // e.g., 'jobs' -> 'job'
    const type = tab.slice(0, -1);
    
    const filtered = marketplaceListings.filter(listing => {
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          listing.type === type &&
          (listing.title.toLowerCase().includes(lowerQuery) ||
           listing.description.toLowerCase().includes(lowerQuery) ||
           listing.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
      }
      
      return listing.type === type;
    });
    
    setFilteredListings(filtered);
  }, [searchQuery, handleSearch]);
  
  // Handle tab change
  const handleTabChange = useCallback((tab: MarketplaceTabType) => {
    setActiveTab(tab);
    filterListingsByTab(tab);
  }, [filterListingsByTab]);
  
  // Handle map marker click
  const handleMarkerClick = useCallback((listing: any) => {
    setSelectedListingId(listing.id);
  }, []);
  
  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'map' : 'grid');
  }, []);

  return (
    <UnifiedDashboardLayout title="Marketplace" showMap={false}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <MarketplaceHeader onCreateListing={handleCreateListing} />
          <Button
            variant="outline"
            size="sm"
            onClick={toggleViewMode}
            className="flex items-center gap-2"
          >
            {viewMode === 'grid' ? (
              <>
                <Map className="h-4 w-4" />
                <span>Map View</span>
              </>
            ) : (
              <>
                <Grid className="h-4 w-4" />
                <span>Grid View</span>
              </>
            )}
          </Button>
        </div>
        
        <MarketplaceSearch onSearch={handleSearch} />
        
        <MarketplaceTabs activeTab={activeTab} onTabChange={handleTabChange}>
          {viewMode === 'grid' ? (
            <MarketplaceGrid 
            listings={filteredListings.map(listing => ({
              ...listing,
              price: listing.price.toString()
            }))} 
            onListingClick={handleListingClick} 
          />
          ) : (
            <div className="h-[calc(100vh-300px)] min-h-[500px] w-full rounded-lg overflow-hidden border">
              <MarketplaceMap 
                listings={filteredListings}
                onListingSelect={handleMarkerClick}
                selectedListingId={selectedListingId}
              />
            </div>
          )}
        </MarketplaceTabs>
      </div>
    </UnifiedDashboardLayout>
  );
}
