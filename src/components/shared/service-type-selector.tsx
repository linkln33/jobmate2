import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Paper, 
  Divider,
  TextField,
  Button,
  IconButton,
  Collapse
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Types
export interface ServiceType {
  id: string;
  name: string;
  category?: string;
}

interface ServiceTypeSelectorProps {
  intentId: string;
  categoryId: string;
  suggestedServiceTypes: ServiceType[];
  selectedServiceTypes: string[];
  onChange: (serviceTypes: string[]) => void;
  label?: string;
  allowCustomTypes?: boolean;
}

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  intentId,
  categoryId,
  suggestedServiceTypes,
  selectedServiceTypes,
  onChange,
  label = 'Service Types',
  allowCustomTypes = true
}) => {
  const [customType, setCustomType] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Group service types by category
  const getServiceTypesByCategory = (): Record<string, ServiceType[]> => {
    const result: Record<string, ServiceType[]> = {};
    
    suggestedServiceTypes.forEach(serviceType => {
      const category = serviceType.category || 'Other';
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(serviceType);
    });
    
    return result;
  };
  
  const serviceTypesByCategory = getServiceTypesByCategory();
  
  // Initialize expanded state for categories
  React.useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    Object.keys(serviceTypesByCategory).forEach(category => {
      initialExpandedState[category] = true;
    });
    setExpandedCategories(initialExpandedState);
  }, [suggestedServiceTypes]);
  
  // Handle toggling service type selection
  const handleToggleServiceType = (serviceTypeId: string) => {
    if (selectedServiceTypes.includes(serviceTypeId)) {
      onChange(selectedServiceTypes.filter(id => id !== serviceTypeId));
    } else {
      onChange([...selectedServiceTypes, serviceTypeId]);
    }
  };
  
  // Handle adding custom service type
  const handleAddCustomType = () => {
    if (customType && !selectedServiceTypes.includes(customType)) {
      onChange([...selectedServiceTypes, customType]);
      setCustomType('');
      setShowAddCustom(false);
    }
  };
  
  // Handle toggling category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };
  
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      
      {/* Selected service types */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {selectedServiceTypes.length > 0 ? (
          selectedServiceTypes.map((serviceTypeId) => {
            // Find the service type in the suggested list or create a custom one
            const serviceType = suggestedServiceTypes.find(st => st.id === serviceTypeId) || 
              { id: serviceTypeId, name: serviceTypeId };
            
            return (
              <Chip
                key={serviceTypeId}
                label={serviceType.name}
                onDelete={() => handleToggleServiceType(serviceTypeId)}
                color="primary"
                variant="outlined"
                size="medium"
              />
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            No service types selected yet
          </Typography>
        )}
      </Box>
      
      {/* Service types by category */}
      {Object.entries(serviceTypesByCategory).map(([category, serviceTypes]) => (
        <Paper 
          key={category} 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 2, 
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => toggleCategory(category)}
          >
            <Typography variant="subtitle2" color="primary">
              {category}
            </Typography>
            <IconButton size="small">
              {expandedCategories[category] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={expandedCategories[category]}>
            <Divider sx={{ my: 1 }} />
            <FormGroup>
              {serviceTypes.map((serviceType) => (
                <FormControlLabel
                  key={serviceType.id}
                  control={
                    <Checkbox
                      checked={selectedServiceTypes.includes(serviceType.id)}
                      onChange={() => handleToggleServiceType(serviceType.id)}
                      size="small"
                    />
                  }
                  label={serviceType.name}
                />
              ))}
            </FormGroup>
          </Collapse>
        </Paper>
      ))}
      
      {/* Add custom service type */}
      {allowCustomTypes && (
        <Box sx={{ mt: 2 }}>
          {!showAddCustom ? (
            <Button
              startIcon={<AddIcon />}
              onClick={() => setShowAddCustom(true)}
              variant="outlined"
              size="small"
            >
              Add Custom Service Type
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Enter custom service type"
                size="small"
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customType) {
                    handleAddCustomType();
                  }
                }}
              />
              <Button 
                variant="contained" 
                size="small"
                onClick={handleAddCustomType}
                disabled={!customType}
              >
                Add
              </Button>
              <Button 
                variant="text" 
                size="small"
                onClick={() => {
                  setShowAddCustom(false);
                  setCustomType('');
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ServiceTypeSelector;
