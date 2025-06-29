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
  Tabs,
  Tab
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getCategoriesForIntent } from '../../data/category-mapping';

interface RentSomethingProps {
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

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rental-tabpanel-${index}`}
      aria-labelledby={`rental-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `rental-tab-${index}`,
    'aria-controls': `rental-tabpanel-${index}`,
  };
}

const RentSomething: React.FC<RentSomethingProps> = ({ onSelectCategory, onBack, onNext }) => {
  const theme = useTheme();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Get categories for the 'rent-something' intent
  const categories = getCategoriesForIntent('rent-something');

  // Group categories by type
  const propertyCategories = categories.filter(cat => 
    ['apartments', 'houses', 'vacation-rentals', 'commercial-space'].includes(cat.id)
  );
  
  const equipmentCategories = categories.filter(cat => 
    ['equipment-rental', 'vehicle-rental', 'event-equipment', 'tools'].includes(cat.id)
  );
  
  const otherCategories = categories.filter(cat => 
    !propertyCategories.includes(cat) && !equipmentCategories.includes(cat)
  );

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    onSelectCategory(categoryId);
  };

  const handleNext = () => {
    if (selectedCategoryId) {
      onNext('rent-something', selectedCategoryId);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Render category grid
  const renderCategoryGrid = (categoryList: typeof categories) => (
    <Grid container spacing={3} justifyContent="center">
      {categoryList.map((category) => (
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
  );

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
        What would you like to rent?
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Select a category that best matches your rental needs
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Properties" {...a11yProps(0)} />
          <Tab label="Equipment" {...a11yProps(1)} />
          <Tab label="Other" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderCategoryGrid(propertyCategories)}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderCategoryGrid(equipmentCategories)}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderCategoryGrid(otherCategories)}
      </TabPanel>

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

export default RentSomething;
