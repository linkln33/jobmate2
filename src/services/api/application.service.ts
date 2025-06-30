import { BaseService } from './base.service';
import { ApplicationsTable, ApplicationAttachmentsTable, ApplicationWithDetails } from '@/lib/supabase/types';

/**
 * Service for managing job applications
 */
export class ApplicationService extends BaseService {
  /**
   * Get an application by ID
   * @param id Application ID
   * @returns Application with details
   */
  async getApplicationById(id: string): Promise<ApplicationWithDetails> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('applications')
      .select(`
        *,
        listing:listings(id, title, user_id),
        applicant:profiles(id, full_name, avatar_url),
        attachments:application_attachments(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      this.handleError(error, 'Failed to fetch application');
    }
    
    // Verify permission to view this application
    if (data.applicant_id !== userId && data.listing.user_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to view this application'
      );
    }

    return data as unknown as ApplicationWithDetails;
  }

  /**
   * Create a new application
   * @param application Application data
   * @returns Created application
   */
  async createApplication(application: Omit<ApplicationsTable['Insert'], 'applicant_id'>): Promise<ApplicationsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Check if user already applied to this listing
    const { data: existingApplication, error: checkError } = await this.supabase
      .from('applications')
      .select('id')
      .eq('listing_id', application.listing_id)
      .eq('applicant_id', userId)
      .maybeSingle();
    
    if (checkError) {
      this.handleError(checkError, 'Failed to check existing applications');
    }
    
    if (existingApplication) {
      this.handleError(
        { status: 400, code: 'ALREADY_APPLIED' }, 
        'You have already applied to this listing'
      );
    }
    
    const { data, error } = await this.supabase
      .from('applications')
      .insert({ ...application, applicant_id: userId })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to create application');
    }

    return data;
  }

  /**
   * Update an application
   * @param id Application ID
   * @param application Application data to update
   * @returns Updated application
   */
  async updateApplication(id: string, application: ApplicationsTable['Update']): Promise<ApplicationsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Verify ownership
    const { data: existingApplication, error: fetchError } = await this.supabase
      .from('applications')
      .select('applicant_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch application');
    }
    
    if (existingApplication.applicant_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to update this application'
      );
    }
    
    const { data, error } = await this.supabase
      .from('applications')
      .update(application)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update application');
    }

    return data;
  }

  /**
   * Update application status (for listing owner)
   * @param id Application ID
   * @param status New status
   * @returns Updated application
   */
  async updateApplicationStatus(id: string, status: string): Promise<ApplicationsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Verify listing ownership
    const { data: application, error: fetchError } = await this.supabase
      .from('applications')
      .select('listing_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch application');
    }
    
    const { data: listing, error: listingError } = await this.supabase
      .from('listings')
      .select('user_id')
      .eq('id', application.listing_id)
      .single();
    
    if (listingError) {
      this.handleError(listingError, 'Failed to fetch listing');
    }
    
    if (listing.user_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to update this application status'
      );
    }
    
    const { data, error } = await this.supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update application status');
    }

    return data;
  }

  /**
   * Get applications for a listing (for listing owner)
   * @param listingId Listing ID
   * @returns Applications for the listing
   */
  async getApplicationsForListing(listingId: string): Promise<ApplicationWithDetails[]> {
    const userId = await this.getCurrentUserId();
    
    // Verify listing ownership
    const { data: listing, error: listingError } = await this.supabase
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single();
    
    if (listingError) {
      this.handleError(listingError, 'Failed to fetch listing');
    }
    
    if (listing.user_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to view applications for this listing'
      );
    }
    
    const { data, error } = await this.supabase
      .from('applications')
      .select(`
        *,
        listing:listings(id, title, user_id),
        applicant:profiles(id, full_name, avatar_url),
        attachments:application_attachments(*)
      `)
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error, 'Failed to fetch applications');
    }

    return data as unknown as ApplicationWithDetails[];
  }

  /**
   * Get applications submitted by the current user
   * @returns User's applications
   */
  async getMyApplications(): Promise<ApplicationWithDetails[]> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('applications')
      .select(`
        *,
        listing:listings(id, title, user_id),
        applicant:profiles(id, full_name, avatar_url),
        attachments:application_attachments(*)
      `)
      .eq('applicant_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error, 'Failed to fetch your applications');
    }

    return data as unknown as ApplicationWithDetails[];
  }

  /**
   * Upload an attachment to an application
   * @param applicationId Application ID
   * @param file File to upload
   * @returns Uploaded attachment
   */
  async uploadApplicationAttachment(
    applicationId: string, 
    file: File
  ): Promise<ApplicationAttachmentsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Verify ownership
    const { data: existingApplication, error: fetchError } = await this.supabase
      .from('applications')
      .select('applicant_id')
      .eq('id', applicationId)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch application');
    }
    
    if (existingApplication.applicant_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to update this application'
      );
    }
    
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${applicationId}/${fileName}`;

    const { error: uploadError } = await this.supabase
      .storage
      .from('application_attachments')
      .upload(filePath, file, {
        contentType: file.type
      });

    if (uploadError) {
      this.handleError(uploadError, 'Failed to upload attachment');
    }

    // Create attachment record
    const { data, error } = await this.supabase
      .from('application_attachments')
      .insert({
        application_id: applicationId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to create attachment record');
    }

    return data;
  }

  /**
   * Delete an application attachment
   * @param attachmentId Attachment ID
   * @returns Success status
   */
  async deleteApplicationAttachment(attachmentId: string): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    // Get attachment details
    const { data: attachment, error: fetchError } = await this.supabase
      .from('application_attachments')
      .select('file_path, application_id')
      .eq('id', attachmentId)
      .single();
    
    if (fetchError) {
      this.handleError(fetchError, 'Failed to fetch attachment');
    }
    
    // Verify ownership
    const { data: application, error: applicationError } = await this.supabase
      .from('applications')
      .select('applicant_id')
      .eq('id', attachment.application_id)
      .single();
    
    if (applicationError) {
      this.handleError(applicationError, 'Failed to fetch application');
    }
    
    if (application.applicant_id !== userId) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to delete this attachment'
      );
    }
    
    // Delete from storage
    const { error: storageError } = await this.supabase
      .storage
      .from('application_attachments')
      .remove([attachment.file_path]);
    
    if (storageError) {
      this.handleError(storageError, 'Failed to delete attachment file');
    }
    
    // Delete record
    const { error } = await this.supabase
      .from('application_attachments')
      .delete()
      .eq('id', attachmentId);

    if (error) {
      this.handleError(error, 'Failed to delete attachment record');
    }

    return { success: true };
  }
}

// Export a singleton instance for client-side use
export const applicationService = new ApplicationService();
