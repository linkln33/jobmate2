"use client";

import React from 'react';
import EnhancedPreferenceComponent from '@/components/jobmates/enhanced-preference-component';
import { Box, Container, Typography, Paper } from '@mui/material';

export default function TestCalendarPage() {
  // Mock data for testing
  const intentId = "hire";
  const categoryId = "jobs";
  
  const handleBack = () => {
    console.log("Back button clicked");
  };
  
  const handleComplete = (preferences: any) => {
    console.log("Preferences saved:", preferences);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Test Google Calendar Integration
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <EnhancedPreferenceComponent
            intentId={intentId}
            categoryId={categoryId}
            onBack={handleBack}
            onComplete={handleComplete}
            preferences={{}}
            features={{
              showUrgencySelector: true,
              showAvailabilitySelector: true,
              showBudgetSelector: true,
              showLocationSelector: true,
              showSkillsSelector: true
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
