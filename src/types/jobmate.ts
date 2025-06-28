import { MainCategory, UserPreferences, Subcategory } from './compatibility';

export type JobMateStatus = 'active' | 'paused' | 'archived';
export type JobMateIntent = 'earn' | 'hire' | 'sell' | 'rent' | 'list' | 'buy' | 'help' | 'learn' | 'browse';

export interface JobMateSettings {
  autoRun: boolean;
  runFrequency: 'daily' | 'weekly' | 'monthly';
  notifications: boolean;
  isPublic: boolean;
  isCollaborative: boolean;
}

export interface JobMate {
  id: string;
  userId: string;
  name: string;
  emoji?: string;
  description?: string;
  categoryFocus: MainCategory;
  subcategories?: Subcategory[];
  status: JobMateStatus;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  collaborators?: string[]; // User IDs of collaborators
  isTemplate?: boolean;
  templateId?: string; // If created from a template
  settings?: JobMateSettings;
  intent: JobMateIntent;
}

export interface JobMateMatch {
  id: string;
  jobMateId: string;
  listingId: string;
  compatibilityScore: number;
  status: 'new' | 'viewed' | 'saved' | 'contacted' | 'rejected';
  createdAt: Date;
  updatedAt?: Date;
}

export interface JobMateTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  categoryFocus: MainCategory;
  subcategories?: Subcategory[];
  preferences: Partial<UserPreferences>;
  creatorId: string;
  isPublic: boolean;
  usageCount: number;
  createdAt: Date;
  settings?: Partial<JobMateSettings>;
  intent?: JobMateIntent;
}

// Initial form data for creating a JobMate
export interface JobMateFormData {
  name: string;
  emoji: string;
  description: string;
  categoryFocus: MainCategory;
  subcategories?: Subcategory[];
  intent: JobMateIntent;
  preferences: Partial<UserPreferences>;
  settings?: JobMateSettings;
}
