import React, { useState, useEffect } from 'react';
import { preferenceService } from '@/services/preference-service';
import {
  Box,
  Typography,
  Paper,
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
import GoogleCalendarIntegration from '@/components/shared/google-calendar-integration';
import SkillSelector from '../shared/skill-selector';
import ServiceTypeSelector, { ServiceType } from '../shared/service-type-selector';

// Import data
import { getFeaturesForCategory, CategoryFeatures } from '../../data/category-features';
import { getSkillsForCategory, getIndustriesForCategory, SkillSuggestion, IndustrySuggestion } from '../../data/suggested-skills';
import { getServiceTypesForCategory } from '../../data/service-types';

// Types are imported from category-features.ts

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
  
  // Mock user ID for development - in production this would come from auth context
  const MOCK_USER_ID = 'user-123';
  
  // Get suggested data
  const suggestedSkills = getSkillsForCategory(intentId, categoryId);
  const suggestedIndustries = getIndustriesForCategory(intentId, categoryId);
  const suggestedServiceTypes = getServiceTypesForCategory(intentId, categoryId);
  
  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
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
    
    // Save preferences using the preference service
    try {
      const response = await preferenceService.savePreferences(
        MOCK_USER_ID,
        intentId,
        categoryId,
        updatedPreferences
      );
      
      if (response.success) {
        onComplete(updatedPreferences);
      } else {
        console.error('Failed to save preferences:', response.error);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
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

  const handleAvailabilityChange = (availability: AvailabilitySettings) => {
    setAvailability(availability);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Customize Your Preferences
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Tailor your experience to find the perfect match
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Left Column */}
        <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', md: '48%' } }}>
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '48%' } }}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                      placeholder="Enter city, zip code, or address"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '48%' } }}>
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
                  </Box>
                </Box>
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
                    onChange={(event, newValue) => setPriceRange(newValue as [number, number])}
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
                    valueLabelFormat={(value: number) => `$${value}`}
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
                    onChange={(e) => setExperienceLevel(e.target.value as string)}
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
                    onChange={(event, newValue) => {
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
        </Box>
        
        {/* Right Column */}
        <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', md: '48%' } }}>
          {/* Availability Calendar Section */}
          {features.showAvailabilityCalendar && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Availability
              </Typography>
              <GoogleCalendarIntegration
                availability={availability}
                onAvailabilityChange={handleAvailabilityChange}
                eventTitle={`JobMate Availability for ${categoryId}`}
                eventDescription={`Availability settings for JobMate in category: ${categoryId}`}
                showExportButton={true}
                showImportButton={true}
              />
            </Box>
          )}
          
          {/* Urgency Section */}
          {features.showUrgencySelector && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Urgency</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as string)}
                >
                  <MenuItem value="low">Not Urgent</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">Urgent</MenuItem>
                  <MenuItem value="immediate">Immediate</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          )}
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onBack}
              startIcon={<ArrowBackIcon />}
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
              Save & Continue
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EnhancedPreferenceComponent;
