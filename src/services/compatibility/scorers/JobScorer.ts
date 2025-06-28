import { 
  CompatibilityResult, 
  CompatibilityDimension, 
  UserPreferences, 
  ContextualFactors,
  JobSubcategory,
  Subcategory,
  MainCategory
} from '@/types/compatibility';
import { BaseScorer } from '../BaseScorer';

/**
 * JobScorer calculates compatibility between user preferences and job listings
 */
export class JobScorer extends BaseScorer {
  /**
   * Calculate compatibility score for job listings
   */
  calculateScore(
    userPreferences: UserPreferences,
    job: any,
    contextualFactors?: ContextualFactors
  ): CompatibilityResult {
    const dimensions: CompatibilityDimension[] = [];
    
    // If no job preferences, return default moderate score
    if (!userPreferences.categoryPreferences?.jobs) {
      return this.createDefaultResult('jobs', job.subcategory, userPreferences.userId, job.id);
    }
    
    const prefs = userPreferences.categoryPreferences.jobs;
    
    // 1. Skills match (highest weight)
    const skillsScore = this.calculateSkillsMatch(
      prefs.desiredSkills || [],
      job.requiredSkills || []
    );
    
    dimensions.push({
      name: 'Skills Match',
      score: skillsScore,
      weight: 0.4,
      description: this.getSkillsMatchDescription(skillsScore)
    });
    
    // 2. Salary match
    const salaryScore = this.calculateSalaryMatch(
      prefs.minSalary,
      prefs.maxSalary,
      job.salary
    );
    
    dimensions.push({
      name: 'Salary Match',
      score: salaryScore,
      weight: 0.25,
      description: this.getSalaryMatchDescription(salaryScore, job.salary)
    });
    
    // 3. Work arrangement match
    const arrangementScore = this.calculateArrangementMatch(
      prefs.workArrangement || [],
      job.workArrangement
    );
    
    dimensions.push({
      name: 'Work Arrangement',
      score: arrangementScore,
      weight: 0.2,
      description: this.getArrangementMatchDescription(arrangementScore, job.workArrangement)
    });
    
    // 4. Experience level match
    const experienceScore = this.calculateExperienceMatch(
      prefs.experienceLevel,
      job.experienceLevel
    );
    
    dimensions.push({
      name: 'Experience Level',
      score: experienceScore,
      weight: 0.15,
      description: this.getExperienceMatchDescription(experienceScore, job.experienceLevel)
    });
    
    // Calculate overall score with user weights
    const overallScore = super.calculateOverallScore(dimensions, userPreferences);
    
    // Generate improvement suggestions
    const improvementSuggestions = super.generateImprovementSuggestions(dimensions);
    
    // Find primary match reason
    const primaryMatchReason = super.findPrimaryMatchReason(dimensions);
    
    return {
      overallScore,
      dimensions,
      category: 'jobs',
      subcategory: job.subcategory as JobSubcategory,
      listingId: job.id,
      userId: userPreferences.userId,
      timestamp: new Date(),
      primaryMatchReason,
      improvementSuggestions
    };
  }
  
  /**
   * Create a default result when no preferences are available
   */
  private createDefaultResult(category: MainCategory, subcategory: Subcategory | undefined, userId: string, jobId: string): CompatibilityResult {
    return {
      overallScore: 50, // Neutral score
      dimensions: [
        {
          name: 'Overall Match',
          score: 50,
          weight: 1,
          description: 'Based on general profile information'
        }
      ],
      category,
      subcategory,
      listingId: jobId,
      userId: userId,
      timestamp: new Date(),
      primaryMatchReason: 'Limited preference data available',
      improvementSuggestions: ['Add job preferences to get more accurate matches']
    };
  }
  
  /**
   * Calculate skills match score
   */
  private calculateSkillsMatch(userSkills: string[], jobSkills: string[]): number {
    if (!userSkills.length || !jobSkills.length) return 50;
    
    // Count matching skills (case insensitive partial match)
    const matchingSkills = jobSkills.filter(jobSkill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(jobSkill.toLowerCase()) || 
        jobSkill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    // Calculate match percentage
    return Math.round((matchingSkills.length / jobSkills.length) * 100);
  }
  
  /**
   * Calculate salary match score
   */
  private calculateSalaryMatch(minDesired: number, maxDesired: number, actual: number): number {
    if (isNaN(minDesired) || isNaN(maxDesired) || isNaN(actual)) return 50;
    
    return super.calculateRangeMatch(actual, minDesired, maxDesired);
  }
  
  /**
   * Calculate work arrangement match score
   */
  private calculateArrangementMatch(
    preferredArrangements: JobSubcategory[],
    jobArrangement: JobSubcategory
  ): number {
    if (!preferredArrangements.length || !jobArrangement) return 50;
    
    // Check if job arrangement is in preferred arrangements
    return preferredArrangements.includes(jobArrangement) ? 100 : 0;
  }
  
  /**
   * Calculate experience level match score
   */
  private calculateExperienceMatch(
    preferredLevel: string,
    jobLevel: string
  ): number {
    if (!preferredLevel || !jobLevel) return 50;
    
    // Experience levels ordered from lowest to highest
    const levels = ['entry', 'junior', 'mid', 'senior', 'expert', 'lead'];
    
    const preferredIndex = levels.indexOf(preferredLevel.toLowerCase());
    const jobIndex = levels.indexOf(jobLevel.toLowerCase());
    
    if (preferredIndex === -1 || jobIndex === -1) return 50;
    
    // Exact match
    if (preferredIndex === jobIndex) return 100;
    
    // Calculate how far apart they are
    const difference = Math.abs(preferredIndex - jobIndex);
    const maxDifference = levels.length - 1;
    
    return Math.round(100 - ((difference / maxDifference) * 100));
  }
  
  /**
   * Get description for skills match
   */
  private getSkillsMatchDescription(score: number): string {
    if (score >= 90) return 'Your skills are a perfect match!';
    if (score >= 70) return 'Your skills align well with this job';
    if (score >= 50) return 'You have some relevant skills for this job';
    return 'You may need to develop more skills for this role';
  }
  
  /**
   * Get description for salary match
   */
  private getSalaryMatchDescription(score: number, salary: number): string {
    if (score >= 90) return `The salary ($${salary}) matches your expectations`;
    if (score >= 70) return `The salary ($${salary}) is close to your range`;
    if (score >= 50) return `The salary ($${salary}) is somewhat outside your range`;
    return `The salary ($${salary}) is far from your preferred range`;
  }
  
  /**
   * Get description for work arrangement match
   */
  private getArrangementMatchDescription(score: number, arrangement: string): string {
    if (score >= 90) return `This ${arrangement} position matches your preference`;
    return `This ${arrangement} position differs from your preferences`;
  }
  
  /**
   * Get description for experience level match
   */
  private getExperienceMatchDescription(score: number, level: string): string {
    if (score >= 90) return `The ${level} experience level is perfect for you`;
    if (score >= 70) return `The ${level} experience level is close to your preference`;
    if (score >= 50) return `The ${level} experience level is somewhat different from your preference`;
    return `The ${level} experience level is very different from your preference`;
  }
}

export default JobScorer;
