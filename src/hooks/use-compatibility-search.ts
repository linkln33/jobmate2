// Declare the global Meilisearch client type
declare global {
  interface Window {
    meilisearchClient?: {
      index: (name: string) => {
        search: (query: string, options: any) => Promise<{
          hits: any[];
          estimatedTotalHits?: number;
        }>;
      };
    };
  }
}

import { useState, useEffect, useCallback } from 'react';
import { CompatibilityEngine } from '@/services/compatibility/engine';
import { UserPreferences } from '@/types/compatibility';

// Define the search result type
interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  price?: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  [key: string]: any; // Allow for additional fields
}

// Define the search params type
interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: string[];
  limit?: number;
  offset?: number;
}

// Define the compatibility search options
export interface CompatibilitySearchOptions {
  userPreferences?: UserPreferences;
  minCompatibilityScore?: number;
  prioritizeCompatibility?: boolean;
  weightFactor?: number;
}

/**
 * Custom hook that combines Meilisearch results with compatibility scoring
 */
export function useCompatibilitySearch(
  indexName: string,
  compatibilityEngine: CompatibilityEngine,
  options: CompatibilitySearchOptions = {}
) {
  const [results, setResults] = useState<any[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const {
    userPreferences,
    minCompatibilityScore = 0,
    prioritizeCompatibility = false,
    weightFactor = 0.5
  } = options;
  
  const search = useCallback(async (
    searchParams: SearchParams
  ) => {
    if (!window.meilisearchClient) {
      setError(new Error('Meilisearch client not initialized'));
      return;
    }
    
    try {
      setLoading(true);
      
      // Get the index
      const index = window.meilisearchClient.index(indexName);
      
      // Perform the search
      const searchResults = await index.search(searchParams.query || '', {
        filter: searchParams.filters || [],
        sort: searchParams.sort || [],
        limit: searchParams.limit || 20,
        offset: searchParams.offset || 0
      });
      
      setTotalHits(searchResults.estimatedTotalHits || 0);
      
      let processedResults = [...searchResults.hits];
      
      // If we have user preferences, calculate compatibility scores
      if (userPreferences) {
        processedResults = await Promise.all(
          processedResults.map(async (result) => {
            try {
              const compatibilityResult = await compatibilityEngine.calculateCompatibility(
                userPreferences,
                result,
                result.category || 'general'
              );
              
              return {
                ...result,
                compatibilityScore: compatibilityResult.overallScore,
                compatibilityReason: compatibilityResult.primaryMatchReason
              };
            } catch (error) {
              console.error(`Error calculating compatibility for result ${result.id}:`, error);
              return {
                ...result,
                compatibilityScore: 0,
                compatibilityReason: 'Error calculating compatibility'
              };
            }
          })
        );
      }
      
      // Filter by minimum compatibility score if specified
      if (minCompatibilityScore > 0) {
        processedResults = processedResults.filter(
          (result) => (result.compatibilityScore || 0) >= minCompatibilityScore
        );
      }
      
      // Sort by compatibility score if prioritizing compatibility
      if (prioritizeCompatibility && userPreferences) {
        processedResults = processedResults.sort((a, b) => 
          (b.compatibilityScore || 0) - (a.compatibilityScore || 0)
        );
      }
      
      setResults(processedResults);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [indexName, userPreferences, minCompatibilityScore, prioritizeCompatibility, weightFactor, compatibilityEngine]);
  
  return {
    search,
    results,
    loading,
    error,
    totalHits
  };
}
