import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { 
  Chat as ChatIcon,
  Schedule as ScheduleIcon,
  Handshake as HandshakeIcon,
  People as PeopleIcon,
  SaveAlt as SaveAltIcon
} from '@mui/icons-material';

import { JobMate } from '@/types/jobmate';
import { SubscriptionTier } from '@/types/subscription';
import FeatureFlagService from '@/services/feature-flag-service';
import SubscriptionService from '@/services/subscription-service';

import ChatCompanion from './chat-companion';
import AutoScheduling from './auto-scheduling';
import AutoNegotiation from './auto-negotiation';
import Collaboration from './collaboration';
import TemplateSharing from './template-sharing';

interface FeatureIntegrationProps {
  jobMate: JobMate;
  userId: string;
}

export const FeatureIntegration: React.FC<FeatureIntegrationProps> = ({
  jobMate,
  userId
}) => {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data for components
  const [mockData] = useState({
    chatMessages: [],
    chatSummary: {
      newMatches: 3,
      upcomingEvents: 2,
      pendingActions: 1,
      lastActivity: new Date()
    },
    negotiationSettings: {
      enabled: false,
      style: 'balanced' as const,
      maxDiscount: 15,
      minPrice: 50000,
      autoRespond: false,
      templates: [],
      customMessages: []
    },
    negotiationHistory: [],
    schedulingEnabled: false,
    upcomingEvents: [],
    collaborators: [],
    currentUser: {
      id: userId,
      name: 'Current User',
      email: 'user@example.com'
    }
  });
  
  useEffect(() => {
    const loadSubscriptionData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const tier = await SubscriptionService.getUserSubscriptionTier(userId);
        setSubscriptionTier(tier);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subscription data');
        setSubscriptionTier('free'); // Default to free tier on error
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubscriptionData();
  }, [userId]);
  
  // Check feature availability
  const isChatAvailable = FeatureFlagService.isFeatureAvailable('chat_companion', subscriptionTier);
  const isSchedulingAvailable = FeatureFlagService.isFeatureAvailable('auto_scheduling', subscriptionTier);
  const isNegotiationAvailable = FeatureFlagService.isFeatureAvailable('auto_negotiation', subscriptionTier);
  const isCollaborationAvailable = FeatureFlagService.isFeatureAvailable('collaboration', subscriptionTier);
  const isTemplatesAvailable = FeatureFlagService.isFeatureAvailable('templates', subscriptionTier);
  
  // Mock handlers
  const handleSendChatMessage = async () => Promise.resolve();
  const handleRefreshSummary = async () => Promise.resolve();
  const handleStarMessage = async () => Promise.resolve();
  const handleDeleteMessage = async () => Promise.resolve();
  const handleViewListing = () => {};
  
  const handleToggleAutoScheduling = async () => Promise.resolve();
  const handleDeleteEvent = async () => Promise.resolve();
  const handleOpenSchedulingSettings = () => {};
  
  const handleUpdateNegotiationSettings = async () => Promise.resolve();
  const handleSendNegotiationMessage = async () => Promise.resolve();
  const handleDeleteNegotiationMessage = async () => Promise.resolve();
  
  const handleInviteCollaborator = async () => Promise.resolve();
  const handleRemoveCollaborator = async () => Promise.resolve();
  const handleUpdatePermissions = async () => Promise.resolve();
  
  const handleExportTemplate = async () => Promise.resolve();
  
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    switch (activeTab) {
      case 'chat':
        return (
          <ChatCompanion
            jobMate={jobMate}
            subscriptionTier={subscriptionTier}
            messages={mockData.chatMessages}
            chatSummary={mockData.chatSummary}
            onSendMessage={handleSendChatMessage}
            onRefreshSummary={handleRefreshSummary}
            onStarMessage={handleStarMessage}
            onDeleteMessage={handleDeleteMessage}
            onViewListing={handleViewListing}
          />
        );
      
      case 'scheduling':
        return (
          <AutoScheduling
            jobMate={jobMate}
            subscriptionTier={subscriptionTier}
            isEnabled={mockData.schedulingEnabled}
            upcomingEvents={mockData.upcomingEvents}
            onToggleAutoScheduling={handleToggleAutoScheduling}
            onDeleteEvent={handleDeleteEvent}
            onOpenSettings={handleOpenSchedulingSettings}
          />
        );
      
      case 'negotiation':
        return (
          <AutoNegotiation
            jobMate={jobMate}
            subscriptionTier={subscriptionTier}
            negotiationSettings={mockData.negotiationSettings}
            negotiationHistory={mockData.negotiationHistory}
            onUpdateSettings={handleUpdateNegotiationSettings}
            onSendMessage={handleSendNegotiationMessage}
            onDeleteMessage={handleDeleteNegotiationMessage}
          />
        );
      
      case 'collaboration':
        return (
          <Collaboration
            jobMate={jobMate}
            currentUser={mockData.currentUser}
            collaborators={mockData.collaborators}
            onInviteCollaborator={handleInviteCollaborator}
            onRemoveCollaborator={handleRemoveCollaborator}
            onUpdatePermissions={handleUpdatePermissions}
          />
        );
      
      case 'templates':
        return (
          <TemplateSharing
            jobMate={jobMate}
            onExportTemplate={handleExportTemplate}
          />
        );
      
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              Select a feature tab to view its content.
            </Typography>
          </Box>
        );
    }
  };
  
  const renderUpgradePrompt = () => {
    if (subscriptionTier === 'agency') {
      return null; // Already on highest tier
    }
    
    return (
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Unlock all premium features
        </Typography>
        
        <Typography variant="body2" paragraph>
          Upgrade to {subscriptionTier === 'free' ? 'Pro' : 'Agency'} tier to access all JobMate features.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          component="a"
          href="/subscription-management"
        >
          Upgrade Now
        </Button>
      </Box>
    );
  };
  
  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label="Chat" 
            value="chat" 
            icon={<ChatIcon />} 
            disabled={!isChatAvailable}
          />
          <Tab 
            label="Scheduling" 
            value="scheduling" 
            icon={<ScheduleIcon />} 
            disabled={!isSchedulingAvailable}
          />
          <Tab 
            label="Negotiation" 
            value="negotiation" 
            icon={<HandshakeIcon />} 
            disabled={!isNegotiationAvailable}
          />
          <Tab 
            label="Collaboration" 
            value="collaboration" 
            icon={<PeopleIcon />} 
            disabled={!isCollaborationAvailable}
          />
          <Tab 
            label="Templates" 
            value="templates" 
            icon={<SaveAltIcon />} 
            disabled={!isTemplatesAvailable}
          />
        </Tabs>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        {renderTabContent()}
      </Box>
      
      {renderUpgradePrompt()}
    </Box>
  );
};

export default FeatureIntegration;
