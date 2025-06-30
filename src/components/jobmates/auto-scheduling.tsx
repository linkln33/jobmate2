import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Card, 
  CardContent, 
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import { 
  Event as EventIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { JobMate } from '@/types/jobmate';
import { SubscriptionTier } from '@/types/subscription';

interface SchedulingEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'interview' | 'follow_up' | 'application_deadline' | 'custom';
  status: 'scheduled' | 'pending' | 'completed' | 'canceled';
  listingId?: string;
}

interface AutoSchedulingProps {
  jobMate: JobMate;
  subscriptionTier: SubscriptionTier;
  isEnabled: boolean;
  upcomingEvents: SchedulingEvent[];
  onToggleAutoScheduling: (enabled: boolean) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
  onOpenSettings: () => void;
}

export const AutoScheduling: React.FC<AutoSchedulingProps> = ({
  jobMate,
  subscriptionTier,
  isEnabled,
  upcomingEvents,
  onToggleAutoScheduling,
  onDeleteEvent,
  onOpenSettings
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isPremium = subscriptionTier === 'pro' || subscriptionTier === 'agency';
  
  const handleToggleAutoScheduling = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPremium) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onToggleAutoScheduling(event.target.checked);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update auto scheduling settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onDeleteEvent(eventId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getEventTypeColor = (type: SchedulingEvent['type']) => {
    switch (type) {
      case 'interview':
        return 'primary';
      case 'follow_up':
        return 'info';
      case 'application_deadline':
        return 'warning';
      case 'custom':
        return 'default';
      default:
        return 'default';
    }
  };
  
  const formatEventTime = (date: Date) => {
    return new Date(date).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Auto Scheduling</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onOpenSettings} size="small" sx={{ mr: 1 }}>
            <SettingsIcon />
          </IconButton>
          
          <FormControlLabel
            control={
              <Switch
                checked={isEnabled}
                onChange={handleToggleAutoScheduling}
                disabled={!isPremium || isLoading}
              />
            }
            label={isEnabled ? "Enabled" : "Disabled"}
          />
        </Box>
      </Box>
      
      {!isPremium && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Auto Scheduling is a premium feature. Upgrade to Pro or Agency tier to unlock this feature.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            How It Works
          </Typography>
          
          <Typography variant="body2" paragraph>
            Auto Scheduling automatically creates calendar events for important job search activities:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip 
              icon={<EventIcon />} 
              label="Interview Preparation" 
              color="primary" 
              size="small" 
            />
            <Chip 
              icon={<EventIcon />} 
              label="Application Deadlines" 
              color="warning" 
              size="small" 
            />
            <Chip 
              icon={<EventIcon />} 
              label="Follow-up Reminders" 
              color="info" 
              size="small" 
            />
          </Box>
          
          <Typography variant="body2">
            Events are automatically added to your connected Google Calendar.
          </Typography>
        </CardContent>
      </Card>
      
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Upcoming Events
      </Typography>
      
      {upcomingEvents.length > 0 ? (
        <List>
          {upcomingEvents.map((event) => (
            <React.Fragment key={event.id}>
              <ListItem>
                <ListItemText
                  primary={event.title}
                  secondary={`${formatEventTime(event.startTime)} - ${formatEventTime(event.endTime)}`}
                />
                <ListItemSecondaryAction>
                  <Chip 
                    label={event.type.replace('_', ' ')} 
                    color={getEventTypeColor(event.type)} 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDeleteEvent(event.id)}
                    disabled={isLoading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No upcoming events scheduled.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AutoScheduling;
