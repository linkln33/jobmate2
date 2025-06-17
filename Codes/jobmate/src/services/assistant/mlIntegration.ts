/**
 * Machine Learning Integration for the Assistant
 * 
 * This module provides integration points for future ML capabilities
 * Currently implements placeholder functions that can be replaced with actual ML implementations
 */

import { AssistantMode, AssistantContextState } from '@/contexts/AssistantContext/types';
import { prisma } from '@/lib/prisma';
import aiAssistantService from './aiAssistantService';

/**
 * Predict the most relevant assistant mode based on user behavior and context
 */
export const predictRelevantMode = async (
  userId: string,
  currentPath: string,
  userActivity: Record<string, any>
): Promise<AssistantMode> => {
  // In a real implementation, this would use a trained model
  // For now, use simple rule-based logic as a placeholder
  
  try {
    // Get user's recent memory logs
    const recentLogs = await (prisma as any).assistantMemoryLog?.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    // Path-based mode mapping (simple rules)
    if (currentPath.includes('/jobs')) {
      return 'MATCHING';
    } else if (currentPath.includes('/project')) {
      return 'PROJECT_SETUP';
    } else if (currentPath.includes('/profile')) {
      return 'PROFILE';
    } else if (currentPath.includes('/payment') || currentPath.includes('/billing')) {
      return 'PAYMENTS';
    } else if (currentPath.includes('/marketplace')) {
      return 'MARKETPLACE';
    }
    
    // If we have recent logs, check most used mode
    if (recentLogs.length > 0) {
      const modeCounts: Record<AssistantMode, number> = {
        MATCHING: 0,
        PROJECT_SETUP: 0,
        PAYMENTS: 0,
        PROFILE: 0,
        MARKETPLACE: 0,
        GENERAL: 0
      };
      
      recentLogs.forEach((log: { mode?: string }) => {
        if (log.mode) {
          modeCounts[log.mode as AssistantMode]++;
        }
      });
      
      // Find mode with highest count
      let maxCount = 0;
      let predictedMode: AssistantMode = 'GENERAL';
      
      Object.entries(modeCounts).forEach(([mode, count]) => {
        if (count > maxCount) {
          maxCount = count;
          predictedMode = mode as AssistantMode;
        }
      });
      
      return predictedMode;
    }
    
    return 'GENERAL';
  } catch (error) {
    console.error('Error predicting relevant mode:', error);
    return 'GENERAL';
  }
};

/**
 * Calculate user engagement score with the assistant
 * Higher score means more engaged user
 */
export const calculateEngagementScore = async (userId: string): Promise<number> => {
  try {
    // Get user's recent activity logs
    const logs = await (prisma as any).assistantMemoryLog?.findMany({
      where: { userId }
    }) || [];
    
    // Get user's chat history
    const chatHistory = await (prisma as any).assistantChat?.findMany({
      where: { userId }
    }) || [];
    
    // Calculate basic engagement metrics
    const totalInteractions = logs.length;
    // Use context data for sentiment analysis instead of helpful flag
    const helpfulInteractions = logs.filter((log: any) => {
      const context = log.context as any;
      return context?.sentiment === 'positive';
    }).length;
    const totalChats = chatHistory.length;
    
    // Simple scoring formula (would be replaced by ML model)
    const baseScore = Math.min(totalInteractions * 5, 50);
    const helpfulnessBonus = helpfulInteractions * 10;
    const chatBonus = totalChats * 15;
    
    const totalScore = Math.min(baseScore + helpfulnessBonus + chatBonus, 100);
    
    return totalScore;
  } catch (error) {
    console.error('Error calculating engagement score:', error);
    return 50; // Default middle score
  }
};

/**
 * Predict the most relevant suggestions for the user based on context and history
 */
export const predictRelevantSuggestions = async (
  userId: string,
  mode: AssistantMode,
  context: AssistantContextState
): Promise<string[]> => {
  try {
    // Get user profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        specialistProfile: true
      }
    }) as any; // Cast to any to handle custom fields
    
    // Fetch jobs posted by user separately
    const jobsPosted = await prisma.job.findMany({
      where: { customerId: userId },
      take: 5
    });
    
    // Attach to user object
    user.jobsPosted = jobsPosted;
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get user's memory logs to analyze patterns
    const recentActivity = await (prisma as any).assistantMemoryLog?.findMany({
      where: { 
        userId,
        // Use interactionType instead of helpful flag
        interactionType: 'suggestion_accepted'
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    }) || [];
    
    // Extract relevant information from user data
    const userSkills = user?.skills?.map((s: any) => s.skill?.name) || [];
    const jobCategories = user?.jobsPosted?.map((j: any) => j.serviceCategoryId) || [];
    const interactionContexts = recentActivity?.map((log: any) => log.context) || [];
    
    // In a real implementation, this would use a trained model
    // For now, use the AI service as a placeholder for ML capabilities
    const suggestedTopics = await aiAssistantService.generateContextualSuggestions(
      mode,
      context,
      {
        skills: userSkills,
        recentJobs: user.jobsPosted.map((j: any) => j.title),
        interactionHistory: interactionContexts
      }
    );

    return suggestedTopics;
  } catch (error) {
    console.error('Error predicting relevant suggestions:', error);
    return [
      'Complete your profile to improve job matches',
      'Check out new jobs that match your skills',
      'Update your preferences for better recommendations'
    ];
  }
};

/**
 * Analyze user feedback to improve assistant responses
 */
export const analyzeFeedback = async (userId: string): Promise<{
  positiveTopics: string[];
  negativeTopics: string[];
  overallSentiment: 'positive' | 'neutral' | 'negative';
}> => {
  try {
    // Get user feedback logs with text content
    const feedbackLogs = await (prisma as any).assistantMemoryLog?.findMany({
      where: {
        userId,
        interactionType: 'feedback' // Use interactionType instead of feedbackText
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    // Count positive and negative feedback based on context data
    const positiveCount = feedbackLogs.filter((log: any) => {
      const context = log.context as any;
      return context?.sentiment === 'positive';
    }).length;
    
    const negativeCount = feedbackLogs.filter((log: any) => {
      const context = log.context as any;
      return context?.sentiment === 'negative';
    }).length;
    
    // Simple sentiment analysis (would be replaced by ML model)
    let overallSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    
    if (positiveCount > negativeCount * 2) {
      overallSentiment = 'positive';
    } else if (negativeCount > positiveCount * 2) {
      overallSentiment = 'negative';
    }
    
    // In a real implementation, this would use NLP to extract topics
    // For now, use simple placeholders
    return {
      positiveTopics: ['matching suggestions', 'profile tips', 'quick responses'],
      negativeTopics: ['payment explanations', 'technical issues'],
      overallSentiment
    };
  } catch (error) {
    console.error('Error analyzing feedback:', error);
    return {
      positiveTopics: [],
      negativeTopics: [],
      overallSentiment: 'neutral'
    };
  }
};

/**
 * Score suggestions based on relevance to user context and history
 * Returns suggestions with relevance scores attached
 */
export const scoreSuggestions = async (
  userId: string,
  suggestions: Array<any>,
  context: AssistantContextState
): Promise<Array<any>> => {
  try {
    // Get user's recent activity and preferences
    const recentLogs = await (prisma as any).assistantMemoryLog?.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    }) || [];
    
    // Get user preferences
    const preferences = await (prisma as any).assistantPreference?.findUnique({
      where: { userId }
    }) || {};
    
    // Get user profile data for context
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        specialistProfile: true
      }
    });
    
    // Calculate base scores for each suggestion
    return suggestions.map(suggestion => {
      // Start with base score
      let score = 50;
      
      // 1. Context matching (0-30 points)
      if (suggestion.context && context.currentPath) {
        // Direct context match
        if (context.currentPath.includes(suggestion.context)) {
          score += 30;
        } 
        // Partial context match
        else if (suggestion.context.split('_').some((part: string) => 
          context.currentPath.includes(part))) {
          score += 15;
        }
      }
      
      // 2. User history (0-25 points)
      const similarInteractions = recentLogs.filter((log: any) => 
        log.action === suggestion.action || 
        log.context === suggestion.context
      );
      
      // If user has interacted with similar suggestions
      if (similarInteractions.length > 0) {
        // Calculate acceptance rate
        const acceptedCount = similarInteractions.filter(
          (log: any) => log.interactionType === 'suggestion_accepted'
        ).length;
        
        const acceptanceRate = acceptedCount / similarInteractions.length;
        
        // Higher acceptance rate = higher score
        score += Math.round(acceptanceRate * 25);
      }
      
      // 3. Priority boost (0-20 points)
      if (suggestion.priority) {
        score += (suggestion.priority * 6);
      }
      
      // 4. Skill relevance (0-15 points)
      if (suggestion.skills && user?.skills) {
        const userSkills = user.skills.map((s: any) => s.skill?.name.toLowerCase());
        const suggestionSkills = Array.isArray(suggestion.skills) 
          ? suggestion.skills.map((s: string) => s.toLowerCase())
          : [];
          
        // Count matching skills
        const matchingSkills = suggestionSkills.filter(
          (skill: string) => userSkills.includes(skill)
        ).length;
        
        if (matchingSkills > 0) {
          // Award points based on percentage of matching skills
          const matchPercentage = matchingSkills / suggestionSkills.length;
          score += Math.round(matchPercentage * 15);
        }
      }
      
      // 5. Recency adjustment (-10 to 0 points)
      // Reduce score for suggestions user has seen recently
      const recentSameSuggestion = recentLogs.find(
        (log: any) => 
          log.title === suggestion.title && 
          new Date(log.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      
      if (recentSameSuggestion) {
        score -= 10;
      }
      
      // Ensure score is within bounds (0-100)
      score = Math.max(0, Math.min(100, score));
      
      // Attach score to suggestion
      return {
        ...suggestion,
        relevanceScore: score
      };
    });
  } catch (error) {
    console.error('Error scoring suggestions:', error);
    // Return original suggestions with default score if error
    return suggestions.map(suggestion => ({
      ...suggestion,
      relevanceScore: 50 // Default middle score
    }));
  }
};

export default {
  predictRelevantMode,
  calculateEngagementScore,
  predictRelevantSuggestions,
  analyzeFeedback,
  scoreSuggestions
};
