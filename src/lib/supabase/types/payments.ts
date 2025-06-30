// Types for payments, transactions, and related tables

export type PaymentMethodsTable = {
  Row: {
    id: string;
    user_id: string;
    type: string;
    provider: string;
    is_default: boolean;
    last_four: string | null;
    expiry_date: string | null;
    billing_address: Record<string, any> | null;
    metadata: Record<string, any> | null;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    type: string;
    provider: string;
    is_default?: boolean;
    last_four?: string | null;
    expiry_date?: string | null;
    billing_address?: Record<string, any> | null;
    metadata?: Record<string, any> | null;
    is_verified?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    type?: string;
    provider?: string;
    is_default?: boolean;
    last_four?: string | null;
    expiry_date?: string | null;
    billing_address?: Record<string, any> | null;
    metadata?: Record<string, any> | null;
    is_verified?: boolean;
    created_at?: string;
    updated_at?: string;
  };
};

export type TransactionsTable = {
  Row: {
    id: string;
    user_id: string;
    type: string;
    status: string;
    amount: number;
    currency: string;
    description: string | null;
    payment_method_id: string | null;
    external_id: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    type: string;
    status: string;
    amount: number;
    currency: string;
    description?: string | null;
    payment_method_id?: string | null;
    external_id?: string | null;
    metadata?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    type?: string;
    status?: string;
    amount?: number;
    currency?: string;
    description?: string | null;
    payment_method_id?: string | null;
    external_id?: string | null;
    metadata?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
  };
};

export type InvoicesTable = {
  Row: {
    id: string;
    number: string;
    user_id: string;
    client_id: string;
    listing_id: string | null;
    application_id: string | null;
    amount: number;
    tax_amount: number | null;
    currency: string;
    status: string;
    due_date: string | null;
    issued_date: string | null;
    paid_date: string | null;
    notes: string | null;
    items: Record<string, any>[] | null;
    transaction_id: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    number?: string;
    user_id: string;
    client_id: string;
    listing_id?: string | null;
    application_id?: string | null;
    amount: number;
    tax_amount?: number | null;
    currency: string;
    status?: string;
    due_date?: string | null;
    issued_date?: string | null;
    paid_date?: string | null;
    notes?: string | null;
    items?: Record<string, any>[] | null;
    transaction_id?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    number?: string;
    user_id?: string;
    client_id?: string;
    listing_id?: string | null;
    application_id?: string | null;
    amount?: number;
    tax_amount?: number | null;
    currency?: string;
    status?: string;
    due_date?: string | null;
    issued_date?: string | null;
    paid_date?: string | null;
    notes?: string | null;
    items?: Record<string, any>[] | null;
    transaction_id?: string | null;
    created_at?: string;
    updated_at?: string;
  };
};

export type EscrowTable = {
  Row: {
    id: string;
    listing_id: string;
    application_id: string;
    client_id: string;
    freelancer_id: string;
    amount: number;
    currency: string;
    status: string;
    funded_transaction_id: string | null;
    released_transaction_id: string | null;
    release_conditions: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    listing_id: string;
    application_id: string;
    client_id: string;
    freelancer_id: string;
    amount: number;
    currency: string;
    status?: string;
    funded_transaction_id?: string | null;
    released_transaction_id?: string | null;
    release_conditions?: string | null;
    due_date?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    listing_id?: string;
    application_id?: string;
    client_id?: string;
    freelancer_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    funded_transaction_id?: string | null;
    released_transaction_id?: string | null;
    release_conditions?: string | null;
    due_date?: string | null;
    created_at?: string;
    updated_at?: string;
  };
};

export type SubscriptionPlansTable = {
  Row: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    currency: string;
    interval: string;
    features: Record<string, any> | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    currency: string;
    interval: string;
    features?: Record<string, any> | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    name?: string;
    description?: string | null;
    price?: number;
    currency?: string;
    interval?: string;
    features?: Record<string, any> | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
};

export type SubscriptionsTable = {
  Row: {
    id: string;
    user_id: string;
    plan_id: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    canceled_at: string | null;
    payment_method_id: string | null;
    external_id: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    plan_id: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end?: boolean;
    canceled_at?: string | null;
    payment_method_id?: string | null;
    external_id?: string | null;
    metadata?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    plan_id?: string;
    status?: string;
    current_period_start?: string;
    current_period_end?: string;
    cancel_at_period_end?: boolean;
    canceled_at?: string | null;
    payment_method_id?: string | null;
    external_id?: string | null;
    metadata?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
  };
};

// Subscription with plan details
export type SubscriptionWithPlan = SubscriptionsTable['Row'] & {
  plan: SubscriptionPlansTable['Row'];
};
