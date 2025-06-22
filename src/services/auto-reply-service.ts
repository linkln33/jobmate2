import { Job, Specialist, MatchResult } from '@/types/job-match-types';

// Define template types
export type AutoReplyTemplate = 
  | 'introduction'
  | 'skills_highlight'
  | 'availability'
  | 'pricing'
  | 'questions'
  | 'full_response';

// Define template data interface
export interface TemplateData {
  job: Partial<Job>;
  specialist: Partial<Specialist>;
  matchResult?: MatchResult;
}

/**
 * Service for generating smart auto-replies to job matches
 */
class AutoReplyService {
  /**
   * Generate a complete response for a job application
   */
  generateFullResponse(data: TemplateData): string {
    const { job, specialist, matchResult } = data;
    
    // Combine multiple template sections
    const intro = this.generateTemplate('introduction', data);
    const skills = this.generateTemplate('skills_highlight', data);
    const availability = this.generateTemplate('availability', data);
    const pricing = this.generateTemplate('pricing', data);
    const questions = this.generateTemplate('questions', data);
    
    // Combine all sections
    return `${intro}\n\n${skills}\n\n${availability}\n\n${pricing}\n\n${questions}`;
  }
  
  /**
   * Generate a specific template section
   */
  generateTemplate(templateType: AutoReplyTemplate, data: TemplateData): string {
    const { job, specialist, matchResult } = data;
    
    // Get relevant skills for this job
    const relevantSkills = this.getRelevantSkills(
      specialist.skills || [], 
      job.serviceCategory?.name || '',
      job.description || ''
    );
    
    switch (templateType) {
      case 'introduction':
        return this.generateIntroduction(job, specialist);
        
      case 'skills_highlight':
        return this.generateSkillsHighlight(relevantSkills, specialist, job);
        
      case 'availability':
        return this.generateAvailability(job, specialist);
        
      case 'pricing':
        return this.generatePricing(job, specialist);
        
      case 'questions':
        return this.generateQuestions(job);
        
      case 'full_response':
        return this.generateFullResponse(data);
        
      default:
        return '';
    }
  }
  
  /**
   * Generate introduction section
   */
  private generateIntroduction(job?: Partial<Job>, specialist?: Partial<Specialist>): string {
    const jobTitle = job?.title || 'your job';
    const clientName = job?.customer?.firstName || 'there';
    const specialistName = specialist?.firstName || 'I';
    
    return `Hi ${clientName},

I'm interested in ${jobTitle} and believe I'd be a great fit for this project. ${specialistName === 'I' ? 'I have' : `${specialistName} has`} extensive experience in ${job?.serviceCategory?.name || 'this type of work'} and would love to help you with this job.`;
  }
  
  /**
   * Generate skills highlight section
   */
  private generateSkillsHighlight(
    relevantSkills: string[], 
    specialist?: Partial<Specialist>,
    job?: Partial<Job>
  ): string {
    if (relevantSkills.length === 0) {
      return `I have the skills and experience needed to complete this job successfully.`;
    }
    
    const skillsList = relevantSkills.slice(0, 3).join(', ');
    const experienceYears = specialist?.yearsOfExperience || '5+';
    
    return `My expertise includes ${skillsList}, with ${experienceYears} years of experience in ${job?.serviceCategory?.name || 'this field'}. I've successfully completed ${specialist?.completedJobs || 'numerous'} similar projects with consistently positive feedback.`;
  }
  
  /**
   * Generate availability section
   */
  private generateAvailability(job?: Partial<Job>, specialist?: Partial<Specialist>): string {
    const isUrgent = job?.urgencyLevel === 'high' || job?.urgencyLevel === 'urgent';
    
    if (isUrgent) {
      return `I understand this is an urgent job, and I'm available to start immediately. I can prioritize your project and ensure it's completed quickly without compromising quality.`;
    }
    
    return `I'm available to start this project ${this.getRandomAvailability()} and can work with your schedule to ensure timely completion.`;
  }
  
  /**
   * Generate pricing section
   */
  private generatePricing(job?: Partial<Job>, specialist?: Partial<Specialist>): string {
    const hasBudget = job?.budgetMin !== undefined || job?.budgetMax !== undefined;
    const specialistRate = specialist?.hourlyRate;
    
    if (hasBudget && specialistRate) {
      const budgetMin = job?.budgetMin || 0;
      const budgetMax = job?.budgetMax || 999999;
      
      if (specialistRate >= budgetMin && specialistRate <= budgetMax) {
        return `My rate of $${specialistRate}/hr falls within your budget range, and I can provide excellent value for your investment.`;
      } else if (specialistRate < budgetMin) {
        return `My rate of $${specialistRate}/hr is below your budget range, which means you'll receive high-quality work at a competitive price.`;
      } else {
        return `While my standard rate is $${specialistRate}/hr, I'd be happy to discuss pricing options that work within your budget for this specific project.`;
      }
    }
    
    return `I offer competitive rates and would be happy to provide a detailed quote after learning more about your specific requirements.`;
  }
  
  /**
   * Generate questions section
   */
  private generateQuestions(job?: Partial<Job>): string {
    return `I have a few questions to better understand your needs:
1. Do you have a specific timeline or deadline for this project?
2. Are there any particular requirements or preferences I should know about?
3. What's the best way to communicate during the project?

I look forward to discussing this opportunity with you further. Please feel free to reach out with any questions.

Best regards,
[Your Name]`;
  }
  
  /**
   * Helper method to get relevant skills for a job
   */
  private getRelevantSkills(
    specialistSkills: string[], 
    jobCategory: string,
    jobDescription: string
  ): string[] {
    if (specialistSkills.length === 0) return [];
    
    // Simple keyword matching for now
    // In a real implementation, this would use more sophisticated matching
    return specialistSkills.filter(skill => {
      const skillLower = skill.toLowerCase();
      const categoryLower = jobCategory.toLowerCase();
      const descriptionLower = jobDescription.toLowerCase();
      
      return categoryLower.includes(skillLower) || 
             descriptionLower.includes(skillLower) ||
             this.isRelatedSkill(skillLower, categoryLower);
    });
  }
  
  /**
   * Check if a skill is related to a job category
   */
  private isRelatedSkill(skill: string, category: string): boolean {
    // Map of related skills by category
    const relatedSkillsMap: Record<string, string[]> = {
      'plumbing': ['water', 'pipe', 'leak', 'faucet', 'drain', 'toilet'],
      'electrical': ['wiring', 'circuit', 'outlet', 'lighting', 'power'],
      'cleaning': ['housekeeping', 'maid', 'janitorial', 'dusting', 'vacuum'],
      'landscaping': ['gardening', 'lawn', 'mowing', 'trimming', 'plants'],
      'carpentry': ['woodwork', 'furniture', 'cabinet', 'shelving', 'construction'],
      'painting': ['interior', 'exterior', 'wall', 'trim', 'staining'],
      'moving': ['packing', 'lifting', 'transport', 'furniture', 'boxes']
    };
    
    // Check if the category contains any of our known categories
    for (const [knownCategory, relatedSkills] of Object.entries(relatedSkillsMap)) {
      if (category.includes(knownCategory)) {
        return relatedSkills.some(relatedSkill => skill.includes(relatedSkill));
      }
    }
    
    return false;
  }
  
  /**
   * Get a random availability statement
   */
  private getRandomAvailability(): string {
    const options = [
      'within the next few days',
      'as early as tomorrow',
      'this week',
      'at your earliest convenience',
      'according to your preferred schedule'
    ];
    
    return options[Math.floor(Math.random() * options.length)];
  }
}

// Export singleton instance
export const autoReplyService = new AutoReplyService();
