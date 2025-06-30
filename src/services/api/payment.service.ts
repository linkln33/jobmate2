import { BaseService } from './base.service';
import { 
  PaymentMethodsTable, 
  TransactionsTable,
  SubscriptionPlansTable,
  SubscriptionsTable,
  SubscriptionWithPlan
} from '@/lib/supabase/types';

/**
 * Service for managing payments and subscriptions
 */
export class PaymentService extends BaseService {
  /**
   * Get all subscription plans
   * @param includeInactive Whether to include inactive plans
   * @returns List of subscription plans
   */
  async getSubscriptionPlans(includeInactive: boolean = false): Promise<SubscriptionPlansTable['Row'][]> {
    let query = this.supabase
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true });
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;

    if (error) {
      this.handleError(error, 'Failed to fetch subscription plans');
    }

    return data;
  }

  /**
   * Get the current user's active subscription
   * @returns User's subscription with plan details or null if not subscribed
   */
  async getMySubscription(): Promise<SubscriptionWithPlan | null> {
    try {
      const userId = await this.getCurrentUserId();
      
      const { data, error } = await this.supabase
        .from('subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();
      
      if (error) {
        this.handleError(error, 'Failed to fetch subscription');
      }
      
      return data as unknown as SubscriptionWithPlan;
    } catch (error) {
      // User might not be authenticated
      return null;
    }
  }

  /**
   * Get the current user's payment methods
   * @returns User's payment methods
   */
  async getMyPaymentMethods(): Promise<PaymentMethodsTable['Row'][]> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      this.handleError(error, 'Failed to fetch payment methods');
    }

    return data;
  }

  /**
   * Get the current user's transaction history
   * @param limit Maximum number of transactions to return
   * @param offset Offset for pagination
   * @returns User's transactions
   */
  async getMyTransactions(limit: number = 20, offset: number = 0): Promise<TransactionsTable['Row'][]> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      this.handleError(error, 'Failed to fetch transactions');
    }

    return data;
  }
}

// Export a singleton instance for client-side use
export const paymentService = new PaymentService();
