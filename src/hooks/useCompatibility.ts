import { useState, useEffect, useContext } from 'react';
import AssistantContext from '@/contexts/AssistantContext/AssistantContext';
import { AssistantContextState } from '@/contexts/AssistantContext/types';
import { 
  CompatibilityResult, 
  MainCategory, 
  ContextualFactors 
} from '@/types/compatibility';

/**
 * Hook for calculating and accessing compatibility scores
 */
export const useCompatibility = (
  listingId: string,
  category: MainCategory,
  listingData: any,
  contextualFactors?: ContextualFactors
) => {
  const assistantContext = useContext(AssistantContext);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCompatibility = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the API endpoint to calculate compatibility
        const response = await fetch('/api/compatibility', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user-1', // Default to user-1 for demo
            listingId,
            category,
            listingData,
            contextualFactors
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to calculate compatibility');
        }
        
        const compatibilityResult = await response.json();
        setResult(compatibilityResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error calculating compatibility');
        console.error('Error calculating compatibility:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (listingId && category && listingData) {
      fetchCompatibility();
    }
  }, [listingId, category, listingData, contextualFactors]);
  
  return { result, loading, error };
};

export default useCompatibility;
