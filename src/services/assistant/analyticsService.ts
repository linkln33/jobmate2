/**
 * Assistant Analytics Service
 * 
 * Provides data aggregation and analysis for the assistant usage
 */

import { getSupabaseServiceClient } from '@/lib/supabase/client';
import { AssistantMode } from '@/contexts/AssistantContext/types';

/**
 * Get assistant usage statistics by mode
 * @param userId User ID
 * @returns Object containing usage statistics by mode
 */
export const getAssistantUsageByMode = async (userId: string) => {
  try {
    const supabase = getSupabaseServiceClient();
    
    // Supabase doesn't have direct groupBy functionality like Prisma
    // We need to fetch all logs and then group them in JavaScript
    const { data: logs, error } = await supabase
      .from('assistantMemoryLogs')
      .select('mode')
      .eq('userId', userId);
      
    if (error) {
      console.error('Error fetching assistant logs:', error);
      return [];
    }
    
    // Group by mode and count
    const modeMap = new Map();
    logs?.forEach(log => {
      const mode = log.mode;
      modeMap.set(mode, (modeMap.get(mode) || 0) + 1);
    });
    
    const modeStats = Array.from(modeMap.entries()).map(([mode, count]) => ({
      mode,
      _count: { id: count }
    }));

    return modeStats.map(stat => ({
      mode: stat.mode,
      count: stat._count.id
    }));
  } catch (error) {
    console.error('Error retrieving assistant usage by mode:', error);
    return [];
  }
};

/**
 * Get assistant usage statistics by interaction type
 * @param userId User ID
 * @returns Object containing usage statistics by interaction type
 */
export const getAssistantUsageByInteractionType = async (userId: string) => {
  try {
    const supabase = getSupabaseServiceClient();
    
    // Fetch all logs and group them in JavaScript
    const { data: logs, error } = await supabase
      .from('assistantMemoryLogs')
      .select('interactionType')
      .eq('userId', userId);
      
    if (error) {
      console.error('Error fetching assistant logs:', error);
      return [];
    }
    
    // Group by interaction type and count
    const interactionMap = new Map();
    logs?.forEach(log => {
      const interactionType = log.interactionType;
      interactionMap.set(interactionType, (interactionMap.get(interactionType) || 0) + 1);
    });
    
    const interactionStats = Array.from(interactionMap.entries()).map(([interactionType, count]) => ({
      interactionType,
      _count: { id: count }
    }));

    return interactionStats.map(stat => ({
      interactionType: stat.interactionType,
      count: stat._count.id
    }));
  } catch (error) {
    console.error('Error retrieving assistant usage by interaction type:', error);
    return [];
  }
};

/**
 * Get assistant usage over time
 * @param userId User ID
 * @param days Number of days to look back
 * @returns Array of daily usage counts
 */
export const getAssistantUsageOverTime = async (userId: string, days: number = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const supabase = getSupabaseServiceClient();
    
    const { data: usageLogs, error } = await supabase
      .from('assistantMemoryLogs')
      .select('createdAt')
      .eq('userId', userId)
      .gte('createdAt', startDate.toISOString());
      
    if (error) {
      console.error('Error fetching assistant usage logs:', error);
      return [];
    }
    
    // Sort logs by creation date
    const sortedLogs = usageLogs?.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ) || [];

    // Group by day
    const dailyUsage: Record<string, number> = {};
    
    usageLogs.forEach(log => {
      const date = log.createdAt.toISOString().split('T')[0];
      dailyUsage[date] = (dailyUsage[date] || 0) + 1;
    });

    // Fill in missing days with zero counts
    const result = [];
    const currentDate = new Date(startDate);
    const endDate = new Date();
    
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      result.push({
        date: dateString,
        count: dailyUsage[dateString] || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  } catch (error) {
    console.error('Error retrieving assistant usage over time:', error);
    return [];
  }
};

/**
 * Get suggestion engagement metrics
 * @param userId User ID
 * @returns Object containing suggestion engagement metrics
 */
export const getSuggestionEngagementMetrics = async (userId: string) => {
  try {
    const supabase = getSupabaseServiceClient();
    
    // Get total suggestions count
    const { count: totalSuggestions, error: totalError } = await supabase
      .from('assistantSuggestions')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId);
      
    if (totalError) {
      console.error('Error counting total suggestions:', totalError);
      return { totalSuggestions: 0, clickRate: 0, dismissRate: 0, pendingRate: 0 };
    }
    
    // Get clicked suggestions count
    const { count: clickedSuggestions, error: clickedError } = await supabase
      .from('assistantSuggestions')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)
      .eq('status', 'clicked');
      
    if (clickedError) {
      console.error('Error counting clicked suggestions:', clickedError);
    }
    
    // Get dismissed suggestions count
    const { count: dismissedSuggestions, error: dismissedError } = await supabase
      .from('assistantSuggestions')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)
      .eq('status', 'dismissed');
      
    if (dismissedError) {
      console.error('Error counting dismissed suggestions:', dismissedError);
    }
    
    // Get pending suggestions count
    const { count: pendingSuggestions, error: pendingError } = await supabase
      .from('assistantSuggestions')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)
      .eq('status', 'pending');
      
    if (pendingError) {
      console.error('Error counting pending suggestions:', pendingError);
    }
    
    return {
      total: totalSuggestions,
      clicked: clickedSuggestions,
      dismissed: dismissedSuggestions,
      pending: pendingSuggestions,
      engagementRate: totalSuggestions > 0 ? (clickedSuggestions / totalSuggestions) * 100 : 0
    };
  } catch (error) {
    console.error('Error retrieving suggestion engagement metrics:', error);
    return {
      total: 0,
      clicked: 0,
      dismissed: 0,
      pending: 0,
      engagementRate: 0
    };
  }
};

/**
 * Get most used assistant features
 * @param userId User ID
 * @returns Array of most used features
 */
export const getMostUsedFeatures = async (userId: string) => {
  try {
    const supabase = getSupabaseServiceClient();
    
    // Fetch all logs with features
    const { data: logs, error } = await supabase
      .from('assistantMemoryLogs')
      .select('feature')
      .eq('userId', userId)
      .not('feature', 'is', null);
      
    if (error) {
      console.error('Error fetching feature logs:', error);
      return [];
    }
    
    // Group by feature and count
    const featureMap = new Map();
    logs?.forEach(log => {
      const feature = log.feature;
      featureMap.set(feature, (featureMap.get(feature) || 0) + 1);
    });
    
    // Sort by count and take top 5
    const featureStats = Array.from(featureMap.entries())
      .map(([feature, count]) => ({
        feature,
        _count: { id: count }
      }))
      .sort((a, b) => b._count.id - a._count.id)
      .slice(0, 5);

    return featureStats.map(stat => ({
      feature: stat.feature,
      count: stat._count.id
    }));
  } catch (error) {
    console.error('Error retrieving most used features:', error);
    return [];
  }
};

export default {
  getAssistantUsageByMode,
  getAssistantUsageByInteractionType,
  getAssistantUsageOverTime,
  getSuggestionEngagementMetrics,
  getMostUsedFeatures
};
