// Types for notifications and related tables

export type NotificationsTable = {
  Row: {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    data: Record<string, any> | null;
    is_read: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, any> | null;
    is_read?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    type?: string;
    title?: string;
    message?: string;
    data?: Record<string, any> | null;
    is_read?: boolean;
    created_at?: string;
    updated_at?: string;
  };
};

export type NotificationTypesTable = {
  Row: {
    id: string;
    description: string;
    template: string;
    icon: string | null;
    color: string | null;
    category: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id: string;
    description: string;
    template: string;
    icon?: string | null;
    color?: string | null;
    category?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    description?: string;
    template?: string;
    icon?: string | null;
    color?: string | null;
    category?: string | null;
    created_at?: string;
    updated_at?: string;
  };
};

export type NotificationPreferencesTable = {
  Row: {
    id: string;
    user_id: string;
    type: string;
    email: boolean;
    push: boolean;
    in_app: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    type: string;
    email?: boolean;
    push?: boolean;
    in_app?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    type?: string;
    email?: boolean;
    push?: boolean;
    in_app?: boolean;
    created_at?: string;
    updated_at?: string;
  };
};

export type NotificationDevicesTable = {
  Row: {
    id: string;
    user_id: string;
    device_token: string;
    device_type: string;
    is_active: boolean;
    last_used_at: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    device_token: string;
    device_type: string;
    is_active?: boolean;
    last_used_at?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    device_token?: string;
    device_type?: string;
    is_active?: boolean;
    last_used_at?: string | null;
    created_at?: string;
    updated_at?: string;
  };
};

// Notification with type details
export type NotificationWithType = NotificationsTable['Row'] & {
  notification_type: NotificationTypesTable['Row'];
};
