// Auth types for Supabase

export type AuthUser = {
  id: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  aud: string;
  email?: string;
  phone?: string;
  created_at: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  [key: string]: any;
};

// Types for auth-related tables in the public schema
export type AuthSession = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: AuthUser;
};

// Auth error type
export type AuthError = {
  message: string;
  status?: number;
};

// Auth response type
export type AuthResponse = {
  data: {
    session: AuthSession | null;
    user: AuthUser | null;
  } | null;
  error: AuthError | null;
};
