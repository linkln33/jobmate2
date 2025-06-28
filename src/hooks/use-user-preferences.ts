import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/compatibility';
import { userService } from '../services/userService';

/**
 * Hook to fetch and manage user preferences for compatibility calculations
 */
export function useUserPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Update user preferences
   * @param newPreferences Updated user preferences
   */
  const updatePreferences = async (newPreferences: UserPreferences) => {
    // Use either the provided userId in the hook or from the preferences object
    const targetUserId = userId || newPreferences.userId;
    if (!targetUserId) return;
    
    try {
      // Update preferences in service
      const updatedPreferences = await userService.updateUserPreferences(targetUserId, newPreferences);
      // Update local state
      setPreferences(updatedPreferences);
    } catch (err) {
      console.error('Error updating user preferences:', err);
      setError(err instanceof Error ? err : new Error('Failed to update user preferences'));
    }
  };
  
  useEffect(() => {
    async function fetchPreferences() {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const userPrefs = await userService.getUserPreferences(userId);
        setPreferences(userPrefs);
      } catch (err) {
        console.error('Error fetching user preferences:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user preferences'));
        
        // Use mock data as fallback for development
        setPreferences({
          userId,
          generalPreferences: {
            priceImportance: 8,
            locationImportance: 7,
            qualityImportance: 9,
          },
          categoryPreferences: {
            jobs: {
              desiredSkills: ['JavaScript', 'React', 'TypeScript'],
              minSalary: 60000,
              maxSalary: 120000,
              workArrangement: ['remote', 'hybrid'],
              experienceLevel: 'mid'
            },
            services: {
              serviceTypes: ['development', 'design', 'marketing'],
              maxPrice: 200,
              preferredDistance: 25,
              minProviderRating: 4.5
            }
          },
          dailyPreferences: {
            intent: 'Looking for remote development opportunities',
            budget: 100000,
            location: 'Remote',
            urgency: 3
          },
          weightPreferences: {
            skills: 0.3,
            location: 0.15,
            availability: 0.1,
            price: 0.1,
            userPreferences: 0.1,
            previousInteractions: 0.1,
            reputation: 0.1,
            aiTrend: 0.05
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPreferences();
  }, [userId]);
  
  return { preferences, isLoading, error, setPreferences, updatePreferences };
}
