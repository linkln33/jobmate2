import { SubscriptionTier, UserSubscription, PurchasedAddon } from '@/types/subscription';

/**
 * Service to manage feature access based on subscription tier and purchased add-ons
 */
export class FeatureFlagService {
  /**
   * Check if a feature is available for a given subscription tier
   */
  static isFeatureAvailable(
    featureName: string, 
    subscriptionTier: SubscriptionTier | undefined,
    userSubscription?: UserSubscription,
    purchasedAddons?: PurchasedAddon[]
  ): boolean {
    // If no subscription tier is provided, default to free
    const tier = subscriptionTier || 'free';
    
    // Check if feature is available based on subscription tier
    if (this.isFeatureAvailableForTier(featureName, tier)) {
      return true;
    }
    
    // Check if feature is available through purchased add-ons
    if (purchasedAddons && purchasedAddons.length > 0) {
      const hasFeatureAddon = this.hasFeatureAddon(featureName, purchasedAddons);
      if (hasFeatureAddon) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Check if a feature is available for a specific subscription tier
   */
  private static isFeatureAvailableForTier(
    featureName: string, 
    tier: SubscriptionTier
  ): boolean {
    // Define feature availability by tier
    const featureAvailability: Record<string, SubscriptionTier[]> = {
      // Basic features
      'create_jobmate': ['free', 'pro', 'agency'],
      'basic_matching': ['free', 'pro', 'agency'],
      'basic_alerts': ['free', 'pro', 'agency'],
      
      // Pro features
      'real_time_matching': ['pro', 'agency'],
      'auto_alerts': ['pro', 'agency'],
      'chat_companion': ['pro', 'agency'],
      'ai_insights': ['pro', 'agency'],
      'auto_scheduling': ['pro', 'agency'],
      'auto_negotiation': ['pro', 'agency'],
      'templates': ['pro', 'agency'],
      
      // Agency features
      'team_sharing': ['agency'],
      'collaboration': ['agency'],
      'api_access': ['agency'],
      'auto_posting': ['agency'],
      'white_label': ['agency'],
      
      // Limits
      'multiple_jobmates': ['pro', 'agency'],
      'unlimited_jobmates': ['agency']
    };
    
    // Check if feature exists in the availability map
    if (featureName in featureAvailability) {
      return featureAvailability[featureName].includes(tier);
    }
    
    // Default to false for unknown features
    return false;
  }
  
  /**
   * Check if user has purchased an add-on that provides access to a feature
   */
  private static hasFeatureAddon(
    featureName: string, 
    purchasedAddons: PurchasedAddon[]
  ): boolean {
    // Map feature names to add-on IDs
    const featureToAddonMap: Record<string, string[]> = {
      'auto_negotiation': ['feature-auto-negotiation'],
      'chat_companion': ['feature-chat-companion'],
      'auto_scheduling': ['feature-auto-scheduling'],
      'auto_posting': ['feature-auto-posting'],
      'templates': ['category-tech', 'category-finance']
    };
    
    // Check if feature exists in the add-on map
    if (featureName in featureToAddonMap) {
      const addonIds = featureToAddonMap[featureName];
      
      // Check if user has any of the required add-ons
      return purchasedAddons.some(addon => 
        addonIds.includes(addon.addonId) && addon.status === 'active'
      );
    }
    
    return false;
  }
  
  /**
   * Get the maximum number of JobMates allowed for a subscription tier
   */
  static getMaxJobMatesForTier(tier: SubscriptionTier): number {
    switch (tier) {
      case 'free':
        return 1;
      case 'pro':
        return 5;
      case 'agency':
        return 20;
      default:
        return 1;
    }
  }
  
  /**
   * Check if a user has enough credits for a specific action
   */
  static hasEnoughCredits(
    actionName: string, 
    userSubscription?: UserSubscription
  ): boolean {
    if (!userSubscription) {
      return false;
    }
    
    // Define credit costs for different actions
    const creditCosts: Record<string, number> = {
      'create_template': 10,
      'use_auto_negotiation': 5,
      'boost_match': 15,
      'premium_insight': 20
    };
    
    // Check if action exists in the cost map
    if (actionName in creditCosts) {
      return userSubscription.credits >= creditCosts[actionName];
    }
    
    // Default to true for unknown actions
    return true;
  }
  
  /**
   * Get the credit cost for a specific action
   */
  static getCreditCost(actionName: string): number {
    // Define credit costs for different actions
    const creditCosts: Record<string, number> = {
      'create_template': 10,
      'use_auto_negotiation': 5,
      'boost_match': 15,
      'premium_insight': 20
    };
    
    // Return cost if action exists in the cost map
    if (actionName in creditCosts) {
      return creditCosts[actionName];
    }
    
    // Default to 0 for unknown actions
    return 0;
  }
}

export default FeatureFlagService;
