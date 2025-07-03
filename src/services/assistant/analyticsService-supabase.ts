/**
 * Assistant Analytics Service (Supabase Implementation)
 * 
 * Provides data aggregation and analysis for the assistant usage
 */

import { getSupabaseClient } from '@/lib/supabase/client';
import { AssistantMode } from '@/contexts/AssistantContext/types';

/**
 * Get assistant usage statistics by mode
 * @param userId User ID
 * @returns Object containing usage statistics by mode
 */
export const getAssistantUsageByMode = async (userId: string) => {
  try {
    const supabase = getSupabaseClient();
    
    // Query all logs for this user
    const { data: logs, error } = await supabase
      .from('assistant_memory_logs')
      .select('mode')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error retrieving assistant logs:', error);
      return [];
    }
    
    // Group and count by mode
    const modeCounts: Record<string, number> = {};
    logs.forEach(log => {
      modeCounts[log.mode] = (modeCounts[log.mode] || 0) + 1;
    });
    
    // Convert to expected format
    return Object.entries(modeCounts).map(([mode, count]) => ({
      mode,
      count
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
    const supabase = getSupabaseClient();
    
    // Query all logs for this user
    const { data: logs, error } = await supabase
      .from('assistant_memory_logs')
      .select('interaction_type')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error retrieving assistant logs:', error);
      return [];
    }
    
    // Group and count by interaction type
    const typeCounts: Record<string, number> = {};
    logs.forEach(log => {
      if (log.interaction_type) {
        typeCounts[log.interaction_type] = (typeCounts[log.interaction_type] || 0) + 1;
      }
    });
    
    // Convert to expected format
    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
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
    const supabase = getSupabaseClient();
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Query logs within date range
    const { data: logs, error } = await supabase
      .from('assistant_memory_logs')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
      
    if (error) {
      console.error('Error retrieving assistant logs:', error);
      return [];
    }
    
    // Create a map of dates with zero counts
    const dateMap: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dateMap[dateString] = 0;
    }
    
    // Count logs by date
    logs.forEach(log => {
      const dateString = new Date(log.created_at).toISOString().split('T')[0];
      if (dateMap[dateString] !== undefined) {
        dateMap[dateString]++;
      }
    });
    
    // Convert to expected format
    return Object.entries(dateMap).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => a.date.localeCompare(b.date));
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
    const supabase = getSupabaseClient();
    
    // Count total suggestions
    const { count: totalSuggestions, error: totalError } = await supabase
      .from('assistant_suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    if (totalError) {
      console.error('Error counting suggestions:', totalError);
      return {
        totalSuggestions: 0,
        clickedSuggestions: 0,
        dismissedSuggestions: 0,
        pendingSuggestions: 0,
        clickThroughRate: 0
      };
    }
    
    // Count clicked suggestions
    const { count: clickedSuggestions, error: clickedError } = await supabase
      .from('assistant_suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'clicked');
      
    // Count dismissed suggestions
    const { count: dismissedSuggestions, error: dismissedError } = await supabase
      .from('assistant_suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'dismissed');
      
    // Count pending suggestions
    const { count: pendingSuggestions, error: pendingError } = await supabase
      .from('assistant_suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'pending');
    
    // Calculate click-through rate
    const clickThroughRate = (totalSuggestions || 0) > 0 
      ? (clickedSuggestions || 0) / (totalSuggestions || 0) 
      : 0;
    
    return {
      totalSuggestions: totalSuggestions || 0,
      clickedSuggestions: clickedSuggestions || 0,
      dismissedSuggestions: dismissedSuggestions || 0,
      pendingSuggestions: pendingSuggestions || 0,
      clickThroughRate
    };
  } catch (error) {
    console.error('Error retrieving suggestion engagement metrics:', error);
    return {
      totalSuggestions: 0,
      clickedSuggestions: 0,
      dismissedSuggestions: 0,
      pendingSuggestions: 0,
      clickThroughRate: 0
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
    const supabase = getSupabaseClient();
    
    // Query all logs for this user
    const { data: logs, error } = await supabase
      .from('assistant_memory_logs')
      .select('feature')
      .eq('user_id', userId)
      .not('feature', 'is', null);
      
    if (error) {
      console.error('Error retrieving assistant logs:', error);
      return [];
    }
    
    // Group and count by feature
    const featureCounts: Record<string, number> = {};
    logs.forEach(log => {
      if (log.feature) {
        featureCounts[log.feature] = (featureCounts[log.feature] || 0) + 1;
      }
    });
    
    // Convert to expected format and sort by count
    return Object.entries(featureCounts)
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count);
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
