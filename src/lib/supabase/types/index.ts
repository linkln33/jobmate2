// Export all database types from their respective modules
export type * from './auth';
export type * from './profiles';
export type * from './listings';
export type * from './applications';
export type * from './messages';
export type * from './reviews';
export type * from './skills';
export type * from './bookmarks';
export type * from './notifications';
export type * from './payments';

// Main Database type that combines all schemas
export type Database = {
  public: {
    Tables: {
      // Auth and Profiles
      profiles: ProfilesTable;
      user_settings: UserSettingsTable;
      
      // Listings
      listings: ListingsTable;
      listing_attachments: ListingAttachmentsTable;
      listing_tags: ListingTagsTable;
      
      // Applications
      applications: ApplicationsTable;
      application_attachments: ApplicationAttachmentsTable;
      
      // Messages
      conversations: ConversationsTable;
      conversation_participants: ConversationParticipantsTable;
      messages: MessagesTable;
      
      // Reviews
      reviews: ReviewsTable;
      review_categories: ReviewCategoriesTable;
      
      // Skills and Categories
      skills: SkillsTable;
      user_skills: UserSkillsTable;
      categories: CategoriesTable;
      
      // Bookmarks and Searches
      bookmarks: BookmarksTable;
      saved_searches: SavedSearchesTable;
      user_follows: UserFollowsTable;
      collections: CollectionsTable;
      collection_items: CollectionItemsTable;
      
      // Notifications
      notifications: NotificationsTable;
      notification_types: NotificationTypesTable;
      notification_preferences: NotificationPreferencesTable;
      notification_devices: NotificationDevicesTable;
      
      // Payments
      payment_methods: PaymentMethodsTable;
      transactions: TransactionsTable;
      invoices: InvoicesTable;
      escrow: EscrowTable;
      subscription_plans: SubscriptionPlansTable;
      subscriptions: SubscriptionsTable;
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Functions: {
      search_listings: {
        Args: {
          search_term?: string;
          category_id?: string;
          min_budget?: number;
          max_budget?: number;
          location?: string;
          max_distance?: number;
          user_location?: { x: number; y: number };
          status?: string[];
          tags?: string[];
          sort_by?: string;
          sort_direction?: string;
          page_size?: number;
          page_number?: number;
        };
        Returns: {
          id: string;
          title: string;
          description: string;
          user_id: string;
          category_id: string;
          budget_min: number;
          budget_max: number;
          budget_type: string;
          location: string;
          location_lat: number;
          location_lng: number;
          status: string;
          expires_at: string;
          created_at: string;
          updated_at: string;
          distance: number;
          total_count: number;
        }[];
      };
      get_user_stats: {
        Args: { target_user_id: string };
        Returns: Record<string, unknown>;
      };
      get_listing_stats: {
        Args: { target_listing_id: string };
        Returns: Record<string, unknown>;
      };
      get_recommended_listings: {
        Args: { for_user_id: string; limit_count?: number };
        Returns: {
          id: string;
          title: string;
          description: string;
          budget_min: number;
          budget_max: number;
          budget_type: string;
          location: string;
          status: string;
          created_at: string;
          relevance_score: number;
        }[];
      };
      get_similar_listings: {
        Args: { listing_id: string; limit_count?: number };
        Returns: {
          id: string;
          title: string;
          description: string;
          budget_min: number;
          budget_max: number;
          budget_type: string;
          location: string;
          status: string;
          created_at: string;
          similarity_score: number;
        }[];
      };
      calculate_reputation_score: {
        Args: { user_id: string };
        Returns: number;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      has_subscription: {
        Args: { plan_level?: string };
        Returns: boolean;
      };
      can_create_listing: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      // Add any PostgreSQL enums here
    };
  };
};
