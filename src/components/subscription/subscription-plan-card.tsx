import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import { 
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { SubscriptionPlan, SubscriptionTier } from '@/types/subscription';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  currentTier?: SubscriptionTier;
  onSelectPlan: (planId: string) => void;
  isPopular?: boolean;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  currentTier,
  onSelectPlan,
  isPopular = false
}) => {
  const isCurrentPlan = currentTier === plan.tier;
  
  const getFeatureIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckIcon fontSize="small" color="success" />
    ) : (
      <CloseIcon fontSize="small" color="disabled" />
    );
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: isPopular ? '2px solid' : '1px solid',
        borderColor: isPopular ? 'primary.main' : 'divider',
        transform: isPopular ? 'scale(1.02)' : 'none',
        zIndex: isPopular ? 1 : 0,
        boxShadow: isPopular ? 3 : 1
      }}
    >
      {isPopular && (
        <Chip
          label="Most Popular"
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {plan.name}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" component="span">
            ${plan.price}
          </Typography>
          <Typography variant="subtitle1" component="span" color="text.secondary">
            /month
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {plan.description}
        </Typography>
        
        <List dense>
          <ListItem>
            <ListItemIcon>
              {getFeatureIcon(true)}
            </ListItemIcon>
            <ListItemText primary={`Up to ${plan.features.maxJobMates} JobMates`} />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              {getFeatureIcon(plan.features.realTimeMatching)}
            </ListItemIcon>
            <ListItemText primary="Real-time matching" />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              {getFeatureIcon(plan.features.autoAlerts)}
            </ListItemIcon>
            <ListItemText primary="Automated alerts" />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              {getFeatureIcon(plan.features.chatInterface)}
            </ListItemIcon>
            <ListItemText primary="Chat companion" />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              {getFeatureIcon(plan.features.aiInsights)}
            </ListItemIcon>
            <ListItemText primary="AI insights" />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              {getFeatureIcon(plan.features.teamSharing)}
            </ListItemIcon>
            <ListItemText primary="Team sharing & collaboration" />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              {getFeatureIcon(plan.features.scheduling)}
            </ListItemIcon>
            <ListItemText primary="Auto scheduling" />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              {getFeatureIcon(plan.features.autoNegotiation)}
            </ListItemIcon>
            <ListItemText primary="Auto negotiation" />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              {getFeatureIcon(plan.features.apiAccess)}
            </ListItemIcon>
            <ListItemText primary="API access" />
          </ListItem>
        </List>
      </CardContent>
      
      <CardActions>
        <Button 
          fullWidth 
          variant={isCurrentPlan ? "outlined" : "contained"}
          color={isCurrentPlan ? "success" : "primary"}
          onClick={() => onSelectPlan(plan.id)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? "Current Plan" : "Select Plan"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default SubscriptionPlanCard;
