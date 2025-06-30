import { BaseService } from './base.service';
import { 
  NotificationsTable, 
  NotificationPreferencesTable,
  NotificationDevicesTable,
  NotificationWithType
} from '@/lib/supabase/types';

/**
 * Service for managing notifications
 */
export class NotificationService extends BaseService {
  /**
   * Get all notifications for the current user
   * @param limit Maximum number of notifications to return
   * @param offset Offset for pagination
   * @returns User's notifications with type details
   */
  async getMyNotifications(limit: number = 20, offset: number = 0): Promise<NotificationWithType[]> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('notifications')
      .select(`
        *,
        notification_type:notification_types(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      this.handleError(error, 'Failed to fetch notifications');
    }

    return data as unknown as NotificationWithType[];
  }

  /**
   * Get unread notification count for the current user
   * @returns Count of unread notifications
   */
  async getUnreadCount(): Promise<number> {
    const userId = await this.getCurrentUserId();
    
    const { count, error } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      this.handleError(error, 'Failed to fetch unread count');
    }

    return count || 0;
  }

  /**
   * Mark a notification as read
   * @param id Notification ID
   * @returns Updated notification
   */
  async markAsRead(id: string): Promise<NotificationsTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to mark notification as read');
    }

    return data;
  }

  /**
   * Mark all notifications as read
   * @returns Success status
   */
  async markAllAsRead(): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    const { error } = await this.supabase
      .from('notifications')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      this.handleError(error, 'Failed to mark all notifications as read');
    }

    return { success: true };
  }

  /**
   * Delete a notification
   * @param id Notification ID
   * @returns Success status
   */
  async deleteNotification(id: string): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    const { error } = await this.supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      this.handleError(error, 'Failed to delete notification');
    }

    return { success: true };
  }

  /**
   * Get notification preferences for the current user
   * @returns User's notification preferences
   */
  async getMyNotificationPreferences(): Promise<NotificationPreferencesTable['Row'][]> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('notification_preferences')
      .select(`
        *,
        notification_type:notification_types(description, category)
      `)
      .eq('user_id', userId);

    if (error) {
      this.handleError(error, 'Failed to fetch notification preferences');
    }

    return data;
  }

  /**
   * Update notification preferences
   * @param type Notification type
   * @param channels Channels to enable/disable
   * @returns Updated preference
   */
  async updateNotificationPreference(
    type: string,
    channels: { email: boolean; push: boolean; in_app: boolean }
  ): Promise<NotificationPreferencesTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('notification_preferences')
      .update({
        email: channels.email,
        push: channels.push,
        in_app: channels.in_app,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('type', type)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update notification preferences');
    }

    return data;
  }

  /**
   * Register a device for push notifications
   * @param deviceToken Device token
   * @param deviceType Device type (e.g., 'ios', 'android', 'web')
   * @returns Registered device
   */
  async registerDevice(deviceToken: string, deviceType: string): Promise<NotificationDevicesTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Check if device is already registered
    const { data: existingDevice, error: checkError } = await this.supabase
      .from('notification_devices')
      .select('id')
      .eq('user_id', userId)
      .eq('device_token', deviceToken)
      .maybeSingle();
    
    if (checkError) {
      this.handleError(checkError, 'Failed to check existing devices');
    }
    
    if (existingDevice) {
      // Update existing device
      const { data, error } = await this.supabase
        .from('notification_devices')
        .update({
          is_active: true,
          last_used_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingDevice.id)
        .select()
        .single();
      
      if (error) {
        this.handleError(error, 'Failed to update device');
      }
      
      return data;
    } else {
      // Create new device
      const { data, error } = await this.supabase
        .from('notification_devices')
        .insert({
          user_id: userId,
          device_token: deviceToken,
          device_type: deviceType,
          is_active: true
        })
        .select()
        .single();
      
      if (error) {
        this.handleError(error, 'Failed to register device');
      }
      
      return data;
    }
  }

  /**
   * Unregister a device from push notifications
   * @param deviceToken Device token
   * @returns Success status
   */
  async unregisterDevice(deviceToken: string): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    const { error } = await this.supabase
      .from('notification_devices')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('device_token', deviceToken);

    if (error) {
      this.handleError(error, 'Failed to unregister device');
    }

    return { success: true };
  }

  /**
   * Set up a real-time subscription for new notifications
   * @param onNewNotification Callback for new notifications
   * @returns Subscription object
   */
  subscribeToNotifications(onNewNotification: (notification: NotificationWithType) => void) {
    return this.supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${this.getCurrentUserId()}`
        },
        async (payload) => {
          const notification = payload.new as NotificationsTable['Row'];
          
          // Get notification type details
          const { data: notificationType, error } = await this.supabase
            .from('notification_types')
            .select('*')
            .eq('id', notification.type)
            .single();
          
          if (!error && notificationType) {
            onNewNotification({
              ...notification,
              notification_type: notificationType
            } as unknown as NotificationWithType);
          }
        }
      )
      .subscribe();
  }
}

// Export a singleton instance for client-side use
export const notificationService = new NotificationService();
