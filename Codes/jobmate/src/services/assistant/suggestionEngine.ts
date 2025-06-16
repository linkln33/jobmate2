import { prisma } from '@/lib/prisma';
import { matchingService } from '@/services/server/matching-service';
import { AssistantMode, AssistantSuggestion } from '@/contexts/AssistantContext/types';

/**
 * Rule-based suggestion engine for the Unified Adaptive AI Assistant
 * Generates contextual suggestions based on user data, current mode, and context
 */
export const suggestionEngine = {
  /**
   * Generate suggestions for a user based on mode and context
   * @param userId User ID
   * @param mode Assistant mode
   * @param context Current context (optional)
   * @returns Array of suggestions
   */
  async generateSuggestions(
    userId: string,
    mode: AssistantMode,
    context?: string
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
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get user preferences
      const preferences = await prisma.assistantPreference.findUnique({
        where: { userId }
      });

      // Initialize suggestions array
      const suggestions: Partial<AssistantSuggestion>[] = [];

      // Generate mode-specific suggestions
      switch (mode) {
        case 'MATCHING':
          await this.generateMatchingSuggestions(userId, user, suggestions, context);
          break;
        case 'PROJECT_SETUP':
          await this.generateProjectSetupSuggestions(userId, user, suggestions, context);
          break;
        case 'PROFILE':
          await this.generateProfileSuggestions(userId, user, suggestions, context);
          break;
        case 'PAYMENTS':
          await this.generatePaymentSuggestions(userId, user, suggestions, context);
          break;
        case 'MARKETPLACE':
          await this.generateMarketplaceSuggestions(userId, user, suggestions, context);
          break;
        case 'GENERAL':
        default:
          await this.generateGeneralSuggestions(userId, user, suggestions, context);
          break;
      }

      // Filter based on proactivity level
      const proactivityLevel = preferences?.proactivityLevel || 2;
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
   * Generate matching-related suggestions
   */
  async generateMatchingSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: string
  ): Promise<void> {
    try {
      // If in job matching context, provide matching tips
      if (context === 'job_matching') {
        // Check if user has skills
        if (user.skills.length === 0) {
          suggestions.push({
            userId,
            title: 'Add skills to improve matches',
            content: 'Adding relevant skills to your profile will help you get better job matches.',
            mode: 'MATCHING',
            context: 'job_matching',
            priority: 3,
            actionUrl: '/profile/skills',
            isActive: true
          });
        }

        // Get top job matches using matching service
        const topMatches = await matchingService.findMatchesForUser(
          userId,
          { limit: 3, offset: 0 }
        );

        if (topMatches && topMatches.length > 0) {
          // Suggest top match
          suggestions.push({
            userId,
            title: 'Top job match available',
            content: `We found a great match: "${topMatches[0].title}". This job aligns well with your skills and preferences.`,
            mode: 'MATCHING',
            context: 'job_matching',
            priority: 2,
            actionUrl: `/jobs/${topMatches[0].id}`,
            isActive: true
          });

          // Suggest improving match criteria if there are few matches
          if (topMatches.length < 3) {
            suggestions.push({
              userId,
              title: 'Expand your matching criteria',
              content: 'Consider adjusting your location preferences or adding more skills to see more job matches.',
              mode: 'MATCHING',
              context: 'job_matching',
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
            context: 'job_matching',
            priority: 2,
            actionUrl: '/profile/skills',
            isActive: true
          });
        }
      }
    } catch (error) {
      console.error('Error generating matching suggestions:', error);
    }
  },

  /**
   * Generate project setup suggestions
   */
  async generateProjectSetupSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: string
  ): Promise<void> {
    try {
      // If in job creation context
      if (context === 'job_creation') {
        // Check if user has posted jobs before
        if (user.jobsPosted.length === 0) {
          suggestions.push({
            userId,
            title: 'First time posting a job?',
            content: 'Here are some tips for creating an effective job posting that attracts the right specialists.',
            mode: 'PROJECT_SETUP',
            context: 'job_creation',
            priority: 3,
            isActive: true
          });
        }

        // Suggest adding detailed requirements
        suggestions.push({
          userId,
          title: 'Add detailed requirements',
          content: 'Jobs with clear requirements get 50% more qualified applicants. Be specific about skills needed.',
          mode: 'PROJECT_SETUP',
          context: 'job_creation',
          priority: 2,
          isActive: true
        });

        // Suggest fair budget
        suggestions.push({
          userId,
          title: 'Set a competitive budget',
          content: 'Setting a fair budget attracts more qualified specialists. Research market rates for similar services.',
          mode: 'PROJECT_SETUP',
          context: 'job_creation',
          priority: 1,
          isActive: true
        });
      }
    } catch (error) {
      console.error('Error generating project setup suggestions:', error);
    }
  },

  /**
   * Generate profile-related suggestions
   */
  async generateProfileSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: string
  ): Promise<void> {
    try {
      // Check profile completeness
      const hasSkills = user.skills.length > 0;
      const hasServices = user.specialistServices.length > 0;
      const hasPortfolio = user.portfolioItems && user.portfolioItems.length > 0;
      const hasBio = !!user.bio;

      // If in skills management context
      if (context === 'skills_management') {
        // Suggest adding more skills if user has few
        if (user.skills.length < 5) {
          suggestions.push({
            userId,
            title: 'Add more skills',
            content: 'Users with 5+ skills get 3x more job matches. Add more relevant skills to your profile.',
            mode: 'PROFILE',
            context: 'skills_management',
            priority: 2,
            isActive: true
          });
        }

        // Suggest getting endorsements
        const endorsedSkills = user.skills.filter((s: any) => s.endorsements && s.endorsements.length > 0);
        if (endorsedSkills.length < user.skills.length / 2) {
          suggestions.push({
            userId,
            title: 'Get skill endorsements',
            content: 'Endorsed skills increase your credibility. Ask colleagues to endorse your skills.',
            mode: 'PROFILE',
            context: 'skills_management',
            priority: 1,
            isActive: true
          });
        }
      } else {
        // General profile suggestions
        if (!hasBio) {
          suggestions.push({
            userId,
            title: 'Complete your bio',
            content: 'A professional bio helps clients understand your background and expertise.',
            mode: 'PROFILE',
            context: 'profile_completion',
            priority: 3,
            actionUrl: '/profile',
            isActive: true
          });
        }

        if (!hasPortfolio && user.role === 'SPECIALIST') {
          suggestions.push({
            userId,
            title: 'Add portfolio items',
            content: 'Showcase your work with portfolio items to attract more clients.',
            mode: 'PROFILE',
            context: 'profile_completion',
            priority: 2,
            actionUrl: '/profile/portfolio',
            isActive: true
          });
        }
      }
    } catch (error) {
      console.error('Error generating profile suggestions:', error);
    }
  },

  /**
   * Generate payment-related suggestions
   */
  async generatePaymentSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: string
  ): Promise<void> {
    try {
      // Check if payment method is set up
      const hasPaymentMethod = await prisma.paymentMethod.findFirst({
        where: { userId }
      });

      if (!hasPaymentMethod) {
        suggestions.push({
          userId,
          title: 'Set up payment method',
          content: 'Add a payment method to streamline transactions on JobMate.',
          mode: 'PAYMENTS',
          context: 'payment_setup',
          priority: 3,
          actionUrl: '/payments/methods',
          isActive: true
        });
      }

      // Check for pending payments
      const pendingPayments = await prisma.payment.findMany({
        where: {
          userId,
          status: 'PENDING'
        }
      });

      if (pendingPayments.length > 0) {
        suggestions.push({
          userId,
          title: 'Pending payments',
          content: `You have ${pendingPayments.length} pending payment${pendingPayments.length > 1 ? 's' : ''} that require your attention.`,
          mode: 'PAYMENTS',
          context: 'payment_management',
          priority: 3,
          actionUrl: '/payments',
          isActive: true
        });
      }
    } catch (error) {
      console.error('Error generating payment suggestions:', error);
    }
  },

  /**
   * Generate marketplace-related suggestions
   */
  async generateMarketplaceSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: string
  ): Promise<void> {
    try {
      // If user is a specialist
      if (user.role === 'SPECIALIST') {
        // Check if specialist has services listed
        if (user.specialistServices.length === 0) {
          suggestions.push({
            userId,
            title: 'List your services',
            content: 'Start offering your services in the marketplace to attract more clients.',
            mode: 'MARKETPLACE',
            context: 'service_listing',
            priority: 3,
            actionUrl: '/marketplace/my-services/new',
            isActive: true
          });
        } else {
          // Suggest optimizing existing services
          suggestions.push({
            userId,
            title: 'Optimize your service listings',
            content: 'Add detailed descriptions and clear pricing to make your services stand out.',
            mode: 'MARKETPLACE',
            context: 'service_optimization',
            priority: 2,
            actionUrl: '/marketplace/my-services',
            isActive: true
          });
        }
      } else {
        // For customers
        // Suggest popular services based on user's interests/skills
        suggestions.push({
          userId,
          title: 'Discover top services',
          content: 'Browse our top-rated services that match your interests.',
          mode: 'MARKETPLACE',
          context: 'service_discovery',
          priority: 2,
          actionUrl: '/marketplace',
          isActive: true
        });
      }
    } catch (error) {
      console.error('Error generating marketplace suggestions:', error);
    }
  },

  /**
   * Generate general suggestions
   */
  async generateGeneralSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: string
  ): Promise<void> {
    try {
      // Welcome new users
      const isNewUser = new Date(user.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
      if (isNewUser) {
        suggestions.push({
          userId,
          title: 'Welcome to JobMate!',
          content: 'Complete your profile to get personalized job matches and opportunities.',
          mode: 'GENERAL',
          context: 'onboarding',
          priority: 3,
          actionUrl: '/profile',
          isActive: true
        });
      }

      // Check for unread notifications
      const unreadNotifications = await prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      });

      if (unreadNotifications > 0) {
        suggestions.push({
          userId,
          title: 'Unread notifications',
          content: `You have ${unreadNotifications} unread notification${unreadNotifications > 1 ? 's' : ''}.`,
          mode: 'GENERAL',
          context: 'notifications',
          priority: 2,
          actionUrl: '/notifications',
          isActive: true
        });
      }

      // Suggest exploring features based on usage patterns
      // This would be more sophisticated in a real implementation
      suggestions.push({
        userId,
        title: 'Explore JobMate features',
        content: 'Discover all the tools and features available to help you succeed on JobMate.',
        mode: 'GENERAL',
        context: 'feature_discovery',
        priority: 1,
        actionUrl: '/help/features',
        isActive: true
      });
    } catch (error) {
      console.error('Error generating general suggestions:', error);
    }
  }
};

export default suggestionEngine;
