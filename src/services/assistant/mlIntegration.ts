/**
 * Machine Learning Integration for the Assistant
 * 
 * This module provides integration points for future ML capabilities
 * Currently implements placeholder functions that can be replaced with actual ML implementations
 */

import { AssistantMode, AssistantContextState } from '@/contexts/AssistantContext/types';
import { getSupabaseServiceClient } from '@/lib/supabase/client';
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
    const supabase = getSupabaseServiceClient();
    const { data: recentLogs, error } = await supabase
      .from('assistantMemoryLogs')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error('Error fetching recent memory logs:', error);
      return 'JOB_SEARCH'; // Default mode on error
    }
    
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
    const supabase = getSupabaseServiceClient();
    
    // Get user's recent activity logs
    const { data: logs, error: logsError } = await supabase
      .from('assistantMemoryLogs')
      .select('*')
      .eq('userId', userId);
      
    if (logsError) {
      console.error('Error fetching memory logs:', logsError);
    }
    
    // Get user's chat history
    const { data: chatHistory, error: chatError } = await supabase
      .from('assistantChats')
      .select('*')
      .eq('userId', userId);
      
    if (chatError) {
      console.error('Error fetching chat history:', chatError);
    }
    
    // Use empty arrays if data is null
    const safeLogsData = logs || [];
    const safeChatData = chatHistory || [];
    
    // Calculate basic engagement metrics
    const totalInteractions = safeLogsData.length;
    // Use context data for sentiment analysis instead of helpful flag
    const helpfulInteractions = safeLogsData.filter((log: any) => {
      const context = log.context as any;
      return context?.sentiment === 'positive';
    }).length;
    const totalChats = safeChatData.length;
    
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
    const supabase = getSupabaseServiceClient();
    
    // Get user profile data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error('Error fetching user:', userError);
      return [];
    }
    
    // Get user skills
    const { data: skills, error: skillsError } = await supabase
      .from('userSkills')
      .select('*, skill(*)')
      .eq('userId', userId);
      
    if (skillsError) {
      console.error('Error fetching user skills:', skillsError);
    }
    
    // Get specialist profile if exists
    const { data: specialistProfile, error: specialistError } = await supabase
      .from('specialistProfiles')
      .select('*')
      .eq('userId', userId)
      .maybeSingle();
      
    if (specialistError) {
      console.error('Error fetching specialist profile:', specialistError);
    }
    
    // Combine user data
    const userData = {
      ...user,
      skills: skills || [],
      specialistProfile: specialistProfile || null
    };
    
    if (!userData) return [];
    
    // Get jobs posted by user
    const { data: jobsPosted, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('userId', userId)
      .neq('status', 'DELETED')
      .order('createdAt', { ascending: false })
      .limit(5);
      
    if (jobsError) {
      console.error('Error fetching jobs posted:', jobsError);
    }
    
    const safeJobsPosted = jobsPosted || [];
    
    userData.jobsPosted = safeJobsPosted;
    
    if (!userData) {
      throw new Error('User not found');
    }
    
    // Get user's memory logs to analyze patterns
    const { data: recentActivity, error: activityError } = await supabase
      .from('assistantMemoryLogs')
      .select('*')
      .eq('userId', userId)
      .eq('interactionType', 'suggestion_accepted')
      .order('createdAt', { ascending: false })
      .limit(20);
      
    if (activityError) {
      console.error('Error fetching recent activity:', activityError);
    }
    
    const safeRecentActivity = recentActivity || [];
    
    // Extract relevant information from user data
    const userSkills = userData?.skills?.map((s: any) => s.skill?.name) || [];
    const jobCategories = userData?.jobsPosted?.map((j: any) => j.serviceCategoryId) || [];
    const interactionContexts = safeRecentActivity?.map((log: any) => log.context) || [];
    
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
    const supabase = getSupabaseServiceClient();
    
    // Get user feedback logs with text content
    const { data: feedbackLogs, error: feedbackError } = await supabase
      .from('assistantMemoryLogs')
      .select('*')
      .eq('userId', userId)
      .eq('interactionType', 'feedback')
      .order('createdAt', { ascending: false })
      .limit(50);
      
    if (feedbackError) {
      console.error('Error fetching feedback logs:', feedbackError);
      return {
        positiveTopics: [],
        negativeTopics: [],
        overallSentiment: 'neutral'
      };
    }
    
    const safeFeedbackLogs = feedbackLogs || [];
    
    // Count positive and negative feedback based on context data
    const positiveCount = safeFeedbackLogs.filter((log: any) => {
      const context = log.context as any;
      return context?.sentiment === 'positive';
    }).length;
    
    const negativeCount = safeFeedbackLogs.filter((log: any) => {
      const context = log.context as any;
      return context?.sentiment === 'negative';
    }).length;
    
    // Analyze recent activity to find patterns
    const acceptedSuggestionTypes = safeRecentActivity.map((log: any) => {
      try {
        const context = log.context ? JSON.parse(log.context) : {};
        return context.suggestionType || '';
      } catch (e) {
        return '';
      }
    }).filter(Boolean);

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
    const supabase = getSupabaseServiceClient();
    
    // Get user's recent activity logs
    const { data: recentLogs, error: logsError } = await supabase
      .from('assistantMemoryLogs')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(50);
      
    if (logsError) {
      console.error('Error fetching recent logs:', logsError);
    }
    
    const safeRecentLogs = recentLogs || [];
    
    // Get user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('assistantPreferences')
      .select('*')
      .eq('userId', userId)
      .maybeSingle();
      
    if (prefsError) {
      console.error('Error fetching preferences:', prefsError);
    }
    
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error('Error fetching user:', userError);
    }
    
    // Get user skills
    const { data: skills, error: skillsError } = await supabase
      .from('userSkills')
      .select('*, skill(*)')
      .eq('userId', userId);
      
    if (skillsError) {
      console.error('Error fetching user skills:', skillsError);
    }
    
    // Combine user with skills
    const userData = user ? {
      ...user,
      skills: skills || []
    } : null;
    
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
