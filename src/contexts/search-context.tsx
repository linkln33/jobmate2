"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { InstantSearch, Configure } from 'react-instantsearch';
import { searchClient } from '@/utils/algolia';

type SearchContextType = {
  // Add any additional context properties here
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  return (
    <SearchContext.Provider value={{}}>
      <InstantSearch 
        searchClient={searchClient} 
        indexName="jobmate_listings"
      >
        <Configure 
          hitsPerPage={12}
          distinct={true}
        />
        {children}
      </InstantSearch>
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
