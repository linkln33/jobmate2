import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea, 
  styled, 
  useTheme,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Chip,
  CardMedia
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightIcon from '@mui/icons-material/Flight';
import { getCategoriesForIntent } from '../../data/category-mapping';

interface HolidayTravelProps {
  onSelectCategory: (categoryId: string) => void;
  onBack: () => void;
  onNext: (intentId: string, categoryId: string) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const CategoryIcon = styled(Box)(({ theme }) => ({
  fontSize: '2rem',
  marginBottom: theme.spacing(1),
}));

const DestinationCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const FeatureSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const HolidayTravel: React.FC<HolidayTravelProps> = ({ onSelectCategory, onBack, onNext }) => {
  const theme = useTheme();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Get categories for the 'holiday-travel' intent
  const categories = getCategoriesForIntent('holiday-travel');

  // Mock popular destinations
  const popularDestinations = [
    { id: 'beach-destinations', name: 'Beach Destinations', image: '🏝️' },
    { id: 'city-breaks', name: 'City Breaks', image: '🏙️' },
    { id: 'mountain-retreats', name: 'Mountain Retreats', image: '🏔️' },
    { id: 'countryside-escapes', name: 'Countryside Escapes', image: '🌄' }
  ];

  // Mock travel seasons
  const travelSeasons = [
    { id: 'summer', name: 'Summer Getaways' },
    { id: 'winter', name: 'Winter Escapes' },
    { id: 'spring', name: 'Spring Breaks' },
    { id: 'autumn', name: 'Autumn Adventures' }
  ];

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    onSelectCategory(categoryId);
  };

  const handleNext = () => {
    if (selectedCategoryId) {
      onNext('holiday-travel', selectedCategoryId);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Stepper activeStep={1} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Select Intent</StepLabel>
        </Step>
        <Step>
          <StepLabel>Choose Category</StepLabel>
        </Step>
        <Step>
          <StepLabel>Set Preferences</StepLabel>
        </Step>
      </Stepper>

      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Plan Your Perfect Getaway
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Select a travel category to find your ideal holiday experience
      </Typography>

      {/* Popular Destinations Section */}
      <FeatureSection elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOnIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Popular Destinations</Typography>
        </Box>
        <Grid container spacing={2}>
          {popularDestinations.map((destination) => (
            <Grid item xs={12} sm={6} md={3} key={destination.id}>
              <DestinationCard>
                <CardActionArea onClick={() => handleSelectCategory('vacation-packages')}>
                  <Box sx={{ 
                    height: 140, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '4rem'
                  }}>
                    {destination.image}
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h3" align="center">
                      {destination.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </DestinationCard>
            </Grid>
          ))}
        </Grid>
      </FeatureSection>

      {/* Travel Seasons Section */}
      <FeatureSection elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FlightIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Travel Seasons</Typography>
        </Box>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {travelSeasons.map((season) => (
            <Grid item key={season.id}>
              <Chip 
                label={season.name}
                onClick={() => handleSelectCategory('vacation-packages')}
                variant="outlined"
                color="primary"
              />
            </Grid>
          ))}
        </Grid>
      </FeatureSection>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" align="center" gutterBottom>
        Browse Travel Categories
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <StyledCard 
              elevation={selectedCategoryId === category.id ? 4 : 1}
              sx={{
                border: selectedCategoryId === category.id ? `2px solid ${theme.palette.primary.main}` : 'none',
              }}
            >
              <CardActionArea 
                onClick={() => handleSelectCategory(category.id)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <CategoryIcon>{category.icon}</CategoryIcon>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          variant="outlined" 
          onClick={onBack}
        >
          Back to Intents
        </Button>
        <Button 
          variant="contained" 
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          disabled={!selectedCategoryId}
        >
          Continue to Preferences
        </Button>
      </Box>
    </Box>
  );
};

export default HolidayTravel;
