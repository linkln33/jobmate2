import { CompatibilityResult } from '@/types/compatibility';

export interface NotificationOptions {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  data?: Record<string, any>;
  expiresAt?: Date;
}

export interface CompatibilityNotificationOptions {
  userId: string;
  compatibilityResult: CompatibilityResult;
  entityType: 'listing' | 'user' | 'job';
  entityId: string;
  entityTitle: string;
}

/**
 * Service for managing user notifications
 */
class NotificationService {
  /**
   * Send a notification to a user
   */
  async sendNotification(options: NotificationOptions): Promise<boolean> {
    // In a real app, this would send to a notification database or service
    console.log(`Sending notification to user ${options.userId}:`, options);
    
    // Mock successful notification
    return true;
  }
  
  /**
   * Send a compatibility match notification when a high match is found
   */
  async sendCompatibilityMatchNotification({
    userId,
    compatibilityResult,
    entityType,
    entityId,
    entityTitle
  }: CompatibilityNotificationOptions): Promise<boolean> {
    // Only notify for high compatibility matches (over 80%)
    if (compatibilityResult.overallScore < 80) {
      return false;
    }
    
    // Create notification content based on entity type
    let title = '';
    let message = '';
    let link = '';
    
    switch (entityType) {
      case 'listing':
        title = 'High Compatibility Marketplace Listing';
        message = `We found a listing that's ${compatibilityResult.overallScore}% compatible with your preferences: ${entityTitle}`;
        link = `/marketplace/${entityId}`;
        break;
      case 'job':
        title = 'Job Opportunity Match';
        message = `New job opportunity with ${compatibilityResult.overallScore}% compatibility: ${entityTitle}`;
        link = `/jobs/${entityId}`;
        break;
      case 'user':
        title = 'Potential Collaborator Match';
        message = `You're ${compatibilityResult.overallScore}% compatible with ${entityTitle}. Consider connecting!`;
        link = `/profile?id=${entityId}`;
        break;
    }
    
    // Send the notification
    return this.sendNotification({
      userId,
      title,
      message,
      type: 'success',
      link,
      data: {
        compatibilityScore: compatibilityResult.overallScore,
        primaryReason: compatibilityResult.primaryMatchReason,
        entityType,
        entityId
      }
    });
  }
  
  /**
   * Send an email notification for high compatibility matches
   */
  async sendEmailNotification({
    userId,
    compatibilityResult,
    entityType,
    entityId,
    entityTitle
  }: CompatibilityNotificationOptions): Promise<boolean> {
    // In a real app, this would send an actual email
    // For now, we'll just log it
    console.log(`Would send email to user ${userId} about ${entityType} match:`, {
      score: compatibilityResult.overallScore,
      title: entityTitle,
      entityId
    });
    
    return true;
  }
  
  /**
   * Check for new high compatibility matches and notify users
   * This would typically be run on a schedule or triggered by new listings
   */
  async checkAndNotifyNewMatches(): Promise<void> {
    // In a real app, this would:
    // 1. Query for new listings/jobs/users added since last check
    // 2. For each user, calculate compatibility with new entities
    // 3. Send notifications for high matches
    
    console.log('Checking for new compatibility matches to notify users');
  }
}

export const notificationService = new NotificationService();
