import { useState, useEffect } from 'react';
import { UserPreferences, MainCategory } from '@/types/compatibility';
import { compatibilityEngine } from '@/services/compatibility/engine';
import { calculateCompatibilityScore } from '@/utils/compatibility';

interface ListingWithScore {
  id: string;
  title: string;
  description?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  location?: any;
  tags?: string[];
  [key: string]: any;
}

export function useCompatibilityScores<T extends ListingWithScore>(
  listings: T[],
  userPreferences: UserPreferences | null
) {
  const [scoredListings, setScoredListings] = useState<(T & { 
    compatibilityScore: number;
    compatibilityReason: string;
  })[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!listings || !userPreferences) {
      setScoredListings(listings.map(listing => ({
        ...listing,
        compatibilityScore: 0,
        compatibilityReason: 'No user preferences available'
      })));
      return;
    }

    const calculateScores = async () => {
      setIsCalculating(true);
      
      try {
        // Use the compatibility engine if available, otherwise fall back to utility function
        const withScores = listings.map(listing => {
          try {
            // Try to use the compatibility engine first
            if (compatibilityEngine) {
              try {
                // Get the listing category or default to marketplace
                const categoryStr = (listing.category as string) || 'marketplace';
                const category = categoryStr as MainCategory;
                
                // Pass the category as a separate parameter as required by the engine
                const result = compatibilityEngine.calculateCompatibility(
                  userPreferences,
                  category,
                  listing, // Pass the entire listing as the third parameter
                  {} // Empty contextual factors as the fourth parameter
                );
                
                return {
                  ...listing,
                  compatibilityScore: result.overallScore / 100, // Convert to 0-1 scale
                  compatibilityReason: result.primaryMatchReason || 'Based on your preferences'
                };
              } catch (error) {
                console.warn('Compatibility engine error, falling back to utility:', error);
                // Fall back to utility function if engine fails
              }
            }
            
            // Fall back to utility function
            const result = calculateCompatibilityScore(
              userPreferences,
              {
                id: listing.id,
                tags: listing.tags || [],
                location: typeof listing.location === 'string' ? listing.location : 
                         (listing.location?.address || ''),
                schedule: listing.schedule || [],
                price: listing.price,
                category: listing.category,
                creatorId: listing.owner?.id
              }
            );
            
            return {
              ...listing,
              compatibilityScore: result.score / 100, // Convert to 0-1 scale
              compatibilityReason: result.primaryReason
            };
          } catch (error) {
            console.error('Error calculating compatibility score:', error);
            return {
              ...listing,
              compatibilityScore: 0.5, // Default moderate score
              compatibilityReason: 'Score calculation error'
            };
          }
        });
        
        setScoredListings(withScores);
      } catch (error) {
        console.error('Error in compatibility calculation:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateScores();
  }, [listings, userPreferences]);

  return {
    scoredListings,
    isCalculating
  };
}
