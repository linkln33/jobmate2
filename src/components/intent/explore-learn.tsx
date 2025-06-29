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
  Chip
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import { getCategoriesForIntent } from '../../data/category-mapping';

interface ExploreLearningProps {
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

const FeatureSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const ExploreLearning: React.FC<ExploreLearningProps> = ({ onSelectCategory, onBack, onNext }) => {
  const theme = useTheme();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Get categories for the 'explore-learn' intent
  const categories = getCategoriesForIntent('explore-learn');

  // Mock trending learning topics
  const trendingTopics = [
    { id: 'data-science', name: 'Data Science', count: 120 },
    { id: 'web-development', name: 'Web Development', count: 98 },
    { id: 'digital-marketing', name: 'Digital Marketing', count: 85 },
    { id: 'ui-ux-design', name: 'UI/UX Design', count: 72 },
    { id: 'artificial-intelligence', name: 'Artificial Intelligence', count: 64 }
  ];

  // Mock featured courses
  const featuredCourses = [
    { id: 'python-programming', name: 'Python Programming', instructor: 'Sarah Johnson' },
    { id: 'digital-illustration', name: 'Digital Illustration', instructor: 'Michael Chen' },
    { id: 'business-analytics', name: 'Business Analytics', instructor: 'Emma Williams' }
  ];

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    onSelectCategory(categoryId);
  };

  const handleNext = () => {
    if (selectedCategoryId) {
      onNext('explore-learn', selectedCategoryId);
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
        What would you like to learn?
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Discover new skills, courses, and learning opportunities
      </Typography>

      {/* Trending Topics Section */}
      <FeatureSection elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Trending Topics</Typography>
        </Box>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {trendingTopics.map((topic) => (
            <Grid item key={topic.id}>
              <Chip 
                label={`${topic.name} (${topic.count})`}
                onClick={() => handleSelectCategory('online-courses')}
                variant="outlined"
                color="primary"
              />
            </Grid>
          ))}
        </Grid>
      </FeatureSection>

      {/* Featured Courses Section */}
      <FeatureSection elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SchoolIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Featured Courses</Typography>
        </Box>
        <Grid container spacing={2}>
          {featuredCourses.map((course) => (
            <Grid item xs={12} sm={4} key={course.id}>
              <Card variant="outlined">
                <CardActionArea onClick={() => handleSelectCategory('online-courses')}>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Instructor: {course.instructor}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </FeatureSection>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" align="center" gutterBottom>
        Browse Learning Categories
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

export default ExploreLearning;
