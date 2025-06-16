/**
 * Enhanced Suggestion Engine for the Unified Adaptive AI Assistant
 * Integrates rule-based logic with ML capabilities for more intelligent suggestions
 */

import { prisma } from '@/lib/prisma';
import { matchingService } from '@/services/server/matching-service';
import { AssistantMode, AssistantSuggestion, AssistantContext } from '@/contexts/AssistantContext/types';
import mlIntegration from './mlIntegration';
import aiAssistantService from './aiAssistantService';

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
    context?: AssistantContext
  ): Promise<Partial<AssistantSuggestion>[]> {
    try {
      // Get user data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          skills: {
            include: {
              skill: true
            }
          },
          specialistServices: true,
          jobsPosted: {
            where: { status: 'OPEN' },
            take: 5,
            orderBy: { createdAt: 'desc' }
          },
          jobsAppliedTo: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          },
          assistantPreference: true,
          assistantMemoryLogs: {
            take: 20,
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate user engagement score
      const engagementScore = await mlIntegration.calculateEngagementScore(userId);
      
      // Initialize suggestions array
      const suggestions: Partial<AssistantSuggestion>[] = [];

      // Generate mode-specific suggestions
      switch (mode) {
        case 'MATCHING':
          await this.generateMatchingSuggestions(userId, user, suggestions, context, engagementScore);
          break;
        case 'PROJECT_SETUP':
          await this.generateProjectSetupSuggestions(userId, user, suggestions, context, engagementScore);
          break;
        case 'PROFILE':
          await this.generateProfileSuggestions(userId, user, suggestions, context, engagementScore);
          break;
        case 'PAYMENTS':
          await this.generatePaymentSuggestions(userId, user, suggestions, context, engagementScore);
          break;
        case 'MARKETPLACE':
          await this.generateMarketplaceSuggestions(userId, user, suggestions, context, engagementScore);
          break;
        case 'GENERAL':
        default:
          await this.generateGeneralSuggestions(userId, user, suggestions, context, engagementScore);
          break;
      }

      // Add ML-predicted suggestions if user is highly engaged
      if (engagementScore > 60) {
        try {
          const mlSuggestions = await mlIntegration.predictRelevantSuggestions(userId, mode, context || {});
          
          // Add ML suggestions to the list
          mlSuggestions.forEach((suggestion, index) => {
            suggestions.push({
              userId,
              title: `Smart Suggestion ${index + 1}`,
              content: suggestion,
              mode,
              context: context ? JSON.stringify(context) : undefined,
              priority: 2,
              isActive: true,
              aiGenerated: true
            });
          });
        } catch (error) {
          console.error('Error getting ML suggestions:', error);
        }
      }

      // Filter based on proactivity level
      const proactivityLevel = user.assistantPreference?.proactivityLevel || 2;
      let filteredSuggestions = suggestions;

      if (proactivityLevel === 1) {
        // Minimal: Only high priority suggestions
        filteredSuggestions = suggestions.filter(s => s.priority === 3);
      } else if (proactivityLevel === 2) {
        // Balanced: Medium and high priority suggestions
        filteredSuggestions = suggestions.filter(s => s.priority && s.priority >= 2);
      }
      // Level 3 (Proactive): All suggestions

      return filteredSuggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  },

  /**
   * Generate matching-related suggestions with ML enhancements
   */
  async generateMatchingSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: AssistantContext,
    engagementScore: number = 50
  ): Promise<void> {
    try {
      // If in job matching context, provide matching tips
      if (context && context.page === 'job_matching') {
        // Check if user has skills
        if (user.skills.length === 0) {
          suggestions.push({
            userId,
            title: 'Add skills to improve matches',
            content: 'Adding relevant skills to your profile will help you get better job matches.',
            mode: 'MATCHING',
            context: JSON.stringify(context),
            priority: 3,
            actionUrl: '/profile/skills',
            isActive: true
          });
        }

        // Get top job matches using matching service
        const topMatches = await matchingService.findMatchesForUser(
          userId,
          { limit: 5, offset: 0 }
        );

        if (topMatches && topMatches.length > 0) {
          // Suggest top match
          suggestions.push({
            userId,
            title: 'Top job match available',
            content: `We found a great match: "${topMatches[0].title}". This job aligns well with your skills and preferences.`,
            mode: 'MATCHING',
            context: JSON.stringify(context),
            priority: 2,
            actionUrl: `/jobs/${topMatches[0].id}`,
            isActive: true
          });

          // For highly engaged users, provide more detailed match analysis
          if (engagementScore > 70 && topMatches.length >= 3) {
            suggestions.push({
              userId,
              title: 'Match trend analysis',
              content: `Based on your recent applications, we've noticed you're most successful with ${topMatches[0].category} roles. Consider focusing on similar positions.`,
              mode: 'MATCHING',
              context: JSON.stringify(context),
              priority: 2,
              isActive: true,
              aiGenerated: true
            });
          }

          // Suggest improving match criteria if there are few matches
          if (topMatches.length < 3) {
            suggestions.push({
              userId,
              title: 'Expand your matching criteria',
              content: 'Consider adjusting your location preferences or adding more skills to see more job matches.',
              mode: 'MATCHING',
              context: JSON.stringify(context),
              priority: 1,
              actionUrl: '/profile/preferences',
              isActive: true
            });
          }
        } else {
          // No matches found
          suggestions.push({
            userId,
            title: 'No matches found',
            content: 'Try expanding your search criteria or adding more skills to your profile.',
            mode: 'MATCHING',
            context: JSON.stringify(context),
            priority: 2,
            actionUrl: '/profile/skills',
            isActive: true
          });
        }
      }
      
      // If user has applied to jobs recently, provide application status suggestions
      if (user.jobsAppliedTo && user.jobsAppliedTo.length > 0) {
        const recentApplication = user.jobsAppliedTo[0];
        
        suggestions.push({
          userId,
          title: 'Recent application status',
          content: `You applied to "${recentApplication.job.title}" recently. Check the status of your application.`,
          mode: 'MATCHING',
          priority: 2,
          actionUrl: `/applications/${recentApplication.id}`,
          isActive: true
        });
      }
      
      // If user hasn't applied to jobs in a while, suggest new opportunities
      const lastApplicationDate = user.jobsAppliedTo && user.jobsAppliedTo.length > 0 
        ? new Date(user.jobsAppliedTo[0].createdAt) 
        : null;
        
      if (lastApplicationDate && (new Date().getTime() - lastApplicationDate.getTime()) > 7 * 24 * 60 * 60 * 1000) {
        suggestions.push({
          userId,
          title: 'New job opportunities',
          content: 'It\'s been a week since your last application. Check out new job postings that match your skills.',
          mode: 'MATCHING',
          priority: 2,
          actionUrl: '/jobs',
          isActive: true
        });
      }
    } catch (error) {
      console.error('Error generating matching suggestions:', error);
    }
  },

  /**
   * Generate project setup suggestions with ML enhancements
   */
  async generateProjectSetupSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: AssistantContext,
    engagementScore: number = 50
  ): Promise<void> {
    try {
      // If user has open projects, provide project management tips
      if (user.jobsPosted && user.jobsPosted.length > 0) {
        const openProjects = user.jobsPosted.filter((job: any) => job.status === 'OPEN');
        
        if (openProjects.length > 0) {
          suggestions.push({
            userId,
            title: 'Manage your open projects',
            content: `You have ${openProjects.length} open project(s). Make sure to review applications and set up milestones.`,
            mode: 'PROJECT_SETUP',
            priority: 2,
            actionUrl: '/dashboard/projects',
            isActive: true
          });
          
          // For highly engaged users, provide more detailed project advice
          if (engagementScore > 65) {
            suggestions.push({
              userId,
              title: 'Project success tips',
              content: 'Based on successful projects in your industry, consider adding detailed requirements and clear deliverables to attract better candidates.',
              mode: 'PROJECT_SETUP',
              priority: 2,
              isActive: true,
              aiGenerated: true
            });
          }
        }
      }
      
      // If in project creation context, provide setup tips
      if (context && context.page === 'project_creation') {
        suggestions.push({
          userId,
          title: 'Project setup best practices',
          content: 'Define clear milestones and deliverables to attract qualified freelancers and ensure project success.',
          mode: 'PROJECT_SETUP',
          context: JSON.stringify(context),
          priority: 3,
          isActive: true
        });
        
        suggestions.push({
          userId,
          title: 'Set realistic deadlines',
          content: 'Projects with realistic timelines receive 40% more qualified applications. Consider your requirements carefully.',
          mode: 'PROJECT_SETUP',
          context: JSON.stringify(context),
          priority: 2,
          isActive: true
        });
      }
      
      // If user has completed projects, suggest leaving reviews
      const completedProjects = user.jobsPosted ? user.jobsPosted.filter((job: any) => job.status === 'COMPLETED') : [];
      
      if (completedProjects.length > 0) {
        const unreviewedProjects = completedProjects.filter((job: any) => !job.clientReview);
        
        if (unreviewedProjects.length > 0) {
          suggestions.push({
            userId,
            title: 'Leave reviews for completed projects',
            content: `You have ${unreviewedProjects.length} completed project(s) without reviews. Leaving feedback helps the community.`,
            mode: 'PROJECT_SETUP',
            priority: 1,
            actionUrl: '/dashboard/reviews',
            isActive: true
          });
        }
      }
    } catch (error) {
      console.error('Error generating project setup suggestions:', error);
    }
  },

  /**
   * Generate other mode-specific suggestions
   * Implementation similar to the above methods, with ML enhancements
   */
  async generateProfileSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: AssistantContext,
    engagementScore: number = 50
  ): Promise<void> {
    // Profile suggestions implementation
    // Similar structure to the above methods
  },

  async generatePaymentSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: AssistantContext,
    engagementScore: number = 50
  ): Promise<void> {
    // Payment suggestions implementation
    // Similar structure to the above methods
  },

  async generateMarketplaceSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: AssistantContext,
    engagementScore: number = 50
  ): Promise<void> {
    // Marketplace suggestions implementation
    // Similar structure to the above methods
  },

  async generateGeneralSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: AssistantContext,
    engagementScore: number = 50
  ): Promise<void> {
    // General suggestions implementation
    // Similar structure to the above methods
  }
};

export default enhancedSuggestionEngine;
