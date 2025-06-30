import { SubscriptionPlan, UserSubscription, PurchasedAddon, Addon, SubscriptionTier } from '@/types/subscription';

/**
 * Service to manage user subscriptions, plans, and add-ons
 */
export class SubscriptionService {
  private static readonly API_BASE = '/api/subscription';
  
  /**
   * Get all available subscription plans
   */
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll return mock data
      return [
        {
          id: 'free-plan',
          name: 'Free',
          tier: 'free',
          price: 0,
          description: 'Basic JobMate functionality for casual job seekers',
          features: {
            maxJobMates: 1,
            realTimeMatching: false,
            autoAlerts: true,
            chatInterface: false,
            aiInsights: false,
            teamSharing: false,
            scheduling: false,
            apiAccess: false,
            autoPosting: false,
            autoNegotiation: false
          }
        },
        {
          id: 'pro-plan',
          name: 'Pro',
          tier: 'pro',
          price: 9.99,
          description: 'Advanced features for serious job seekers',
          features: {
            maxJobMates: 5,
            realTimeMatching: true,
            autoAlerts: true,
            chatInterface: true,
            aiInsights: true,
            teamSharing: false,
            scheduling: true,
            apiAccess: false,
            autoPosting: false,
            autoNegotiation: true
          }
        },
        {
          id: 'agency-plan',
          name: 'Agency',
          tier: 'agency',
          price: 29.99,
          description: 'Full suite of features for teams and professionals',
          features: {
            maxJobMates: 20,
            realTimeMatching: true,
            autoAlerts: true,
            chatInterface: true,
            aiInsights: true,
            teamSharing: true,
            scheduling: true,
            apiAccess: true,
            autoPosting: true,
            autoNegotiation: true
          }
        }
      ];
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
      throw new Error('Failed to fetch subscription plans');
    }
  }
  
  /**
   * Get the current user's subscription
   */
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll return mock data
      return {
        id: 'mock-subscription',
        userId,
        planId: 'free-plan',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false,
        credits: 50
      };
    } catch (error) {
      console.error('Failed to fetch user subscription:', error);
      throw new Error('Failed to fetch user subscription');
    }
  }
  
  /**
   * Subscribe to a plan
   */
  static async subscribeToPlan(userId: string, planId: string): Promise<UserSubscription> {
    try {
      // In a real implementation, this would call an API
      console.log(`Subscribing user ${userId} to plan ${planId}`);
      
      // Mock response
      return {
        id: 'new-subscription',
        userId,
        planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false,
        credits: planId === 'free-plan' ? 10 : planId === 'pro-plan' ? 100 : 500
      };
    } catch (error) {
      console.error('Failed to subscribe to plan:', error);
      throw new Error('Failed to subscribe to plan');
    }
  }
  
  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<UserSubscription> {
    try {
      // In a real implementation, this would call an API
      console.log(`Cancelling subscription ${subscriptionId}`);
      
      // Mock response
      return {
        id: subscriptionId,
        userId: 'mock-user',
        planId: 'free-plan',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: true,
        credits: 0
      };
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }
  
  /**
   * Get all available add-ons
   */
  static async getAddons(): Promise<Addon[]> {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll return mock data
      return [
        {
          id: 'credits-small',
          name: '100 Credits',
          description: 'Add 100 credits to your account for premium features',
          price: 4.99,
          creditCost: 0,
          type: 'credits'
        },
        {
          id: 'credits-medium',
          name: '500 Credits',
          description: 'Add 500 credits to your account for premium features',
          price: 19.99,
          creditCost: 0,
          type: 'credits'
        },
        {
          id: 'boost-matches',
          name: 'Match Boost',
          description: 'Boost your JobMate matching priority for 7 days',
          price: 2.99,
          creditCost: 50,
          type: 'boost',
          duration: 7
        },
        {
          id: 'feature-auto-negotiation',
          name: 'Auto Negotiation',
          description: 'Enable auto negotiation for 30 days without upgrading your plan',
          price: 5.99,
          creditCost: 100,
          type: 'feature',
          duration: 30
        }
      ];
    } catch (error) {
      console.error('Failed to fetch add-ons:', error);
      throw new Error('Failed to fetch add-ons');
    }
  }
  
  /**
   * Get user's purchased add-ons
   */
  static async getUserAddons(userId: string): Promise<PurchasedAddon[]> {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll return mock data
      return [
        {
          id: 'purchased-addon-1',
          userId,
          addonId: 'feature-auto-negotiation',
          purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
          status: 'active'
        }
      ];
    } catch (error) {
      console.error('Failed to fetch user add-ons:', error);
      throw new Error('Failed to fetch user add-ons');
    }
  }
  
  /**
   * Purchase an add-on
   */
  static async purchaseAddon(
    userId: string, 
    addonId: string, 
    useCredits: boolean
  ): Promise<PurchasedAddon> {
    try {
      // In a real implementation, this would call an API
      console.log(`User ${userId} purchasing add-on ${addonId} using ${useCredits ? 'credits' : 'payment'}`);
      
      // Mock response
      return {
        id: `purchased-${addonId}`,
        userId,
        addonId,
        purchaseDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'active'
      };
    } catch (error) {
      console.error('Failed to purchase add-on:', error);
      throw new Error('Failed to purchase add-on');
    }
  }
  
  /**
   * Use credits for a specific action
   */
  static async useCredits(userId: string, amount: number, actionName: string): Promise<number> {
    try {
      // In a real implementation, this would call an API
      console.log(`User ${userId} using ${amount} credits for ${actionName}`);
      
      // Mock response - return remaining credits
      return 50 - amount;
    } catch (error) {
      console.error('Failed to use credits:', error);
      throw new Error('Failed to use credits');
    }
  }
  
  /**
   * Get the current user's subscription tier
   */
  static async getUserSubscriptionTier(userId: string): Promise<SubscriptionTier> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        return 'free';
      }
      
      const plans = await this.getSubscriptionPlans();
      const userPlan = plans.find(plan => plan.id === subscription.planId);
      
      return userPlan?.tier || 'free';
    } catch (error) {
      console.error('Failed to get user subscription tier:', error);
      return 'free'; // Default to free tier on error
    }
  }
}

export default SubscriptionService;
