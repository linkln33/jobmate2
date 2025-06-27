"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceListings } from '@/data/marketplace-listings';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { Button } from '@/components/ui/button';
import { Grid } from 'lucide-react';
import { MarketplaceMap } from '@/components/map/marketplace-map';
import { RecentListingsFeed } from '@/components/marketplace/recent-listings-feed';
import { MarketplaceListing } from '@/types/marketplace';

// Default map center (San Francisco)
const defaultCenter = { lat: 37.7749, lng: -122.4194 };

export default function MarketplaceMapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);

  // Filter listings based on search query and selected categories
  const filteredListings = marketplaceListings.filter(listing => {
    // Filter by search query
    const matchesQuery = !searchQuery || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by selected categories
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(listing.category);
    
    return matchesQuery && matchesCategory;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    // If categoryId is already in the array, remove it, otherwise add it
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleViewGrid = () => {
    router.push('/marketplace');
  };
  
  const handleListingSelect = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
  };

  return (
    <UnifiedDashboardLayout title="Marketplace Map" showMap={false}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Marketplace Map</h1>
          <Button
            variant="default"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={handleViewGrid}
          >
            <Grid className="h-4 w-4" />
            Grid View
          </Button>
        </div>
        
        <div className="mb-4">
          <MarketplaceSearch 
            onSearch={handleSearch} 
            selectedCategories={selectedCategories}
            onCategorySelect={handleCategorySelect}
          />
        </div>
        
        {/* Map container with reduced height to make room for listings feed */}
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden" 
          style={{ height: 'calc(50vh - 100px)', minHeight: '400px', width: '100%', position: 'relative' }}
        >
          {/* Use the MarketplaceMap component directly */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <MarketplaceMap 
              listings={filteredListings} 
              onListingSelect={handleListingSelect}
              selectedListingId={selectedListing?.id}
              defaultCenter={defaultCenter}
              defaultZoom={12}
            />
          </div>
        </div>
        
        {/* Recent listings feed */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <RecentListingsFeed 
            listings={marketplaceListings} 
            title="Recent Marketplace Listings" 
            maxItems={6} 
          />
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
