// Import necessary types
import { Specialist, MatchResult } from '@/services/match-service';

// Define Job type here to avoid import issues
interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  zipCode: string;
  budgetMin?: number;
  budgetMax?: number;
  createdAt: string;
  urgencyLevel?: string;
  isVerifiedPayment?: boolean;
  isNeighborPosted?: boolean;
  serviceCategory?: {
    id: string;
    name: string;
  };
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Define specialized context types for match assistance
export interface MatchAssistanceContext {
  specialist: Partial<Specialist>;
  matchResults?: Array<{
    job: Partial<Job>;
    matchResult: MatchResult;
  }>;
  selectedJob?: Partial<Job>;
  matchPreferences?: {
    prioritizeLocation?: boolean;
    prioritizeRate?: boolean;
    prioritizeUrgent?: boolean;
    maxDistance?: number;
  };
}

export class AIMatchService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  }

  /**
   * Generate suggestions for improving match score
   */
  async generateMatchImprovementSuggestions(
    context: MatchAssistanceContext
  ): Promise<string[]> {
    try {
      const { specialist, matchResults } = context;
      
      // Build a prompt for the AI to generate suggestions
      const prompt = `
You are JobMate's AI assistant helping a specialist improve their match scores.

Specialist Profile:
- Skills: ${specialist.skills?.join(', ')}
- Location: ${specialist.location?.city}, ${specialist.location?.state}
- Rating: ${specialist.rating}/5 (${specialist.completedJobs} completed jobs)
- Rate: $${specialist.hourlyRate}/hr (Range: $${specialist.ratePreferences?.min}-${specialist.ratePreferences?.max})
- Response time: ${specialist.responseTime} minutes
- Verification level: ${specialist.verificationLevel}/3

${matchResults ? `
Recent Job Match Scores:
${matchResults.slice(0, 5).map(match => 
  `- ${match.job.title}: ${match.matchResult.score}% (Skills: ${Math.round(match.matchResult.factors.skillMatch * 100)}%, Location: ${Math.round(match.matchResult.factors.locationProximity * 100)}%, Price: ${Math.round(match.matchResult.factors.priceMatch * 100)}%)`
).join('\n')}
` : ''}

Provide 5 specific suggestions for how this specialist can improve their match scores.
Each suggestion should be a single sentence and actionable.
`;

      // In production, this would call the OpenAI API
      // For now, we'll use our mock data approach
      const suggestions = await this.getMockSuggestions('match_improvement');
      return suggestions;
    } catch (error) {
      console.error('Error generating match improvement suggestions:', error);
      return this.getFallbackMatchSuggestions();
    }
  }
  
  /**
   * Generate explanation for a specific job match
   */
  async generateMatchExplanation(
    context: MatchAssistanceContext
  ): Promise<{explanation: string, improvementTips: string[]}> {
    try {
      const { specialist, selectedJob, matchResults } = context;
      
      // Find the match result for the selected job
      const jobMatch = matchResults?.find(
        match => match.job.id === selectedJob?.id
      );
      
      if (!jobMatch) {
        return {
          explanation: "I don't have enough information about this match.",
          improvementTips: []
        };
      }
      
      // Build a prompt for the AI to explain the match
      const prompt = `
You are JobMate's AI assistant explaining a job match to a specialist.

Job Details:
- Title: ${selectedJob?.title}
- Category: ${selectedJob?.serviceCategory?.name}
- Location: ${selectedJob?.city}, ${selectedJob?.state}
- Budget: ${selectedJob?.budgetMin ? '$' + selectedJob?.budgetMin : 'Not specified'} - ${selectedJob?.budgetMax ? '$' + selectedJob?.budgetMax : 'Not specified'}
- Urgency: ${selectedJob?.urgencyLevel}

Match Results:
- Overall Score: ${jobMatch.matchResult.score}%
- Skill Match: ${Math.round(jobMatch.matchResult.factors.skillMatch * 100)}%
- Location Match: ${Math.round(jobMatch.matchResult.factors.locationProximity * 100)}%
- Price Match: ${Math.round(jobMatch.matchResult.factors.priceMatch * 100)}%
- Reputation Match: ${Math.round(jobMatch.matchResult.factors.reputationScore * 100)}%
- Availability Match: ${Math.round(jobMatch.matchResult.factors.availabilityMatch * 100)}%

First, provide a 2-3 sentence explanation of why this job was matched with the specialist, highlighting the strongest factors.

Then, provide 2-3 specific tips for how the specialist could improve their chances of getting this specific job.
`;

      // In production, this would call the OpenAI API
      // For now, we'll use our mock data approach
      const response = await this.getMockStructuredResponse('match_explanation');
      
      // Parse the response
      const parts = response.split('\n\n');
      const explanation = parts[0] || "This job matches your profile based on several factors including skills, location, and pricing.";
      const improvementTips = parts.slice(1).join('\n').split('\n').filter((line: string) => line.trim().length > 0);
      
      return {
        explanation,
        improvementTips: improvementTips.length > 0 ? improvementTips : this.getFallbackImprovementTips()
      };
    } catch (error) {
      console.error('Error generating match explanation:', error);
      return {
        explanation: "This job appears to be a good match for your skills and preferences.",
        improvementTips: this.getFallbackImprovementTips()
      };
    }
  }
  
  /**
   * Generate suggestions for optimizing specialist profile
   */
  async generateProfileOptimizationTips(
    context: MatchAssistanceContext
  ): Promise<{
    skillSuggestions: string[];
    rateSuggestions: string[];
    generalTips: string[];
  }> {
    try {
      const { specialist, matchResults } = context;
      
      // Build a prompt for the AI to suggest profile improvements
      const prompt = `
You are JobMate's AI assistant helping a specialist optimize their profile for better job matches.

Specialist Profile:
- Skills: ${specialist.skills?.join(', ')}
- Location: ${specialist.location?.city}, ${specialist.location?.state}
- Rating: ${specialist.rating}/5 (${specialist.completedJobs} completed jobs)
- Rate: $${specialist.hourlyRate}/hr (Range: $${specialist.ratePreferences?.min}-${specialist.ratePreferences?.max})
- Response time: ${specialist.responseTime} minutes
- Verification level: ${specialist.verificationLevel}/3

${matchResults ? `
Recent Job Categories in Their Area:
${matchResults.slice(0, 5).map(match => `- ${match.job.serviceCategory?.name}`).join('\n')}
` : ''}

Provide the following recommendations:
1. 3-4 skills they should add to their profile to improve matches (based on market demand)
2. Advice on their rate setting (too high, too low, or good as is)
3. 2-3 general profile optimization tips

Format your response in three sections clearly labeled "Skills:", "Rate:", and "General Tips:".
`;

      // In production, this would call the OpenAI API
      // For now, we'll use our mock data approach
      const response = await this.getMockStructuredResponse('profile_optimization');
      
      // Parse the response
      const sections = response.split('\n\n');
      
      const skillSection = sections.find((s: string) => s.startsWith('Skills:')) || '';
      const rateSection = sections.find((s: string) => s.startsWith('Rate:')) || '';
      const tipsSection = sections.find((s: string) => s.startsWith('General Tips:')) || '';
      
      const skillSuggestions = skillSection.replace('Skills:', '').split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.trim().replace(/^-\s*/, ''));
      
      const rateSuggestions = rateSection.replace('Rate:', '').split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.trim().replace(/^-\s*/, ''));
      
      const generalTips = tipsSection.replace('General Tips:', '').split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.trim().replace(/^-\s*/, ''));
      
      return {
        skillSuggestions: skillSuggestions.length > 0 ? skillSuggestions : this.getFallbackSkillSuggestions(),
        rateSuggestions: rateSuggestions.length > 0 ? rateSuggestions : this.getFallbackRateSuggestions(),
        generalTips: generalTips.length > 0 ? generalTips : this.getFallbackGeneralTips()
      };
    } catch (error) {
      console.error('Error generating profile optimization tips:', error);
      return {
        skillSuggestions: this.getFallbackSkillSuggestions(),
        rateSuggestions: this.getFallbackRateSuggestions(),
        generalTips: this.getFallbackGeneralTips()
      };
    }
  }
  
  // Fallback data for when API calls fail
  private getFallbackMatchSuggestions(): string[] {
    return [
      "Add more specific skills to your profile that match the jobs you're interested in",
      "Consider expanding your service area to increase your match radius",
      "Adjust your rate range to better align with job budgets in your area",
      "Improve your response time to get higher scores for urgent jobs",
      "Complete your verification steps to improve your trust score"
    ];
  }
  
  private getFallbackImprovementTips(): string[] {
    return [
      "Highlight relevant experience in your application message",
      "Respond quickly to show your interest and availability",
      "Offer a competitive rate within the job's budget range"
    ];
  }
  
  private getFallbackSkillSuggestions(): string[] {
    return [
      "Home Maintenance & Repair",
      "Plumbing Basics",
      "Electrical Troubleshooting",
      "Furniture Assembly"
    ];
  }
  
  private getFallbackRateSuggestions(): string[] {
    return [
      "Your current rate is competitive for your skill level and market",
      "Consider offering package deals for common service combinations",
      "Adjust your rate based on job complexity and materials required"
    ];
  }
  
  private getFallbackGeneralTips(): string[] {
    return [
      "Add a professional profile photo to increase trust",
      "Complete all verification steps to appear in more searches",
      "Keep your availability calendar updated to improve match scores"
    ];
  }
  
  /**
   * Generate suggestions based on a prompt
   */
  private async getMockSuggestions(type: string): Promise<string[]> {
    // Mock suggestions for different contexts
    const mockSuggestions: Record<string, string[]> = {
      'match_improvement': [
        "Add more specific skills to your profile that match the jobs you're interested in",
        "Consider expanding your service area to increase your match radius",
        "Adjust your rate range to better align with job budgets in your area",
        "Improve your response time to get higher scores for urgent jobs",
        "Complete your verification steps to improve your trust score"
      ]
    };
    
    return mockSuggestions[type] || this.getFallbackMatchSuggestions();
  }

  // Helper method to generate structured responses
  private async getMockStructuredResponse(type: string): Promise<string> {
    // In production, this would call the OpenAI API with specific formatting instructions
    // For now, we'll use our mock approach
    const mockResponses: Record<string, string> = {
      'improve': `Here are some ways to improve your match scores:

- Add more specific skills to your profile that are in demand
- Update your availability calendar more frequently
- Consider expanding your service radius by 5-10 miles
- Complete your background verification to increase trust
- Respond to inquiries within 30 minutes for urgent jobs`,

      'explain': `This job is an excellent match for you with a 92% overall score! Your skills in plumbing and home repair align perfectly with the job requirements, and your location is within 5 miles of the job site, giving you a strong location match.

Respond quickly to this job posting as it was just listed and has an "urgent" status.
Consider mentioning your previous experience with similar projects in your application message.
Offer a rate within the client's budget range to maximize your chances of being selected.`,

      'profile': `Skills:
- Kitchen Remodeling
- Bathroom Renovation
- Tile Installation
- Drywall Repair

Rate:
- Your current rate of $45/hr is slightly below market average for your skill level and experience
- Consider increasing your rate to $50-55/hr to better reflect your expertise
- Offer tiered pricing options based on job complexity

General Tips:
- Add before/after photos of your work to showcase your quality
- Request reviews from your past clients to improve your reputation score
- Set up automatic availability updates to improve your response score`
    };
    
    // Return the appropriate mock response based on the type parameter
    if (type === 'match_explanation') {
      return mockResponses['explain'];
    } else if (type === 'profile_optimization') {
      return mockResponses['profile'];
    } else {
      return mockResponses['improve'];
    }
  }
}

// Export singleton instance
export const aiMatchService = new AIMatchService();
