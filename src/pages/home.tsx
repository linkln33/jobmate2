import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Divider,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Link as MuiLink
} from '@mui/material';
import { 
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Image from 'next/image';

import SubscriptionTiersShowcase from '@/components/subscription/subscription-tiers-showcase';
import { SubscriptionTier } from '@/types/subscription';
import SubscriptionService from '@/services/subscription-service';
import { ScrollTriggeredWaitlist } from '@/components/waitlist/scroll-triggered-waitlist';

export const HomePage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    router.push('/subscription-management');
  };
  
  return (
    <Box>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ 
        background: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              JobMate
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 4 }}>
              <MuiLink 
                href="#" 
                color="text.primary" 
                sx={{ textDecoration: 'none', fontWeight: 500 }}
              >
                Home
              </MuiLink>
              <MuiLink 
                href="#features" 
                color="text.primary" 
                sx={{ textDecoration: 'none', fontWeight: 500 }}
              >
                Features
              </MuiLink>
              <MuiLink 
                href="#pricing" 
                color="text.primary" 
                sx={{ 
                  textDecoration: 'none', 
                  fontWeight: 700,
                  color: 'primary.main'
                }}
              >
                Pricing
              </MuiLink>
              <MuiLink 
                href="#testimonials" 
                color="text.primary" 
                sx={{ textDecoration: 'none', fontWeight: 500 }}
              >
                Testimonials
              </MuiLink>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          pt: 12,
          pb: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Your AI-Powered
                <Box component="span" sx={{ 
                  color: 'primary.main',
                  display: 'block'
                }}>
                  Job Search Assistant
                </Box>
              </Typography>
              
              <Typography variant="h5" color="text.secondary" paragraph>
                JobMate helps you find the perfect job by continuously searching, matching, and applying to opportunities that fit your profile.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ mr: 2, mb: 2 }}
                  onClick={() => router.push('/create-jobmate')}
                >
                  Create Your JobMate
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ mb: 2 }}
                  onClick={() => router.push('/how-it-works')}
                >
                  How It Works
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  position: 'relative',
                  height: { xs: '300px', md: '400px' },
                  width: '100%'
                }}
              >
                {/* This would be replaced with an actual image in a real implementation */}
                <Paper 
                  elevation={6} 
                  sx={{ 
                    height: '100%', 
                    width: '100%', 
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h4" color="text.secondary">
                    JobMate Dashboard Preview
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box sx={{ py: 8 }} id="features">
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 6 }}
          >
            How JobMate Works
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Smart Search
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  JobMate continuously searches job boards and company websites for positions matching your skills and preferences.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  AI Matching
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our AI analyzes job descriptions and your profile to find the best matches based on skills, experience, and preferences.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <NotificationsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Real-time Alerts
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Get notified immediately when high-quality job matches are found, so you can apply while positions are still fresh.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <PsychologyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Smart Assistant
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  JobMate learns from your feedback and adapts to your preferences to improve match quality over time.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Compare Table Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 6 }}
          >
            Compare JobMate Plans
          </Typography>
          
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              overflow: 'auto'
            }}
          >
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}></th>
                    <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="h6">Basic</Typography>
                    </th>
                    <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Typography variant="h6" color="primary">Standard</Typography>
                    </th>
                    <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="h6">Premium</Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body1">Job Search Frequency</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">Weekly</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Typography variant="body2">Daily</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">Hourly</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body1">Number of JobMates</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">1</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Typography variant="body2">3</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">Unlimited</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body1">AI Assistant</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">Basic</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Typography variant="body2">Advanced</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">Premium</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body1">Auto-Application</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">❌</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Typography variant="body2">✅</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">✅</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body1">Collaboration</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">❌</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Typography variant="body2">❌</Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <Typography variant="body2">✅</Typography>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </Paper>
        </Container>
      </Box>
      
      {/* Subscription Tiers Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }} id="pricing">
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 6 }}
          >
            Choose Your Plan
          </Typography>
          <SubscriptionTiersShowcase 
            currentTier={currentTier}
            onSelectTier={handleSelectTier}
          />
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Box sx={{ py: 8 }} id="testimonials">
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 6 }}
          >
            Success Stories
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                  "JobMate found me a senior developer position that perfectly matched my skills and salary expectations. I was hired within two weeks!"
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Alex Johnson
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Software Engineer
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                  "The auto negotiation feature helped me secure a 15% higher salary than I initially expected. The ROI on my Pro subscription was incredible!"
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Sarah Miller
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Marketing Director
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                  "As a recruiting agency, the Agency plan has transformed how we match candidates with opportunities. The collaboration features are game-changing."
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Michael Chen
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recruitment Agency Owner
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Transform Your Job Search?
          </Typography>
          
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Create your JobMate today and let AI find your perfect job match.
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            color="secondary"
            onClick={() => router.push('/create-jobmate')}
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.2rem'
            }}
          >
            Get Started for Free
          </Button>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                JobMate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your AI-powered job search assistant that helps you find the perfect job match.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Product
              </Typography>
              <Typography variant="body2" paragraph>Features</Typography>
              <Typography variant="body2" paragraph>Pricing</Typography>
              <Typography variant="body2" paragraph>FAQ</Typography>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Company
              </Typography>
              <Typography variant="body2" paragraph>About Us</Typography>
              <Typography variant="body2" paragraph>Blog</Typography>
              <Typography variant="body2" paragraph>Careers</Typography>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Resources
              </Typography>
              <Typography variant="body2" paragraph>Support</Typography>
              <Typography variant="body2" paragraph>Documentation</Typography>
              <Typography variant="body2" paragraph>Privacy Policy</Typography>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Connect
              </Typography>
              <Typography variant="body2" paragraph>Twitter</Typography>
              <Typography variant="body2" paragraph>LinkedIn</Typography>
              <Typography variant="body2" paragraph>Email</Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} JobMate. All rights reserved.
          </Typography>
        </Container>
      </Box>
      
      {/* Scroll Triggered Waitlist Popup */}
      <ScrollTriggeredWaitlist />
    </Box>
  );
};

export default HomePage;
