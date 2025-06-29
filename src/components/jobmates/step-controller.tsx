import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Stepper, Step, StepLabel, Typography, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Import intent components
import IntentSelector from '../intent/intent-selector';
import EarnMoney from '../intent/earn-money';
import HireSomeone from '../intent/hire-someone';
import FindHelp from '../intent/find-help';
import JustBrowsing from '../intent/just-browsing';
import SellSomething from '../intent/sell-something';
import RentSomething from '../intent/rent-something';
import ExploreLearning from '../intent/explore-learn';
import HolidayTravel from '../intent/holiday-travel';

// Import preference component factory
import PreferenceComponentFactory from './preference-component-factory';

// Import helper functions and types
import { getIntentById } from '../../types/intent';
import { getCategoryById } from '../../data/category-mapping';
import { matchingService } from '../../services/server/matching-service';

enum StepState {
  INTENT_SELECTION = 0,
  CATEGORY_SELECTION = 1,
  PREFERENCE_CUSTOMIZATION = 2,
  RESULTS = 3,
}

interface StepControllerProps {
  onComplete: (data: any) => void;
  initialIntentId?: string;
  initialCategoryId?: string;
  initialPreferences?: any;
}

const StepController: React.FC<StepControllerProps> = ({ 
  onComplete, 
  initialIntentId = null, 
  initialCategoryId = null, 
  initialPreferences = {}
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState<StepState>(
    initialIntentId && initialCategoryId ? StepState.PREFERENCE_CUSTOMIZATION : StepState.INTENT_SELECTION
  );
  const [selectedIntentId, setSelectedIntentId] = useState<string | null>(initialIntentId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId);
  const [preferences, setPreferences] = useState<any>(initialPreferences);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle intent selection
  const handleSelectIntent = (intentId: string) => {
    setSelectedIntentId(intentId);
    setCurrentStep(StepState.CATEGORY_SELECTION);
  };

  // Handle category selection
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  // Handle moving to preferences step
  const handleMoveToPreferences = (intentId: string, categoryId: string) => {
    setSelectedIntentId(intentId);
    setSelectedCategoryId(categoryId);
    setCurrentStep(StepState.PREFERENCE_CUSTOMIZATION);
  };

  // Handle going back to intent selection
  const handleBackToIntents = () => {
    setCurrentStep(StepState.INTENT_SELECTION);
  };

  // Handle going back to category selection
  const handleBackToCategories = () => {
    setCurrentStep(StepState.CATEGORY_SELECTION);
  };

  // Handle saving preferences
  const handleSavePreferences = async (newPreferences: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Combine all preferences
      const combinedPreferences = {
        ...preferences,
        ...newPreferences,
        intentId: selectedIntentId,
        categoryId: selectedCategoryId,
      };
      
      setPreferences(combinedPreferences);
      
      // In a real application, we would call an API to get matches based on preferences
      // For now, we'll simulate a delay and move to the results step
      setTimeout(() => {
        setCurrentStep(StepState.RESULTS);
        setIsLoading(false);
        
        // Complete the flow by calling the onComplete callback
        onComplete({
          intentId: selectedIntentId,
          categoryId: selectedCategoryId,
          preferences: combinedPreferences
        });
      }, 1500);
    } catch (err) {
      setError('An error occurred while processing your preferences. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle next step in preferences
  const handleNextInPreferences = (partialPreferences: any) => {
    // Update preferences with partial data
    setPreferences({
      ...preferences,
      ...partialPreferences
    });
    
    // This could be expanded to handle multi-step preference flow
    // For now, we'll just use it to update preferences without completing the flow
  };

  // Get the current step content
  const getStepContent = () => {
    switch (currentStep) {
      case StepState.INTENT_SELECTION:
        return (
          <IntentSelector 
            onSelectIntent={handleSelectIntent}
            selectedIntentId={selectedIntentId || undefined}
          />
        );
        
      case StepState.CATEGORY_SELECTION:
        // Dynamically render the appropriate category selection component based on intent
        switch (selectedIntentId) {
          case 'earn-money':
            return (
              <EarnMoney 
                onSelectCategory={handleSelectCategory}
                onBack={handleBackToIntents}
                onNext={handleMoveToPreferences}
              />
            );
          case 'hire-someone':
            return (
              <HireSomeone 
                onSelectCategory={handleSelectCategory}
                onBack={handleBackToIntents}
                onNext={handleMoveToPreferences}
              />
            );
          case 'find-help':
            return (
              <FindHelp 
                onSelectCategory={handleSelectCategory}
                onBack={handleBackToIntents}
                onNext={handleMoveToPreferences}
              />
            );
          case 'just-browsing':
            return (
              <JustBrowsing 
                onSelectCategory={handleSelectCategory}
                onBack={handleBackToIntents}
                onNext={handleMoveToPreferences}
              />
            );
          case 'sell-something':
            return (
              <SellSomething 
                onSelectCategory={handleSelectCategory}
                onBack={handleBackToIntents}
                onNext={handleMoveToPreferences}
              />
            );
          case 'rent-something':
            return (
              <RentSomething 
                onSelectCategory={handleSelectCategory}
                onBack={handleBackToIntents}
                onNext={handleMoveToPreferences}
              />
            );
          case 'explore-learn':
            return (
              <ExploreLearning 
                onSelectCategory={handleSelectCategory}
                onBack={handleBackToIntents}
                onNext={handleMoveToPreferences}
              />
            );
          case 'holiday-travel':
            return (
              <HolidayTravel 
                onSelectCategory={handleSelectCategory}
                onBack={handleBackToIntents}
                onNext={handleMoveToPreferences}
              />
            );
          default:
            // Fallback for any other intent that might be added in the future
            return (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5">
                  Category selection for {getIntentById(selectedIntentId!)?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  This component is under development.
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<ArrowBackIcon />} 
                  onClick={handleBackToIntents}
                  sx={{ mt: 3 }}
                >
                  Back to Intents
                </Button>
              </Box>
            );
        }
        
      case StepState.PREFERENCE_CUSTOMIZATION:
        if (selectedIntentId && selectedCategoryId) {
          return (
            <>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              
              <PreferenceComponentFactory
                intentId={selectedIntentId}
                categoryId={selectedCategoryId}
                onBack={handleBackToCategories}
                onNext={handleNextInPreferences}
                onComplete={handleSavePreferences}
                preferences={preferences}
                isLoading={isLoading}
              />
            </>
          );
        }
        return null;
        
      case StepState.RESULTS:
        return (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Preferences Saved Successfully!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {getIntentById(selectedIntentId!)?.name} &gt; {getCategoryById(selectedIntentId!, selectedCategoryId!)?.name}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4 }}>
              Your preferences have been saved and will be used to provide you with personalized matches.
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setCurrentStep(StepState.PREFERENCE_CUSTOMIZATION)}
              sx={{ mr: 2 }}
            >
              Edit Preferences
            </Button>
            
            <Button 
              variant="outlined"
              onClick={handleBackToIntents}
            >
              Start Over
            </Button>
          </Box>
        );
        
      default:
        return null;
    }
  };

  // Get step labels
  const getStepLabels = () => {
    const steps = ['Select Intent', 'Choose Category', 'Set Preferences', 'Results'];
    return steps;
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4 }}>
        <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
          {getStepLabels().map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Display loading state if applicable */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Typography variant="h6">Processing your preferences...</Typography>
          </Box>
        )}
        
        {/* Main content */}
        {!isLoading && getStepContent()}
      </Paper>
    </Container>
  );
};

export default StepController;
