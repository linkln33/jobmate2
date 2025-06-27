"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceListings } from '@/data/marketplace-listings';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Button } from '@/components/ui/button';
import { Grid, ArrowLeft } from 'lucide-react';
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { MarketplaceMap } from '@/components/map/marketplace-map';
import { MarketplaceListing } from '@/types/marketplace';



export default function MarketplaceMapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState(marketplaceListings);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      setFilteredListings(marketplaceListings);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = marketplaceListings.filter(listing => (
      listing.title.toLowerCase().includes(lowerQuery) ||
      listing.description.toLowerCase().includes(lowerQuery) ||
      (listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    ));
    
    setFilteredListings(filtered);
  };
  
  // Handle listing selection (when a marker is clicked)
  const handleListingSelect = (listing: MarketplaceListing) => {
    setSelectedListingId(listing.id);
    router.push(`/marketplace/listing/${listing.id}`);
  };
  
  // Handle back to grid view
  const handleBackToGrid = () => {
    router.push('/marketplace');
  };
  
  return (
    <UnifiedDashboardLayout title="Marketplace Map" showMap={false}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToGrid}
              className="flex items-center gap-2"
            >
              <Grid className="h-4 w-4" />
              <span>Grid View</span>
            </Button>
            <h1 className="text-2xl font-bold">Marketplace Map</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredListings.length} listings found
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <MarketplaceSearch onSearch={handleSearch} />
        </div>
        
        <div className="h-[calc(100vh-250px)] min-h-[500px] w-full rounded-lg overflow-hidden border">
          <MarketplaceMap 
            listings={filteredListings}
            onListingSelect={handleListingSelect}
            selectedListingId={selectedListingId}
          />
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
