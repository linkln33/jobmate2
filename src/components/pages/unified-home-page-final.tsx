"use client";

import React, { useState, useEffect } from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { StickyNavbar } from '@/components/ui/sticky-navbar';
import { ModernFooter } from '@/components/ui/modern-footer';
// FloatingAIAssistant is provided by UnifiedDashboardLayout
import { ParticleBackground } from '@/components/ui/particle-background';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HomepageMap } from '@/components/map/homepage-map';
import { Job } from '@/types/job';

// Import all sections individually
import { FeatureHighlightsSection } from '@/components/sections/feature-highlights-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { ComparisonSection } from '@/components/sections/comparison-section';
import { SubscriptionTiersSection } from '@/components/sections/subscription-tiers-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { MarketplaceSection } from '@/components/sections/marketplace-section';
import { AIAssistantSection } from '@/components/sections/ai-assistant-section';
import { OnboardingWizardSection } from '@/components/sections/onboarding-wizard-section';
import { CTASection } from '@/components/sections/cta-section';
import { WaitlistPopup } from '@/components/waitlist/waitlist-popup';


export function UnifiedHomePageFinal() {
  const { isAuthenticated } = useAuth();
  
  // State for controlling the waitlist popup
  const [showWaitlistPopup, setShowWaitlistPopup] = useState(true); // Set to true for immediate display
  
  useEffect(() => {
    // For testing: Show popup immediately without scroll
    // Remove localStorage check temporarily
    console.log('Waitlist popup should show immediately');
    
    // Comment out scroll logic for testing
    /*
    // Add scroll event listener
    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      
      // Show popup when user scrolls past 60% of the page
      if (scrollPercentage > 60 && !isAuthenticated) {
        setShowWaitlistPopup(true);
        // Store that user has seen the popup
        localStorage.setItem('jobmate_waitlist_popup_seen', new Date().toISOString());
        // Remove scroll listener after showing popup
        window.removeEventListener('scroll', handleScroll);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    */
  }, []);
  
  const closeWaitlistPopup = () => {
    setShowWaitlistPopup(false);
  };
  
  // Sample jobs data for the map
  const sampleJobs: Job[] = [
    {
      id: '1',
      title: 'Plumbing Repair',
      status: 'new',
      urgency: 'high',
      address: '123 Main St, San Francisco, CA',
      price: '120',
      time: '2 hours',
      customer: 'John Doe',
      lat: 37.7749,
      lng: -122.4194,
      category: 'plumbing'
    },
    {
      id: '2',
      title: 'Electrical Installation',
      status: 'in_progress',
      urgency: 'medium',
      address: '456 Market St, San Francisco, CA',
      price: '200',
      time: '3 hours',
      scheduledTime: '2023-10-15T14:00:00',
      customer: 'Jane Smith',
      lat: 37.7833,
      lng: -122.4167,
      category: 'electrical'
    },
    {
      id: '3',
      title: 'HVAC Maintenance',
      status: 'completed',
      urgency: 'low',
      address: '789 Golden Gate Ave, San Francisco, CA',
      price: '150',
      time: '1.5 hours',
      customer: 'Robert Johnson',
      lat: 37.7694,
      lng: -122.4862,
      category: 'hvac'
    },
  ];
  
  return (
    <UnifiedDashboardLayout title="JobMate - AI-Powered Job Matching" hideSidebar showMap={false} isPublicPage={true} hideDashboardButton={true}>
      {/* Waitlist Popup */}
      {showWaitlistPopup && <WaitlistPopup onClose={closeWaitlistPopup} />}
      
      {/* Floating AI Assistant is provided by UnifiedDashboardLayout */}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-12 overflow-hidden">
        
        <div className="container mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-blue-600 dark:text-blue-400">
                  AI-Powered Job Matching
                </span>
                <br />
                <span className="text-gray-900 dark:text-gray-100">
                  For The Future Of Work
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg">
                JobMate uses advanced AI to connect skilled professionals with the perfect opportunities, 
                streamlining your job search and hiring process.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                    {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800">
                  <Link href="#how-it-works">
                    See How It Works
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {/* Real people avatars */}
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" />
                  <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" />
                  <img src="https://randomuser.me/api/portraits/women/63.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" />
                  <img src="https://randomuser.me/api/portraits/men/36.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" />
                </div>
                <div className="ml-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Trusted by <span className="font-semibold text-blue-600 dark:text-blue-400">10,000+</span> professionals
                  </span>
                </div>
              </div>
            </motion.div>
            
            {/* Interactive Map on the right side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px]"
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl">
                <HomepageMap />
              </div>
              

            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Feature Highlights Section */}
      <FeatureHighlightsSection />
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* Onboarding Wizard Preview */}
      <OnboardingWizardSection />

      {/* AI Assistant Section */}
      <AIAssistantSection />
      
      {/* Comparison Section */}
      <ComparisonSection />
      
      {/* Subscription Tiers Section */}
      <SubscriptionTiersSection />
      
      {/* Marketplace Preview */}
      <MarketplaceSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <ModernFooter />
      
      {/* Waitlist Popup */}
      {showWaitlistPopup && <WaitlistPopup onClose={closeWaitlistPopup} />}
    </UnifiedDashboardLayout>
  );
}
