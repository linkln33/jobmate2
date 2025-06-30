// Types for conversations and messages

export type ConversationsTable = {
  Row: {
    id: string;
    listing_id: string | null;
    application_id: string | null;
    title: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    listing_id?: string | null;
    application_id?: string | null;
    title?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    listing_id?: string | null;
    application_id?: string | null;
    title?: string | null;
    created_at?: string;
    updated_at?: string;
  };
};

export type ConversationParticipantsTable = {
  Row: {
    id: string;
    conversation_id: string;
    user_id: string;
    last_read_at: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    conversation_id: string;
    user_id: string;
    last_read_at?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    conversation_id?: string;
    user_id?: string;
    last_read_at?: string | null;
    created_at?: string;
  };
};

export type MessagesTable = {
  Row: {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    attachments: Record<string, any>[] | null;
    is_read: boolean;
    created_at: string;
  };
  Insert: {
    id?: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    attachments?: Record<string, any>[] | null;
    is_read?: boolean;
    created_at?: string;
  };
  Update: {
    id?: string;
    conversation_id?: string;
    sender_id?: string;
    content?: string;
    attachments?: Record<string, any>[] | null;
    is_read?: boolean;
    created_at?: string;
  };
};

// Message with sender details
export type MessageWithSender = MessagesTable['Row'] & {
  sender: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

// Conversation with participants and last message
export type ConversationWithDetails = ConversationsTable['Row'] & {
  participants: (ConversationParticipantsTable['Row'] & {
    profile: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    };
  })[];
  last_message?: MessageWithSender | null;
  unread_count: number;
  listing?: {
    id: string;
    title: string;
  } | null;
  application?: {
    id: string;
    status: string;
  } | null;
};
