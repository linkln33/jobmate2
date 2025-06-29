"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { MainCategory, ServicePreferences, ServiceSubcategory, UserPreferences } from "@/types/compatibility";

interface JobMatePreferencesServiceStepProps {
  preferences: Partial<UserPreferences>;
  onUpdate: (preferences: Partial<UserPreferences>) => void;
  onBack?: () => void;
  category?: MainCategory;
  isRental?: boolean;
  isMarketplace?: boolean;
  isLearning?: boolean;
  isTravel?: boolean;
  isHiring?: boolean;
}

export function JobMatePreferencesServiceStep({ 
  preferences, 
  onUpdate,
  onBack,
  category,
  isRental,
  isMarketplace,
  isLearning,
  isTravel,
  isHiring
}: JobMatePreferencesServiceStepProps) {
  // Initialize service preferences with proper typing
  const initialServicePrefs: ServicePreferences = {
    serviceTypes: [] as ServiceSubcategory[],
    maxPrice: 1000,
    minProviderRating: 4,
    responseTime: "any",
    availability: [],
    experienceLevel: "any",
    location: "any",
    paymentMethods: [],
    specialRequirements: ""
  };

  const [servicePrefs, setServicePrefs] = useState<ServicePreferences>(
    preferences.categoryPreferences?.services || initialServicePrefs
  );
  
  const [serviceTypeInput, setServiceTypeInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  
  // Common service types - must match ServiceSubcategory type
  const serviceTypes: ServiceSubcategory[] = [
    "handyman", "development", "design", "writing", 
    "marketing", "legal", "tutoring", "health", "events",
    "cleaning", "gardening", "pet-care", "moving"
  ];
  
  // Payment methods
  const paymentMethods = [
    "Credit Card", "PayPal", "Cash", "Bank Transfer", 
    "Venmo", "Apple Pay", "Google Pay", "Crypto"
  ];
  
  // Availability options
  const availabilityOptions = [
    "Weekdays", "Evenings", "Weekends", "Early Morning",
    "24/7", "Same Day", "By Appointment"
  ];
  
  // Toggle service type
  const toggleServiceType = (type: ServiceSubcategory): void => {
    if (servicePrefs.serviceTypes?.includes(type)) {
      setServicePrefs(prev => ({
        ...prev,
        serviceTypes: prev.serviceTypes?.filter(t => t !== type) || []
      }));
    } else {
      setServicePrefs(prev => ({
        ...prev,
        serviceTypes: [...(prev.serviceTypes || []), type]
      }));
    }
  };
  
  // Add a service type
  const addServiceType = (): void => {
    if (!serviceTypeInput.trim()) return;
    
    // Check if already exists
    if (servicePrefs.serviceTypes?.includes(serviceTypeInput as any)) return;
    
    setServicePrefs(prev => ({
      ...prev,
      serviceTypes: [...(prev.serviceTypes || []), serviceTypeInput as any]
    }));
    
    setServiceTypeInput("");
  };
  
  // Remove a service type
  const removeServiceType = (type: string) => {
    const currentTypes = Array.isArray(servicePrefs.serviceTypes) 
      ? servicePrefs.serviceTypes as string[]
      : [];
      
    setServicePrefs(prev => ({
      ...prev,
      serviceTypes: currentTypes.filter(t => t !== type)
    }));
  };
  
  // Toggle payment method
  const togglePaymentMethod = (method: string) => {
    const currentMethods = Array.isArray(servicePrefs.paymentMethods) 
      ? servicePrefs.paymentMethods
      : [];
      
    if (currentMethods.includes(method)) {
      setServicePrefs(prev => ({
        ...prev,
        paymentMethods: currentMethods.filter(m => m !== method)
      }));
    } else {
      setServicePrefs(prev => ({
        ...prev,
        paymentMethods: [...currentMethods, method]
      }));
    }
  };
  
  // Toggle availability
  const toggleAvailability = (availability: string) => {
    const currentAvailability = Array.isArray(servicePrefs.availability) 
      ? servicePrefs.availability
      : [];
      
    if (currentAvailability.includes(availability)) {
      setServicePrefs(prev => ({
        ...prev,
        availability: currentAvailability.filter(a => a !== availability)
      }));
    } else {
      setServicePrefs(prev => ({
        ...prev,
        availability: [...currentAvailability, availability]
      }));
    }
  };
  
  // Get current special requirements as array
  const getSpecialRequirementsArray = (): string[] => {
    if (!servicePrefs.specialRequirements) return [];
    if (Array.isArray(servicePrefs.specialRequirements)) {
      return servicePrefs.specialRequirements as unknown as string[];
    }
    return servicePrefs.specialRequirements.split(',').filter(r => r.trim() !== '');
  };
  
  // Add a special requirement
  const handleAddRequirement = () => {
    if (!requirementInput.trim()) return;
    
    const requirements = getSpecialRequirementsArray();
    const newRequirements = [...requirements, requirementInput.trim()];
    
    setServicePrefs(prev => ({
      ...prev,
      specialRequirements: newRequirements.join(', ')
    }));
    
    setRequirementInput("");
  };
  
  // Remove a special requirement
  const removeRequirement = (requirement: string) => {
    const requirements = getSpecialRequirementsArray();
    const newRequirements = requirements.filter(r => r !== requirement);
    
    setServicePrefs(prev => ({
      ...prev,
      specialRequirements: newRequirements.join(', ')
    }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    onUpdate({
      ...preferences,
      categoryPreferences: {
        ...preferences.categoryPreferences,
        services: servicePrefs
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Service Preferences</h2>
        <p className="text-muted-foreground mt-2">
          Tell your JobMate what kind of services you're looking for
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Price Range */}
        <div className="space-y-4">
          <h3 className="font-medium">Price Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice">Minimum ($)</Label>
              <Input
                id="minPrice"
                type="number"
                value={servicePrefs.minPrice || 0}
                onChange={(e) => setServicePrefs(prev => ({
                  ...prev,
                  minPrice: parseInt(e.target.value)
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Maximum ($)</Label>
              <Input
                id="maxPrice"
                type="number"
                value={servicePrefs.maxPrice || 1000}
                onChange={(e) => setServicePrefs(prev => ({
                  ...prev,
                  maxPrice: parseInt(e.target.value)
                }))}
              />
            </div>
          </div>
        </div>
        
        {/* Service Types */}
        <div className="space-y-4">
          <h3 className="font-medium">Service Types</h3>
          <div className="flex flex-wrap gap-2">
            {serviceTypes.map((type: ServiceSubcategory) => {
              const currentTypes = Array.isArray(servicePrefs.serviceTypes) 
                ? servicePrefs.serviceTypes as ServiceSubcategory[]
                : [];
              return (
                <Badge 
                  key={type} 
                  variant={currentTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleServiceType(type)}
                >
                  {type}
                </Badge>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add another service type"
              value={serviceTypeInput}
              onChange={(e) => setServiceTypeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addServiceType()}
              className="flex-1"
            />
            <Button type="button" onClick={addServiceType}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.isArray(servicePrefs.serviceTypes) && 
              (servicePrefs.serviceTypes as ServiceSubcategory[])
                .filter(t => !serviceTypes.includes(t))
                .map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type}
                    <button onClick={() => removeServiceType(type)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
            }
          </div>
        </div>
        
        {/* Provider Rating */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="font-medium">Minimum Provider Rating</h3>
            <span className="font-medium">{servicePrefs.minProviderRating || 4} / 5</span>
          </div>
          <Slider
            defaultValue={[servicePrefs.minProviderRating || 4]}
            min={1}
            max={5}
            step={0.5}
            onValueChange={(value) => setServicePrefs(prev => ({
              ...prev,
              minProviderRating: value[0]
            }))}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 ★</span>
            <span>2 ★</span>
            <span>3 ★</span>
            <span>4 ★</span>
            <span>5 ★</span>
          </div>
        </div>
        
        {/* Response Time */}
        <div className="space-y-4">
          <h3 className="font-medium">Response Time</h3>
          <div className="grid grid-cols-3 gap-2">
            {["within-hour", "same-day", "within-week", "any"].map((option) => (
              <Button
                key={option}
                variant={servicePrefs.responseTime === option ? "default" : "outline"}
                onClick={() => setServicePrefs(prev => ({ ...prev, responseTime: option }))}
              >
                {option === "within-hour" ? "Within Hour" :
                 option === "same-day" ? "Same Day" :
                 option === "within-week" ? "Within Week" : "Any"}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Availability */}
        <div className="space-y-4">
          <h3 className="font-medium">Availability</h3>
          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map((option) => {
              const currentAvailability = Array.isArray(servicePrefs.availability) 
                ? servicePrefs.availability
                : [];
              return (
                <Badge 
                  key={option} 
                  variant={currentAvailability.includes(option) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleAvailability(option)}
                >
                  {option}
                </Badge>
              );
            })}
          </div>
        </div>
        
        {/* Experience Level */}
        <div className="space-y-4">
          <h3 className="font-medium">Experience Level</h3>
          <div className="grid grid-cols-4 gap-2">
            {["beginner", "intermediate", "expert", "any"].map((option) => (
              <Button
                key={option}
                variant={servicePrefs.experienceLevel === option ? "default" : "outline"}
                onClick={() => setServicePrefs(prev => ({ ...prev, experienceLevel: option }))}
                className="capitalize"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Location */}
        <div className="space-y-4">
          <h3 className="font-medium">Service Location</h3>
          <div className="grid grid-cols-3 gap-2">
            {["remote", "in-person", "any"].map((option) => (
              <Button
                key={option}
                variant={servicePrefs.location === option ? "default" : "outline"}
                onClick={() => setServicePrefs(prev => ({ ...prev, location: option }))}
                className="capitalize"
              >
                {option === "in-person" ? "In Person" : option}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="font-medium">Accepted Payment Methods</h3>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => {
              const currentMethods = Array.isArray(servicePrefs.paymentMethods) 
                ? servicePrefs.paymentMethods
                : [];
              return (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`payment-${method}`} 
                    checked={currentMethods.includes(method)}
                    onCheckedChange={() => togglePaymentMethod(method)}
                  />
                  <Label htmlFor={`payment-${method}`}>{method}</Label>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Special Requirements */}
        <div className="space-y-4">
          <h3 className="font-medium">Special Requirements</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Add special requirements"
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddRequirement()}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddRequirement} size="sm">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {getSpecialRequirementsArray().map((requirement) => (
              <Badge key={requirement} variant="secondary" className="flex items-center gap-1">
                {requirement}
                <button onClick={() => removeRequirement(requirement)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {getSpecialRequirementsArray().length === 0 && (
              <p className="text-sm text-muted-foreground">No special requirements added</p>
            )}
          </div>
        </div>
      </div>
      
      <Button onClick={handleSubmit} className="w-full">
        Save Preferences
      </Button>
    </div>
  );
}
