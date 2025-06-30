-- JobMate Extended Features: Payments and Transactions
-- This file defines the payment, transaction, and related tables

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit_card', 'bank_account', 'paypal', 'stripe')),
  provider TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  last_four TEXT,
  expiry_date TEXT,
  billing_address JSONB,
  metadata JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('payment', 'payout', 'refund', 'fee', 'adjustment')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT,
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  external_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  paid_date DATE,
  notes TEXT,
  items JSONB NOT NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create escrow table for holding funds during project completion
CREATE TABLE IF NOT EXISTS escrow (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL NOT NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  freelancer_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('pending', 'funded', 'released', 'disputed', 'refunded')),
  funded_transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  released_transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  release_conditions TEXT,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_escrow_updated_at
  BEFORE UPDATE ON escrow
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT REFERENCES subscription_plans(id) ON DELETE RESTRICT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  external_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for payment_methods
-- Users can view their own payment methods
CREATE POLICY "Users can view their own payment methods"
  ON payment_methods FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own payment methods
CREATE POLICY "Users can create payment methods"
  ON payment_methods FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own payment methods
CREATE POLICY "Users can update their own payment methods"
  ON payment_methods FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own payment methods
CREATE POLICY "Users can delete their own payment methods"
  ON payment_methods FOR DELETE
  USING (user_id = auth.uid());

-- Policies for transactions
-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (user_id = auth.uid());

-- Only system can create transactions (will be handled through functions)
-- Only system can update transactions (will be handled through functions)

-- Policies for invoices
-- Users can view invoices they created
CREATE POLICY "Users can view invoices they created"
  ON invoices FOR SELECT
  USING (user_id = auth.uid());

-- Users can view invoices where they are the client
CREATE POLICY "Users can view invoices as client"
  ON invoices FOR SELECT
  USING (client_id = auth.uid());

-- Users can create invoices
CREATE POLICY "Users can create invoices"
  ON invoices FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update invoices they created
CREATE POLICY "Users can update their own invoices"
  ON invoices FOR UPDATE
  USING (user_id = auth.uid());

-- Policies for escrow
-- Users can view escrow where they are client or freelancer
CREATE POLICY "Users can view escrow as client or freelancer"
  ON escrow FOR SELECT
  USING (client_id = auth.uid() OR freelancer_id = auth.uid());

-- Only system can create escrow (will be handled through functions)
-- Only system can update escrow (will be handled through functions)

-- Policies for subscription_plans
-- Anyone can view active subscription plans
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = true);

-- Only admins can modify subscription plans
CREATE POLICY "Only admins can insert subscription plans"
  ON subscription_plans FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE metadata->>'is_admin' = 'true'));

CREATE POLICY "Only admins can update subscription plans"
  ON subscription_plans FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE metadata->>'is_admin' = 'true'));

-- Policies for subscriptions
-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- Only system can create subscriptions (will be handled through functions)
-- Only system can update subscriptions (will be handled through functions)

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, price, interval, features)
VALUES 
  ('basic', 'Basic Plan', 'Essential features for freelancers', 0, 'monthly', 
   '{"listings": 5, "applications": "unlimited", "featured_profile": false, "priority_support": false}'::jsonb),
  ('pro', 'Pro Plan', 'Advanced features for serious freelancers', 9.99, 'monthly', 
   '{"listings": 15, "applications": "unlimited", "featured_profile": true, "priority_support": false}'::jsonb),
  ('business', 'Business Plan', 'Complete solution for agencies and businesses', 29.99, 'monthly', 
   '{"listings": 50, "applications": "unlimited", "featured_profile": true, "priority_support": true}'::jsonb),
  ('basic-yearly', 'Basic Plan (Yearly)', 'Essential features for freelancers', 0, 'yearly', 
   '{"listings": 5, "applications": "unlimited", "featured_profile": false, "priority_support": false}'::jsonb),
  ('pro-yearly', 'Pro Plan (Yearly)', 'Advanced features for serious freelancers', 99.99, 'yearly', 
   '{"listings": 15, "applications": "unlimited", "featured_profile": true, "priority_support": false}'::jsonb),
  ('business-yearly', 'Business Plan (Yearly)', 'Complete solution for agencies and businesses', 299.99, 'yearly', 
   '{"listings": 50, "applications": "unlimited", "featured_profile": true, "priority_support": true}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  year_prefix TEXT;
  next_number INTEGER;
BEGIN
  year_prefix := to_char(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(number FROM 6) AS INTEGER)), 0) + 1
  INTO next_number
  FROM invoices
  WHERE number LIKE year_prefix || '-%';
  
  NEW.number := year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate invoice number
CREATE OR REPLACE TRIGGER invoices_generate_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  WHEN (NEW.number IS NULL)
  EXECUTE PROCEDURE generate_invoice_number();
