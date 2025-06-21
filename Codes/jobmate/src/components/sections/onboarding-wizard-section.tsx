"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingWizardPreview } from '@/components/ui/onboarding-wizard-preview';
import { Button } from '@/components/ui/button';
import { Lock as LockIcon } from 'lucide-react';

export function OnboardingWizardSection() {
  const onboardingSteps = [
    {
      title: "Create Your Dual-Role Profile",
      description: "Build a comprehensive profile that lets you operate as both a service provider and a customer in our hybrid marketplace.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg bg-gradient-to-r from-transparent to-blue-50 dark:from-transparent dark:to-blue-900/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Unified Profile System</h4>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300">Unique to JobMate</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Unlike other platforms that force you to create separate accounts, JobMate's unified profile system allows you to:
            </p>
            <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400 mb-3">
              <li className="flex items-center">
                <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Switch between provider and client modes instantly
              </li>
              <li className="flex items-center">
                <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Maintain a single reputation score across all activities
              </li>
              <li className="flex items-center">
                <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Use earnings from services to pay for services you need
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs mr-2">P</div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Provider Mode</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-xs">Web Development</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  <span className="text-xs">UI/UX Design</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                  <span className="text-xs">Mobile App Development</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-red-500 flex items-center justify-center text-white text-xs mr-2">C</div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Mode</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                  <span className="text-xs">Marketing Services</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-xs">Content Creation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Configure AI Matching Engine",
      description: "Fine-tune our proprietary AI to find your ideal matches based on 50+ data points and marketplace patterns.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg bg-gradient-to-r from-transparent to-purple-50 dark:from-transparent dark:to-purple-900/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">MarketMind™ AI Configuration</h4>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full dark:bg-purple-900/30 dark:text-purple-300">Advanced AI</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              JobMate's AI analyzes these key data points to create your perfect marketplace experience:
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-xs">
                <span className="font-medium block">Skill Analysis</span>
                <span className="text-gray-600 dark:text-gray-400">Matches based on verified skill compatibility</span>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-xs">
                <span className="font-medium block">Success Patterns</span>
                <span className="text-gray-600 dark:text-gray-400">Learns from your successful transactions</span>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-xs">
                <span className="font-medium block">Communication Style</span>
                <span className="text-gray-600 dark:text-gray-400">Matches based on communication preferences</span>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-xs">
                <span className="font-medium block">Market Demand</span>
                <span className="text-gray-600 dark:text-gray-400">Prioritizes high-demand opportunities</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dual-Role Preferences</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-purple-500" checked />
                <span className="text-sm">Service Provider</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-purple-500" checked />
                <span className="text-sm">Customer</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-purple-500" checked />
                <span className="text-sm">Remote Services</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-purple-500" checked />
                <span className="text-sm">Local Services</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Dynamic Pricing Engine</h4>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-300">Market-Optimized</span>
            </div>
            <div className="h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative">
              <div className="absolute right-1/4 -top-1 w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-2 border-purple-500 shadow-lg"></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
              <span>$50</span>
              <span>$500</span>
              <span>$5000+</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">AI suggests optimal pricing based on your skills and current market rates</p>
          </div>
        </div>
      )
    },
    {
      title: "Intelligent Marketplace Navigation",
      description: "Explore our AI-guided marketplace that adapts to your behavior and preferences for maximum efficiency.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg bg-gradient-to-r from-transparent to-green-50 dark:from-transparent dark:to-green-900/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Unified Marketplace Hub</h4>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-300">Cross-Category</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Unlike traditional platforms that separate different service types, JobMate's unified marketplace lets you:
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20"></div>
                <span className="text-xs font-medium relative z-10">Professional Services</span>
                <div className="text-[10px] mt-1 text-blue-700 dark:text-blue-300 relative z-10">Web Dev, Design, Marketing</div>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/20"></div>
                <span className="text-xs font-medium relative z-10">Quick Gigs</span>
                <div className="text-[10px] mt-1 text-purple-700 dark:text-purple-300 relative z-10">Delivery, Tasks, Assistance</div>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/20"></div>
                <span className="text-xs font-medium relative z-10">Asset Rentals</span>
                <div className="text-[10px] mt-1 text-amber-700 dark:text-amber-300 relative z-10">Equipment, Spaces, Tools</div>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 p-2 rounded text-xs">
              <div className="flex items-center mb-1">
                <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Unified Billing System</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 pl-4">Bundle services across categories with a single payment</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered Recommendations</h4>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">Personalized</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs mr-2">JS</div>
                <div>
                  <div className="text-xs font-medium">John Smith - Web Developer</div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 flex items-center">
                    <span className="flex items-center mr-2">
                      <svg className="h-2 w-2 text-yellow-500 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      4.9
                    </span>
                    <span>98% Match to Your Needs</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-xs mr-2">AK</div>
                <div>
                  <div className="text-xs font-medium">Anna Kim - UX Designer</div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 flex items-center">
                    <span className="flex items-center mr-2">
                      <svg className="h-2 w-2 text-yellow-500 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      4.8
                    </span>
                    <span>95% Match to Your Needs</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
              MarketMind™ AI continuously learns from your interactions to improve matches
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Blockchain-Secured Transactions",
      description: "Experience our multi-stage smart contracts with cryptographic verification and automated milestone releases.",
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-lg bg-gradient-to-r from-transparent to-amber-50 dark:from-transparent dark:to-amber-900/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Advanced Smart Contract System</h4>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full dark:bg-amber-900/30 dark:text-amber-300">Blockchain-Powered</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              JobMate's revolutionary transaction system provides security features not available on other platforms:
            </p>
            <div className="bg-white/70 dark:bg-gray-800/70 p-2 rounded-md mb-3">
              <div className="flex items-center mb-1">
                <svg className="h-3 w-3 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs font-medium">Multi-Stage Verification</span>
              </div>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 pl-4">Each transaction phase is independently verified and recorded on the blockchain</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Smart Contract Milestone System</h4>
            <div className="relative pb-6">
              <div className="absolute top-4 left-3 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600"></div>
              <div className="relative space-y-4">
                <div className="flex">
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center z-10 mr-3">
                    1
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 flex-1">
                    <h5 className="text-xs font-medium">Contract Initiation</h5>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">Terms defined, cryptographically signed by both parties</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center z-10 mr-3">
                    2
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded p-2 flex-1">
                    <h5 className="text-xs font-medium">Secure Escrow Deposit</h5>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">Funds secured in multi-signature blockchain wallet</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-7 h-7 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center z-10 mr-3">
                    3
                  </div>
                  <div className="bg-violet-50 dark:bg-violet-900/20 rounded p-2 flex-1">
                    <h5 className="text-xs font-medium">Milestone Verification</h5>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">AI-assisted verification of deliverables at each milestone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Dispute Resolution System</h4>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-300">Automated</span>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-amber-50 dark:from-gray-800 dark:to-amber-900/10 rounded-md">
              <div className="w-10 h-10 mr-3 text-amber-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h5 className="text-xs font-medium">AI-Powered Dispute Resolution</h5>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Our AI analyzes contract terms, communication history, and delivered work to automatically resolve disputes with 94% satisfaction rate</p>
              </div>
            </div>
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
              The Ultimate Marketplace Experience
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            JobMate's revolutionary platform enables you to be both provider and customer simultaneously. Create services, hire professionals, manage projects, and handle secure payments — all within one seamless ecosystem.
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
