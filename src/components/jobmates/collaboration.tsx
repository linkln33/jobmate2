import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  ListItemSecondaryAction, 
  Avatar, 
  IconButton, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon, 
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { JobMate } from '@/types/jobmate';

// Mock user type - replace with your actual user type
interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface CollaboratorPermissions {
  canEdit: boolean;
  canInvite: boolean;
  canDelete: boolean;
  canChangeSettings: boolean;
}

interface Collaborator {
  user: User;
  status: 'active' | 'invited' | 'removed';
  permissions: CollaboratorPermissions;
  addedAt: Date;
}

interface CollaborationProps {
  jobMate: JobMate;
  currentUser: User;
  collaborators: Collaborator[];
  onInviteCollaborator: (email: string, permissions: CollaboratorPermissions) => Promise<void>;
  onRemoveCollaborator: (userId: string) => Promise<void>;
  onUpdatePermissions: (userId: string, permissions: CollaboratorPermissions) => Promise<void>;
}

export const Collaboration: React.FC<CollaborationProps> = ({
  jobMate,
  currentUser,
  collaborators,
  onInviteCollaborator,
  onRemoveCollaborator,
  onUpdatePermissions
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editPermissionsDialogOpen, setEditPermissionsDialogOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [permissions, setPermissions] = useState<CollaboratorPermissions>({
    canEdit: true,
    canInvite: false,
    canDelete: false,
    canChangeSettings: false
  });
  const [error, setError] = useState('');
  
  const isOwner = jobMate.userId === currentUser.id;
  const activeCollaborators = collaborators.filter(c => c.status === 'active');
  const pendingCollaborators = collaborators.filter(c => c.status === 'invited');
  
  const handleInvite = async () => {
    if (!inviteEmail) {
      setError('Please enter an email address');
      return;
    }
    
    try {
      await onInviteCollaborator(inviteEmail, permissions);
      setInviteEmail('');
      setInviteDialogOpen(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    }
  };
  
  const handleOpenEditPermissions = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setPermissions(collaborator.permissions);
    setEditPermissionsDialogOpen(true);
  };
  
  const handleUpdatePermissions = async () => {
    if (!selectedCollaborator) return;
    
    try {
      await onUpdatePermissions(selectedCollaborator.user.id, permissions);
      setEditPermissionsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update permissions');
    }
  };
  
  const handleRemoveCollaborator = async (userId: string) => {
    try {
      await onRemoveCollaborator(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove collaborator');
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Collaborators</Typography>
        
        {(isOwner || collaborators.some(c => 
          c.user.id === currentUser.id && 
          c.status === 'active' && 
          c.permissions.canInvite
        )) && (
          <Button 
            variant="outlined" 
            startIcon={<PersonAddIcon />}
            onClick={() => setInviteDialogOpen(true)}
          >
            Invite Collaborator
          </Button>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Owner
        </Typography>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={currentUser.avatarUrl} alt={currentUser.name}>
                {currentUser.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary={currentUser.name} 
              secondary={currentUser.email} 
            />
            <Chip label="Owner" color="primary" size="small" />
          </ListItem>
        </List>
      </Box>
      
      {activeCollaborators.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Active Collaborators
          </Typography>
          <List>
            {activeCollaborators.map((collaborator) => (
              <ListItem key={collaborator.user.id}>
                <ListItemAvatar>
                  <Avatar src={collaborator.user.avatarUrl} alt={collaborator.user.name}>
                    {collaborator.user.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={collaborator.user.name} 
                  secondary={collaborator.user.email} 
                />
                <ListItemSecondaryAction>
                  {isOwner && (
                    <>
                      <Tooltip title="Edit permissions">
                        <IconButton 
                          edge="end" 
                          aria-label="edit permissions"
                          onClick={() => handleOpenEditPermissions(collaborator)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove collaborator">
                        <IconButton 
                          edge="end" 
                          aria-label="remove"
                          onClick={() => handleRemoveCollaborator(collaborator.user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {pendingCollaborators.length > 0 && (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Pending Invitations
          </Typography>
          <List>
            {pendingCollaborators.map((collaborator) => (
              <ListItem key={collaborator.user.id}>
                <ListItemAvatar>
                  <Avatar>
                    {collaborator.user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={collaborator.user.email} 
                  secondary={`Invited ${new Date(collaborator.addedAt).toLocaleDateString()}`} 
                />
                <Chip label="Pending" color="warning" size="small" sx={{ mr: 1 }} />
                <ListItemSecondaryAction>
                  {isOwner && (
                    <Tooltip title="Cancel invitation">
                      <IconButton 
                        edge="end" 
                        aria-label="cancel"
                        onClick={() => handleRemoveCollaborator(collaborator.user.id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Collaborator</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Email Address"
              fullWidth
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              margin="normal"
              type="email"
              required
            />
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Permissions
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label="Can Edit JobMate" 
                  color={permissions.canEdit ? "primary" : "default"}
                  onClick={() => setPermissions({...permissions, canEdit: !permissions.canEdit})}
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Can modify preferences and settings
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label="Can Invite Others" 
                  color={permissions.canInvite ? "primary" : "default"}
                  onClick={() => setPermissions({...permissions, canInvite: !permissions.canInvite})}
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Can invite new collaborators
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label="Can Delete" 
                  color={permissions.canDelete ? "primary" : "default"}
                  onClick={() => setPermissions({...permissions, canDelete: !permissions.canDelete})}
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Can delete the JobMate
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label="Can Change Settings" 
                  color={permissions.canChangeSettings ? "primary" : "default"}
                  onClick={() => setPermissions({...permissions, canChangeSettings: !permissions.canChangeSettings})}
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Can modify advanced settings
                </Typography>
              </Box>
            </Box>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              Collaborators will receive an email invitation to join this JobMate.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleInvite} 
            variant="contained"
            disabled={!inviteEmail}
          >
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Permissions Dialog */}
      <Dialog 
        open={editPermissionsDialogOpen} 
        onClose={() => setEditPermissionsDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Edit Permissions</DialogTitle>
        <DialogContent>
          {selectedCollaborator && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                {selectedCollaborator.user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedCollaborator.user.email}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="Can Edit JobMate" 
                    color={permissions.canEdit ? "primary" : "default"}
                    onClick={() => setPermissions({...permissions, canEdit: !permissions.canEdit})}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Can modify preferences and settings
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="Can Invite Others" 
                    color={permissions.canInvite ? "primary" : "default"}
                    onClick={() => setPermissions({...permissions, canInvite: !permissions.canInvite})}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Can invite new collaborators
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="Can Delete" 
                    color={permissions.canDelete ? "primary" : "default"}
                    onClick={() => setPermissions({...permissions, canDelete: !permissions.canDelete})}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Can delete the JobMate
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="Can Change Settings" 
                    color={permissions.canChangeSettings ? "primary" : "default"}
                    onClick={() => setPermissions({...permissions, canChangeSettings: !permissions.canChangeSettings})}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Can modify advanced settings
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPermissionsDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdatePermissions} 
            variant="contained"
          >
            Update Permissions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Collaboration;
