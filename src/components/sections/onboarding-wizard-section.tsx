"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingWizardPreview } from '@/components/ui/onboarding-wizard-preview';
import { Button } from '@/components/ui/button';
import { Lock as LockIcon } from 'lucide-react';
import { onboardingSteps } from '@/data/onboarding-steps';

/**
 * OnboardingWizardSection Component
 * 
 * A marketing section that showcases the JobMate onboarding process with an interactive preview.
 * This section includes a step-by-step explanation of how the onboarding works alongside
 * an animated preview of the actual onboarding wizard interface.
 * 
 * Features:
 * - Animated elements using Framer Motion for enhanced visual appeal
 * - Step-by-step explanation of the onboarding process
 * - Interactive preview of the onboarding wizard
 * - Call-to-action button to start the onboarding process
 * - Visual timeline with numbered steps
 * 
 * The component uses the onboarding steps data from `@/data/onboarding-steps` to populate
 * the preview component with realistic content.
 * 
 * @returns {JSX.Element} A section component showcasing the onboarding process
 * 
 * @example
 * ```tsx
 * // In a page component
 * import { OnboardingWizardSection } from '@/components/sections/onboarding-wizard-section';
 * 
 * export default function HomePage() {
 *   return (
 *     <main>
 *       <OnboardingWizardSection />
 *     </main>
 *   );
 * }
 * ```
 */
export function OnboardingWizardSection() {
  return (
    <section id="onboarding" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Simple Onboarding, Powerful Results
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Get started in minutes with our streamlined onboarding process that gathers the information our AI needs to find your perfect matches.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold mb-6">How It Works</h3>
            <div className="relative">
              <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              <div className="space-y-12">
                <div className="flex items-start relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-4 shrink-0 shadow-lg z-10">1</div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Create Your Unified Profile</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Build a comprehensive profile with your skills, interests, and preferences to access all marketplace features with a single account.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-4 shrink-0 shadow-lg z-10">2</div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Configure AI Matching Engine</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Fine-tune our MarketMind™ AI to find your ideal matches based on your preferences, skills, and marketplace patterns.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-4 shrink-0 shadow-lg z-10">3</div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Explore the Intelligent Marketplace</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Navigate our AI-guided marketplace that adapts to your behavior and preferences for maximum efficiency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none">
                Start Free Onboarding
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <OnboardingWizardPreview steps={onboardingSteps} />
            
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
              <LockIcon className="h-4 w-4 text-green-500" />
              <span>Secure Onboarding</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl -z-10"></div>
    </section>
  );
}
