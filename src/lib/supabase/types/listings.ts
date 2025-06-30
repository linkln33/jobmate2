// Types for listings and related tables

export type ListingsTable = {
  Row: {
    id: string;
    user_id: string;
    title: string;
    description: string;
    category_id: string | null;
    budget_min: number | null;
    budget_max: number | null;
    budget_type: string | null;
    location: string | null;
    location_lat: number | null;
    location_lng: number | null;
    status: string;
    expires_at: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    title: string;
    description: string;
    category_id?: string | null;
    budget_min?: number | null;
    budget_max?: number | null;
    budget_type?: string | null;
    location?: string | null;
    location_lat?: number | null;
    location_lng?: number | null;
    status?: string;
    expires_at?: string | null;
    metadata?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    title?: string;
    description?: string;
    category_id?: string | null;
    budget_min?: number | null;
    budget_max?: number | null;
    budget_type?: string | null;
    location?: string | null;
    location_lat?: number | null;
    location_lng?: number | null;
    status?: string;
    expires_at?: string | null;
    metadata?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
  };
};

export type ListingAttachmentsTable = {
  Row: {
    id: string;
    listing_id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    is_featured: boolean | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    listing_id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    is_featured?: boolean | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    listing_id?: string;
    file_name?: string;
    file_path?: string;
    file_type?: string;
    file_size?: number;
    is_featured?: boolean | null;
    created_at?: string;
  };
};

export type ListingTagsTable = {
  Row: {
    id: string;
    listing_id: string;
    tag: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    listing_id: string;
    tag: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    listing_id?: string;
    tag?: string;
    created_at?: string;
  };
};

// Extended listing type with joined data
export type ListingWithDetails = ListingsTable['Row'] & {
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  attachments: ListingAttachmentsTable['Row'][];
  tags: ListingTagsTable['Row'][];
};
