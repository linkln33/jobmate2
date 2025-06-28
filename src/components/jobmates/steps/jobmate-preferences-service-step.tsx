"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPreferences } from "@/types/compatibility";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface JobMatePreferencesServiceStepProps {
  preferences: Partial<UserPreferences>;
  onUpdate: (preferences: Partial<UserPreferences>) => void;
  onBack?: () => void;
}

export function JobMatePreferencesServiceStep({ 
  preferences, 
  onUpdate,
  onBack 
}: JobMatePreferencesServiceStepProps) {
  const [servicePrefs, setServicePrefs] = useState(preferences.categoryPreferences?.services || {
    minPrice: 0,
    maxPrice: 1000,
    serviceTypes: [],
    providerRating: 4,
    responseTime: "any",
    availability: [],
    experienceLevel: "any",
    location: "any",
    paymentMethods: [],
    specialRequirements: []
  });
  
  const [serviceTypeInput, setServiceTypeInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  
  // Common service types
  const commonServiceTypes = [
    "Cleaning", "Plumbing", "Electrical", "Tutoring", 
    "Web Design", "Photography", "Landscaping", "Home Repair",
    "Personal Training", "Accounting", "Legal", "Marketing"
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
  const toggleServiceType = (type: string) => {
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
  const addServiceType = () => {
    if (serviceTypeInput.trim() && !servicePrefs.serviceTypes?.includes(serviceTypeInput.trim())) {
      setServicePrefs(prev => ({
        ...prev,
        serviceTypes: [...(prev.serviceTypes || []), serviceTypeInput.trim()]
      }));
      setServiceTypeInput("");
    }
  };
  
  // Remove a service type
  const removeServiceType = (type: string) => {
    setServicePrefs(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes?.filter(t => t !== type) || []
    }));
  };
  
  // Toggle payment method
  const togglePaymentMethod = (method: string) => {
    if (servicePrefs.paymentMethods?.includes(method)) {
      setServicePrefs(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods?.filter(m => m !== method) || []
      }));
    } else {
      setServicePrefs(prev => ({
        ...prev,
        paymentMethods: [...(prev.paymentMethods || []), method]
      }));
    }
  };
  
  // Toggle availability
  const toggleAvailability = (availability: string) => {
    if (servicePrefs.availability?.includes(availability)) {
      setServicePrefs(prev => ({
        ...prev,
        availability: prev.availability?.filter(a => a !== availability) || []
      }));
    } else {
      setServicePrefs(prev => ({
        ...prev,
        availability: [...(prev.availability || []), availability]
      }));
    }
  };
  
  // Add a special requirement
  const addRequirement = () => {
    if (requirementInput.trim() && !servicePrefs.specialRequirements?.includes(requirementInput.trim())) {
      setServicePrefs(prev => ({
        ...prev,
        specialRequirements: [...(prev.specialRequirements || []), requirementInput.trim()]
      }));
      setRequirementInput("");
    }
  };
  
  // Remove a special requirement
  const removeRequirement = (requirement: string) => {
    setServicePrefs(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements?.filter(r => r !== requirement) || []
    }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    const updatedPreferences = {
      ...preferences,
      categoryPreferences: {
        ...preferences.categoryPreferences,
        services: servicePrefs
      }
    };
    onUpdate(updatedPreferences);
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
            {commonServiceTypes.map((type) => (
              <Badge 
                key={type} 
                variant={servicePrefs.serviceTypes?.includes(type) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleServiceType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add another service type"
              value={serviceTypeInput}
              onChange={(e) => setServiceTypeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addServiceType()}
            />
            <Button onClick={addServiceType}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {servicePrefs.serviceTypes?.filter(t => !commonServiceTypes.includes(t)).map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeServiceType(type)}
                />
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Provider Rating */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="font-medium">Minimum Provider Rating</h3>
            <span className="font-medium">{servicePrefs.providerRating} / 5</span>
          </div>
          <Slider
            defaultValue={[servicePrefs.providerRating || 4]}
            min={1}
            max={5}
            step={0.5}
            onValueChange={(value) => setServicePrefs(prev => ({
              ...prev,
              providerRating: value[0]
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
            {availabilityOptions.map((option) => (
              <Badge 
                key={option} 
                variant={servicePrefs.availability?.includes(option) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleAvailability(option)}
              >
                {option}
              </Badge>
            ))}
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
            {paymentMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox 
                  id={`payment-${method}`} 
                  checked={servicePrefs.paymentMethods?.includes(method)}
                  onCheckedChange={() => togglePaymentMethod(method)}
                />
                <Label htmlFor={`payment-${method}`}>{method}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Special Requirements */}
        <div className="space-y-4">
          <h3 className="font-medium">Special Requirements</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Add a special requirement"
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
            />
            <Button onClick={addRequirement}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {servicePrefs.specialRequirements?.map((requirement) => (
              <Badge key={requirement} variant="secondary" className="flex items-center gap-1">
                {requirement}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeRequirement(requirement)}
                />
              </Badge>
            ))}
            {!servicePrefs.specialRequirements?.length && (
              <p className="text-sm text-muted-foreground">No special requirements added</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-6">
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
}
