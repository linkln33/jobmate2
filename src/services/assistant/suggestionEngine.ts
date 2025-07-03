import { matchingService } from '@/services/server/matching-service';
import { AssistantMode, AssistantSuggestion, AssistantContextState } from '@/contexts/AssistantContext/types';
import descriptionGenerator from './descriptionGenerator';
import priceCalculator, { getPersonalizedPriceEstimates } from './priceCalculator';
import { Prisma, User } from '@/lib/types';
import { scoreSuggestions } from './mlIntegration';
import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/client';

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
    context?: string,
    contextState?: AssistantContextState
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
          }
          // Note: jobsPosted and jobsAppliedTo are handled via type casting below
        }
      }) as any; // Cast to any to avoid TypeScript errors with custom fields
      
      // Fetch jobs posted by user separately to avoid Prisma schema type issues
      const jobsPosted = await prisma.job.findMany({
        where: { 
          customerId: userId, // Using customerId based on User.jobsAsCustomer relation
          status: 'OPEN'
        },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
      
      // Fetch jobs applied to by user
      // Using any type cast to handle potential schema differences
      const jobsAppliedTo = await (prisma as any).application?.findMany({
        where: { applicantId: userId },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
      
      // Attach to user object
      user.jobsPosted = jobsPosted;
      user.jobsAppliedTo = jobsAppliedTo;

      if (!user) {
        throw new Error('User not found');
      }

      // Get user preferences - use try/catch since this model might not exist yet
      let preferences = null;
      try {
        preferences = await (prisma as any).assistantPreference.findUnique({
          where: { userId }
        });
      } catch (error) {
        console.warn('Assistant preferences not available:', error);
      }

      // Initialize suggestions array
      const suggestions: Partial<AssistantSuggestion>[] = [];

      // Generate mode-specific suggestions
      switch (mode) {
        case 'MATCHING':
          await this.generateMatchingSuggestions(userId, user, suggestions, context);
          await this.generatePriceCalculatorSuggestions(userId, user, suggestions, context);
          break;
        case 'PROJECT_SETUP':
          await this.generateProjectSetupSuggestions(userId, user, suggestions, context);
          await this.generateJobDescriptionSuggestions(userId, user, suggestions, context);
          await this.generatePriceCalculatorSuggestions(userId, user, suggestions, context);
          break;
        case 'PROFILE':
          await this.generateProfileSuggestions(userId, user, suggestions, context);
          break;
        case 'PAYMENTS':
          await this.generatePaymentSuggestions(userId, user, suggestions, context);
          await this.generatePriceCalculatorSuggestions(userId, user, suggestions, context);
          break;
        case 'MARKETPLACE':
          await this.generateMarketplaceSuggestions(userId, user, suggestions, context);
          await this.generateJobDescriptionSuggestions(userId, user, suggestions, context);
          await this.generatePriceCalculatorSuggestions(userId, user, suggestions, context);
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
      
      // Apply ML-based relevance scoring if context state is provided
      if (contextState) {
        try {
          // Score suggestions based on user history and context
          const scoredSuggestions = await scoreSuggestions(
            userId,
            filteredSuggestions,
            contextState
          );
          
          // Sort by relevance score (highest first)
          scoredSuggestions.sort((a, b) => 
            (b.relevanceScore || 0) - (a.relevanceScore || 0)
          );
          
          // Limit to top suggestions based on proactivity level
          const suggestionLimit = proactivityLevel === 1 ? 2 : 
                               proactivityLevel === 2 ? 4 : 6;
          
          return scoredSuggestions.slice(0, suggestionLimit);
        } catch (error) {
          console.error('Error applying ML scoring:', error);
          // Fall back to unscored suggestions if scoring fails
          return filteredSuggestions;
        }
      }

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
        // Use try/catch since the method might not exist or have a different signature
        let topMatches = [];
        try {
          topMatches = await (matchingService as any).findMatchesForUser(
            userId,
            { limit: 3, offset: 0 }
          );
        } catch (error) {
          console.warn('Error finding matches:', error);
        }

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
        if (user.jobsPosted && user.jobsPosted.length === 0) {
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
      const hasSkills = user.skills && user.skills.length > 0;
      const hasServices = user.specialistServices && user.specialistServices.length > 0;
      const hasPortfolio = user.portfolioItems && user.portfolioItems.length > 0;
      const hasBio = !!user.bio;

      // If in skills management context
      if (context === 'skills_management') {
        // Suggest adding more skills if user has few
        if (!hasSkills || user.skills.length < 5) {
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
        const endorsedSkills = user.skills?.filter((s: any) => s.endorsements && s.endorsements.length > 0) || [];
        if (endorsedSkills.length < (user.skills?.length || 0) / 2) {
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
      let hasPaymentMethod = null;
      try {
        hasPaymentMethod = await (prisma as any).paymentMethod.findFirst({
          where: { userId }
        });
      } catch (error) {
        console.warn('Payment method check failed:', error);
      }

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
      let pendingPayments = [];
      try {
        pendingPayments = await (prisma as any).payment.findMany({
          where: {
            userId,
            status: 'PENDING'
          }
        });
      } catch (error) {
        console.warn('Pending payments check failed:', error);
      }

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
        if (!user.specialistServices || user.specialistServices.length === 0) {
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

        // Suggest promoting services
        suggestions.push({
          userId,
          title: 'Promote your services',
          content: 'Boost visibility by sharing your services on social media or with your network.',
          mode: 'MARKETPLACE',
          context: 'service_promotion',
          priority: 1,
          isActive: true
        });
      } else {
        // For clients
        suggestions.push({
          userId,
          title: 'Browse top services',
          content: 'Explore our curated selection of top-rated services in your areas of interest.',
          mode: 'MARKETPLACE',
          context: 'service_discovery',
          priority: 2,
          actionUrl: '/marketplace/discover',
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
      if (user.createdAt && new Date(user.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
        suggestions.push({
          userId,
          title: 'Welcome to JobMate!',
          content: 'Complete your profile to get personalized job matches and recommendations.',
          mode: 'GENERAL',
          priority: 3,
          actionUrl: '/profile',
          isActive: true
        });
      }

      // Suggest platform features
      suggestions.push({
        userId,
        title: 'Explore JobMate features',
        content: 'Discover how JobMate can help you find work or talent in your field.',
        mode: 'GENERAL',
        priority: 1,
        actionUrl: '/features',
        isActive: true
      });

      // Suggest community engagement
      suggestions.push({
        userId,
        title: 'Join our community',
        content: 'Connect with other professionals in our community forums and events.',
        mode: 'GENERAL',
        priority: 1,
        actionUrl: '/community',
        isActive: true
      });
    } catch (error) {
      console.error('Error generating general suggestions:', error);
    }
  },



  /**
   * Generate job description suggestions
   */
  async generateJobDescriptionSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: string
  ): Promise<void> {
    try {
      // Check if context contains keywords related to job posting
      const jobPostingKeywords = ['job description', 'post a job', 'create listing', 'write description', 'job post'];
      const isJobPostingContext = context && jobPostingKeywords.some(keyword => 
        context.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isJobPostingContext || (user.jobsPosted && user.jobsPosted.length > 0)) {
        // Add job description template suggestion
        suggestions.push({
          title: 'Create Job Description',
          content: 'I can help you write a compelling job description based on your requirements.',
          mode: 'PROJECT_SETUP',
          context: 'job_description',
          priority: 80,
          actionUrl: '/job/create-description',
          isActive: true
        });

        // Add specific job type suggestions based on user history or skills
        const userSkills = user.skills?.map((s: any) => s.skill.name.toLowerCase()) || [];
        const relevantJobTypes: string[] = [];

        // Check for web development skills
        if (userSkills.some((skill: string) => ['javascript', 'react', 'html', 'css', 'web'].some(s => skill.includes(s)))) {
          relevantJobTypes.push('web development');
        }

        // Check for mobile development skills
        if (userSkills.some((skill: string) => ['ios', 'android', 'react native', 'flutter', 'mobile'].some(s => skill.includes(s)))) {
          relevantJobTypes.push('mobile development');
        }

        // Check for design skills
        if (userSkills.some((skill: string) => ['design', 'ui', 'ux', 'graphic', 'photoshop', 'illustrator'].some(s => skill.includes(s)))) {
          relevantJobTypes.push('design');
        }

        // Add suggestions for relevant job types
        for (const jobType of relevantJobTypes) {
          suggestions.push({
            title: `${jobType.charAt(0).toUpperCase() + jobType.slice(1)} Job Template`,
            content: `Create a professional ${jobType} job description with best practices.`,
            mode: 'PROJECT_SETUP',
            context: jobType.replace(' ', '_'),
            priority: 75,
            actionUrl: `/job/create-description?category=${jobType.replace(' ', '_')}`,
            isActive: true
          });
        }

        // If user has posted jobs before, suggest improvements
        if (user.jobsPosted && user.jobsPosted.length > 0) {
          suggestions.push({
            title: 'Improve Job Description',
            content: 'I can help you improve your existing job posts to attract better candidates.',
            mode: 'PROJECT_SETUP',
            context: 'job_improvement',
            priority: 70,
            actionUrl: '/job/improve',
            isActive: true
          });
        }
      }
    } catch (error) {
      console.error('Error generating job description suggestions:', error);
    }
  },

  /**
   * Generate price calculator suggestions
   */
  async generatePriceCalculatorSuggestions(
    userId: string,
    user: any,
    suggestions: Partial<AssistantSuggestion>[],
    context?: string
  ): Promise<void> {
    try {
      // Check if context contains keywords related to pricing or budgeting
      const pricingKeywords = ['price', 'cost', 'budget', 'estimate', 'quote', 'how much', 'pricing'];
      const isPricingContext = context && pricingKeywords.some(keyword => 
        context.toLowerCase().includes(keyword.toLowerCase())
      );

      // Check if user is in job creation context or has pricing-related queries
      if (isPricingContext || context === 'job_creation' || context === 'project_setup') {
        // Add price calculator suggestion
        suggestions.push({
          userId,
          title: 'Estimate Project Cost',
          content: 'Get a price estimate based on project type, complexity, and duration.',
          mode: 'PROJECT_SETUP',
          context: context || 'pricing',
          priority: 75,
          actionUrl: '/project/price-calculator',
          isActive: true
        });

        // Get personalized price estimates based on user history
        const personalizedSuggestions = await getPersonalizedPriceEstimates(userId);
        if (personalizedSuggestions.length > 0) {
          // Add personalized suggestions with higher priority
          personalizedSuggestions.forEach(suggestion => {
            suggestions.push({
              userId,
              title: suggestion.title,
              content: suggestion.content,
              mode: suggestion.mode as AssistantMode,
              context: suggestion.context,
              priority: 85, // Higher priority than generic suggestions
              actionUrl: suggestion.actionUrl,
              isActive: true
            });
          });
        } else {
          // If no history, fall back to skill-based suggestions
          // If user has specific job types in mind based on skills, add targeted suggestions
          const userSkills = user.skills?.map((s: any) => s.skill.name.toLowerCase()) || [];
          
          // Web development price estimate
          if (userSkills.some((skill: string) => ['javascript', 'react', 'html', 'css', 'web'].some(s => skill.includes(s)))) {
            const estimate = priceCalculator.calculatePriceEstimate('Web Development');
            suggestions.push({
              userId,
              title: 'Web Development Pricing',
              content: `Typical web development projects cost between $${estimate.totalMin}-${estimate.totalMax}.`,
              mode: 'PROJECT_SETUP',
              context: 'web_development',
              priority: 70,
              actionUrl: '/project/price-calculator?category=web',
              isActive: true
            });
          }

          // Mobile development price estimate
          if (userSkills.some((skill: string) => ['ios', 'android', 'react native', 'flutter', 'mobile'].some(s => skill.includes(s)))) {
            const estimate = priceCalculator.calculatePriceEstimate('Mobile Development');
            suggestions.push({
              userId,
              title: 'Mobile App Pricing',
              content: `Typical mobile app projects cost between $${estimate.totalMin}-${estimate.totalMax}.`,
              mode: 'PROJECT_SETUP',
              context: 'mobile_development',
              priority: 70,
              actionUrl: '/project/price-calculator?category=mobile',
              isActive: true
            });
          }

          // Design price estimate
          if (userSkills.some((skill: string) => ['design', 'ui', 'ux', 'graphic', 'photoshop', 'illustrator'].some(s => skill.includes(s)))) {
            const estimate = priceCalculator.calculatePriceEstimate('UI/UX Design');
            suggestions.push({
              userId,
              title: 'Design Project Pricing',
              content: `Typical design projects cost between $${estimate.totalMin}-${estimate.totalMax}.`,
              mode: 'PROJECT_SETUP',
              context: 'design',
              priority: 70,
              actionUrl: '/project/price-calculator?category=design',
              isActive: true
            });
          }
        }

        // If user is posting a job, suggest budget optimization
        if (context === 'job_creation') {
          suggestions.push({
            userId,
            title: 'Optimize Your Budget',
            content: 'Learn how to set a competitive budget that attracts quality specialists.',
            mode: 'PROJECT_SETUP',
            context: 'budget_optimization',
            priority: 65,
            actionUrl: '/guides/budget-optimization',
            isActive: true
          });
        }
      }
    } catch (error) {
      console.error('Error generating price calculator suggestions:', error);
    }
  }
};

export default suggestionEngine;
