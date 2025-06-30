"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';

// Import marketplace components
import { MarketplaceHeader } from '@/components/marketplace/marketplace-header';
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { MarketplaceTabs, MarketplaceTabType } from '@/components/marketplace/marketplace-tabs';
import { MarketplaceGrid } from '@/components/marketplace/marketplace-grid';
import { MarketplaceListingCardProps } from '@/components/marketplace/marketplace-listing-card';
import { marketplaceListings } from '@/data/marketplace-listings';

export function UnifiedMarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MarketplaceTabType>('all');
  const [filteredListings, setFilteredListings] = useState<typeof marketplaceListings>(marketplaceListings);
  
  // Transform marketplace listings to match MarketplaceListingCardProps interface
  const transformedListings = useMemo(() => {
    // Force refresh all listings on component mount
    if (filteredListings.length === 0 && marketplaceListings.length > 0) {
      return marketplaceListings.map(listing => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: typeof listing.price === 'number' ? `$${listing.price}${listing.priceUnit ? `/${listing.priceUnit}` : ''}` : listing.price,
        priceUnit: listing.priceUnit,
        imageUrl: listing.imageUrl,
        tags: listing.tags || [],
        type: listing.type as 'job' | 'service' | 'item' | 'rental',
        isFeatured: listing.isFeatured || false,
        isVerified: listing.isVerified || false,
        isVip: listing.isVip || false,
        user: {
          name: listing.user?.name || listing.sellerName || 'JobMate User',
          avatar: listing.user?.avatar || ''
        },
        stats: {
          views: listing.viewCount || 0,
          likes: listing.favoriteCount || 0,
          comments: 0
        }
      }));
    }
    
    return filteredListings.map(listing => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: typeof listing.price === 'number' ? `$${listing.price}${listing.priceUnit ? `/${listing.priceUnit}` : ''}` : listing.price,
      priceUnit: listing.priceUnit,
      imageUrl: listing.imageUrl,
      tags: listing.tags || [],
      type: listing.type as 'job' | 'service' | 'item' | 'rental',
      isFeatured: listing.isFeatured || false,
      isVerified: listing.isVerified || false,
      isVip: listing.isVip || false,
      user: {
        name: listing.user?.name || listing.sellerName || 'JobMate User',
        avatar: listing.user?.avatar || ''
      },
      stats: {
        views: listing.viewCount || 0,
        likes: listing.favoriteCount || 0,
        comments: 0
      }
    }));
  }, [filteredListings, marketplaceListings]);
  
  // Handle search query changes
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      setFilteredListings(marketplaceListings);
      return;
    }
    
    // Filter listings based on search query
    const filtered = marketplaceListings.filter(listing => 
      listing.title.toLowerCase().includes(query.toLowerCase()) ||
      listing.description.toLowerCase().includes(query.toLowerCase()) ||
      listing.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredListings(filtered);
  }, []);
  
  // Handle tab changes
  const handleTabChange = useCallback((tab: MarketplaceTabType) => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
    
    // Map tab types to listing types
    const typeMap: Record<MarketplaceTabType, string> = {
      all: '',
      items: 'item',
      services: 'service',
      rentals: 'rental',
      jobs: 'job'
    };
    
    console.log('Looking for listings with type:', typeMap[tab]);
    console.log('Available types in marketplace listings:', Array.from(new Set(marketplaceListings.map(l => l.type))));
    
    if (tab === 'all') {
      const allListings = marketplaceListings.filter(listing => 
        searchQuery ? (
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) : true
      );
      console.log('All listings count:', allListings.length);
      setFilteredListings(allListings);
      return;
    }
    
    // Filter listings by type
    const filtered = marketplaceListings.filter(listing => {
      const matchesType = listing.type === typeMap[tab];
      const matchesSearch = !searchQuery || (
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesType && matchesSearch;
    });
    
    console.log(`Filtered ${tab} listings:`, filtered.length);
    console.log('Filtered listing IDs:', filtered.map(l => l.id));
    
    setFilteredListings(filtered);
  }, [searchQuery]);
  
  // Handle listing click
  const handleListingClick = useCallback((id: string) => {
    router.push(`/marketplace/listing/${id}`);
  }, [router]);
  
  // Handle create listing button click
  const handleCreateListing = useCallback(() => {
    router.push('/marketplace/create');
  }, [router]);
  
  // Ensure listings are loaded on component mount
  useEffect(() => {
    console.log('All marketplace listings:', marketplaceListings);
    console.log('Item listings:', marketplaceListings.filter(l => l.type === 'item').length);
    console.log('Service listings:', marketplaceListings.filter(l => l.type === 'service').length);
    console.log('Rental listings:', marketplaceListings.filter(l => l.type === 'rental').length);
    console.log('Job listings:', marketplaceListings.filter(l => l.type === 'job').length);
    
    // Force all listings to be shown
    setFilteredListings([...marketplaceListings]);
  }, [marketplaceListings]);

  return (
    <UnifiedDashboardLayout title="Marketplace" showMap={false}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <MarketplaceHeader 
            onCreateListing={handleCreateListing} 
            className="mb-8"
          />
          
          {/* Search Bar */}
          <GlassCard className="mb-8" intensity="low">
            <GlassCardContent className="p-3">
              <MarketplaceSearch 
                onSearch={handleSearch} 
                onFilter={() => {}} 
                className="w-full"
              />
            </GlassCardContent>
          </GlassCard>
          
          {/* Main Content */}
          <MarketplaceTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            className="mb-8"
          >
            {/* Grid of marketplace listings */}
            <div className="mt-6">
              {filteredListings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No listings found matching your criteria.
                  </p>
                </div>
              ) : (
                <MarketplaceGrid 
                  listings={transformedListings} 
                  onListingClick={handleListingClick}
                  className="mt-4"
                />
              )}
            </div>
          </MarketplaceTabs>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
