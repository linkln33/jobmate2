"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingWizardPreview } from '@/components/ui/onboarding-wizard-preview';
import { Button } from '@/components/ui/button';

export function OnboardingWizardSection() {
  const onboardingSteps = [
    {
      title: "Create Your Profile",
      description: "Tell us about your skills, services you offer, and what you're looking to hire.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">About You</h4>
            <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Services You Offer</h4>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-md w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-md w-2/3 animate-pulse"></div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Services You Need</h4>
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
      description: "Tell us how you prefer to work and collaborate in the marketplace.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marketplace Preferences</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" checked />
                <span className="text-sm">Service Provider</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" checked />
                <span className="text-sm">Customer</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" checked />
                <span className="text-sm">Remote Services</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" checked />
                <span className="text-sm">Local Services</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</h4>
            <div className="h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative">
              <div className="absolute right-1/4 -top-1 w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-2 border-blue-500"></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
              <span>$50</span>
              <span>$500</span>
              <span>$5000+</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Connect & Collaborate",
      description: "Use our tools to create proposals, negotiate terms, and secure transactions.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marketplace Matches</h4>
            <div className="space-y-2">
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg border-2 border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Senior Frontend Developer</h4>
              <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">98% Match</span>
            </div>
            <h5 className="font-medium mb-1">Website Redesign Project</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400">DigitalBrand Co. • Remote • $2,500-3,500</p>
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              Apply with AI Assistance
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Secure Transactions",
      description: "Use smart contracts and escrow to ensure secure and fair transactions.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg border-2 border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Senior Frontend Developer</h4>
              <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">98% Match</span>
            </div>
            <h5 className="font-medium mb-1">Website Redesign Project</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400">DigitalBrand Co. • Remote • $2,500-3,500</p>
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              Apply with AI Assistance
            </Button>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Smart Contract & Escrow</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Our secure system will:
            </div>
            <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Hold funds securely until work is completed
              </li>
              <li className="flex items-center">
                <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Release payments based on milestones
              </li>
              <li className="flex items-center">
                <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Provide dispute resolution if needed
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
              Seamless Marketplace Experience
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Get started in minutes with our intuitive process for both service providers and customers.
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
