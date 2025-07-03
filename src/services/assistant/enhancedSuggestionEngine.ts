/**
 * Enhanced Suggestion Engine for the Unified Adaptive AI Assistant
 * Integrates rule-based logic with ML capabilities for more intelligent suggestions
 */

import { getSupabaseServiceClient } from '@/lib/supabase/client';
import { AssistantMode, AssistantSuggestion } from '@/contexts/AssistantContext/types';
import mlIntegration from './mlIntegration';
import aiAssistantService from './aiAssistantService';

// Type for context state to avoid circular dependencies
type ContextState = {
  currentMode?: AssistantMode;
  currentPath?: string;
  userRole?: 'CUSTOMER' | 'SPECIALIST' | null;
  currentContext?: string;
};

/**
 * Enhanced suggestion engine that combines rule-based logic with ML predictions
 */
export const enhancedSuggestionEngine = {
  /**
   * Generate suggestions for a user based on mode, context, and ML predictions
   * @param userId User ID
   * @param mode Assistant mode
   * @param context Current context (optional)
   * @returns Array of suggestions
   */
  async generateSuggestions(
    userId: string,
    mode: AssistantMode,
    context?: ContextState
  ): Promise<Partial<AssistantSuggestion>[]> {
    try {
      // Get basic user data
      const supabase = getSupabaseServiceClient();
      
      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('id', userId)
        .single();
        
      if (userError) {
        console.error('Error fetching user:', userError);
        throw new Error('Error fetching user data');
      }
      
      // Get user skills
      const { data: userSkills, error: skillsError } = await supabase
        .from('userSkills')
        .select('*, skill(*)')
        .eq('userId', userId);
        
      if (skillsError) {
        console.error('Error fetching user skills:', skillsError);
      }
      
      // Combine user with skills
      const userWithSkills = {
        ...user,
        skills: userSkills || []
      };

      if (!userWithSkills) {
        throw new Error('User not found');
      }

      // Calculate user engagement score (simplified)
      const engagementScore = 50; // Default to medium engagement
      
      // Initialize suggestions array
      const suggestions: Partial<AssistantSuggestion>[] = [];

      // Add basic suggestions based on mode
      switch (mode) {
        case 'MATCHING':
          suggestions.push({
            userId,
            title: 'Improve your job matches',
            content: 'Add more skills to your profile to see better job matches.',
            mode: 'MATCHING',
            context: 'job-matching',
            priority: 2,
            isActive: true
          });
          break;
          
        case 'PROJECT_SETUP':
          suggestions.push({
            userId,
            title: 'Project setup tips',
            content: 'Make sure to add a detailed description to your project.',
            mode: 'PROJECT_SETUP',
            context: 'project-creation',
            priority: 2,
            isActive: true
          });
          break;
          
        case 'PROFILE':
          suggestions.push({
            userId,
            title: 'Complete your profile',
            content: 'Add a professional photo to increase your visibility.',
            mode: 'PROFILE',
            context: 'profile-completion',
            priority: 2,
            isActive: true
          });
          break;
          
        case 'PAYMENTS':
          suggestions.push({
            userId,
            title: 'Payment methods',
            content: 'Add a payment method to speed up future transactions.',
            mode: 'PAYMENTS',
            context: 'payment-setup',
            priority: 2,
            isActive: true
          });
          break;
          
        case 'MARKETPLACE':
          suggestions.push({
            userId,
            title: 'Marketplace tips',
            content: 'Filter by rating to find top-rated specialists.',
            mode: 'MARKETPLACE',
            context: 'marketplace-browsing',
            priority: 2,
            isActive: true
          });
          break;
          
        case 'GENERAL':
        default:
          suggestions.push({
            userId,
            title: 'Welcome to JobMate',
            content: 'Explore our features to get the most out of the platform.',
            mode: 'GENERAL',
            context: 'general',
            priority: 2,
            isActive: true
          });
          break;
      }

      // Add context-specific suggestions if available
      if (context?.currentPath) {
        if (context.currentPath.includes('matching')) {
          suggestions.push({
            userId,
            title: 'Matching criteria',
            content: 'Adjust your location preferences to see more matches.',
            mode,
            context: 'matching-criteria',
            priority: 3,
            isActive: true
          });
        }
        
        if (context.currentPath.includes('profile')) {
          suggestions.push({
            userId,
            title: 'Profile visibility',
            content: 'Make your profile public to get more job opportunities.',
            mode,
            context: 'profile-settings',
            priority: 3,
            isActive: true
          });
        }
      }

      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  },
};

export default enhancedSuggestionEngine;
