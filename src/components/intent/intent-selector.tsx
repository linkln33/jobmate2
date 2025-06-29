import React, { useState } from 'react';
import { INTENT_OPTIONS, IntentOption } from '../../types/intent';
import { Box, Grid, Typography, Card, CardContent, CardActionArea, styled, useTheme } from '@mui/material';

interface IntentSelectorProps {
  onSelectIntent: (intentId: string) => void;
  selectedIntentId?: string;
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

const IntentIcon = styled(Box)(({ theme }) => ({
  fontSize: '2rem',
  marginBottom: theme.spacing(1),
}));

const IntentSelector: React.FC<IntentSelectorProps> = ({ onSelectIntent, selectedIntentId }) => {
  const theme = useTheme();

  const handleSelectIntent = (intentId: string) => {
    onSelectIntent(intentId);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        What would you like to do today?
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Select your primary goal to get started
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {INTENT_OPTIONS.map((intent: IntentOption) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={intent.id}>
            <StyledCard 
              elevation={selectedIntentId === intent.id ? 4 : 1}
              sx={{
                border: selectedIntentId === intent.id ? `2px solid ${theme.palette.primary.main}` : 'none',
              }}
            >
              <CardActionArea 
                onClick={() => handleSelectIntent(intent.id)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <IntentIcon>{intent.icon}</IntentIcon>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {intent.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {intent.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IntentSelector;
