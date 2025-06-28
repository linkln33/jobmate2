import { useState, useEffect } from 'react';
import { CompatibilityResult } from '@/types/compatibility';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { userService } from '@/services/userService';

interface UseUserToUserCompatibilityOptions {
  targetUserId: string;
}

/**
 * Hook to calculate compatibility between the current user and another user
 */
export function useUserToUserCompatibility({ 
  targetUserId 
}: UseUserToUserCompatibilityOptions) {
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Get current user ID - in a real app, this would come from auth context
  const currentUserId = 'current-user'; // Placeholder - replace with actual user ID
  const { preferences: currentUserPreferences, isLoading: loadingCurrentUser } = useUserPreferences(currentUserId);
  
  useEffect(() => {
    const calculateUserCompatibility = async () => {
      if (loadingCurrentUser || !currentUserPreferences || !targetUserId) return;
      
      try {
        setLoading(true);
        
        // Get target user's preferences
        const targetUserPreferences = await userService.getUserPreferences(targetUserId);
        
        if (!targetUserPreferences) {
          throw new Error('Could not load target user preferences');
        }
        
        // Calculate compatibility between users
        const compatibilityResult = await userService.calculateUserToUserCompatibility(
          currentUserPreferences,
          targetUserPreferences
        );
        
        setResult(compatibilityResult);
      } catch (err) {
        console.error('Error calculating user compatibility:', err);
        setError(err instanceof Error ? err : new Error('Unknown error calculating user compatibility'));
      } finally {
        setLoading(false);
      }
    };
    
    calculateUserCompatibility();
  }, [targetUserId, currentUserPreferences, loadingCurrentUser]);
  
  return {
    compatibilityResult: result,
    loading: loading || loadingCurrentUser,
    error
  };
}
