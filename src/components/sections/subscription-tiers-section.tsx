"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography } from '@mui/material';
import SubscriptionTiersShowcase from '@/components/subscription/subscription-tiers-showcase';
import { SubscriptionTier } from '@/types/subscription';
import SubscriptionService from '@/services/subscription-service';

export function SubscriptionTiersSection() {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free');
  
  useEffect(() => {
    // In a real app, we'd get the user ID from auth context
    const mockUserId = 'mock-user-id';
    
    const loadUserTier = async () => {
      try {
        const tier = await SubscriptionService.getUserSubscriptionTier(mockUserId);
        setCurrentTier(tier);
      } catch (error) {
        console.error('Failed to load user subscription tier:', error);
      }
    };
    
    loadUserTier();
  }, []);
  
  const handleSelectTier = (tier: SubscriptionTier) => {
    // Navigate to subscription management page
    window.location.href = '/subscription-management';
  };

  return (
    <Box 
      id="pricing"
      sx={{
        pt: 1,
        pb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #1976d2, #9c27b0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Choose Your Plan
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mb: 2 }}>
            Select the perfect plan that fits your job search needs
          </Typography>
        </Box>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SubscriptionTiersShowcase 
            currentTier={currentTier}
            onSelectTier={handleSelectTier}
          />
        </motion.div>
      </Container>
    </Box>
  );
}
