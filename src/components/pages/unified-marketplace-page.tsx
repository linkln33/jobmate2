"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';

// Import marketplace components
import { MarketplaceHeader } from '@/components/marketplace/marketplace-header';
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { MarketplaceTabs, MarketplaceTabType } from '@/components/marketplace/marketplace-tabs';
import { MarketplaceGrid } from '@/components/marketplace/marketplace-grid';
import { marketplaceListings } from '@/data/marketplace-listings';

export function UnifiedMarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MarketplaceTabType>('all');
  const [filteredListings, setFilteredListings] = useState(marketplaceListings);
  
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
    setActiveTab(tab);
    
    if (tab === 'all') {
      setFilteredListings(marketplaceListings.filter(listing => 
        searchQuery ? (
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) : true
      ));
      return;
    }
    
    // Map tab types to listing types
    const typeMap: Record<MarketplaceTabType, string> = {
      all: '',
      items: 'item',
      services: 'service',
      rentals: 'rental',
      jobs: 'job'
    };
    
    // Filter listings by type
    const filtered = marketplaceListings.filter(listing => 
      listing.type === typeMap[tab] && (
        searchQuery ? (
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) : true
      )
    );
    
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
                  listings={filteredListings} 
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
