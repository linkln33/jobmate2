"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingWizardPreview } from '@/components/ui/onboarding-wizard-preview';
import { Button } from '@/components/ui/button';

export function OnboardingWizardSection() {
  const onboardingSteps = [
    {
      title: "Create Your Profile",
      description: "Tell us about your skills, experience, and career goals.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Professional Summary</h4>
            <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</h4>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-md w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-md w-2/3 animate-pulse"></div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience</h4>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-md w-full animate-pulse"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Set Your Preferences",
      description: "Tell us what you're looking for in your next opportunity.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Preferences</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" checked />
                <span className="text-sm">Remote Work</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" checked />
                <span className="text-sm">Full-time</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" />
                <span className="text-sm">Contract</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" />
                <span className="text-sm">Part-time</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Range</h4>
            <div className="h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative">
              <div className="absolute right-1/4 -top-1 w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-2 border-blue-500"></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
              <span>$50k</span>
              <span>$100k</span>
              <span>$150k+</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "AI Job Matching",
      description: "Our AI will find the perfect opportunities for you.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 relative z-10">AI Analysis</h4>
            <div className="flex items-center mb-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-2">
                AI
              </div>
              <div className="text-sm">Analyzing your profile and preferences...</div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-3/4 animate-pulse"></div>
            </div>
            <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400 relative z-10">75% Complete</div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Matching Jobs</h4>
            <div className="space-y-2">
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Apply",
      description: "Start applying to your matched opportunities with AI assistance.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg border-2 border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Senior Frontend Developer</h4>
              <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">98% Match</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">TechCorp Inc. • Remote • $120-150k/yr</div>
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              Apply with AI Assistance
            </Button>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Application Assistant</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Our AI will help you:
            </div>
            <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tailor your resume for this specific role
              </li>
              <li className="flex items-center">
                <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Draft a personalized cover letter
              </li>
              <li className="flex items-center">
                <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Prepare for interview questions
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="onboarding" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text from-blue-600 to-purple-600">
              Seamless Onboarding Experience
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Get started in minutes with our intuitive onboarding process and AI-guided setup.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <OnboardingWizardPreview steps={onboardingSteps} />
        </motion.div>
      </div>
    </section>
  );
}
