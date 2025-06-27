"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle,
  Save
} from "lucide-react";
import { ListingTypeStep } from "@/components/marketplace/create-listing/steps/listing-type-step";
import { ListingDetailsStep } from "@/components/marketplace/create-listing/steps/listing-details-step";
import { ListingPricingStep } from "@/components/marketplace/create-listing/steps/listing-pricing-step";
import { ListingLocationStep } from "@/components/marketplace/create-listing/steps/listing-location-step";
import { ListingMediaStep } from "@/components/marketplace/create-listing/steps/listing-media-step";
import { ListingPreviewStep } from "@/components/marketplace/create-listing/steps/listing-preview-step";
import { useToast } from "@/components/ui/use-toast";
import { MarketplaceListing } from "@/types/marketplace";

const STEPS = [
  { id: "type", title: "Listing Type" },
  { id: "details", title: "Details" },
  { id: "pricing", title: "Pricing" },
  { id: "location", title: "Location" },
  { id: "media", title: "Photos & Media" },
  { id: "preview", title: "Preview & Submit" },
];

// Initial empty listing data
const initialListingData: Partial<MarketplaceListing> = {
  title: "",
  description: "",
  price: 0,
  priceUnit: "",
  imageUrl: "",
  tags: [],
  type: "item",
  category: "",
  pricingType: "fixed",
  address: "",
  lat: undefined,
  lng: undefined,
  status: "pending",
  user: {
    name: "Current User",
    avatar: "/avatars/user-01.png"
  }
};

export function ListingCreationWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [listingData, setListingData] = useState<Partial<MarketplaceListing>>(initialListingData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update listing data
  const updateListingData = (data: Partial<MarketplaceListing>) => {
    setListingData(prev => ({ ...prev, ...data }));
    
    // Clear any errors for fields that have been updated
    const updatedErrors = { ...errors };
    Object.keys(data).forEach(key => {
      if (updatedErrors[key]) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const currentStepId = STEPS[currentStep].id;
    const newErrors: Record<string, string> = {};
    
    switch (currentStepId) {
      case "type":
        if (!listingData.type) {
          newErrors.type = "Please select a listing type";
        }
        if (!listingData.category) {
          newErrors.category = "Please select a category";
        }
        break;
        
      case "details":
        if (!listingData.title || listingData.title.trim().length < 5) {
          newErrors.title = "Title must be at least 5 characters";
        }
        if (!listingData.description || listingData.description.trim().length < 20) {
          newErrors.description = "Description must be at least 20 characters";
        }
        if (!listingData.tags || listingData.tags.length === 0) {
          newErrors.tags = "Please add at least one tag";
        }
        break;
        
      case "pricing":
        if (listingData.price === undefined || listingData.price <= 0) {
          newErrors.price = "Please enter a valid price";
        }
        if (!listingData.pricingType) {
          newErrors.pricingType = "Please select a pricing type";
        }
        if (listingData.pricingType === "hourly" && !listingData.priceUnit) {
          newErrors.priceUnit = "Please specify the price unit";
        }
        break;
        
      case "location":
        if (!listingData.address) {
          newErrors.address = "Please enter an address";
        }
        if (listingData.lat === undefined || listingData.lng === undefined) {
          newErrors.location = "Please select a location on the map";
        }
        break;
        
      case "media":
        if (!listingData.imageUrl) {
          newErrors.imageUrl = "Please upload at least one image";
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (validateCurrentStep()) {
      setIsSubmitting(true);
      
      try {
        // In a real app, this would be an API call to create the listing
        // For demo purposes, we'll just simulate a successful creation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Listing Created",
          description: "Your listing has been created successfully and is pending review.",
          duration: 5000,
        });
        
        // Redirect to marketplace
        router.push("/marketplace");
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error creating your listing. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Render step content
  const renderStepContent = () => {
    const currentStepId = STEPS[currentStep].id;
    
    switch (currentStepId) {
      case "type":
        return (
          <ListingTypeStep 
            data={listingData} 
            updateData={updateListingData} 
            errors={errors} 
          />
        );
        
      case "details":
        return (
          <ListingDetailsStep 
            data={listingData} 
            updateData={updateListingData} 
            errors={errors} 
          />
        );
        
      case "pricing":
        return (
          <ListingPricingStep 
            data={listingData} 
            updateData={updateListingData} 
            errors={errors} 
          />
        );
        
      case "location":
        return (
          <ListingLocationStep 
            data={listingData} 
            updateData={updateListingData} 
            errors={errors} 
          />
        );
        
      case "media":
        return (
          <ListingMediaStep 
            data={listingData} 
            updateData={updateListingData} 
            errors={errors} 
          />
        );
        
      case "preview":
        return (
          <ListingPreviewStep 
            data={listingData} 
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="border border-white/20 shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl overflow-hidden">
        <div className="p-8 pb-4 border-b border-white/10">
          <h1 className="text-2xl font-bold mb-2">Create New Listing</h1>
          <p className="text-muted-foreground">
            Complete all steps to create your marketplace listing
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="px-8 py-8 relative">
          {/* Container with fixed height to ensure proper spacing */}
          <div className="relative h-24">
            {/* Connecting line that runs through all steps - positioned at center of circles */}
            <div className="absolute top-5 left-[2%] right-[2%] h-0.5 bg-muted-foreground/30" />
            
            {/* Completed line segments - rendered separately for better z-index control */}
            {STEPS.map((step, index) => {
              if (index === 0 || currentStep < index) return null;
              
              const totalSteps = STEPS.length - 1;
              const paddingPercent = 4; // 2% on each side
              const availableSpace = 100 - (paddingPercent * 2);
              const segmentWidth = availableSpace / totalSteps;
              const startPosition = paddingPercent + ((index - 1) * segmentWidth);
              
              return (
                <div 
                  key={`line-${step.id}`}
                  className="absolute top-5 h-0.5 bg-primary"
                  style={{
                    left: `${startPosition}%`,
                    width: `${segmentWidth}%`,
                  }}
                />
              );
            })}
            
            {/* Step indicators */}
            {STEPS.map((step, index) => {
              // Calculate position for equal spacing with padding
              const totalSteps = STEPS.length - 1;
              const paddingPercent = 4; // 2% on each side
              const availableSpace = 100 - (paddingPercent * 2);
              const position = paddingPercent + (index * (availableSpace / totalSteps));
              
              return (
                <div 
                  key={step.id} 
                  className="flex flex-col items-center absolute"
                  style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="flex items-center justify-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 
                        ${currentStep === index 
                          ? 'bg-primary border-primary text-white shadow-lg' 
                          : currentStep > index 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-white/80 dark:bg-gray-800/80 border-muted-foreground/30 text-muted-foreground'
                        }`}
                    >
                      {currentStep > index ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                  </div>
                  <span 
                    className={`mt-2 text-xs font-medium whitespace-nowrap
                      ${currentStep === index 
                        ? 'text-primary' 
                        : currentStep > index 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Step Content */}
        <div className="px-8 py-8 border-t border-white/10">
          {renderStepContent()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between px-8 pb-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Submit Listing
              </>
            )}
          </Button>
        )}
      </div>
      </Card>
      
      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-6 p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Please fix the following errors:</span>
          </div>
          <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
