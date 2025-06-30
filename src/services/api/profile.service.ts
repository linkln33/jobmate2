import { BaseService } from './base.service';
import { ProfilesTable, UserSettingsTable, ProfileWithSettings } from '@/lib/supabase/types';

/**
 * Service for managing user profiles
 */
export class ProfileService extends BaseService {
  /**
   * Get the current user's profile
   * @returns User profile
   */
  async getMyProfile(): Promise<ProfilesTable['Row']> {
    const userId = await this.getCurrentUserId();
    return this.getProfileById(userId);
  }

  /**
   * Get a user profile by ID
   * @param userId User ID
   * @returns User profile
   */
  async getProfileById(userId: string): Promise<ProfilesTable['Row']> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      this.handleError(error, 'Failed to fetch profile');
    }

    return data;
  }

  /**
   * Get a user profile with settings
   * @param userId User ID
   * @returns User profile with settings
   */
  async getProfileWithSettings(userId: string): Promise<ProfileWithSettings> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select(`
        *,
        user_settings:user_settings(*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      this.handleError(error, 'Failed to fetch profile with settings');
    }

    return data as unknown as ProfileWithSettings;
  }

  /**
   * Update the current user's profile
   * @param profile Profile data to update
   * @returns Updated profile
   */
  async updateMyProfile(profile: ProfilesTable['Update']): Promise<ProfilesTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update profile');
    }

    return data;
  }

  /**
   * Update the current user's settings
   * @param settings Settings data to update
   * @returns Updated settings
   */
  async updateMySettings(settings: Omit<UserSettingsTable['Update'], 'user_id'>): Promise<UserSettingsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('user_settings')
      .update(settings)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update settings');
    }

    return data;
  }

  /**
   * Upload a profile avatar
   * @param file File to upload
   * @returns URL of the uploaded avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    const userId = await this.getCurrentUserId();
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await this.supabase
      .storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      this.handleError(uploadError, 'Failed to upload avatar');
    }

    const { data: { publicUrl } } = this.supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update the profile with the new avatar URL
    await this.updateMyProfile({ avatar_url: publicUrl });

    return publicUrl;
  }
}

// Export a singleton instance for client-side use
export const profileService = new ProfileService();
