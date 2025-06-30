"use client";

import React from 'react';
import { useHits, useStats } from 'react-instantsearch';
import { Loader2 } from 'lucide-react';

interface SearchResultsProps {
  renderItem: (hit: any) => React.ReactNode;
  emptyMessage?: string;
  loadingMessage?: string;
  className?: string;
}

export function SearchResults({
  renderItem,
  emptyMessage = "No results found. Try adjusting your search.",
  loadingMessage = "Searching...",
  className = ""
}: SearchResultsProps) {
  const { hits, results } = useHits();
  const { areHitsSorted, nbHits, processingTimeMS } = useStats();
  
  const isLoading = !results;
  const isEmpty = nbHits === 0;
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">{loadingMessage}</p>
      </div>
    );
  }
  
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Found {nbHits} results in {processingTimeMS}ms
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hits.map((hit) => renderItem(hit))}
      </div>
    </div>
  );
}
