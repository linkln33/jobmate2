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
  StepLabel
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getCategoriesForIntent } from '../../data/category-mapping';

interface EarnMoneyProps {
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

const EarnMoney: React.FC<EarnMoneyProps> = ({ onSelectCategory, onBack, onNext }) => {
  const theme = useTheme();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Get categories for the 'earn-money' intent
  const categories = getCategoriesForIntent('earn-money');

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    onSelectCategory(categoryId);
  };

  const handleNext = () => {
    if (selectedCategoryId) {
      onNext('earn-money', selectedCategoryId);
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
        How would you like to earn money?
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Select a category that best matches your skills and interests
      </Typography>

      <Grid container spacing={3} justifyContent="center">
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

export default EarnMoney;
