import { useState, useEffect } from 'react';
import { CompatibilityResult } from '@/types/compatibility';
import { notificationService } from '@/services/notificationService';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useCompatibilityEngine } from '@/hooks/use-compatibility-engine';

interface UseCompatibilityNotificationsOptions {
  enabled?: boolean;
  userId?: string;
  notificationThreshold?: number;
}

/**
 * Hook to manage compatibility-based notifications
 * This hook can be used to automatically notify users of high compatibility matches
 */
export function useCompatibilityNotifications({
  enabled = true,
  userId = 'current-user', // Default to current user
  notificationThreshold = 80 // Only notify for matches above this threshold
}: UseCompatibilityNotificationsOptions = {}) {
  const [notifiedItems, setNotifiedItems] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { preferences, isLoading } = useUserPreferences(userId);
  const compatibilityEngine = useCompatibilityEngine();
  
  /**
   * Check if a compatibility result should trigger a notification
   */
  const shouldNotify = (result: CompatibilityResult): boolean => {
    // Check if score is above threshold
    if (result.overallScore < notificationThreshold) {
      return false;
    }
    
    // Check if we've already notified about this item
    if (notifiedItems[`${result.category}-${result.listingId}`]) {
      return false;
    }
    
    return true;
  };
  
  /**
   * Send a notification for a compatibility match
   */
  const notifyMatch = async (
    result: CompatibilityResult, 
    entityType: 'listing' | 'user' | 'job',
    entityTitle: string
  ): Promise<void> => {
    if (!enabled || !userId) return;
    
    try {
      // Send in-app notification
      await notificationService.sendCompatibilityMatchNotification({
        userId,
        compatibilityResult: result,
        entityType,
        entityId: result.listingId,
        entityTitle
      });
      
      // Mark as notified
      setNotifiedItems(prev => ({
        ...prev,
        [`${result.category}-${result.listingId}`]: true
      }));
    } catch (error) {
      console.error('Failed to send compatibility notification:', error);
    }
  };
  
  /**
   * Check a specific item for compatibility and notify if it's a high match
   */
  const checkAndNotify = async (
    itemId: string,
    category: 'jobs' | 'marketplace' | 'user-match',
    itemData: any,
    itemTitle: string
  ): Promise<CompatibilityResult | null> => {
    if (!enabled || isLoading || !preferences) return null;
    
    try {
      setIsProcessing(true);
      
      // Calculate detailed compatibility
      const result = await compatibilityEngine.calculateDetailedCompatibility({
        listingId: itemId,
        category,
        listingData: itemData,
        userPreferences: preferences,
        includeImprovementSuggestions: true
      });
      
      // Determine entity type based on category
      const entityType = category === 'jobs' 
        ? 'job' 
        : (category === 'marketplace' ? 'listing' : 'user');
      
      // Notify if it's a high match
      if (shouldNotify(result)) {
        await notifyMatch(result, entityType as any, itemTitle);
      }
      
      return result;
    } catch (error) {
      console.error('Error checking compatibility for notifications:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Check multiple items for compatibility and notify for high matches
   */
  const checkBatchAndNotify = async (
    items: Array<{ id: string; category: 'jobs' | 'marketplace' | 'user-match'; data: any; title: string }>
  ): Promise<CompatibilityResult[]> => {
    if (!enabled || isLoading || !preferences) return [];
    
    try {
      setIsProcessing(true);
      
      const results: CompatibilityResult[] = [];
      
      // Process each item
      for (const item of items) {
        const result = await checkAndNotify(item.id, item.category, item.data, item.title);
        if (result) {
          results.push(result);
        }
      }
      
      return results;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    checkAndNotify,
    checkBatchAndNotify,
    isProcessing,
    notifiedItems,
    clearNotifiedItems: () => setNotifiedItems({})
  };
}
