"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceService, MarketplaceListing as ServiceListing } from '@/services/marketplaceService';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { MarketplaceHeader } from '@/components/marketplace/marketplace-header';
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { MarketplaceTabs, MarketplaceTabType } from '@/components/marketplace/marketplace-tabs';
import { MarketplaceGrid } from '@/components/marketplace/marketplace-grid';
import { MarketplaceFilters } from '@/components/marketplace/marketplace-filters';
import { Button } from '@/components/ui/button';
import { Grid, Map, Plus } from 'lucide-react';
import { MarketplaceListingCardProps } from '@/components/marketplace/marketplace-listing-card';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to convert ServiceListing to MarketplaceListingCardProps
function convertToCardProps(listings: ServiceListing[]): MarketplaceListingCardProps[] {
  return listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: listing.pricing.price.toString(),
    priceUnit: listing.pricing.unit,
    imageUrl: listing.media.length > 0 ? listing.media[0].url : '/placeholder-image.jpg',
    tags: listing.tags || [],
    type: mapListingType(listing.type),
    isFeatured: false,
    isVerified: true,
    isVip: false,
    user: {
      name: listing.contactInfo?.email || 'Listing Owner',
      avatar: '/images/avatars/avatar-1.png'
    },
    location: `${listing.location.city}, ${listing.location.state}`
  }));
}

// Helper function to map MarketplaceTabType to listing type
function getListingTypeForTab(tab: MarketplaceTabType): string | null {
  switch (tab) {
    case 'items':
      return 'item';
    case 'services':
      return 'service';
    case 'rentals':
      return 'rental';
    case 'jobs':
      return 'job';
    default:
      return null; // 'all' tab or any other tab returns null (no filter)
  }
}

// Helper function to map service listing type to MarketplaceListingCardProps type
function mapListingType(type: string): 'job' | 'service' | 'item' | 'rental' | undefined {
  switch (type) {
    case 'service':
      return 'service';
    case 'job':
      return 'job';
    case 'item':
    case 'product': // Handle 'product' type from service
      return 'item';
    case 'rental':
      return 'rental';
    default:
      return undefined;
  }
}

export default function MarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MarketplaceTabType>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch listings from the marketplace service
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const allListings = await marketplaceService.getAllListings();
        setListings(allListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, []);
  
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
    return listings.filter(listing => {
      // Filter by tab
      if (activeTab !== 'all') {
        const typeFilter = getListingTypeForTab(activeTab);
        if (typeFilter && listing.type !== typeFilter) {
          return false;
        }
      }
      
      // Filter by selected categories
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.some(cat => {
          return listing.category === cat || listing.subcategory === cat;
        });
        if (!matchesCategory) return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query) ||
          listing.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [listings, activeTab, selectedCategories, searchQuery]);
  
  // Convert to card props
  const listingCards = useMemo(() => {
    return convertToCardProps(filteredListings);
  }, [filteredListings]);
  
  // Handle tab change
  const handleTabChange = useCallback((tab: MarketplaceTabType) => {
    setActiveTab(tab);
    setSelectedCategories([]);
  }, []);
  
  // Handle view map
  const handleViewMap = useCallback(() => {
    router.push('/marketplace/map');
  }, [router]);
  
  return (
    <UnifiedDashboardLayout title="Marketplace" showSearch={false}>
      <div className="flex flex-col space-y-6">
        {/* Header with search, filters, and action buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="flex-1">
              <MarketplaceSearch onSearch={handleSearch} />
            </div>
            
            <div className="shrink-0">
              <MarketplaceFilters 
                onFilterChange={(filters) => {
                  console.log('Filters changed:', filters);
                  // Implement filter logic here
                }} 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              variant="warning" 
              size="default"
              className="flex items-center gap-2 h-10 w-36 justify-center"
              onClick={handleViewMap}
            >
              <Map className="h-4 w-4 mr-1" />
              View Map
            </Button>
            
            <Button 
              variant="default"
              size="default"
              className="flex items-center gap-2 h-10 w-44 justify-center"
              onClick={handleCreateListing}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Listing
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-2">
          <MarketplaceTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        
        {/* Listings grid with loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : listingCards.length > 0 ? (
          <MarketplaceGrid 
            listings={listingCards} 
            onListingClick={handleListingClick} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No listings found</p>
            <Button onClick={handleCreateListing}>
              Create Your First Listing
            </Button>
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
