"use client";

import React from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { StickyNavbar } from '@/components/ui/sticky-navbar';
import { ModernFooter } from '@/components/ui/modern-footer';
// FloatingAIAssistant is provided by UnifiedDashboardLayout
import { ParticleBackground } from '@/components/ui/particle-background';
import { AIRobotFace } from '@/components/ui/ai-robot-face';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Import all sections individually
import { FeatureHighlightsSection } from '@/components/sections/feature-highlights-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { AIAssistantSection } from '@/components/sections/ai-assistant-section';
import { ComparisonSection } from '@/components/sections/comparison-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { MarketplaceSection } from '@/components/sections/marketplace-section';
import { OnboardingWizardSection } from '@/components/sections/onboarding-wizard-section';
import { CTASection } from '@/components/sections/cta-section';

export function UnifiedHomePageFinal() {
  const { isAuthenticated } = useAuth();
  
  return (
    <UnifiedDashboardLayout title="JobMate - AI-Powered Job Matching" hideSidebar showMap={false} isPublicPage={true}>
      
      {/* Floating AI Assistant is provided by UnifiedDashboardLayout */}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Particle Background */}
        <div className="absolute inset-0 z-0">
          <ParticleBackground color="rgba(79, 70, 229, 0.4)" density="medium" speed="slow" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text from-blue-600 to-purple-600">
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
                <Button size="lg" className="glow-button bg-gradient-to-r from-blue-600 to-purple-600">
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
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                
                <div className="flex justify-center mb-6">
                  <AIRobotFace size="lg" variant="glow" />
                </div>
                
                <h3 className="text-2xl font-semibold text-center mb-4">
                  Meet Your AI Career Assistant
                </h3>
                
                <div className="space-y-4">
                  <div className="glass-card bg-blue-500/5 p-3 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      "I can analyze your skills and experience to find the perfect job matches."
                    </p>
                  </div>
                  
                  <div className="glass-card bg-purple-500/5 p-3 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      "Let me optimize your resume to highlight your strengths for each application."
                    </p>
                  </div>
                  
                  <div className="glass-card bg-blue-500/5 p-3 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      "I'll prepare you for interviews with personalized coaching and industry insights."
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" className="border-blue-500 text-blue-600 dark:text-blue-400">
                    Try AI Assistant Now
                  </Button>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
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
      
      {/* Marketplace Preview */}
      <MarketplaceSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <ModernFooter />
    </UnifiedDashboardLayout>
  );
}
