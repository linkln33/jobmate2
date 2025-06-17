/**
 * Assistant Analytics Service
 * 
 * Provides data aggregation and analysis for the assistant usage
 */

import { prisma } from '@/lib/prisma';
import { AssistantMode } from '@/contexts/AssistantContext/types';

/**
 * Get assistant usage statistics by mode
 * @param userId User ID
 * @returns Object containing usage statistics by mode
 */
export const getAssistantUsageByMode = async (userId: string) => {
  try {
    const modeStats = await prisma.assistantMemoryLog.groupBy({
      by: ['mode'],
      where: {
        userId
      },
      _count: {
        id: true
      }
    });

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
    const interactionStats = await prisma.assistantMemoryLog.groupBy({
      by: ['interactionType'],
      where: {
        userId
      },
      _count: {
        id: true
      }
    });

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
    
    const usageLogs = await prisma.assistantMemoryLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

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
    const totalSuggestions = await prisma.assistantSuggestion.count({
      where: {
        userId
      }
    });
    
    const clickedSuggestions = await prisma.assistantSuggestion.count({
      where: {
        userId,
        status: 'clicked'
      }
    });
    
    const dismissedSuggestions = await prisma.assistantSuggestion.count({
      where: {
        userId,
        status: 'dismissed'
      }
    });
    
    const pendingSuggestions = await prisma.assistantSuggestion.count({
      where: {
        userId,
        status: 'pending'
      }
    });
    
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
    const featureStats = await prisma.assistantMemoryLog.groupBy({
      by: ['interactionType'],
      where: {
        userId
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    return featureStats.map(stat => ({
      feature: stat.interactionType,
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
