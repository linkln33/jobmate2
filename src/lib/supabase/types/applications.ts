// Types for applications and related tables

export type ApplicationsTable = {
  Row: {
    id: string;
    listing_id: string;
    applicant_id: string;
    cover_letter: string | null;
    proposal_data: Record<string, any> | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    listing_id: string;
    applicant_id: string;
    cover_letter?: string | null;
    proposal_data?: Record<string, any> | null;
    status?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    listing_id?: string;
    applicant_id?: string;
    cover_letter?: string | null;
    proposal_data?: Record<string, any> | null;
    status?: string;
    created_at?: string;
    updated_at?: string;
  };
};

export type ApplicationAttachmentsTable = {
  Row: {
    id: string;
    application_id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    created_at: string;
  };
  Insert: {
    id?: string;
    application_id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    created_at?: string;
  };
  Update: {
    id?: string;
    application_id?: string;
    file_name?: string;
    file_path?: string;
    file_type?: string;
    file_size?: number;
    created_at?: string;
  };
};

// Application with joined data
export type ApplicationWithDetails = ApplicationsTable['Row'] & {
  listing: {
    id: string;
    title: string;
    user_id: string;
  };
  applicant: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  attachments: ApplicationAttachmentsTable['Row'][];
};
