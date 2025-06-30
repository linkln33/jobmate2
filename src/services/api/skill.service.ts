import { BaseService } from './base.service';
import { SkillsTable, UserSkillsTable, UserSkillWithDetails } from '@/lib/supabase/types';

/**
 * Service for managing skills
 */
export class SkillService extends BaseService {
  /**
   * Get all skills
   * @param category Optional category filter
   * @returns List of skills
   */
  async getAllSkills(category?: string): Promise<SkillsTable['Row'][]> {
    let query = this.supabase
      .from('skills')
      .select('*')
      .order('popularity', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;

    if (error) {
      this.handleError(error, 'Failed to fetch skills');
    }

    return data;
  }

  /**
   * Search for skills
   * @param searchTerm Search term
   * @param limit Maximum number of results
   * @returns Matching skills
   */
  async searchSkills(searchTerm: string, limit: number = 10): Promise<SkillsTable['Row'][]> {
    const { data, error } = await this.supabase
      .from('skills')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('popularity', { ascending: false })
      .limit(limit);

    if (error) {
      this.handleError(error, 'Failed to search skills');
    }

    return data;
  }

  /**
   * Get a skill by ID
   * @param id Skill ID
   * @returns Skill
   */
  async getSkillById(id: string): Promise<SkillsTable['Row']> {
    const { data, error } = await this.supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      this.handleError(error, 'Failed to fetch skill');
    }

    return data;
  }

  /**
   * Create a new skill (admin only)
   * @param skill Skill data
   * @returns Created skill
   */
  async createSkill(skill: SkillsTable['Insert']): Promise<SkillsTable['Row']> {
    await this.requireAdmin();
    
    const { data, error } = await this.supabase
      .from('skills')
      .insert(skill)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to create skill');
    }

    return data;
  }

  /**
   * Update a skill (admin only)
   * @param id Skill ID
   * @param skill Skill data to update
   * @returns Updated skill
   */
  async updateSkill(id: string, skill: SkillsTable['Update']): Promise<SkillsTable['Row']> {
    await this.requireAdmin();
    
    const { data, error } = await this.supabase
      .from('skills')
      .update(skill)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update skill');
    }

    return data;
  }

  /**
   * Delete a skill (admin only)
   * @param id Skill ID
   * @returns Success status
   */
  async deleteSkill(id: string): Promise<{ success: boolean }> {
    await this.requireAdmin();
    
    const { error } = await this.supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) {
      this.handleError(error, 'Failed to delete skill');
    }

    return { success: true };
  }

  /**
   * Get skills for a user
   * @param userId User ID
   * @returns User's skills with details
   */
  async getUserSkills(userId: string): Promise<UserSkillWithDetails[]> {
    const { data, error } = await this.supabase
      .from('user_skills')
      .select(`
        *,
        skill:skills(*)
      `)
      .eq('user_id', userId)
      .order('is_featured', { ascending: false });

    if (error) {
      this.handleError(error, 'Failed to fetch user skills');
    }

    return data as unknown as UserSkillWithDetails[];
  }

  /**
   * Get skills for the current user
   * @returns Current user's skills with details
   */
  async getMySkills(): Promise<UserSkillWithDetails[]> {
    const userId = await this.getCurrentUserId();
    return this.getUserSkills(userId);
  }

  /**
   * Add a skill to the current user's profile
   * @param skillId Skill ID
   * @param proficiencyLevel Optional proficiency level (1-5)
   * @param yearsExperience Optional years of experience
   * @param isFeatured Whether this is a featured skill
   * @returns Added user skill
   */
  async addUserSkill(
    skillId: string,
    proficiencyLevel?: number,
    yearsExperience?: number,
    isFeatured: boolean = false
  ): Promise<UserSkillsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Check if user already has this skill
    const { data: existingSkill, error: checkError } = await this.supabase
      .from('user_skills')
      .select('id')
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .maybeSingle();
    
    if (checkError) {
      this.handleError(checkError, 'Failed to check existing skills');
    }
    
    if (existingSkill) {
      this.handleError(
        { status: 400, code: 'SKILL_EXISTS' }, 
        'You already have this skill in your profile'
      );
    }
    
    const { data, error } = await this.supabase
      .from('user_skills')
      .insert({
        user_id: userId,
        skill_id: skillId,
        proficiency_level: proficiencyLevel,
        years_experience: yearsExperience,
        is_featured: isFeatured
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to add skill');
    }

    return data;
  }

  /**
   * Update a user skill
   * @param userSkillId User skill ID
   * @param updates Updates to apply
   * @returns Updated user skill
   */
  async updateUserSkill(
    userSkillId: string,
    updates: {
      proficiencyLevel?: number;
      yearsExperience?: number;
      isFeatured?: boolean;
    }
  ): Promise<UserSkillsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('user_skills')
      .update({
        proficiency_level: updates.proficiencyLevel,
        years_experience: updates.yearsExperience,
        is_featured: updates.isFeatured
      })
      .eq('id', userSkillId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update skill');
    }

    return data;
  }

  /**
   * Remove a skill from the current user's profile
   * @param userSkillId User skill ID
   * @returns Success status
   */
  async removeUserSkill(userSkillId: string): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    const { error } = await this.supabase
      .from('user_skills')
      .delete()
      .eq('id', userSkillId)
      .eq('user_id', userId);

    if (error) {
      this.handleError(error, 'Failed to remove skill');
    }

    return { success: true };
  }

  /**
   * Get top skills by popularity
   * @param limit Maximum number of skills to return
   * @returns Popular skills
   */
  async getPopularSkills(limit: number = 10): Promise<SkillsTable['Row'][]> {
    const { data, error } = await this.supabase
      .from('skills')
      .select('*')
      .order('popularity', { ascending: false })
      .limit(limit);

    if (error) {
      this.handleError(error, 'Failed to fetch popular skills');
    }

    return data;
  }

  /**
   * Check if user is admin and throw error if not
   * @private
   */
  private async requireAdmin(): Promise<void> {
    const isAdmin = await this.isUserAdmin();
    
    if (!isAdmin) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to perform this action'
      );
    }
  }
}

// Export a singleton instance for client-side use
export const skillService = new SkillService();
