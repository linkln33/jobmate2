import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Switch, 
  FormControlLabel, 
  Slider, 
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Divider,
  Paper
} from '@mui/material';
import { 
  Send as SendIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';
import { JobMate } from '@/types/jobmate';
import { SubscriptionTier } from '@/types/subscription';

interface NegotiationMessage {
  id: string;
  listingId: string;
  message: string;
  sentAt: Date;
  status: 'sent' | 'delivered' | 'read' | 'replied';
  response?: string;
  responseAt?: Date;
  isAutomatic: boolean;
}

interface NegotiationTemplate {
  id: string;
  name: string;
  message: string;
  category: string;
  variables: string[];
}

interface NegotiationSettings {
  enabled: boolean;
  style: 'aggressive' | 'balanced' | 'conservative';
  maxDiscount: number; // Percentage
  minPrice: number | null;
  autoRespond: boolean;
  templates: NegotiationTemplate[];
  customMessages: string[];
}

interface AutoNegotiationProps {
  jobMate: JobMate;
  subscriptionTier: SubscriptionTier;
  negotiationSettings: NegotiationSettings;
  negotiationHistory: NegotiationMessage[];
  onUpdateSettings: (settings: NegotiationSettings) => Promise<void>;
  onSendMessage: (listingId: string, message: string, isAutomatic: boolean) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
}

export const AutoNegotiation: React.FC<AutoNegotiationProps> = ({
  jobMate,
  subscriptionTier,
  negotiationSettings,
  negotiationHistory,
  onUpdateSettings,
  onSendMessage,
  onDeleteMessage
}) => {
  const [settings, setSettings] = useState<NegotiationSettings>(negotiationSettings);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [error, setError] = useState('');
  
  const isPremium = subscriptionTier === 'pro' || subscriptionTier === 'agency';
  
  // Group messages by listing
  const messagesByListing: Record<string, NegotiationMessage[]> = {};
  negotiationHistory.forEach(message => {
    if (!messagesByListing[message.listingId]) {
      messagesByListing[message.listingId] = [];
    }
    messagesByListing[message.listingId].push(message);
  });
  
  const handleSaveSettings = async () => {
    try {
      await onUpdateSettings(settings);
      setSettingsDialogOpen(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    }
  };
  
  const handleSendMessage = async () => {
    if (!selectedListingId || !customMessage) return;
    
    try {
      await onSendMessage(selectedListingId, customMessage, false);
      setCustomMessage('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await onDeleteMessage(messageId);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  };
  
  const getListingName = (listingId: string) => {
    // This would typically come from your listings data
    // For now, just return a placeholder
    return `Listing #${listingId.substring(0, 8)}`;
  };
  
  const getMessageStatusIcon = (status: NegotiationMessage['status']) => {
    switch (status) {
      case 'sent':
        return <SendIcon fontSize="small" color="action" />;
      case 'delivered':
        return <CheckIcon fontSize="small" color="primary" />;
      case 'read':
        return <CheckIcon fontSize="small" color="success" />;
      case 'replied':
        return <RefreshIcon fontSize="small" color="success" />;
      default:
        return null;
    }
  };
  
  const getNegotiationStyleIcon = (style: NegotiationSettings['style']) => {
    switch (style) {
      case 'aggressive':
        return <TrendingDownIcon color="error" />;
      case 'balanced':
        return <TrendingFlatIcon color="primary" />;
      case 'conservative':
        return <TrendingUpIcon color="success" />;
      default:
        return null;
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Auto Negotiation</Typography>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<HistoryIcon />}
            onClick={() => setHistoryDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            History
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<SettingsIcon />}
            onClick={() => setSettingsDialogOpen(true)}
          >
            Settings
          </Button>
        </Box>
      </Box>
      
      {!isPremium && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Auto Negotiation is a premium feature. Upgrade to Pro or Agency tier to unlock this feature.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Auto Negotiation Status</Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enabled}
                  onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
                  disabled={!isPremium}
                />
              }
              label={settings.enabled ? "Enabled" : "Disabled"}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Negotiation Style:
            </Typography>
            <Chip 
              icon={getNegotiationStyleIcon(settings.style)}
              label={settings.style.charAt(0).toUpperCase() + settings.style.slice(1)}
              color={
                settings.style === 'aggressive' ? 'error' : 
                settings.style === 'balanced' ? 'primary' : 
                'success'
              }
              size="small"
            />
          </Box>
          
          <Typography variant="body2">
            Max Discount: {settings.maxDiscount}%
          </Typography>
          
          {settings.minPrice !== null && (
            <Typography variant="body2">
              Minimum Price: ${settings.minPrice}
            </Typography>
          )}
          
          <Typography variant="body2">
            Auto Respond: {settings.autoRespond ? 'Enabled' : 'Disabled'}
          </Typography>
          
          <Typography variant="body2" sx={{ mt: 1 }}>
            Templates: {settings.templates.length} available
          </Typography>
        </CardContent>
      </Card>
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Recent Negotiations
      </Typography>
      
      {Object.keys(messagesByListing).length > 0 ? (
        <Box>
          {Object.entries(messagesByListing).slice(0, 3).map(([listingId, messages]) => (
            <Card key={listingId} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2">
                  {getListingName(listingId)}
                </Typography>
                
                <List dense>
                  {messages.slice(0, 3).map((message) => (
                    <ListItem key={message.id}>
                      <ListItemText
                        primary={message.message}
                        secondary={`${new Date(message.sentAt).toLocaleString()} ${message.isAutomatic ? '(Auto)' : ''}`}
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title={message.status}>
                          <Box component="span" sx={{ mr: 1 }}>
                            {getMessageStatusIcon(message.status)}
                          </Box>
                        </Tooltip>
                        
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteMessage(message.id)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                
                {messages.length > 3 && (
                  <Button 
                    size="small" 
                    onClick={() => {
                      setSelectedListingId(listingId);
                      setHistoryDialogOpen(true);
                    }}
                    sx={{ mt: 1 }}
                  >
                    View All ({messages.length})
                  </Button>
                )}
              </CardContent>
              <CardActions>
                <TextField
                  placeholder="Type a message..."
                  size="small"
                  fullWidth
                  value={selectedListingId === listingId ? customMessage : ''}
                  onChange={(e) => {
                    setSelectedListingId(listingId);
                    setCustomMessage(e.target.value);
                  }}
                  disabled={!isPremium}
                  sx={{ mr: 1 }}
                />
                <Button 
                  variant="contained" 
                  size="small"
                  endIcon={<SendIcon />}
                  onClick={handleSendMessage}
                  disabled={!isPremium || !customMessage || selectedListingId !== listingId}
                >
                  Send
                </Button>
              </CardActions>
            </Card>
          ))}
          
          {Object.keys(messagesByListing).length > 3 && (
            <Button 
              variant="outlined" 
              onClick={() => setHistoryDialogOpen(true)}
              fullWidth
            >
              View All Negotiations
            </Button>
          )}
        </Box>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No negotiation history yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            When you match with listings, you can enable auto-negotiation to automatically send offers.
          </Typography>
        </Paper>
      )}
      
      {/* Settings Dialog */}
      <Dialog 
        open={settingsDialogOpen} 
        onClose={() => setSettingsDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Auto Negotiation Settings</DialogTitle>
        <DialogContent>
          {!isPremium ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Auto Negotiation is a premium feature. Upgrade to Pro or Agency tier to unlock this feature.
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enabled}
                    onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
                  />
                }
                label="Enable Auto Negotiation"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="subtitle1" gutterBottom>
                Negotiation Style
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Button
                  variant={settings.style === 'aggressive' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => setSettings({...settings, style: 'aggressive'})}
                  startIcon={<TrendingDownIcon />}
                >
                  Aggressive
                </Button>
                
                <Button
                  variant={settings.style === 'balanced' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setSettings({...settings, style: 'balanced'})}
                  startIcon={<TrendingFlatIcon />}
                >
                  Balanced
                </Button>
                
                <Button
                  variant={settings.style === 'conservative' ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => setSettings({...settings, style: 'conservative'})}
                  startIcon={<TrendingUpIcon />}
                >
                  Conservative
                </Button>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Maximum Discount (%)
              </Typography>
              
              <Slider
                value={settings.maxDiscount}
                onChange={(_, newValue) => setSettings({...settings, maxDiscount: newValue as number})}
                aria-labelledby="max-discount-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={50}
                sx={{ mb: 3 }}
              />
              
              <Typography variant="subtitle1" gutterBottom>
                Minimum Price ($)
              </Typography>
              
              <TextField
                type="number"
                value={settings.minPrice || ''}
                onChange={(e) => setSettings({
                  ...settings, 
                  minPrice: e.target.value ? Number(e.target.value) : null
                })}
                fullWidth
                placeholder="No minimum"
                sx={{ mb: 3 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoRespond}
                    onChange={(e) => setSettings({...settings, autoRespond: e.target.checked})}
                  />
                }
                label="Auto Respond to Counter-Offers"
                sx={{ mb: 2 }}
              />
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Message Templates
              </Typography>
              
              <List>
                {settings.templates.map((template, index) => (
                  <ListItem key={template.id}>
                    <ListItemText
                      primary={template.name}
                      secondary={template.message}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 1 }}
              >
                Add Template
              </Button>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Custom Messages
              </Typography>
              
              <List>
                {settings.customMessages.map((message, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={message} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              
              <TextField
                label="Add Custom Message"
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 2 }}
              />
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 1 }}
              >
                Add Message
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveSettings} 
            variant="contained"
            disabled={!isPremium}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* History Dialog */}
      <Dialog 
        open={historyDialogOpen} 
        onClose={() => setHistoryDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Negotiation History</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {Object.entries(messagesByListing).map(([listingId, messages]) => (
              <Box key={listingId} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {getListingName(listingId)}
                </Typography>
                
                <List>
                  {messages.map((message) => (
                    <React.Fragment key={message.id}>
                      <ListItem>
                        <ListItemText
                          primary={message.message}
                          secondary={`${new Date(message.sentAt).toLocaleString()} ${message.isAutomatic ? '(Auto)' : ''}`}
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title={message.status}>
                            <Box component="span" sx={{ mr: 1 }}>
                              {getMessageStatusIcon(message.status)}
                            </Box>
                          </Tooltip>
                          
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      
                      {message.response && (
                        <ListItem sx={{ pl: 4, bgcolor: 'action.hover' }}>
                          <ListItemText
                            primary={message.response}
                            secondary={message.responseAt ? new Date(message.responseAt).toLocaleString() : ''}
                          />
                        </ListItem>
                      )}
                    </React.Fragment>
                  ))}
                </List>
                
                <Box sx={{ display: 'flex', mt: 1 }}>
                  <TextField
                    placeholder="Type a message..."
                    size="small"
                    fullWidth
                    value={selectedListingId === listingId ? customMessage : ''}
                    onChange={(e) => {
                      setSelectedListingId(listingId);
                      setCustomMessage(e.target.value);
                    }}
                    disabled={!isPremium}
                    sx={{ mr: 1 }}
                  />
                  <Button 
                    variant="contained" 
                    size="small"
                    endIcon={<SendIcon />}
                    onClick={handleSendMessage}
                    disabled={!isPremium || !customMessage || selectedListingId !== listingId}
                  >
                    Send
                  </Button>
                </Box>
                
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
            
            {Object.keys(messagesByListing).length === 0 && (
              <Typography variant="body1" color="text.secondary" align="center">
                No negotiation history yet.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutoNegotiation;
