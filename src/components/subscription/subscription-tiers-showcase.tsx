import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { SubscriptionTier } from '@/types/subscription';

interface PricingFeature {
  name: string;
  tiers: {
    free: boolean;
    pro: boolean;
    agency: boolean;
  };
}

const PRICING_FEATURES: PricingFeature[] = [
  { 
    name: 'JobMate Agents', 
    tiers: { free: true, pro: true, agency: true } 
  },
  { 
    name: 'AI Profile Builder', 
    tiers: { free: true, pro: true, agency: false } 
  },
  { 
    name: 'Real-Time Job Map', 
    tiers: { free: true, pro: true, agency: true } 
  },
  { 
    name: 'Email Notifications', 
    tiers: { free: true, pro: false, agency: false } 
  },
  { 
    name: 'Marketplace Access', 
    tiers: { free: true, pro: true, agency: true } 
  },
  { 
    name: 'Integrated Payments', 
    tiers: { free: true, pro: true, agency: true } 
  },
  { 
    name: 'Real-Time Notifications', 
    tiers: { free: false, pro: true, agency: true } 
  },
  { 
    name: 'Advanced Matching', 
    tiers: { free: false, pro: true, agency: true } 
  },
  { 
    name: 'Rent & Sell JobMates', 
    tiers: { free: false, pro: true, agency: true } 
  },
  { 
    name: 'Store Front', 
    tiers: { free: false, pro: true, agency: true } 
  },
  { 
    name: 'Affiliate Program', 
    tiers: { free: false, pro: true, agency: true } 
  },
  { 
    name: 'Competitor Research', 
    tiers: { free: false, pro: true, agency: true } 
  },
  { 
    name: 'Team Collaboration', 
    tiers: { free: false, pro: false, agency: true } 
  },
  { 
    name: 'API Access', 
    tiers: { free: false, pro: false, agency: true } 
  },
  { 
    name: 'White Label Option', 
    tiers: { free: false, pro: false, agency: true } 
  }
];

interface PricingTierProps {
  tier: SubscriptionTier;
  name: string;
  price: number;
  description: string;
  maxJobMates: number;
  features: PricingFeature[];
  isPopular?: boolean;
  ctaText: string;
  onSelect: (tier: SubscriptionTier) => void;
}

const PricingTier: React.FC<PricingTierProps> = ({
  tier,
  name,
  price,
  description,
  maxJobMates,
  features,
  isPopular = false,
  ctaText,
  onSelect
}) => {
  const theme = useTheme();
  
  // Define tier-specific styling
  const getTierStyle = () => {
    switch(tier) {
      case 'free':
        return {
          background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.8) 0%, rgba(173, 216, 230, 0.6) 100%)',
          borderColor: 'rgba(173, 216, 230, 0.4)',
          headerColor: '#1976d2'
        };
      case 'pro':
        return {
          background: 'linear-gradient(135deg, rgba(255, 223, 186, 0.8) 0%, rgba(255, 223, 186, 0.6) 100%)',
          borderColor: 'rgba(255, 223, 186, 0.4)',
          headerColor: '#ed6c02'
        };
      case 'agency':
        return {
          background: 'linear-gradient(135deg, rgba(209, 196, 233, 0.8) 0%, rgba(209, 196, 233, 0.6) 100%)',
          borderColor: 'rgba(209, 196, 233, 0.4)',
          headerColor: '#9c27b0'
        };
      default:
        return {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.4)',
          headerColor: '#1976d2'
        };
    }
  };
  
  const tierStyle = getTierStyle();
  
  return (
    <Card 
      raised={isPopular}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        background: tierStyle.background,
        backdropFilter: 'blur(15px)',
        borderRadius: 4,
        border: `1px solid ${tierStyle.borderColor}`,
        boxShadow: isPopular 
          ? '0 10px 30px 0 rgba(31, 38, 135, 0.25)' 
          : '0 8px 20px 0 rgba(31, 38, 135, 0.15)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 15px 35px 0 rgba(31, 38, 135, 0.3)',
        },
        pt: 1
      }}
    >
      {/* Limited Deal badge */}
      {isPopular && (
        <Box 
          sx={{ 
            position: 'absolute',
            top: -12,
            right: 24,
            background: 'linear-gradient(90deg, #ff9800, #ff5722)',
            color: 'white',
            py: 0.5,
            px: 2,
            borderRadius: 10,
            fontWeight: 'bold',
            fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <StarIcon fontSize="small" />
          Limited Deal
        </Box>
      )}
      
      <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 }, pt: 1 }}>
        <Typography 
          variant="h5" 
          component="h3" 
          gutterBottom 
          fontWeight="bold"
          sx={{ color: tierStyle.headerColor, mb: 1 }}
        >
          {name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 0.5 }}>
          {tier === 'pro' ? (
            <>
              <Typography variant="h4" component="span" fontWeight="bold">
                ${price}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1, textDecoration: 'none' }}>
                /month
              </Typography>
              <Typography variant="body2" color="error" sx={{ ml: 1, textDecoration: 'line-through' }}>
                $19.99
              </Typography>
              <Typography variant="caption" sx={{ ml: 1, color: '#4caf50', fontWeight: 'bold' }}>
                50% OFF
              </Typography>
            </>
          ) : tier === 'agency' ? (
            <>
              <Typography variant="h4" component="span" fontWeight="bold">
                ${price}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1, textDecoration: 'none' }}>
                /month
              </Typography>
              <Typography variant="body2" color="error" sx={{ ml: 1, textDecoration: 'line-through' }}>
                $99.99
              </Typography>
              <Typography variant="caption" sx={{ ml: 1, color: '#4caf50', fontWeight: 'bold' }}>
                50% OFF
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h4" component="span" fontWeight="bold">
                ${price}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
                /month
              </Typography>
            </>
          )}
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph 
          sx={{ mb: 0.5, fontSize: '0.85rem', minHeight: '40px' }}
        >
          {description}
        </Typography>
        
        <Divider sx={{ my: 0.5 }} />
        
        <Box sx={{ mb: 0.5 }}>
          <Typography 
            variant="subtitle2" 
            fontWeight="bold"
            sx={{ color: tierStyle.headerColor }}
          >
            Up to {maxJobMates} JobMates
          </Typography>
        </Box>
        
        <List disablePadding dense sx={{ pt: 0 }}>
          {features.filter(feature => feature.tiers[tier as keyof typeof feature.tiers]).map((feature, index) => (
            <ListItem 
              key={index} 
              disablePadding 
              sx={{ py: 0.25 }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <CheckIcon sx={{ color: tierStyle.headerColor }} fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={feature.name} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: 'medium',
                  fontSize: '0.85rem'
                }} 
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
      
      <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onSelect(tier)}
          sx={{
            mt: 1,
            backgroundColor: tierStyle.headerColor,
            color: 'white',
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: tierStyle.headerColor,
              boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {ctaText}
        </Button>
      </CardActions>
    </Card>
  );
};

interface SubscriptionTiersShowcaseProps {
  currentTier?: SubscriptionTier;
  onSelectTier: (tier: SubscriptionTier) => void;
}

export const SubscriptionTiersShowcase: React.FC<SubscriptionTiersShowcaseProps> = ({
  currentTier,
  onSelectTier
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      {/* Pricing Cards */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 2 }, mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <PricingTier
            tier="free"
            name="Free"
            price={0}
            description="Basic JobMate functionality for casual job seekers"
            maxJobMates={1}
            features={PRICING_FEATURES}
            ctaText={currentTier === 'free' ? 'Current Plan' : 'Get Started'}
            onSelect={onSelectTier}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <PricingTier
            tier="pro"
            name="Pro"
            price={9.99}
            description="Advanced features for serious job seekers"
            maxJobMates={5}
            features={PRICING_FEATURES}
            isPopular={true}
            ctaText={currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            onSelect={onSelectTier}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <PricingTier
            tier="agency"
            name="Agency"
            price={49.99}
            description="Full suite of features for teams and professionals"
            maxJobMates={20}
            features={PRICING_FEATURES}
            ctaText={currentTier === 'agency' ? 'Current Plan' : 'Upgrade to Agency'}
            onSelect={onSelectTier}
          />
        </Box>
      </Box>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1 }}>
          All plans include a 14-day free trial. No credit card required.
        </Typography>
        
        <Button 
          variant="text" 
          color="primary"
          href="/subscription-management"
          sx={{ mt: 1 }}
        >
          View Full Plan Details
        </Button>
      </Box>
    </Box>
  );
};

export default SubscriptionTiersShowcase;
