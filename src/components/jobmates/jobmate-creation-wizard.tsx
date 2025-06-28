"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { jobMateService } from "@/services/jobMateService";
import { JobMateFormData, JobMate } from "@/types/jobmate";
import { MainCategory, UserPreferences } from "@/types/compatibility";

// Import step components
import { JobMatePreferencesJobStep } from "./steps/jobmate-preferences-job-step";
import { JobMatePreferencesRentalStep } from "./steps/jobmate-preferences-rental-step";
import { JobMatePreferencesServiceStep } from "./steps/jobmate-preferences-service-step";
import { JobMateWeightsStep } from "./steps/jobmate-weights-step";
import { JobMatePersonalizeStep } from "./steps/jobmate-personalize-step";
import { JobMatePreviewStep } from "./steps/jobmate-preview-step";

// Wizard steps
const STEPS = [
  { id: "intent", title: "Daily Intent" },
  { id: "category", title: "Category Focus" },
  { id: "preferences", title: "Detailed Preferences" },
  { id: "weights", title: "Match Weights" },
  { id: "name", title: "Name Your JobMate" },
  { id: "preview", title: "Preview & Create" },
];

interface JobMateCreationWizardProps {
  onClose?: () => void;
  onSuccess?: (jobMate: JobMate) => void;
  userId: string;
}

export function JobMateCreationWizard({ 
  onClose, 
  onSuccess,
  userId 
}: JobMateCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<JobMateFormData>({
    name: "My JobMate",
    emoji: "🔍",
    description: "Helping me find the best matches",
    categoryFocus: "jobs" as MainCategory,
    intent: "browse",
    preferences: {
      categoryPreferences: {
        jobs: {
          desiredSkills: [],
          minSalary: 0,
          maxSalary: 150000,
          workArrangement: "hybrid",
          experienceLevel: "mid-level",
          companySize: "medium",
          industries: [],
          benefits: [],
          workSchedule: "full-time",
          remotePreference: true
        },
        rentals: {
          rentalTypes: ["apartments"],
          minPrice: 0,
          maxPrice: 3000,
          location: "",
          bedrooms: 1,
          bathrooms: 1,
          requiredAmenities: []
        },
        services: {
          serviceTypes: ["development"],
          minPrice: 0,
          maxPrice: 1000,
          minProviderRating: 4,
          responseTime: "24h",
          availability: []
        }
      },
      weights: {
        salary: 5,
        skills: 4,
        location: 3,
        benefits: 2,
        companySize: 1,
        industry: 3
      }
    },
    settings: {
      autoRun: false,
      runFrequency: "daily",
      notifications: true,
      isPublic: false,
      isCollaborative: false
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();
  
  // Navigation functions
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onClose) {
      onClose();
    }
  };
  
  // Update functions for each step
  const updateIntent = (intent: JobMateFormData['intent']) => {
    setFormData(prev => ({
      ...prev,
      intent
    }));
    nextStep();
  };
  
  const updateCategory = (categoryFocus: MainCategory) => {
    setFormData(prev => ({
      ...prev,
      categoryFocus
    }));
    nextStep();
  };
  
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...newPreferences
      }
    }));
    nextStep();
  };
  
  // Helper function to update weights
  const updateWeights = (weights: {[key: string]: number}) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        weights: {
          ...(prev.preferences?.weights || {}),
          ...weights
        }
      }
    }));
    nextStep();
  };
  
  const updateNameAndDetails = (name: string, emoji: string, description: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      emoji,
      description
    }));
    nextStep();
  };
  
  // Final submit function
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const createdJobMate = await jobMateService.createJobMate(formData, userId);
      
      toast({
        title: "JobMate Created!",
        description: `${createdJobMate.name} is now searching for matches.`,
      });
      
      if (onSuccess) {
        onSuccess(createdJobMate);
      } else {
        router.push(`/dashboard/jobmates/${createdJobMate.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create JobMate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render current step
  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case "intent":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">What are you hoping to find today?</h2>
            <p className="text-center text-muted-foreground">
              This helps your JobMate understand your immediate goals
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { value: "earn", label: "Earn some money", icon: "💰" },
                { value: "hire", label: "Hire someone", icon: "🧑‍💼" },
                { value: "sell", label: "Sell something", icon: "🏷️" },
                { value: "rent", label: "Rent something", icon: "🏠" },
                { value: "help", label: "Find help / favor", icon: "🙋" },
                { value: "learn", label: "Explore or learn", icon: "🔍" },
                { value: "browse", label: "Just browsing", icon: "👀" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => updateIntent(option.value as any)}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
        );
        
      case "category":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">What category should this JobMate focus on?</h2>
            <p className="text-center text-muted-foreground">
              Choose the primary category for your JobMate to search
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { value: "jobs", label: "Jobs", icon: "💼" },
                { value: "services", label: "Services", icon: "🛠️" },
                { value: "rentals", label: "Rentals", icon: "🏠" },
                { value: "marketplace", label: "Marketplace", icon: "🛒" },
                { value: "favors", label: "Favors", icon: "🤝" },
                { value: "learning", label: "Learning", icon: "📚" },
                { value: "community", label: "Community", icon: "👥" },
                { value: "events", label: "Events", icon: "🎉" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => updateCategory(option.value as MainCategory)}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
        );
      
      case "preferences":
        // Render different preference forms based on category
        switch (formData.categoryFocus) {
          case "jobs":
            return (
              <JobMatePreferencesJobStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                // Don't pass onBack here as we handle it in the footer
              />
            );
          case "rentals":
            return (
              <JobMatePreferencesRentalStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                // Don't pass onBack here as we handle it in the footer
              />
            );
          case "services":
            return (
              <JobMatePreferencesServiceStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                // Don't pass onBack here as we handle it in the footer
              />
            );
          default:
            return (
              <div className="text-center py-12">
                <p>Preferences for {formData.categoryFocus} are not yet implemented</p>
                <Button onClick={nextStep} className="mt-4">Continue</Button>
              </div>
            );
        }
        
      case "weights":
        return (
          <JobMateWeightsStep
            formData={formData}
            onUpdate={(updatedFormData) => {
              // Extract just the weights from the updated form data
              const weights = updatedFormData.preferences?.weights || {};
              // Use updateWeights which will also call nextStep()
              updateWeights(weights);
            }}
            onBack={prevStep}
          />
        );
        
      case "name":
        return (
          <JobMatePersonalizeStep
            formData={formData}
            onUpdate={setFormData}
            onBack={prevStep}
          />
        );
        
      case "preview":
        return (
          <JobMatePreviewStep
            formData={formData}
            onUpdate={setFormData}
            onBack={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto bg-opacity-70 backdrop-blur-md bg-gradient-to-br from-white/60 to-white/30 border border-white/20 shadow-xl">
      <CardHeader className="border-b border-white/10">
        {/* Step indicators */}
        <div className="flex justify-between">
          {STEPS.map((step, index) => (
            <div 
              key={step.id}
              className={`flex flex-col items-center ${
                index === currentStep 
                  ? "text-primary" 
                  : index < currentStep 
                    ? "text-green-500" 
                    : "text-gray-400"
              }`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index === currentStep 
                    ? "bg-primary/80 text-primary-foreground backdrop-blur-sm shadow-lg ring-2 ring-primary/30" 
                    : index < currentStep 
                      ? "bg-green-500/80 text-white backdrop-blur-sm" 
                      : "bg-gray-200/60 text-gray-500 backdrop-blur-sm"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs mt-1 hidden sm:block font-medium">{step.title}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 bg-white/5 backdrop-blur-sm">
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-md shadow-inner">
          {renderStep()}
        </div>
      </CardContent>
      
      {/* Footer removed - each step handles its own navigation */}
    </Card>
  );
}
