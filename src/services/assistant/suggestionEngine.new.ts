import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/client';
import { matchingService } from '@/services/server/matching-service';
import { AssistantMode, AssistantSuggestion } from '@/contexts/AssistantContext/types';
import descriptionGenerator from './descriptionGenerator';
import { JsonObject, JsonValue, User } from '@/lib/types';

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
      const supabase = getSupabaseServiceClient();
      
      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          userSkills!userId(*, skills!skillId(*))
        `)
        .eq('id', userId)
        .single();
        
      if (userError || !user) {
        throw new Error('User not found: ' + (userError?.message || ''));
      }
      
      // Fetch jobs posted by user
      const { data: jobsPosted, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('customerId', userId)
        .eq('status', 'OPEN')
        .order('createdAt', { ascending: false })
        .limit(5);
        
      if (jobsError) {
        console.error('Error fetching jobs posted:', jobsError);
      }
      
      // Fetch jobs applied to by user
      const { data: jobsAppliedTo, error: applicationsError } = await supabase
        .from('applications')
        .select('*')
        .eq('applicantId', userId)
        .order('createdAt', { ascending: false })
        .limit(5);
        
      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
      }
      
      // Attach to user object (cast to any to avoid TypeScript errors)
      (user as any).jobsPosted = jobsPosted || [];
      (user as any).jobsAppliedTo = jobsAppliedTo || [];

      // Get user preferences
      let preferences = null;
      try {
        const { data: prefsData } = await supabase
          .from('assistantPreferences')
          .select('*')
          .eq('userId', userId)
          .maybeSingle();
      } catch (error) {
        console.warn('Assistant preferences not available:', error);
      }

      // Initialize suggestions array
      const suggestions: Partial<AssistantSuggestion>[] = [];

      // Generate mode-specific suggestions
      switch (mode) {
        case 'MATCHING':
          await this.generateMatchingSuggestions(userId, user, suggestions, context);
          break;
        case 'PROJECT_SETUP':
          await this.generateProjectSetupSuggestions(userId, user, suggestions, context);
          await this.generateJobDescriptionSuggestions(userId, user, suggestions, context);
          break;
        case 'PROFILE':
          await this.generateProfileSuggestions(userId, user, suggestions, context);
          break;
        case 'PAYMENTS':
          await this.generatePaymentSuggestions(userId, user, suggestions, context);
          break;
        case 'MARKETPLACE':
          await this.generateMarketplaceSuggestions(userId, user, suggestions, context);
          await this.generateJobDescriptionSuggestions(userId, user, suggestions, context);
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
            const generatedDescription = descriptionGenerator.generateJobDescription('job match', {
              specificRequirements: ['Expand your matching criteria', 'Consider adjusting your location preferences', 'Add more skills to see more job matches']
            });
            suggestions.push({
              userId,
              title: 'Expand your matching criteria',
              content: generatedDescription,
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
        const { data: paymentMethod } = await supabase
          .from('paymentMethods')
          .select('*')
          .eq('userId', userId)
          .maybeSingle();
          
        hasPaymentMethod = paymentMethod;
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
        const { data: pendingPaymentsData } = await supabase
          .from('payments')
          .select('*')
          .eq('userId', userId)
          .eq('status', 'PENDING')
          .order('createdAt', { ascending: false });
          
        pendingPayments = pendingPaymentsData || [];
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
          title: 'Generate Job Description',
          content: 'Let me help you create a professional job description based on your requirements.',
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
            title: 'Improve Existing Job Post',
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
  }
};

export default suggestionEngine;
