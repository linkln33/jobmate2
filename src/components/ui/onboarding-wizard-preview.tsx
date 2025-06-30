"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

/**
 * Represents a single step in the onboarding wizard.
 * 
 * @interface OnboardingStep
 * @property {string} title - The title of the onboarding step
 * @property {string} description - A brief description of what this step accomplishes
 * @property {string} [image] - Optional URL to an image associated with this step
 * @property {React.ReactNode} content - The main content to be displayed for this step
 */
interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  content: React.ReactNode;
}

/**
 * Props for the OnboardingWizardPreview component.
 * 
 * @interface OnboardingWizardPreviewProps
 * @property {OnboardingStep[]} steps - Array of onboarding steps to display in the preview
 * @property {string} [className] - Optional additional CSS classes to apply to the component
 */
interface OnboardingWizardPreviewProps {
  steps: OnboardingStep[];
  className?: string;
}

/**
 * OnboardingWizardPreview Component
 * 
 * An interactive preview component that simulates the onboarding experience.
 * This component displays a series of onboarding steps with animated transitions
 * between them, allowing users to navigate forward and backward through the steps.
 * 
 * Features:
 * - Animated transitions between steps using Framer Motion
 * - Progress indicators showing current step and completion status
 * - Navigation controls (back/next/finish buttons)
 * - Responsive design with glassmorphism styling
 * 
 * @param {OnboardingWizardPreviewProps} props - Component props
 * @returns {JSX.Element} An interactive onboarding wizard preview component
 * 
 * @example
 * ```tsx
 * import { OnboardingWizardPreview } from '@/components/ui/onboarding-wizard-preview';
 * import { onboardingSteps } from '@/data/onboarding-steps';
 * 
 * function OnboardingDemo() {
 *   return (
 *     <div className="container mx-auto p-4">
 *       <h2>Try Our Onboarding</h2>
 *       <OnboardingWizardPreview steps={onboardingSteps} />
 *     </div>
 *   );
 * }
 * ```
 */
export function OnboardingWizardPreview({ steps, className = '' }: OnboardingWizardPreviewProps) {
  /**
   * State to track the current step index in the onboarding process
   */
  const [currentStep, setCurrentStep] = useState(0);
  
  /**
   * State to track the direction of navigation (1 for forward, -1 for backward)
   * Used for determining the animation direction
   */
  const [direction, setDirection] = useState(0);

  /**
   * Advances to the next step in the onboarding process
   * Sets the direction to 1 (forward) for the animation
   */
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Returns to the previous step in the onboarding process
   * Sets the direction to -1 (backward) for the animation
   */
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Animation variants for the step transitions
   * - enter: Initial animation state when a step enters the view
   * - center: The visible/active animation state
   * - exit: Animation state when a step leaves the view
   * 
   * The direction parameter determines whether the animation slides from left or right
   */
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0
    })
  };

  return (
    <div className={cn('glass-card rounded-xl overflow-hidden', className)}>
      {/* Header with progress indicators */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-lg">Onboarding Preview</h3>
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentStep 
                  ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500' 
                  : index < currentStep 
                    ? 'w-2 bg-blue-500' 
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
              )}
              onClick={() => setCurrentStep(index)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="p-6 relative overflow-hidden" style={{ minHeight: '450px' }}>
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute inset-0 p-6 overflow-y-auto hide-scrollbar"
          >
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-2 gradient-text">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {steps[currentStep].description}
              </p>
              
              <div className="flex-grow">
                {steps[currentStep].content}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer with navigation */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </div>

        <Button
          size="sm"
          onClick={goToNextStep}
          disabled={currentStep === steps.length - 1}
          className={currentStep === steps.length - 1 ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          {currentStep === steps.length - 1 ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
