import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip,
  Divider,
  Alert,
  Badge
} from '@mui/material';
import { 
  Bolt as BoltIcon,
  Extension as ExtensionIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { Addon, UserSubscription } from '@/types/subscription';

// Sample add-ons
const SAMPLE_ADDONS: Addon[] = [
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
  },
  {
    id: 'category-tech',
    name: 'Tech Industry Pack',
    description: 'Specialized JobMate templates and insights for tech industry',
    price: 9.99,
    creditCost: 200,
    type: 'agent_category'
  },
  {
    id: 'category-finance',
    name: 'Finance Industry Pack',
    description: 'Specialized JobMate templates and insights for finance industry',
    price: 9.99,
    creditCost: 200,
    type: 'agent_category'
  }
];

interface AddonCardProps {
  addon: Addon;
  userSubscription?: UserSubscription;
  onPurchase: (addonId: string, useCredits: boolean) => Promise<void>;
}

const AddonCard: React.FC<AddonCardProps> = ({ 
  addon, 
  userSubscription,
  onPurchase 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const hasEnoughCredits = userSubscription && 
    addon.creditCost > 0 && 
    userSubscription.credits >= addon.creditCost;
  
  const getAddonIcon = () => {
    switch (addon.type) {
      case 'credits':
        return <BoltIcon fontSize="large" color="primary" />;
      case 'boost':
        return <BoltIcon fontSize="large" color="secondary" />;
      case 'feature':
        return <ExtensionIcon fontSize="large" color="info" />;
      case 'agent_category':
        return <CategoryIcon fontSize="large" color="success" />;
      default:
        return <ExtensionIcon fontSize="large" />;
    }
  };
  
  const handlePurchase = async (useCredits: boolean) => {
    setIsProcessing(true);
    try {
      await onPurchase(addon.id, useCredits);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getAddonIcon()}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {addon.name}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {addon.description}
        </Typography>
        
        {addon.duration && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
            <Typography variant="body2" color="text.secondary">
              {addon.duration} days
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          {addon.type !== 'credits' && addon.creditCost > 0 ? (
            <Chip 
              label={`${addon.creditCost} credits`} 
              color="primary" 
              size="small" 
              icon={<BoltIcon />} 
            />
          ) : (
            <Box /> // Empty box for spacing
          )}
          
          <Typography variant="h6" color="text.primary">
            ${addon.price}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Button 
          variant="contained" 
          size="small"
          onClick={() => handlePurchase(false)}
          disabled={isProcessing}
          fullWidth={!hasEnoughCredits}
        >
          Buy Now
        </Button>
        
        {hasEnoughCredits && (
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => handlePurchase(true)}
            disabled={isProcessing}
          >
            Use Credits
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

interface AddonStoreProps {
  userSubscription?: UserSubscription;
  onPurchaseAddon: (addonId: string, useCredits: boolean) => Promise<void>;
}

export const AddonStore: React.FC<AddonStoreProps> = ({
  userSubscription,
  onPurchaseAddon
}) => {
  const [error, setError] = useState<string | null>(null);
  
  const handlePurchase = async (addonId: string, useCredits: boolean) => {
    setError(null);
    try {
      await onPurchaseAddon(addonId, useCredits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase add-on');
    }
  };
  
  // Group add-ons by type
  const creditAddons = SAMPLE_ADDONS.filter(addon => addon.type === 'credits');
  const featureAddons = SAMPLE_ADDONS.filter(addon => addon.type === 'feature');
  const boostAddons = SAMPLE_ADDONS.filter(addon => addon.type === 'boost');
  const categoryAddons = SAMPLE_ADDONS.filter(addon => addon.type === 'agent_category');
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add-on Store
        </Typography>
        
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Enhance your JobMate experience with premium add-ons
        </Typography>
        
        {userSubscription && (
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="body1">
              Your Credits: <Badge badgeContent={userSubscription.credits} color="primary" showZero />
            </Typography>
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Credits
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          {creditAddons.map((addon) => (
            <Grid item xs={12} sm={6} md={4} key={addon.id}>
              <AddonCard 
                addon={addon} 
                userSubscription={userSubscription}
                onPurchase={handlePurchase}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Feature Add-ons
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          {featureAddons.map((addon) => (
            <Grid item xs={12} sm={6} md={4} key={addon.id}>
              <AddonCard 
                addon={addon} 
                userSubscription={userSubscription}
                onPurchase={handlePurchase}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Boosts
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          {boostAddons.map((addon) => (
            <Grid item xs={12} sm={6} md={4} key={addon.id}>
              <AddonCard 
                addon={addon} 
                userSubscription={userSubscription}
                onPurchase={handlePurchase}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Industry Packs
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          {categoryAddons.map((addon) => (
            <Grid item xs={12} sm={6} md={4} key={addon.id}>
              <AddonCard 
                addon={addon} 
                userSubscription={userSubscription}
                onPurchase={handlePurchase}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AddonStore;
