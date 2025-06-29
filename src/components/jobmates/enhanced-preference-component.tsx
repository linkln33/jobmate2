import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Slider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Chip,
  Rating,
  Stack,
  FormLabel,
  InputLabel
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Import shared components
import AvailabilityCalendar, { AvailabilitySettings } from '../shared/availability-calendar';
import SkillSelector from '../shared/skill-selector';
import ServiceTypeSelector, { ServiceType } from '../shared/service-type-selector';

// Import data
import { getFeaturesForCategory } from '../../data/category-features';
import { getSkillsForCategory, getIndustriesForCategory, SkillSuggestion, IndustrySuggestion } from '../../data/suggested-skills';
import { getServiceTypesForCategory } from '../../data/service-types';

// Types
interface EnhancedPreferenceComponentProps {
  intentId: string;
  categoryId: string;
  onBack: () => void;
  onComplete: (preferences: any) => void;
  preferences?: any;
  isLoading?: boolean;
}

const EnhancedPreferenceComponent: React.FC<EnhancedPreferenceComponentProps> = ({
  intentId,
  categoryId,
  onBack,
  onComplete,
  preferences = {},
  isLoading = false
}) => {
  // Get category features
  const features = getFeaturesForCategory(intentId, categoryId);
  
  // State for all preference fields
  const [selectedSkills, setSelectedSkills] = useState<string[]>(preferences.skills || []);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(preferences.serviceTypes || []);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(preferences.industries || []);
  const [location, setLocation] = useState<string>(preferences.location || '');
  const [locationRadius, setLocationRadius] = useState<number>(preferences.locationRadius || 10);
  const [priceRange, setPriceRange] = useState<[number, number]>(preferences.priceRange || [0, 100]);
  const [experienceLevel, setExperienceLevel] = useState<string>(preferences.experienceLevel || 'intermediate');
  const [minRating, setMinRating] = useState<number | null>(preferences.minRating || 4);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(preferences.paymentMethods || ['credit_card']);
  const [specialRequirements, setSpecialRequirements] = useState<string>(preferences.specialRequirements || '');
  const [availability, setAvailability] = useState<AvailabilitySettings>(preferences.availability || {});
  const [urgency, setUrgency] = useState<string>(preferences.urgency || 'normal');
  
  // Get suggested data
  const suggestedSkills = getSkillsForCategory(intentId, categoryId);
  const suggestedIndustries = getIndustriesForCategory(intentId, categoryId);
  const suggestedServiceTypes = getServiceTypesForCategory(intentId, categoryId);
  
  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Collect all preferences
    const updatedPreferences = {
      skills: selectedSkills,
      serviceTypes: selectedServiceTypes,
      industries: selectedIndustries,
      location,
      locationRadius,
      priceRange,
      experienceLevel,
      minRating,
      paymentMethods,
      specialRequirements,
      availability,
      urgency
    };
    
    // Call the onComplete callback with the preferences
    onComplete(updatedPreferences);
  };
  
  // Handle rating change
  const handleRatingChange = (value: number | null) => {
    setMinRating(value || 0);
  };

  // Handle price range change
  const handlePriceRangeChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };
  
  // Handle service type selection
  const handleServiceTypeToggle = (value: string) => {
    if (selectedServiceTypes.includes(value)) {
      setSelectedServiceTypes(selectedServiceTypes.filter(type => type !== value));
    } else {
      setSelectedServiceTypes([...selectedServiceTypes, value]);
    }
  };
  
  // Handle payment method toggle
  const handlePaymentMethodToggle = (method: string) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Customize Your Preferences
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Tailor your experience to find the perfect match
      </Typography>
      
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* Skills Section */}
            {features.showSkillSelector && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Skills & Expertise</Typography>
                </Box>
                <SkillSelector
                  intentId={intentId}
                  categoryId={categoryId}
                  selectedSkills={selectedSkills}
                  onChange={setSelectedSkills}
                />
                <Divider sx={{ my: 3 }} />
              </Box>
            )}
            
            {/* Service Types Section */}
            {features.showServiceTypeSelector && suggestedServiceTypes.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Service Types</Typography>
                </Box>
                <ServiceTypeSelector
                  intentId={intentId}
                  categoryId={categoryId}
                  suggestedServiceTypes={suggestedServiceTypes}
                  selectedServiceTypes={selectedServiceTypes}
                  onChange={setSelectedServiceTypes}
                />
                <Divider sx={{ my: 3 }} />
              </Box>
            )}
            
            {/* Industry Section */}
            {features.showIndustrySelector && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Industries</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestedIndustries.map((industry) => (
                    <Chip
                      key={industry.name}
                      label={industry.name}
                      onClick={() => {
                        if (selectedIndustries.includes(industry.name)) {
                          setSelectedIndustries(selectedIndustries.filter(name => name !== industry.name));
                        } else {
                          setSelectedIndustries([...selectedIndustries, industry.name]);
                        }
                      }}
                      color={selectedIndustries.includes(industry.name) ? "primary" : "default"}
                      variant={selectedIndustries.includes(industry.name) ? "filled" : "outlined"}
                    />
                  ))}
                </Box>
                <Divider sx={{ my: 3 }} />
              </Box>
            )}
            
            {/* Location Section */}
            {features.showLocationSelector && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Location</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                      placeholder="Enter city, zip code, or address"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Radius (miles)"
                      type="number"
                      value={locationRadius}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationRadius(parseInt(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">mi</InputAdornment>,
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
              </Box>
            )}
            
            {/* Price Range Section */}
            {features.showPriceRange && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Price Range</Typography>
                </Box>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    valueLabelDisplay="on"
                    min={0}
                    max={200}
                    step={5}
                    marks={[
                      { value: 0, label: '$0' },
                      { value: 50, label: '$50' },
                      { value: 100, label: '$100' },
                      { value: 150, label: '$150' },
                      { value: 200, label: '$200+' }
                    ]}
                    valueLabelFormat={(value) => `$${value}`}
                  />
                </Box>
                <Divider sx={{ my: 3 }} />
              </Box>
            )}
            
            {/* Experience Level Section */}
            {features.showExperienceLevel && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Experience Level</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={experienceLevel}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => setExperienceLevel(e.target.value as string)}
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                    <MenuItem value="any">Any Level</MenuItem>
                  </Select>
                </FormControl>
                <Divider sx={{ my: 3 }} />
              </Box>
            )}
            
            {/* Rating Filter Section */}
            {features.showRatingFilter && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Minimum Rating</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating
                    value={minRating}
                    onChange={(event: React.ChangeEvent<{}>, newValue: number | null) => {
                      setMinRating(newValue);
                    }}
                    precision={0.5}
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {minRating ? `${minRating} stars and above` : 'No minimum'}
                  </Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
              </Box>
            )}
            
            {/* Payment Methods Section */}
            {features.showPaymentMethods && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Payment Methods</Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={paymentMethods.includes('credit_card')} 
                        onChange={() => handlePaymentMethodToggle('credit_card')}
                      />
                    }
                    label="Credit Card"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={paymentMethods.includes('paypal')} 
                        onChange={() => handlePaymentMethodToggle('paypal')}
                      />
                    }
                    label="PayPal"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={paymentMethods.includes('bank_transfer')} 
                        onChange={() => handlePaymentMethodToggle('bank_transfer')}
                      />
                    }
                    label="Bank Transfer"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={paymentMethods.includes('cash')} 
                        onChange={() => handlePaymentMethodToggle('cash')}
                      />
                    }
                    label="Cash"
                  />
                </FormGroup>
                <Divider sx={{ my: 3 }} />
              </Box>
            )}
            
            {/* Special Requirements Section */}
            {features.showSpecialRequirements && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Special Requirements</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={specialRequirements}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecialRequirements(e.target.value)}
                  placeholder="Enter any special requirements or notes"
                  variant="outlined"
                />
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Right Column */}
        <Grid item xs={12} md={5}>
          {/* Availability Calendar Section */}
          {features.showAvailabilityCalendar && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Availability</Typography>
              <AvailabilityCalendar
                value={availability}
                onChange={setAvailability}
              />
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          endIcon={<ArrowForwardIcon />}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </Box>
    </Box>
  );
};

export default EnhancedPreferenceComponent;
