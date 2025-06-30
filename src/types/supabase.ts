export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      application_attachments: {
        Row: {
          application_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_attachments_application_id_fkey"
            columns: ["application_id"]
            referencedRelation: "applications"
            referencedColumns: ["id"]
          }
        ]
      }
      applications: {
        Row: {
          applicant_id: string
          cover_letter: string | null
          created_at: string
          id: string
          listing_id: string
          proposed_rate: number | null
          proposed_timeline: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          listing_id: string
          proposed_rate?: number | null
          proposed_timeline?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          proposed_rate?: number | null
          proposed_timeline?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey"
            columns: ["applicant_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "listings"
            referencedColumns: ["id"]
          }
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          last_read_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          last_read_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          last_read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          application_id: string | null
          created_at: string
          id: string
          listing_id: string | null
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_application_id_fkey"
            columns: ["application_id"]
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "listings"
            referencedColumns: ["id"]
          }
        ]
      }
      listing_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          listing_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          listing_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_attachments_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "listings"
            referencedColumns: ["id"]
          }
        ]
      }
      listing_tags: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          tag: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          tag: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_tags_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "listings"
            referencedColumns: ["id"]
          }
        ]
      }
      listings: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          budget_type: string | null
          category: string
          created_at: string
          description: string
          expires_at: string | null
          id: string
          location: string | null
          remote: boolean
          status: string
          subcategory: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          budget_type?: string | null
          category: string
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          location?: string | null
          remote?: boolean
          status?: string
          subcategory?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          budget_type?: string | null
          category?: string
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          location?: string | null
          remote?: boolean
          status?: string
          subcategory?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          availability: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          hourly_rate: number | null
          id: string
          location: string | null
          metadata: Json | null
          skills: string[] | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          hourly_rate?: number | null
          id: string
          location?: string | null
          metadata?: Json | null
          skills?: string[] | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          location?: string | null
          metadata?: Json | null
          skills?: string[] | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      review_categories: {
        Row: {
          category: string
          created_at: string
          id: string
          rating: number
          review_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          rating: number
          review_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          rating?: number
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_categories_review_id_fkey"
            columns: ["review_id"]
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          application_id: string | null
          content: string | null
          created_at: string
          id: string
          is_public: boolean
          listing_id: string | null
          rating: number
          response: string | null
          reviewee_id: string
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          listing_id?: string | null
          rating: number
          response?: string | null
          reviewee_id: string
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          listing_id?: string | null
          rating?: number
          response?: string | null
          reviewee_id?: string
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_application_id_fkey"
            columns: ["application_id"]
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          language: string | null
          push_notifications: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id: string
          language?: string | null
          push_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          push_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_id_fkey"
            columns: ["id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      waitlist_referrals: {
        Row: {
          created_at: string
          id: string
          points_awarded: number
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_awarded?: number
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_awarded?: number
          referral_code?: string
          referred_user_id?: string
          referrer_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            referencedRelation: "waitlist_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_referrals_referrer_user_id_fkey"
            columns: ["referrer_user_id"]
            referencedRelation: "waitlist_users"
            referencedColumns: ["id"]
          }
        ]
      }
      waitlist_rewards: {
        Row: {
          badge: string
          created_at: string
          id: string
          milestone: number
          user_id: string
        }
        Insert: {
          badge: string
          created_at?: string
          id?: string
          milestone: number
          user_id: string
        }
        Update: {
          badge?: string
          created_at?: string
          id?: string
          milestone?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_rewards_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "waitlist_users"
            referencedColumns: ["id"]
          }
        ]
      }
      waitlist_users: {
        Row: {
          created_at: string
          email: string
          id: string
          interests: string[] | null
          location: string | null
          name: string
          points: number
          referral_code: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interests?: string[] | null
          location?: string | null
          name: string
          points?: number
          referral_code: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interests?: string[] | null
          location?: string | null
          name?: string
          points?: number
          referral_code?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_points: {
        Args: {
          user_id: string
          points_to_add: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
