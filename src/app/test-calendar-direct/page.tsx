"use client";

import React, { useState } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import GoogleCalendarIntegration from '@/components/shared/google-calendar-integration';
import { AvailabilitySettings } from '@/components/shared/availability-calendar';

export default function TestCalendarDirectPage() {
  // Initial empty availability state
  const [availability, setAvailability] = useState<AvailabilitySettings>({
    availableDays: [],
    recurringAvailability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    },
    exceptionDates: []
  });
  
  const handleAvailabilityChange = (newAvailability: AvailabilitySettings) => {
    setAvailability(newAvailability);
    console.log("Availability updated:", newAvailability);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Google Calendar Integration Test
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <GoogleCalendarIntegration
            availability={availability}
            onAvailabilityChange={handleAvailabilityChange}
            eventTitle="JobMate Test Availability"
            eventDescription="Test availability settings for JobMate"
            showExportButton={true}
            showImportButton={true}
          />
        </Box>
      </Paper>
    </Container>
  );
}
