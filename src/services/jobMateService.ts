import { JobMate, JobMateMatch, JobMateTemplate, JobMateFormData } from '@/types/jobmate';
import { compatibilityEngine } from '@/services/compatibility/engine';
import { MainCategory, UserPreferences } from '@/types/compatibility';

// Mock data for development - will be replaced with API calls
const mockJobMates: JobMate[] = [];
const mockMatches: JobMateMatch[] = [];
const mockTemplates: JobMateTemplate[] = [];

export const jobMateService = {
  // Create a new JobMate
  async createJobMate(formData: JobMateFormData, userId: string): Promise<JobMate> {
    const newJobMate: JobMate = {
      id: `jm-${Date.now()}`,
      userId,
      name: formData.name,
      emoji: formData.emoji,
      description: formData.description,
      categoryFocus: formData.categoryFocus,
      subcategories: formData.subcategories,
      status: 'active',
      preferences: {
        ...formData.preferences,
        userId,
        dailyPreferences: {
          intent: formData.intent,
        }
      } as UserPreferences,
      createdAt: new Date(),
      updatedAt: new Date(),
      intent: formData.intent,
    };
    
    // In production, this would be an API call
    mockJobMates.push(newJobMate);
    
    return newJobMate;
  },
  
  // Get all JobMates for a user
  async getUserJobMates(userId: string): Promise<JobMate[]> {
    // In production, this would be an API call
    return mockJobMates.filter(jm => jm.userId === userId);
  },
  
  // Get a specific JobMate
  async getJobMate(id: string): Promise<JobMate | null> {
    // In production, this would be an API call
    const jobMate = mockJobMates.find(jm => jm.id === id);
    return jobMate || null;
  },
  
  // Update JobMate
  async updateJobMate(id: string, updates: Partial<JobMate>): Promise<JobMate> {
    // In production, this would be an API call
    const index = mockJobMates.findIndex(jm => jm.id === id);
    if (index === -1) throw new Error('JobMate not found');
    
    mockJobMates[index] = {
      ...mockJobMates[index],
      ...updates,
      updatedAt: new Date()
    };
    
    return mockJobMates[index];
  },
  
  // Delete JobMate
  async deleteJobMate(id: string): Promise<boolean> {
    // In production, this would be an API call
    const index = mockJobMates.findIndex(jm => jm.id === id);
    if (index === -1) return false;
    
    mockJobMates.splice(index, 1);
    return true;
  },
  
  // Run a JobMate to find matches
  async runJobMate(jobMateId: string): Promise<JobMateMatch[]> {
    const jobMate = await this.getJobMate(jobMateId);
    if (!jobMate) throw new Error('JobMate not found');
    
    // In production, this would:
    // 1. Get relevant listings based on category
    // 2. Use compatibility engine to calculate scores
    // 3. Store matches in database
    
    // For now, we'll create some mock matches
    const mockListings = [
      { id: 'listing-1', title: 'Software Developer Position', category: 'jobs' },
      { id: 'listing-2', title: 'Apartment for Rent', category: 'rentals' },
      { id: 'listing-3', title: 'Web Design Services', category: 'services' }
    ];
    
    const relevantListings = mockListings.filter(
      listing => listing.category === jobMate.categoryFocus
    );
    
    const newMatches: JobMateMatch[] = relevantListings.map(listing => ({
      id: `match-${Date.now()}-${listing.id}`,
      jobMateId,
      listingId: listing.id,
      compatibilityScore: Math.floor(Math.random() * 100),
      status: 'new',
      createdAt: new Date()
    }));
    
    // Add to mock data
    mockMatches.push(...newMatches);
    
    return newMatches;
  },
  
  // Get matches for a JobMate
  async getJobMateMatches(jobMateId: string): Promise<JobMateMatch[]> {
    // In production, this would be an API call
    return mockMatches.filter(match => match.jobMateId === jobMateId);
  },
  
  // Update match status
  async updateMatchStatus(
    matchId: string, 
    status: 'viewed' | 'saved' | 'contacted' | 'rejected'
  ): Promise<JobMateMatch> {
    // In production, this would be an API call
    const index = mockMatches.findIndex(match => match.id === matchId);
    if (index === -1) throw new Error('Match not found');
    
    mockMatches[index] = {
      ...mockMatches[index],
      status,
      updatedAt: new Date()
    };
    
    return mockMatches[index];
  },
  
  // Create a template from a JobMate
  async createTemplate(jobMateId: string, isPublic: boolean): Promise<JobMateTemplate> {
    const jobMate = await this.getJobMate(jobMateId);
    if (!jobMate) throw new Error('JobMate not found');
    
    const template: JobMateTemplate = {
      id: `template-${Date.now()}`,
      name: jobMate.name,
      emoji: jobMate.emoji || '🔍',
      description: jobMate.description || '',
      categoryFocus: jobMate.categoryFocus,
      subcategories: jobMate.subcategories,
      preferences: jobMate.preferences,
      creatorId: jobMate.userId,
      isPublic,
      usageCount: 0,
      createdAt: new Date()
    };
    
    // In production, this would be an API call
    mockTemplates.push(template);
    
    return template;
  },
  
  // Get public templates
  async getPublicTemplates(): Promise<JobMateTemplate[]> {
    // In production, this would be an API call
    return mockTemplates.filter(template => template.isPublic);
  },
  
  // Create JobMate from template
  async createFromTemplate(templateId: string, userId: string): Promise<JobMate> {
    const template = mockTemplates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');
    
    const jobMate: JobMate = {
      id: `jm-${Date.now()}`,
      userId,
      name: template.name,
      emoji: template.emoji,
      description: template.description,
      categoryFocus: template.categoryFocus,
      subcategories: template.subcategories,
      status: 'active',
      preferences: {
        ...template.preferences,
        userId
      } as UserPreferences,
      createdAt: new Date(),
      updatedAt: new Date(),
      templateId,
      intent: 'browse' // Default intent, should be extracted from template if available
    };
    
    // In production, this would be an API call
    mockJobMates.push(jobMate);
    
    // Update template usage count
    const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
    if (templateIndex !== -1) {
      mockTemplates[templateIndex].usageCount += 1;
    }
    
    return jobMate;
  }
};
