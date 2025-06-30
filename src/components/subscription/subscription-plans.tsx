import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Button, 
  Tabs, 
  Tab,
  Alert,
  Paper
} from '@mui/material';
import { SubscriptionPlanCard } from './subscription-plan-card';
import { SubscriptionPlan, SubscriptionTier, UserSubscription } from '@/types/subscription';

// Sample subscription plans
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
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

interface SubscriptionPlansProps {
  currentSubscription?: UserSubscription;
  onSelectPlan: (planId: string) => Promise<void>;
  onCancelSubscription?: () => Promise<void>;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  currentSubscription,
  onSelectPlan,
  onCancelSubscription
}) => {
  const [selectedTab, setSelectedTab] = useState<'plans' | 'current'>('plans');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentPlan = currentSubscription 
    ? SUBSCRIPTION_PLANS.find(plan => plan.id === currentSubscription.planId)
    : undefined;
  
  const currentTier = currentPlan?.tier;
  
  const handleSelectPlan = async (planId: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      await onSelectPlan(planId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select plan');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!onCancelSubscription) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      await onCancelSubscription();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Subscription Plans
        </Typography>
        
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Choose the plan that best fits your job search needs
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {currentSubscription && (
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="Available Plans" value="plans" />
            <Tab label="Current Subscription" value="current" />
          </Tabs>
        </Box>
      )}
      
      {selectedTab === 'plans' ? (
        <Grid container spacing={3}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <SubscriptionPlanCard
                plan={plan}
                currentTier={currentTier}
                onSelectPlan={handleSelectPlan}
                isPopular={plan.tier === 'pro'}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        currentSubscription && currentPlan && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Current Subscription: {currentPlan.name}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                Status: <strong>{currentSubscription.status}</strong>
              </Typography>
              
              <Typography variant="body1">
                Current Period: {formatDate(currentSubscription.currentPeriodStart)} - {formatDate(currentSubscription.currentPeriodEnd)}
              </Typography>
              
              {currentSubscription.cancelAtPeriodEnd && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Your subscription will be canceled at the end of the current billing period.
                </Alert>
              )}
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                Available Credits: <strong>{currentSubscription.credits}</strong>
              </Typography>
            </Box>
            
            {!currentSubscription.cancelAtPeriodEnd && onCancelSubscription && (
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleCancelSubscription}
                disabled={isProcessing}
              >
                Cancel Subscription
              </Button>
            )}
          </Paper>
        )
      )}
    </Container>
  );
};

export default SubscriptionPlans;
