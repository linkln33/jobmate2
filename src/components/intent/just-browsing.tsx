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
  Chip,
  Divider,
  Paper
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import PlaceIcon from '@mui/icons-material/Place';
import { getCategoriesForIntent } from '../../data/category-mapping';

interface JustBrowsingProps {
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

const TrendingSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const JustBrowsing: React.FC<JustBrowsingProps> = ({ onSelectCategory, onBack, onNext }) => {
  const theme = useTheme();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Get categories for the 'just-browsing' intent
  const categories = getCategoriesForIntent('just-browsing');

  // Mock trending data
  const trendingCategories = [
    { id: 'web-development', name: 'Web Development', count: 120 },
    { id: 'home-cleaning', name: 'Home Cleaning', count: 98 },
    { id: 'graphic-design', name: 'Graphic Design', count: 85 },
    { id: 'dog-walking', name: 'Dog Walking', count: 72 },
    { id: 'tutoring', name: 'Tutoring', count: 64 }
  ];

  const trendingSkills = [
    { id: 'react', name: 'React', count: 145 },
    { id: 'ai-ml', name: 'AI & Machine Learning', count: 132 },
    { id: 'social-media', name: 'Social Media Marketing', count: 118 },
    { id: 'video-editing', name: 'Video Editing', count: 89 },
    { id: 'copywriting', name: 'Copywriting', count: 76 }
  ];

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    onSelectCategory(categoryId);
  };

  const handleNext = () => {
    if (selectedCategoryId) {
      onNext('just-browsing', selectedCategoryId);
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
        Explore What's Popular
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Browse trending categories or discover new opportunities
      </Typography>

      {/* Trending Categories Section */}
      <TrendingSection elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Trending Categories</Typography>
        </Box>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {trendingCategories.map((category) => (
            <Grid item key={category.id}>
              <Chip 
                label={`${category.name} (${category.count})`}
                onClick={() => handleSelectCategory('trending')}
                variant="outlined"
                color="primary"
              />
            </Grid>
          ))}
        </Grid>
      </TrendingSection>

      {/* Trending Skills Section */}
      <TrendingSection elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StarIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">In-Demand Skills</Typography>
        </Box>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {trendingSkills.map((skill) => (
            <Grid item key={skill.id}>
              <Chip 
                label={`${skill.name} (${skill.count})`}
                onClick={() => handleSelectCategory('trending')}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
      </TrendingSection>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" align="center" gutterBottom>
        Or Select a Category to Explore
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
          Continue to Explore
        </Button>
      </Box>
    </Box>
  );
};

export default JustBrowsing;
