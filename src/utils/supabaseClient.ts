import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create and export the typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// User profile types
export type Profile = {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  skills?: string[];
  hourly_rate?: number;
  availability?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: {
    average_rating?: number;
  };
};

// Listing types
export type Listing = {
  id: string;
  title: string;
  description: string;
  type: 'job' | 'gig' | 'project';
  category: string;
  subcategory?: string;
  budget_min?: number;
  budget_max?: number;
  budget_type?: 'fixed' | 'hourly' | 'range';
  location?: string;
  remote: boolean;
  user_id: string;
  status: 'draft' | 'active' | 'filled' | 'closed' | 'expired';
  expires_at?: string;
  created_at: string;
  updated_at: string;
};

// Application types
export type Application = {
  id: string;
  listing_id: string;
  applicant_id: string;
  cover_letter?: string;
  proposed_rate?: number;
  proposed_timeline?: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
  updated_at: string;
};

// Message types
export type Conversation = {
  id: string;
  listing_id?: string;
  application_id?: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
};

export type ConversationParticipant = {
  id: string;
  conversation_id: string;
  user_id: string;
  last_read_at: string;
  created_at: string;
  profile?: Profile;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: Profile;
};

// Review types
export type Review = {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  listing_id?: string;
  application_id?: string;
  rating: number;
  content?: string;
  response?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  reviewer?: Profile;
  reviewee?: Profile;
  categories?: ReviewCategory[];
};

export type ReviewCategory = {
  id: string;
  review_id: string;
  category: string;
  rating: number;
  created_at: string;
};

// Helper functions for common Supabase operations
export const supabaseHelper = {
  // Auth helpers
  auth: {
    signUp: async (email: string, password: string) => {
      return await supabase.auth.signUp({ email, password });
    },
    signIn: async (email: string, password: string) => {
      return await supabase.auth.signInWithPassword({ email, password });
    },
    signOut: async () => {
      return await supabase.auth.signOut();
    },
    getCurrentUser: async () => {
      return await supabase.auth.getUser();
    },
    getSession: async () => {
      return await supabase.auth.getSession();
    },
  },

  // Profile helpers
  profiles: {
    getProfile: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      return { data, error };
    },
    updateProfile: async (userId: string, updates: Partial<Profile>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select();
      
      return { data, error };
    },
    getSettings: async (userId: string) => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', userId)
        .single();
      
      return { data, error };
    },
    updateSettings: async (userId: string, updates: any) => {
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('id', userId)
        .select();
      
      return { data, error };
    },
  },

  // Listing helpers
  listings: {
    getListings: async (filters: any = {}, page = 1, limit = 10) => {
      let query = supabase
        .from('listings')
        .select('*, profiles!listings_user_id_fkey(username, avatar_url)')
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.remote !== undefined) query = query.eq('remote', filters.remote);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.user_id) query = query.eq('user_id', filters.user_id);
      
      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      return { data, error, count };
    },
    getListing: async (id: string) => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(id, username, avatar_url, location),
          listing_attachments(*),
          listing_tags(*)
        `)
        .eq('id', id)
        .single();
      
      return { data, error };
    },
    createListing: async (listing: Partial<Listing>) => {
      const { data, error } = await supabase
        .from('listings')
        .insert(listing)
        .select();
      
      return { data, error };
    },
    updateListing: async (id: string, updates: Partial<Listing>) => {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select();
      
      return { data, error };
    },
    deleteListing: async (id: string) => {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      return { error };
    },
  },

  // Application helpers
  applications: {
    getApplications: async (filters: any = {}) => {
      let query = supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_applicant_id_fkey(id, username, avatar_url),
          listings(id, title, type, status)
        `);
      
      // Apply filters
      if (filters.listing_id) query = query.eq('listing_id', filters.listing_id);
      if (filters.applicant_id) query = query.eq('applicant_id', filters.applicant_id);
      if (filters.status) query = query.eq('status', filters.status);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      return { data, error };
    },
    getApplication: async (id: string) => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_applicant_id_fkey(id, username, avatar_url, bio, location, skills),
          listings(id, title, description, type, user_id, status),
          application_attachments(*)
        `)
        .eq('id', id)
        .single();
      
      return { data, error };
    },
    createApplication: async (application: Partial<Application>) => {
      const { data, error } = await supabase
        .from('applications')
        .insert(application)
        .select();
      
      return { data, error };
    },
    updateApplication: async (id: string, updates: Partial<Application>) => {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select();
      
      return { data, error };
    },
  },

  // Messaging helpers
  messages: {
    getConversations: async (userId: string) => {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations!inner(
            id,
            listing_id,
            application_id,
            updated_at,
            created_at
          )
        `)
        .eq('user_id', userId)
        .order('updated_at', { foreignTable: 'conversations', ascending: false });
      
      return { data, error };
    },
    getConversation: async (id: string) => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants(
            id,
            user_id,
            last_read_at,
            profiles(id, username, avatar_url)
          )
        `)
        .eq('id', id)
        .single();
      
      return { data, error };
    },
    getMessages: async (conversationId: string, limit = 50) => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_sender_id_fkey(id, username, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      return { data, error };
    },
    sendMessage: async (conversationId: string, senderId: string, content: string) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content
        })
        .select();
      
      return { data, error };
    },
    createConversation: async (participants: string[], listingId?: string, applicationId?: string) => {
      // Create conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          listing_id: listingId,
          application_id: applicationId
        })
        .select()
        .single();
      
      if (conversationError || !conversation) {
        return { data: null, error: conversationError };
      }
      
      // Add participants
      const participantRecords = participants.map(userId => ({
        conversation_id: conversation.id,
        user_id: userId
      }));
      
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participantRecords);
      
      return { data: conversation, error: participantsError };
    },
  },

  // Review helpers
  reviews: {
    getUserReviews: async (userId: string, asReviewer = false) => {
      const field = asReviewer ? 'reviewer_id' : 'reviewee_id';
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(id, username, avatar_url),
          reviewee:profiles!reviews_reviewee_id_fkey(id, username, avatar_url),
          listings(id, title),
          review_categories(*)
        `)
        .eq(field, userId)
        .order('created_at', { ascending: false });
      
      return { data, error };
    },
    getReview: async (id: string) => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(id, username, avatar_url),
          reviewee:profiles!reviews_reviewee_id_fkey(id, username, avatar_url),
          listings(id, title),
          review_categories(*)
        `)
        .eq('id', id)
        .single();
      
      return { data, error };
    },
    createReview: async (review: Partial<Review>, categories?: Partial<ReviewCategory>[]) => {
      // Create review
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select();
      
      if (error || !data || !data[0]) {
        return { data: null, error };
      }
      
      // Add categories if provided
      if (categories && categories.length > 0) {
        const reviewId = data[0].id;
        const categoryRecords = categories.map(category => ({
          ...category,
          review_id: reviewId
        }));
        
        await supabase
          .from('review_categories')
          .insert(categoryRecords);
      }
      
      return { data, error };
    },
    respondToReview: async (id: string, response: string) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({ response })
        .eq('id', id)
        .select();
      
      return { data, error };
    },
  },
};

export default supabaseHelper;
