import React from 'react';

/**
 * Represents a single step in the onboarding process.
 * 
 * This interface defines the structure for onboarding steps used throughout
 * the application, particularly in the onboarding wizard components.
 * 
 * @interface OnboardingStep
 * @property {string} title - The title of the onboarding step
 * @property {string} description - A brief description of what this step accomplishes
 * @property {React.ReactNode} content - The main content to be displayed for this step, typically a JSX element
 */
export interface OnboardingStep {
  title: string;
  description: string;
  content: React.ReactNode;
}

/**
 * Collection of onboarding steps that guide users through the JobMate platform setup process.
 * 
 * These steps are used by the OnboardingWizardPreview component and other onboarding-related
 * components to display a consistent, step-by-step introduction to the platform's features.
 * 
 * Each step includes:
 * 1. A title and description
 * 2. Rich content with visual elements
 * 3. Explanations of key features and benefits
 * 
 * The onboarding process covers:
 * - Profile creation
 * - AI matching engine configuration
 * - Marketplace exploration
 * - Communication setup
 * 
 * @type {OnboardingStep[]}
 */
export const onboardingSteps: OnboardingStep[] = [
  {
    title: "Create Your Profile",
    description: "Build a comprehensive profile that lets you seamlessly access all features in one integrated experience.",
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
              Access all marketplace features with a single profile
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
              Seamlessly transition between different marketplace roles
            </li>
          </ul>
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Complete Your Profile</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs mr-3">1</div>
              <div className="flex-1">
                <h5 className="text-sm font-medium">Personal Information</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Name, location, contact details, and profile photo</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs mr-3">2</div>
              <div className="flex-1">
                <h5 className="text-sm font-medium">Skills & Expertise</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Professional skills, experience level, and portfolio</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs mr-3">3</div>
              <div className="flex-1">
                <h5 className="text-sm font-medium">Interests & Goals</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">What you're looking for and hoping to achieve</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Configure AI Matching Engine",
    description: "Tell us about your skills and goals so our AI can find the exact people and opportunities you're looking for.",
    content: (
      <div className="space-y-4">
        <div className="glass-card p-4 rounded-lg bg-gradient-to-r from-transparent to-purple-50 dark:from-transparent dark:to-purple-900/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">MarketMind™ AI Configuration</h4>
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full dark:bg-purple-900/30 dark:text-purple-300">Advanced AI</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            JobMate's AI matches you across all our marketplace categories based on your profile:
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-xs">
              <span className="font-medium block">Jobs</span>
              <span className="text-gray-600 dark:text-gray-400">Find work opportunities that match your skills and career goals</span>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-xs">
              <span className="font-medium block">Services</span>
              <span className="text-gray-600 dark:text-gray-400">Connect with service providers or offer your expertise</span>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-xs">
              <span className="font-medium block">Items</span>
              <span className="text-gray-600 dark:text-gray-400">Discover products that match your interests and needs</span>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-xs">
              <span className="font-medium block">Rentals</span>
              <span className="text-gray-600 dark:text-gray-400">Find or list equipment, spaces, and other rentable assets</span>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Interests</h4>
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">Select what you're interested in:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-purple-500" checked />
                <span className="text-sm">Finding Jobs</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-purple-500" checked />
                <span className="text-sm">Offering Services</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-purple-500" />
                <span className="text-sm">Buying/Selling Items</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 accent-purple-500" />
                <span className="text-sm">Renting Assets</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pricing Preferences</h4>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-300">Market-Optimized</span>
          </div>
          <div className="h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative">
            <div className="absolute transform -translate-y-1/2 top-1/2 right-1/4 w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-2 border-purple-500 shadow-sm"></div>
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
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Subscription Tiers</h4>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">Choose Your Plan</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center bg-white/50 dark:bg-gray-800/50 p-2 rounded">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs mr-2">F</div>
              <div>
                <div className="text-xs font-medium">Free Tier</div>
                <div className="text-[10px] text-gray-600 dark:text-gray-400">Basic AI matching, limited connections</div>
              </div>
            </div>
            <div className="flex items-center bg-white/50 dark:bg-gray-800/50 p-2 rounded">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs mr-2">P</div>
              <div>
                <div className="text-xs font-medium">Premium Tier</div>
                <div className="text-[10px] text-gray-600 dark:text-gray-400">Advanced matching, JobMates agents, priority support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];
