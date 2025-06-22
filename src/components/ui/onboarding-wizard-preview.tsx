"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  content: React.ReactNode;
}

interface OnboardingWizardPreviewProps {
  steps: OnboardingStep[];
  className?: string;
}

export function OnboardingWizardPreview({ steps, className = '' }: OnboardingWizardPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

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
                  ? 'w-8 bg-blue-500' 
                  : index < currentStep 
                    ? 'w-2 bg-blue-500' 
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
              )}
            />
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="p-6 relative overflow-hidden" style={{ minHeight: '300px' }}>
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute inset-0 p-6"
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
