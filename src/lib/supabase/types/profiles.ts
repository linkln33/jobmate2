// Types for profiles and user settings

export type ProfilesTable = {
  Row: {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    location_lat: number | null;
    location_lng: number | null;
    website: string | null;
    availability: string | null;
    hourly_rate: number | null;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id: string;
    email?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    location?: string | null;
    location_lat?: number | null;
    location_lng?: number | null;
    website?: string | null;
    availability?: string | null;
    hourly_rate?: number | null;
    metadata?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    email?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    location?: string | null;
    location_lat?: number | null;
    location_lng?: number | null;
    website?: string | null;
    availability?: string | null;
    hourly_rate?: number | null;
    metadata?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
  };
};

export type UserSettingsTable = {
  Row: {
    id: string;
    user_id: string;
    email_notifications: boolean | null;
    push_notifications: boolean | null;
    theme: string | null;
    language: string | null;
    timezone: string | null;
    visibility: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    email_notifications?: boolean | null;
    push_notifications?: boolean | null;
    theme?: string | null;
    language?: string | null;
    timezone?: string | null;
    visibility?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    email_notifications?: boolean | null;
    push_notifications?: boolean | null;
    theme?: string | null;
    language?: string | null;
    timezone?: string | null;
    visibility?: string | null;
    created_at?: string;
    updated_at?: string;
  };
};

// Profile with joined user settings
export type ProfileWithSettings = ProfilesTable['Row'] & {
  user_settings: UserSettingsTable['Row'];
};
