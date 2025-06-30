import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Avatar, 
  IconButton, 
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  InsertEmoticon as EmojiIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { JobMate } from '@/types/jobmate';
import { SubscriptionTier } from '@/types/subscription';

interface ChatMessage {
  id: string;
  sender: 'user' | 'jobmate';
  content: string;
  timestamp: Date;
  attachments?: string[];
  isStarred?: boolean;
  relatedListingId?: string;
}

interface ChatSummary {
  newMatches: number;
  upcomingEvents: number;
  pendingActions: number;
  lastActivity: Date;
}

interface ChatCompanionProps {
  jobMate: JobMate;
  subscriptionTier: SubscriptionTier;
  messages: ChatMessage[];
  chatSummary: ChatSummary;
  onSendMessage: (content: string, attachments?: string[]) => Promise<void>;
  onRefreshSummary: () => Promise<void>;
  onStarMessage: (messageId: string, isStarred: boolean) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
  onViewListing: (listingId: string) => void;
}

export const ChatCompanion: React.FC<ChatCompanionProps> = ({
  jobMate,
  subscriptionTier,
  messages,
  chatSummary,
  onSendMessage,
  onRefreshSummary,
  onStarMessage,
  onDeleteMessage,
  onViewListing
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isPremium = subscriptionTier === 'pro' || subscriptionTier === 'agency';
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    
    setIsLoading(true);
    try {
      await onSendMessage(newMessage, attachments.length > 0 ? attachments : undefined);
      setNewMessage('');
      setAttachments([]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefreshSummary = async () => {
    setIsLoading(true);
    try {
      await onRefreshSummary();
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh summary');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // In a real app, you would upload these files to a server
      // and get back URLs or IDs. For now, we'll just use the file names.
      const newAttachments = Array.from(e.target.files).map(file => file.name);
      setAttachments([...attachments, ...newAttachments]);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
        ' ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderRadius: '8px 8px 0 0'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {jobMate.emoji || '🤖'}
          </Avatar>
          <Box>
            <Typography variant="h6">{jobMate.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {jobMate.categoryFocus} • {jobMate.intent}
            </Typography>
          </Box>
        </Box>
        
        <IconButton onClick={handleRefreshSummary} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </Paper>
      
      {/* Chat Summary */}
      <Card sx={{ mb: 2, mt: 1 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Summary
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              New Matches:
            </Typography>
            <Chip 
              label={chatSummary.newMatches} 
              color={chatSummary.newMatches > 0 ? "primary" : "default"} 
              size="small" 
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Upcoming Events:
            </Typography>
            <Chip 
              label={chatSummary.upcomingEvents} 
              color={chatSummary.upcomingEvents > 0 ? "secondary" : "default"} 
              size="small" 
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Pending Actions:
            </Typography>
            <Chip 
              label={chatSummary.pendingActions} 
              color={chatSummary.pendingActions > 0 ? "warning" : "default"} 
              size="small" 
            />
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            Last activity: {formatDate(chatSummary.lastActivity)}
          </Typography>
        </CardContent>
      </Card>
      
      {/* Chat Messages */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2, 
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <Typography variant="body1" color="text.secondary" align="center">
              No messages yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Start chatting with your JobMate assistant!
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <Box 
              key={message.id} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                {message.sender === 'jobmate' && (
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 1,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {jobMate.emoji || '🤖'}
                  </Avatar>
                )}
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    maxWidth: '70%',
                    bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                    color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    borderRadius: message.sender === 'user' 
                      ? '16px 4px 16px 16px' 
                      : '4px 16px 16px 16px'
                  }}
                >
                  <Typography variant="body1">
                    {message.content}
                  </Typography>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {message.attachments.map((attachment, i) => (
                        <Chip 
                          key={i} 
                          label={attachment} 
                          size="small" 
                          icon={<AttachFileIcon />}
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                  
                  {message.relatedListingId && (
                    <Button 
                      size="small" 
                      startIcon={<VisibilityIcon />}
                      onClick={() => onViewListing(message.relatedListingId!)}
                      sx={{ mt: 1 }}
                    >
                      View Listing
                    </Button>
                  )}
                </Paper>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mt: 0.5,
                  ml: message.sender === 'user' ? 0 : 5,
                  mr: message.sender === 'user' ? 0 : 0,
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
                  {formatDate(message.timestamp)}
                </Typography>
                
                <IconButton 
                  size="small" 
                  onClick={() => onStarMessage(message.id, !message.isStarred)}
                >
                  {message.isStarred ? (
                    <StarIcon fontSize="small" color="warning" />
                  ) : (
                    <StarBorderIcon fontSize="small" />
                  )}
                </IconButton>
                
                <IconButton 
                  size="small" 
                  onClick={() => onDeleteMessage(message.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Input Area */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          borderRadius: '0 0 8px 8px',
          bgcolor: 'background.paper'
        }}
      >
        {!isPremium && (
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ display: 'block', mb: 1 }}
          >
            Chat Companion is a premium feature. Upgrade to Pro or Agency tier for full functionality.
          </Typography>
        )}
        
        {attachments.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
            {attachments.map((attachment, index) => (
              <Chip 
                key={index} 
                label={attachment} 
                size="small" 
                onDelete={() => setAttachments(attachments.filter((_, i) => i !== index))}
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handleAttachmentClick}
            disabled={!isPremium}
          >
            <AttachFileIcon />
          </IconButton>
          
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
          />
          
          <TextField
            fullWidth
            placeholder={isPremium ? "Type a message..." : "Upgrade to Pro to chat with your JobMate"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isPremium}
            multiline
            maxRows={4}
            sx={{ mx: 1 }}
          />
          
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && attachments.length === 0) || !isPremium || isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatCompanion;
