import { messageService, notificationService } from '@/services/api';
import { MessageWithSender, NotificationWithType } from './types';

/**
 * Helper class for managing real-time subscriptions
 */
export class RealtimeSubscriptions {
  private static messageSubscriptions = new Map<string, any>();
  private static notificationSubscription: any = null;
  
  /**
   * Subscribe to new messages in a conversation
   * @param conversationId Conversation ID
   * @param onNewMessage Callback for new messages
   * @returns Unsubscribe function
   */
  static subscribeToMessages(
    conversationId: string,
    onNewMessage: (message: MessageWithSender) => void
  ): () => void {
    // Check if we already have a subscription for this conversation
    if (this.messageSubscriptions.has(conversationId)) {
      // Remove existing subscription
      this.messageSubscriptions.get(conversationId).unsubscribe();
    }
    
    // Create a new subscription
    const subscription = messageService.subscribeToMessages(
      conversationId,
      onNewMessage
    );
    
    // Store the subscription
    this.messageSubscriptions.set(conversationId, subscription);
    
    // Return unsubscribe function
    return () => {
      if (this.messageSubscriptions.has(conversationId)) {
        this.messageSubscriptions.get(conversationId).unsubscribe();
        this.messageSubscriptions.delete(conversationId);
      }
    };
  }
  
  /**
   * Subscribe to new notifications
   * @param onNewNotification Callback for new notifications
   * @returns Unsubscribe function
   */
  static subscribeToNotifications(
    onNewNotification: (notification: NotificationWithType) => void
  ): () => void {
    // Check if we already have a notification subscription
    if (this.notificationSubscription) {
      // Remove existing subscription
      this.notificationSubscription.unsubscribe();
    }
    
    // Create a new subscription
    this.notificationSubscription = notificationService.subscribeToNotifications(
      onNewNotification
    );
    
    // Return unsubscribe function
    return () => {
      if (this.notificationSubscription) {
        this.notificationSubscription.unsubscribe();
        this.notificationSubscription = null;
      }
    };
  }
  
  /**
   * Unsubscribe from all subscriptions
   */
  static unsubscribeAll(): void {
    // Unsubscribe from all message subscriptions
    this.messageSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.messageSubscriptions.clear();
    
    // Unsubscribe from notification subscription
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
      this.notificationSubscription = null;
    }
  }
}

/**
 * React hook for subscribing to new messages in a conversation
 * @param conversationId Conversation ID
 * @param onNewMessage Callback for new messages
 */
export function useMessageSubscription(
  conversationId: string | undefined,
  onNewMessage: (message: MessageWithSender) => void
): void {
  // This would be implemented with useEffect in a React component
  // For demonstration purposes, we'll just show the pattern
  /*
  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = RealtimeSubscriptions.subscribeToMessages(
      conversationId,
      onNewMessage
    );
    
    return () => {
      unsubscribe();
    };
  }, [conversationId, onNewMessage]);
  */
}

/**
 * React hook for subscribing to new notifications
 * @param onNewNotification Callback for new notifications
 */
export function useNotificationSubscription(
  onNewNotification: (notification: NotificationWithType) => void
): void {
  // This would be implemented with useEffect in a React component
  // For demonstration purposes, we'll just show the pattern
  /*
  useEffect(() => {
    const unsubscribe = RealtimeSubscriptions.subscribeToNotifications(
      onNewNotification
    );
    
    return () => {
      unsubscribe();
    };
  }, [onNewNotification]);
  */
}
