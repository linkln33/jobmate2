import { BaseService } from './base.service';
import { 
  ConversationsTable, 
  ConversationParticipantsTable, 
  MessagesTable, 
  MessageWithSender,
  ConversationWithDetails
} from '@/lib/supabase/types';

/**
 * Service for managing messages and conversations
 */
export class MessageService extends BaseService {
  /**
   * Get a conversation by ID
   * @param id Conversation ID
   * @returns Conversation with details
   */
  async getConversationById(id: string): Promise<ConversationWithDetails> {
    const userId = await this.getCurrentUserId();
    
    // Check if user is a participant
    const { data: participant, error: participantError } = await this.supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', id)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (participantError) {
      this.handleError(participantError, 'Failed to check conversation access');
    }
    
    if (!participant) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have access to this conversation'
      );
    }
    
    const { data, error } = await this.supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          *,
          profile:profiles(id, full_name, avatar_url)
        ),
        listing:listings(id, title),
        application:applications(id, status)
      `)
      .eq('id', id)
      .single();

    if (error) {
      this.handleError(error, 'Failed to fetch conversation');
    }
    
    // Get last message
    const { data: lastMessage, error: messageError } = await this.supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(id, full_name, avatar_url)
      `)
      .eq('conversation_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (messageError) {
      this.handleError(messageError, 'Failed to fetch last message');
    }
    
    // Get unread count
    const { data: unreadCount, error: countError } = await this.supabase
      .rpc('get_unread_message_count', { conversation_id: id, user_id: userId });
    
    if (countError) {
      this.handleError(countError, 'Failed to get unread count');
    }
    
    // Update last read timestamp
    await this.updateLastRead(id);
    
    return {
      ...data,
      last_message: lastMessage as unknown as MessageWithSender,
      unread_count: unreadCount || 0
    } as unknown as ConversationWithDetails;
  }

  /**
   * Get messages for a conversation
   * @param conversationId Conversation ID
   * @param limit Maximum number of messages to return
   * @param before Timestamp to get messages before
   * @returns Messages with sender details
   */
  async getMessages(
    conversationId: string, 
    limit: number = 50, 
    before?: string
  ): Promise<MessageWithSender[]> {
    const userId = await this.getCurrentUserId();
    
    // Check if user is a participant
    const { data: participant, error: participantError } = await this.supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (participantError) {
      this.handleError(participantError, 'Failed to check conversation access');
    }
    
    if (!participant) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have access to this conversation'
      );
    }
    
    let query = this.supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(id, full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (before) {
      query = query.lt('created_at', before);
    }
    
    const { data, error } = await query;
    
    if (error) {
      this.handleError(error, 'Failed to fetch messages');
    }
    
    // Update last read timestamp
    await this.updateLastRead(conversationId);
    
    return data as unknown as MessageWithSender[];
  }

  /**
   * Send a message
   * @param conversationId Conversation ID
   * @param content Message content
   * @param attachments Optional attachments
   * @returns Sent message
   */
  async sendMessage(
    conversationId: string, 
    content: string, 
    attachments?: Record<string, any>[]
  ): Promise<MessagesTable['Row']> {
    const userId = await this.getCurrentUserId();
    
    // Check if user is a participant
    const { data: participant, error: participantError } = await this.supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (participantError) {
      this.handleError(participantError, 'Failed to check conversation access');
    }
    
    if (!participant) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have access to this conversation'
      );
    }
    
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        content,
        attachments,
        is_read: false
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to send message');
    }
    
    // Update last read timestamp for sender
    await this.updateLastRead(conversationId);
    
    return data;
  }

  /**
   * Create a new conversation
   * @param params Conversation parameters
   * @returns Created conversation
   */
  async createConversation(params: {
    participantIds: string[];
    listingId?: string;
    applicationId?: string;
    title?: string;
    initialMessage?: string;
  }): Promise<ConversationsTable['Row']> {
    const userId = await this.getCurrentUserId();
    const { participantIds, listingId, applicationId, title, initialMessage } = params;
    
    // Ensure current user is included in participants
    if (!participantIds.includes(userId)) {
      participantIds.push(userId);
    }
    
    // Check if conversation already exists between these users
    if (participantIds.length === 2 && !listingId && !applicationId) {
      const { data: existingConversation, error: checkError } = await this.supabase
        .rpc('find_direct_conversation', {
          user_id_1: userId,
          user_id_2: participantIds.find(id => id !== userId) || ''
        });
      
      if (!checkError && existingConversation) {
        return existingConversation;
      }
    }
    
    // Start transaction
    const { data: conversation, error: conversationError } = await this.supabase
      .from('conversations')
      .insert({
        listing_id: listingId,
        application_id: applicationId,
        title
      })
      .select()
      .single();
    
    if (conversationError) {
      this.handleError(conversationError, 'Failed to create conversation');
    }
    
    // Add participants
    const participantsToInsert = participantIds.map(participantId => ({
      conversation_id: conversation.id,
      user_id: participantId
    }));
    
    const { error: participantsError } = await this.supabase
      .from('conversation_participants')
      .insert(participantsToInsert);
    
    if (participantsError) {
      this.handleError(participantsError, 'Failed to add conversation participants');
    }
    
    // Send initial message if provided
    if (initialMessage) {
      await this.sendMessage(conversation.id, initialMessage);
    }
    
    return conversation;
  }

  /**
   * Get all conversations for the current user
   * @returns User's conversations
   */
  async getMyConversations(): Promise<ConversationWithDetails[]> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .rpc('get_user_conversations', { user_id: userId });
    
    if (error) {
      this.handleError(error, 'Failed to fetch conversations');
    }
    
    return data as unknown as ConversationWithDetails[];
  }

  /**
   * Mark all messages in a conversation as read
   * @param conversationId Conversation ID
   * @returns Success status
   */
  async markConversationAsRead(conversationId: string): Promise<{ success: boolean }> {
    const userId = await this.getCurrentUserId();
    
    // Update last read timestamp
    await this.updateLastRead(conversationId);
    
    // Mark messages as read
    const { error } = await this.supabase
      .rpc('mark_conversation_as_read', {
        conversation_id: conversationId,
        user_id: userId
      });
    
    if (error) {
      this.handleError(error, 'Failed to mark conversation as read');
    }
    
    return { success: true };
  }

  /**
   * Get the total unread message count for the current user
   * @returns Unread count
   */
  async getUnreadCount(): Promise<number> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .rpc('get_total_unread_count', { user_id: userId });
    
    if (error) {
      this.handleError(error, 'Failed to get unread count');
    }
    
    return data || 0;
  }

  /**
   * Set up a real-time subscription for new messages in a conversation
   * @param conversationId Conversation ID
   * @param onNewMessage Callback for new messages
   * @returns Subscription object
   */
  subscribeToMessages(conversationId: string, onNewMessage: (message: MessageWithSender) => void) {
    return this.supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          const message = payload.new as MessagesTable['Row'];
          
          // Get sender details
          const { data: sender, error } = await this.supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', message.sender_id)
            .single();
          
          if (!error && sender) {
            onNewMessage({
              ...message,
              sender
            } as unknown as MessageWithSender);
            
            // Update last read timestamp if not the sender
            const userId = await this.getCurrentUserId().catch(() => null);
            if (userId && message.sender_id !== userId) {
              await this.updateLastRead(conversationId);
            }
          }
        }
      )
      .subscribe();
  }

  /**
   * Update the last read timestamp for a conversation
   * @param conversationId Conversation ID
   * @private
   */
  private async updateLastRead(conversationId: string): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      
      await this.supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);
    } catch (error) {
      // Just log the error, don't fail the whole request
      console.error('Failed to update last read timestamp:', error);
    }
  }
}

// Export a singleton instance for client-side use
export const messageService = new MessageService();
