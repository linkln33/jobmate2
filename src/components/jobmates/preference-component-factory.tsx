import React from 'react';
import { Box, Typography } from '@mui/material';

// Import enhanced preference component
import EnhancedPreferenceComponent from './enhanced-preference-component';

// Import data
import { getFeaturesForCategory } from '../../data/category-features';
import { getIntentById } from '../../types/intent';
import { getCategoryById } from '../../data/category-mapping';

// Interface for preference component props
interface PreferenceComponentProps {
  intentId: string;
  categoryId: string;
  onBack: () => void;
  onComplete: (preferences: any) => void;
}

interface PreferenceComponentFactoryProps {
  intentId: string;
  categoryId: string;
  onBack: () => void;
  onNext: (preferences: any) => void;
  onComplete: (preferences: any) => void;
  preferences?: any;
  isLoading?: boolean;
}

/**
 * Factory component that returns the appropriate preference component
 * based on the selected intent and category
 */
const PreferenceComponentFactory: React.FC<PreferenceComponentFactoryProps> = ({
  intentId,
  categoryId,
  onBack,
  onNext,
  onComplete,
  preferences,
  isLoading
}) => {
  // Get features for this intent+category combination
  const features = getFeaturesForCategory(intentId, categoryId);
  
  // Get intent and category names for display
  const intent = getIntentById(intentId);
  const category = getCategoryById(intentId, categoryId);
  const intentName = intent?.name || intentId;
  const categoryName = category?.name || categoryId;
  
  // Get list of enabled features for display
  const enabledFeatures = Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature.replace('Enabled', ''));
  
  // Handle completion of preferences
  const handleComplete = (preferences: any) => {
    // Save the preferences
    onComplete(preferences);
  };
  
  // Use our enhanced preference component for all intent+category combinations
  return (
    <EnhancedPreferenceComponent
      intentId={intentId}
      categoryId={categoryId}
      onBack={onBack}
      onComplete={handleComplete}
      preferences={preferences}
    />
  );
};

export default PreferenceComponentFactory;
