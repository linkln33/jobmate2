"use client";

import React, { useState } from 'react';
import { SearchProvider } from '@/contexts/search-context';
import { SearchBar } from './search-bar';
import { SearchResults } from './search-results';
import { SearchFilters } from './search-filters';
import { Filter, MapPin, List, Grid } from 'lucide-react';

// This component would be imported from your marketplace components
import { MarketplaceListingCard } from '../marketplace/marketplace-listing-card';

export function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <SearchProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Marketplace Search</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find jobs, services, items, and rentals in our marketplace
          </p>
        </div>
        
        <div className="mb-6">
          <SearchBar className="max-w-3xl mx-auto" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar - hidden on mobile unless toggled */}
          <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              <SearchFilters />
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            {/* Mobile filter toggle and view options */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={toggleFilters}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow text-sm"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow text-sm"
                >
                  <MapPin className="h-4 w-4" />
                  Map View
                </button>
              </div>
            </div>
            
            {/* Search results */}
            <SearchResults
              renderItem={(hit) => (
                <MarketplaceListingCard
                  key={hit.objectID}
                  listing={hit}
                />
              )}
              className={viewMode === 'list' ? 'space-y-4' : ''}
            />
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
