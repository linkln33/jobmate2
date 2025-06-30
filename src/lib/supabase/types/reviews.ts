// Types for reviews and related tables

export type ReviewsTable = {
  Row: {
    id: string;
    reviewer_id: string;
    reviewee_id: string;
    listing_id: string | null;
    application_id: string | null;
    rating: number;
    content: string | null;
    response: string | null;
    is_public: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    reviewer_id: string;
    reviewee_id: string;
    listing_id?: string | null;
    application_id?: string | null;
    rating: number;
    content?: string | null;
    response?: string | null;
    is_public?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    reviewer_id?: string;
    reviewee_id?: string;
    listing_id?: string | null;
    application_id?: string | null;
    rating?: number;
    content?: string | null;
    response?: string | null;
    is_public?: boolean;
    created_at?: string;
    updated_at?: string;
  };
};

export type ReviewCategoriesTable = {
  Row: {
    id: string;
    review_id: string;
    category: string;
    rating: number;
    created_at: string;
  };
  Insert: {
    id?: string;
    review_id: string;
    category: string;
    rating: number;
    created_at?: string;
  };
  Update: {
    id?: string;
    review_id?: string;
    category?: string;
    rating?: number;
    created_at?: string;
  };
};

// Review with joined data
export type ReviewWithDetails = ReviewsTable['Row'] & {
  reviewer: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  reviewee: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  categories: ReviewCategoriesTable['Row'][];
  listing?: {
    id: string;
    title: string;
  } | null;
};
