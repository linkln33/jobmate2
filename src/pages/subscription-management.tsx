import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  CircularProgress,
  Alert
} from '@mui/material';
import SubscriptionPlans from '@/components/subscription/subscription-plans';
import AddonStore from '@/components/subscription/addon-store';
import { UserSubscription, PurchasedAddon } from '@/types/subscription';
import SubscriptionService from '@/services/subscription-service';

interface SubscriptionManagementProps {
  userId: string;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'addons'>('plans');
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [purchasedAddons, setPurchasedAddons] = useState<PurchasedAddon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadSubscriptionData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [subscription, addons] = await Promise.all([
          SubscriptionService.getUserSubscription(userId),
          SubscriptionService.getUserAddons(userId)
        ]);
        
        setUserSubscription(subscription);
        setPurchasedAddons(addons);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subscription data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubscriptionData();
  }, [userId]);
  
  const handleSelectPlan = async (planId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSubscription = await SubscriptionService.subscribeToPlan(userId, planId);
      setUserSubscription(updatedSubscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select plan');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!userSubscription) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSubscription = await SubscriptionService.cancelSubscription(userSubscription.id);
      setUserSubscription(updatedSubscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePurchaseAddon = async (addonId: string, useCredits: boolean) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newAddon = await SubscriptionService.purchaseAddon(userId, addonId, useCredits);
      
      // Update user subscription if credits were used
      if (useCredits && userSubscription) {
        const updatedSubscription = await SubscriptionService.getUserSubscription(userId);
        setUserSubscription(updatedSubscription);
      }
      
      // Update purchased addons
      setPurchasedAddons([...purchasedAddons, newAddon]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase add-on');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Subscription Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Subscription Plans" value="plans" />
          <Tab label="Add-ons & Credits" value="addons" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            activeTab === 'plans' ? (
              <SubscriptionPlans
                currentSubscription={userSubscription || undefined}
                onSelectPlan={handleSelectPlan}
                onCancelSubscription={handleCancelSubscription}
              />
            ) : (
              <AddonStore
                userSubscription={userSubscription || undefined}
                onPurchaseAddon={handlePurchaseAddon}
              />
            )
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default SubscriptionManagement;
