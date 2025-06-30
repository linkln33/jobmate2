// Types for skills, categories, and related tables

export type SkillsTable = {
  Row: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    popularity: number | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    name: string;
    description?: string | null;
    category?: string | null;
    popularity?: number | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    name?: string;
    description?: string | null;
    category?: string | null;
    popularity?: number | null;
    created_at?: string;
    updated_at?: string;
  };
};

export type UserSkillsTable = {
  Row: {
    id: string;
    user_id: string;
    skill_id: string;
    proficiency_level: number | null;
    years_experience: number | null;
    is_featured: boolean | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    skill_id: string;
    proficiency_level?: number | null;
    years_experience?: number | null;
    is_featured?: boolean | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    skill_id?: string;
    proficiency_level?: number | null;
    years_experience?: number | null;
    is_featured?: boolean | null;
    created_at?: string;
  };
};

export type CategoriesTable = {
  Row: {
    id: string;
    name: string;
    description: string | null;
    parent_id: string | null;
    icon: string | null;
    slug: string;
    is_active: boolean;
    display_order: number | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    name: string;
    description?: string | null;
    parent_id?: string | null;
    icon?: string | null;
    slug?: string;
    is_active?: boolean;
    display_order?: number | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    name?: string;
    description?: string | null;
    parent_id?: string | null;
    icon?: string | null;
    slug?: string;
    is_active?: boolean;
    display_order?: number | null;
    created_at?: string;
    updated_at?: string;
  };
};

// User skill with skill details
export type UserSkillWithDetails = UserSkillsTable['Row'] & {
  skill: SkillsTable['Row'];
};

// Category with parent and children
export type CategoryWithRelations = CategoriesTable['Row'] & {
  parent?: CategoriesTable['Row'] | null;
  children?: CategoriesTable['Row'][];
};
