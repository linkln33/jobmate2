import { useState, useEffect } from 'react';
import { CompatibilityResult, MainCategory } from '@/types/compatibility';
import { useCompatibilityEngine } from '@/hooks/use-compatibility-engine';
import { useUserPreferences } from '@/hooks/use-user-preferences';

interface UseListingCompatibilityOptions {
  listingId: string;
  category: MainCategory;
  listingData: any;
}

export function useListingCompatibility({ 
  listingId, 
  category, 
  listingData 
}: UseListingCompatibilityOptions) {
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { compatibilityEngine } = useCompatibilityEngine();
  // Get current user ID - in a real app, this would come from auth context
  const currentUserId = 'current-user'; // Placeholder - replace with actual user ID
  const { preferences, isLoading: loadingPreferences } = useUserPreferences(currentUserId);
  
  useEffect(() => {
    const calculateCompatibility = async () => {
      if (loadingPreferences || !preferences) return;
      
      try {
        setLoading(true);
        
        // Generate detailed compatibility result with multiple dimensions
        const compatibilityResult = await compatibilityEngine.calculateDetailedCompatibility(
          preferences,
          category,
          listingData,
          { includeImprovementSuggestions: true }
        );
        
        setResult(compatibilityResult);
      } catch (err) {
        console.error('Error calculating detailed compatibility:', err);
        setError(err instanceof Error ? err : new Error('Unknown error calculating compatibility'));
      } finally {
        setLoading(false);
      }
    };
    
    calculateCompatibility();
  }, [listingId, category, listingData, preferences, loadingPreferences, compatibilityEngine]);
  
  return {
    compatibilityResult: result,
    loading: loading || loadingPreferences,
    error
  };
}
