import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  TextField, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import { 
  Share as ShareIcon, 
  Download as DownloadIcon, 
  Favorite as FavoriteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { JobMateTemplate, JobMate } from '@/types/jobmate';
import { useRouter } from 'next/navigation';

interface TemplateCardProps {
  template: JobMateTemplate;
  onUse: (template: JobMateTemplate) => void;
  isOwner: boolean;
  onEdit?: (template: JobMateTemplate) => void;
  onDelete?: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onUse, 
  isOwner,
  onEdit,
  onDelete
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div">
            {template.emoji} {template.name}
          </Typography>
          {template.rating !== undefined && (
            <Rating value={template.rating} readOnly precision={0.5} size="small" />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {template.description}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {template.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" />
          ))}
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Category: {template.categoryFocus}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Downloads: {template.downloads}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Uses: {template.usageCount}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          startIcon={<DownloadIcon />}
          onClick={() => onUse(template)}
        >
          Use Template
        </Button>
        
        <Button 
          size="small" 
          startIcon={<ShareIcon />}
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/jobmates/templates/${template.id}`
            );
          }}
        >
          Share
        </Button>
        
        {isOwner && (
          <>
            <IconButton 
              size="small" 
              onClick={() => onEdit && onEdit(template)}
              aria-label="edit template"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            
            <IconButton 
              size="small" 
              onClick={() => onDelete && onDelete(template.id)}
              aria-label="delete template"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );
};

interface ExportTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  jobMate: JobMate | null;
  onExport: (templateData: Partial<JobMateTemplate>) => void;
}

const ExportTemplateDialog: React.FC<ExportTemplateDialogProps> = ({
  open,
  onClose,
  jobMate,
  onExport
}) => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  
  useEffect(() => {
    if (jobMate) {
      setTemplateName(jobMate.name + ' Template');
      setDescription(jobMate.description || '');
    }
  }, [jobMate]);
  
  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleExport = () => {
    if (!jobMate) return;
    
    const templateData: Partial<JobMateTemplate> = {
      name: templateName,
      description,
      emoji: jobMate.emoji || '🤖',
      categoryFocus: jobMate.categoryFocus,
      subcategories: jobMate.subcategories,
      preferences: jobMate.preferences,
      isPublic,
      tags,
      settings: jobMate.settings,
      intent: jobMate.intent
    };
    
    onExport(templateData);
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export JobMate as Template</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Template Name"
            fullWidth
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle2">Tags</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TextField
                label="Add Tag"
                size="small"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddTag}
                disabled={!currentTag}
              >
                Add
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  onDelete={() => handleRemoveTag(tag)} 
                  size="small" 
                />
              ))}
            </Box>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Visibility</Typography>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Button 
                variant={isPublic ? "contained" : "outlined"} 
                onClick={() => setIsPublic(true)}
                sx={{ mr: 1 }}
              >
                Public
              </Button>
              <Button 
                variant={!isPublic ? "contained" : "outlined"} 
                onClick={() => setIsPublic(false)}
              >
                Private
              </Button>
            </Box>
          </Box>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            {isPublic 
              ? "Public templates can be discovered and used by all JobMate users." 
              : "Private templates are only visible to you and users you share the link with."}
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleExport} 
          variant="contained"
          disabled={!templateName}
        >
          Export Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export interface TemplateGalleryProps {
  userTemplates?: JobMateTemplate[];
  publicTemplates?: JobMateTemplate[];
  onUseTemplate: (template: JobMateTemplate) => void;
  onCreateTemplate?: (templateData: Partial<JobMateTemplate>) => void;
  onEditTemplate?: (template: JobMateTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
  userId?: string;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  userTemplates = [],
  publicTemplates = [],
  onUseTemplate,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  userId = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUserTemplates = userTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredPublicTemplates = publicTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search templates"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>
      
      {userTemplates.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>Your Templates</Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {filteredUserTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <TemplateCard 
                  template={template} 
                  onUse={onUseTemplate} 
                  isOwner={true}
                  onEdit={onEditTemplate}
                  onDelete={onDeleteTemplate}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      <Typography variant="h6" sx={{ mb: 2 }}>Public Templates</Typography>
      <Grid container spacing={3}>
        {filteredPublicTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <TemplateCard 
              template={template} 
              onUse={onUseTemplate} 
              isOwner={template.creatorId === userId}
              onEdit={template.creatorId === userId ? onEditTemplate : undefined}
              onDelete={template.creatorId === userId ? onDeleteTemplate : undefined}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export interface TemplateSharingProps {
  jobMate: JobMate | null;
  onExportTemplate: (templateData: Partial<JobMateTemplate>) => void;
}

export const TemplateSharing: React.FC<TemplateSharingProps> = ({
  jobMate,
  onExportTemplate
}) => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ShareIcon />}
        onClick={() => setExportDialogOpen(true)}
        disabled={!jobMate}
      >
        Export as Template
      </Button>
      
      <ExportTemplateDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        jobMate={jobMate}
        onExport={onExportTemplate}
      />
    </>
  );
};

export default TemplateSharing;
