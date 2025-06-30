// Types for bookmarks, saved searches, and related tables

export type BookmarksTable = {
  Row: {
    id: string;
    user_id: string;
    listing_id: string;
    notes: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    listing_id: string;
    notes?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    listing_id?: string;
    notes?: string | null;
    created_at?: string;
  };
};

export type SavedSearchesTable = {
  Row: {
    id: string;
    user_id: string;
    name: string;
    search_params: Record<string, any>;
    is_alert: boolean;
    alert_frequency: string | null;
    last_alerted_at: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    name: string;
    search_params: Record<string, any>;
    is_alert?: boolean;
    alert_frequency?: string | null;
    last_alerted_at?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    name?: string;
    search_params?: Record<string, any>;
    is_alert?: boolean;
    alert_frequency?: string | null;
    last_alerted_at?: string | null;
    created_at?: string;
    updated_at?: string;
  };
};

export type UserFollowsTable = {
  Row: {
    id: string;
    follower_id: string;
    following_id: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    follower_id: string;
    following_id: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    follower_id?: string;
    following_id?: string;
    created_at?: string;
  };
};

export type CollectionsTable = {
  Row: {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    is_private: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    name: string;
    description?: string | null;
    is_private?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    name?: string;
    description?: string | null;
    is_private?: boolean;
    created_at?: string;
    updated_at?: string;
  };
};

export type CollectionItemsTable = {
  Row: {
    id: string;
    collection_id: string;
    listing_id: string;
    notes: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    collection_id: string;
    listing_id: string;
    notes?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    collection_id?: string;
    listing_id?: string;
    notes?: string | null;
    created_at?: string;
  };
};

// Bookmark with listing details
export type BookmarkWithListing = BookmarksTable['Row'] & {
  listing: {
    id: string;
    title: string;
    description: string;
    budget_min: number | null;
    budget_max: number | null;
    budget_type: string | null;
    status: string;
    created_at: string;
    user_id: string;
  };
};

// Collection with items
export type CollectionWithItems = CollectionsTable['Row'] & {
  items: (CollectionItemsTable['Row'] & {
    listing: {
      id: string;
      title: string;
      description: string;
      status: string;
    };
  })[];
};
