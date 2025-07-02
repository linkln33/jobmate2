"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Target, Sparkles, Trophy } from 'lucide-react';

/**
 * Step interface for the How It Works section
 * 
 * @interface Step
 * @property {JSX.Element} icon - Icon component to display for this step
 * @property {string} title - Title of the step
 * @property {string} description - Brief description of what happens in this step
 * @property {string} gradient - Tailwind CSS gradient classes for the step's background
 * @property {string} number - Step number displayed in the UI
 */
interface Step {
  icon: JSX.Element;
  title: string;
  description: string;
  gradient: string;
  number: string;
}

/**
 * HowItWorksSection Component
 * 
 * A visually engaging section that explains the JobMate platform's workflow in four steps.
 * Each step is represented by an animated card with an icon, title, and description.
 * The steps are connected by a gradient line to show progression through the process.
 * 
 * Features:
 * - Animated elements using Framer Motion for enhanced visual appeal
 * - Responsive design that adapts to different screen sizes
 * - Interactive hover effects on step cards
 * - Decorative glassmorphism background elements
 * - Gradient text and connecting line for visual interest
 * - Call-to-action button at the end of the section
 * 
 * The section uses a four-step process to explain the platform:
 * 1. Register - Creating a unified profile
 * 2. Set Goals - Defining what the user is looking for
 * 3. Let AI Work - AI-powered matching system
 * 4. Success - Achieving goals through the platform
 * 
 * @returns {JSX.Element} A section component explaining how the platform works
 * 
 * @example
 * ```tsx
 * // In a page component
 * import { HowItWorksSection } from '@/components/sections/how-it-works-section';
 * 
 * export default function HomePage() {
 *   return (
 *     <main>
 *       <HowItWorksSection />
 *     </main>
 *   );
 * }
 * ```
 */
export function HowItWorksSection() {
  /**
   * Array of steps that explain the platform workflow
   * Each step has an icon, title, description, gradient color scheme, and step number
   */
  const steps = [
    {
      icon: <UserPlus className="h-10 w-10 text-white" />,
      title: "Register",
      description: "Create your unified profile in seconds and join our marketplace community.",
      gradient: "from-blue-500 to-cyan-500",
      number: "1"
    },
    {
      icon: <Target className="h-10 w-10 text-white" />,
      title: "Set Goals",
      description: "Tell us what you're looking for - jobs, services, items, or rentals.",
      gradient: "from-purple-500 to-indigo-500",
      number: "2"
    },
    {
      icon: <Sparkles className="h-10 w-10 text-white" />,
      title: "Let AI Work",
      description: "Our intelligent matching system connects you with the perfect opportunities.",
      gradient: "from-amber-500 to-orange-500",
      number: "3"
    },
    {
      icon: <Trophy className="h-10 w-10 text-white" />,
      title: "Success",
      description: "Achieve your goals with our secure, seamless marketplace platform.",
      gradient: "from-green-500 to-emerald-500",
      number: "4"
    }
  ];

  return (
    <section className="py-10 relative overflow-hidden">
      {/* Glassmorphism background elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-green-500/10 rounded-full filter blur-2xl -z-10"></div>
      
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            JobMate's AI-powered marketplace connects people across jobs, services, items, and rentals in four simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 relative pt-14 lg:pt-16">  {/* Added top padding to move everything down */}
          {/* Connecting line for desktop - positioned higher to be more visible */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 z-0 opacity-80"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative z-10"
            >
              <div className="flex flex-col items-center">
                {/* Step circle with gradient background - positioned to overlap with the line */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${step.gradient} mb-8 shadow-lg hover:scale-110 transition-transform duration-300 relative z-20 border-4 border-white dark:border-gray-800`}>
                  <span className="absolute inset-1 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    {step.icon}
                  </span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center font-bold text-lg border-2 border-blue-500">
                    {step.number}
                  </div>
                </div>
                
                {/* Step content - fixed height to ensure all boxes are the same size */}
                <div className="text-center backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-6 rounded-xl border border-white/30 dark:border-gray-700/30 shadow-xl w-full transition-all duration-300 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-gray-800/50 hover:-translate-y-1 group h-[180px] flex flex-col justify-between">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Call to action button */}
        <div className="mt-12 text-center">
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Get Started Now
          </motion.button>
        </div>
      </div>
    </section>
  );
}
