"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MainCategory, UserPreferences, WeightPreferences, JobSubcategory, ServiceSubcategory, RentalSubcategory } from '@/types/compatibility';
import { Badge } from '@/components/ui/badge';
import { Save, PlusCircle, MinusCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CompatibilityPreferencesFormProps {
  userPreferences: UserPreferences | null;
  onSave: (preferences: UserPreferences) => void;
}

export function CompatibilityPreferencesForm({ userPreferences, onSave }: CompatibilityPreferencesFormProps) {
  const [activeCategory, setActiveCategory] = useState<MainCategory>('jobs');
  // Define types for weight keys to ensure type safety
  type WeightKey = keyof WeightPreferences;

  // Default preferences to use when none are provided
  const defaultPreferences: UserPreferences = {
    userId: '',
    generalPreferences: {
      priceImportance: 8,
      locationImportance: 6,
      qualityImportance: 7
    },
    categoryPreferences: {
      jobs: {
        desiredSkills: [],
        minSalary: 0,
        maxSalary: 150000,
        workArrangement: [],
        experienceLevel: 'entry'
      },
      services: {
        serviceTypes: [],
        maxPrice: 100,
        preferredDistance: 10,
        minProviderRating: 4
      },
      rentals: {
        rentalTypes: [],
        maxPrice: 2000,
        location: '',
        minDuration: 1,
        maxDuration: 12,
        requiredAmenities: []
      }
    },
    weightPreferences: {
      skills: 0.8,
      location: 0.6,
      availability: 0.7,
      price: 0.9,
      userPreferences: 0.8,
      previousInteractions: 0.5,
      reputation: 0.7,
      aiTrend: 0.3
    }
  };
  
  const [preferences, setPreferences] = useState<UserPreferences>(
    userPreferences || defaultPreferences
  );

  const handleGeneralPreferenceChange = (key: string, value: number) => {
    setPreferences(prev => ({
      ...prev,
      generalPreferences: {
        ...prev.generalPreferences,
        [key]: value
      }
    }));
  };

  const handleWeightPreferenceChange = (key: WeightKey, value: number) => {
    setPreferences(prev => {
      // Create a deep copy to ensure we're not modifying the existing object
      const newPrefs = { ...prev };
      
      // Ensure weightPreferences exists with all required properties
      if (!newPrefs.weightPreferences) {
        newPrefs.weightPreferences = { ...defaultPreferences.weightPreferences! };
      }
      
      // Set the value, ensuring it's a number
      const updatedWeights: WeightPreferences = { 
        skills: newPrefs.weightPreferences.skills || 0.8,
        location: newPrefs.weightPreferences.location || 0.6,
        availability: newPrefs.weightPreferences.availability || 0.7,
        price: newPrefs.weightPreferences.price || 0.9,
        userPreferences: newPrefs.weightPreferences.userPreferences || 0.8,
        previousInteractions: newPrefs.weightPreferences.previousInteractions || 0.5,
        reputation: newPrefs.weightPreferences.reputation || 0.7,
        aiTrend: newPrefs.weightPreferences.aiTrend || 0.3
      };
      
      // Update the specific weight
      updatedWeights[key] = value / 10; // Convert slider value (0-10) to weight (0-1)
      
      newPrefs.weightPreferences = updatedWeights;
      return newPrefs;
    });
  };

  const handleJobPreferenceChange = (key: string, value: any) => {
    setPreferences(prev => {
      // Create a deep copy
      const newPrefs = { ...prev };
      
      // Ensure categoryPreferences exists
      if (!newPrefs.categoryPreferences) {
        newPrefs.categoryPreferences = {
          jobs: { desiredSkills: [], workArrangement: [], experienceLevel: 'entry', minSalary: 0, maxSalary: 150000 },
          services: { serviceTypes: [], maxPrice: 100, preferredDistance: 10, minProviderRating: 4 },
          rentals: { rentalTypes: [], maxPrice: 2000, location: '', minDuration: 1, maxDuration: 12, requiredAmenities: [] }
        };
      }
      
      // Ensure jobs exists with required properties
      if (!newPrefs.categoryPreferences.jobs) {
        newPrefs.categoryPreferences.jobs = { 
          desiredSkills: [], 
          workArrangement: [], 
          experienceLevel: 'entry',
          minSalary: 0, 
          maxSalary: 150000 
        };
      }
      
      // Set the value and ensure required properties
      const updatedJobs = { ...newPrefs.categoryPreferences.jobs };
      updatedJobs[key] = value;
      
      // Ensure all required fields have values
      if (!updatedJobs.desiredSkills) updatedJobs.desiredSkills = [];
      if (!updatedJobs.workArrangement) updatedJobs.workArrangement = [];
      if (!updatedJobs.experienceLevel) updatedJobs.experienceLevel = 'entry';
      if (updatedJobs.minSalary === undefined) updatedJobs.minSalary = 0;
      if (updatedJobs.maxSalary === undefined) updatedJobs.maxSalary = 150000;
      
      newPrefs.categoryPreferences.jobs = updatedJobs;
      return newPrefs;
    });
  };

  const handleServicePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => {
      // Create a deep copy
      const newPrefs = { ...prev };
      
      // Ensure categoryPreferences exists
      if (!newPrefs.categoryPreferences) {
        newPrefs.categoryPreferences = {
          jobs: { desiredSkills: [], workArrangement: [], experienceLevel: 'entry', minSalary: 0, maxSalary: 150000 },
          services: { serviceTypes: [], maxPrice: 100, preferredDistance: 10, minProviderRating: 4 },
          rentals: { rentalTypes: [], maxPrice: 2000, location: '', minDuration: 1, maxDuration: 12, requiredAmenities: [] }
        };
      }
      
      // Ensure services exists with required properties
      if (!newPrefs.categoryPreferences.services) {
        newPrefs.categoryPreferences.services = { 
          serviceTypes: [], 
          maxPrice: 100, 
          preferredDistance: 10, 
          minProviderRating: 4 
        };
      }
      
      // Set the value and ensure required properties
      const updatedServices = { ...newPrefs.categoryPreferences.services };
      updatedServices[key] = value;
      
      // Ensure all required fields have values
      if (!updatedServices.serviceTypes) updatedServices.serviceTypes = [];
      if (updatedServices.maxPrice === undefined) updatedServices.maxPrice = 100;
      if (updatedServices.preferredDistance === undefined) updatedServices.preferredDistance = 10;
      if (updatedServices.minProviderRating === undefined) updatedServices.minProviderRating = 4;
      
      newPrefs.categoryPreferences.services = updatedServices;
      return newPrefs;
    });
  };

  const handleRentalPreferenceChange = (key: string, value: any) => {
    setPreferences(prev => {
      // Create a deep copy
      const newPrefs = { ...prev };
      
      // Ensure categoryPreferences exists
      if (!newPrefs.categoryPreferences) {
        newPrefs.categoryPreferences = {
          jobs: { desiredSkills: [], workArrangement: [], experienceLevel: 'entry', minSalary: 0, maxSalary: 150000 },
          services: { serviceTypes: [], maxPrice: 100, preferredDistance: 10, minProviderRating: 4 },
          rentals: { rentalTypes: [], maxPrice: 2000, location: '', minDuration: 1, maxDuration: 12, requiredAmenities: [] }
        };
      }
      
      // Ensure rentals exists with required properties
      if (!newPrefs.categoryPreferences.rentals) {
        newPrefs.categoryPreferences.rentals = { 
          rentalTypes: [], 
          maxPrice: 2000, 
          location: '', 
          minDuration: 1, 
          maxDuration: 12, 
          requiredAmenities: [] 
        };
      }
      
      // Set the value and ensure required properties
      const updatedRentals = { ...newPrefs.categoryPreferences.rentals };
      updatedRentals[key] = value;
      
      // Ensure all required fields have values
      if (!updatedRentals.rentalTypes) updatedRentals.rentalTypes = [];
      if (updatedRentals.maxPrice === undefined) updatedRentals.maxPrice = 2000;
      if (updatedRentals.location === undefined) updatedRentals.location = '';
      if (updatedRentals.minDuration === undefined) updatedRentals.minDuration = 1;
      if (updatedRentals.maxDuration === undefined) updatedRentals.maxDuration = 12;
      if (!updatedRentals.requiredAmenities) updatedRentals.requiredAmenities = [];
      
      newPrefs.categoryPreferences.rentals = updatedRentals;
      return newPrefs;
    });
  };

  const addSkill = (skill: string) => {
    if (!skill.trim()) return;
    
    const currentSkills = preferences.categoryPreferences?.jobs?.desiredSkills || [];
    if (!currentSkills.includes(skill)) {
      handleJobPreferenceChange('desiredSkills', [...currentSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    const currentSkills = preferences.categoryPreferences?.jobs?.desiredSkills || [];
    handleJobPreferenceChange('desiredSkills', currentSkills.filter(s => s !== skill));
  };

  const addAmenity = (amenity: string) => {
    if (!amenity.trim()) return;
    
    const currentAmenities = preferences.categoryPreferences?.rentals?.requiredAmenities || [];
    if (!currentAmenities.includes(amenity)) {
      handleRentalPreferenceChange('requiredAmenities', [...currentAmenities, amenity]);
    }
  };

  const removeAmenity = (amenity: string) => {
    const currentAmenities = preferences.categoryPreferences?.rentals?.requiredAmenities || [];
    handleRentalPreferenceChange('requiredAmenities', currentAmenities.filter(a => a !== amenity));
  };

  const handleSave = () => {
    onSave({
      ...preferences,
      userId: userPreferences?.userId || 'current-user' // Ensure userId is set
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <SectionHeader 
          title="Compatibility Preferences" 
          description="Set your preferences to get better matches"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">General Importance Factors</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="price-importance">Price Importance</Label>
                  <span className="text-sm">{preferences.generalPreferences.priceImportance}/10</span>
                </div>
                <Slider 
                  id="price-importance"
                  min={1} 
                  max={10} 
                  step={1} 
                  value={[preferences.generalPreferences.priceImportance]} 
                  onValueChange={(value) => handleGeneralPreferenceChange('priceImportance', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="location-importance">Location Importance</Label>
                  <span className="text-sm">{preferences.generalPreferences.locationImportance}/10</span>
                </div>
                <Slider 
                  id="location-importance"
                  min={1} 
                  max={10} 
                  step={1} 
                  value={[preferences.generalPreferences.locationImportance]} 
                  onValueChange={(value) => handleGeneralPreferenceChange('locationImportance', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="quality-importance">Quality Importance</Label>
                  <span className="text-sm">{preferences.generalPreferences.qualityImportance}/10</span>
                </div>
                <Slider 
                  id="quality-importance"
                  min={1} 
                  max={10} 
                  step={1} 
                  value={[preferences.generalPreferences.qualityImportance]} 
                  onValueChange={(value) => handleGeneralPreferenceChange('qualityImportance', value[0])}
                />
              </div>
              
              <h3 className="text-lg font-medium mt-6 mb-4">Weight Factors</h3>
              <div className="space-y-4">
                  <div>
                    <Label htmlFor="skills-weight">Skills Importance</Label>
                    <Slider 
                      id="skills-weight" 
                      min={0} 
                      max={10} 
                      step={1} 
                      value={[Math.round((preferences.weightPreferences?.skills || 0.8) * 10)]}
                      onValueChange={([value]) => handleWeightPreferenceChange('skills' as WeightKey, value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location-weight">Location Importance</Label>
                    <Slider 
                      id="location-weight" 
                      min={0} 
                      max={10} 
                      step={1} 
                      value={[Math.round((preferences.weightPreferences?.location || 0.6) * 10)]}
                      onValueChange={([value]) => handleWeightPreferenceChange('location' as WeightKey, value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability-weight">Availability Importance</Label>
                    <Slider 
                      id="availability-weight" 
                      min={0} 
                      max={10} 
                      step={1} 
                      value={[Math.round((preferences.weightPreferences?.availability || 0.7) * 10)]}
                      onValueChange={([value]) => handleWeightPreferenceChange('availability' as WeightKey, value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price-weight">Price Importance</Label>
                    <Slider 
                      id="price-weight" 
                      min={0} 
                      max={10} 
                      step={1} 
                      value={[Math.round((preferences.weightPreferences?.price || 0.9) * 10)]}
                      onValueChange={([value]) => handleWeightPreferenceChange('price' as WeightKey, value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-prefs-weight">User Preferences Importance</Label>
                    <Slider 
                      id="user-prefs-weight" 
                      min={0} 
                      max={10} 
                      step={1} 
                      value={[Math.round((preferences.weightPreferences?.userPreferences || 0.8) * 10)]}
                      onValueChange={([value]) => handleWeightPreferenceChange('userPreferences' as WeightKey, value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="previous-interactions-weight">Previous Interactions Importance</Label>
                    <Slider 
                      id="previous-interactions-weight" 
                      min={0} 
                      max={10} 
                      step={1} 
                      value={[Math.round((preferences.weightPreferences?.previousInteractions || 0.5) * 10)]}
                      onValueChange={([value]) => handleWeightPreferenceChange('previousInteractions' as WeightKey, value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reputation-weight">Reputation Importance</Label>
                    <Slider 
                      id="reputation-weight" 
                      min={0} 
                      max={10} 
                      step={1} 
                      value={[Math.round((preferences.weightPreferences?.reputation || 0.7) * 10)]}
                      onValueChange={([value]) => handleWeightPreferenceChange('reputation' as WeightKey, value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ai-trend-weight">AI Trend Importance</Label>
                    <Slider 
                      id="ai-trend-weight" 
                      min={0} 
                      max={10} 
                      step={1} 
                      value={[Math.round((preferences.weightPreferences?.aiTrend || 0.3) * 10)]}
                      onValueChange={([value]) => handleWeightPreferenceChange('aiTrend' as WeightKey, value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Category-Specific Preferences</h3>
            <Tabs defaultValue="jobs" onValueChange={(value) => setActiveCategory(value as MainCategory)}>
              <TabsList className="mb-4">
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="rentals">Rentals</TabsTrigger>
              </TabsList>
              <TabsContent value="jobs" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-salary">Minimum Salary ($)</Label>
                    <Input 
                      id="min-salary" 
                      type="number" 
                      value={preferences.categoryPreferences?.jobs?.minSalary || 0} 
                      onChange={(e) => handleJobPreferenceChange('minSalary', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-salary">Maximum Salary ($)</Label>
                    <Input 
                      id="max-salary" 
                      type="number" 
                      value={preferences.categoryPreferences?.jobs?.maxSalary || 150000} 
                      onChange={(e) => handleJobPreferenceChange('maxSalary', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience-level">Experience Level</Label>
                  <Select 
                    value={preferences.categoryPreferences?.jobs?.experienceLevel || 'entry'} 
                    onValueChange={(value) => handleJobPreferenceChange('experienceLevel', value)}
                  >
                    <SelectTrigger id="experience-level">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="executive">Executive Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="work-arrangement">Work Arrangement</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['remote', 'on-site', 'hybrid', 'full-time', 'part-time', 'contract'].map((arrangement) => (
                      <div key={arrangement} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`work-${arrangement}`} 
                          checked={preferences.categoryPreferences?.jobs?.workArrangement?.includes(arrangement as JobSubcategory)} 
                          onCheckedChange={(checked) => {
                            const current = preferences.categoryPreferences?.jobs?.workArrangement || [];
                            if (checked) {
                              handleJobPreferenceChange('workArrangement', [...current, arrangement as JobSubcategory]);
                            } else {
                              handleJobPreferenceChange('workArrangement', current.filter(a => a !== arrangement));
                            }
                          }}
                        />
                        <Label htmlFor={`work-${arrangement}`} className="capitalize">{arrangement.replace('-', ' ')}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Desired Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {preferences.categoryPreferences?.jobs?.desiredSkills?.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <MinusCircle 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSkill(skill)} 
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      id="skill-input" 
                      placeholder="Add a skill" 
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => {
                        const input = document.getElementById('skill-input') as HTMLInputElement;
                        addSkill(input.value);
                        input.value = '';
                      }}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="services" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-service-price">Maximum Price ($)</Label>
                  <Input 
                    id="max-service-price" 
                    type="number" 
                    value={preferences.categoryPreferences?.services?.maxPrice || 100} 
                    onChange={(e) => handleServicePreferenceChange('maxPrice', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferred-distance">Preferred Distance (miles)</Label>
                  <Input 
                    id="preferred-distance" 
                    type="number" 
                    value={preferences.categoryPreferences?.services?.preferredDistance || 10} 
                    onChange={(e) => handleServicePreferenceChange('preferredDistance', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min-provider-rating">Minimum Provider Rating</Label>
                  <Select 
                    value={String(preferences.categoryPreferences?.services?.minProviderRating || 4)} 
                    onValueChange={(value) => handleServicePreferenceChange('minProviderRating', parseFloat(value))}
                  >
                    <SelectTrigger id="min-provider-rating">
                      <SelectValue placeholder="Select minimum rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No minimum</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                      <SelectItem value="5">5 stars only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service-types">Service Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['handyman', 'development', 'design', 'writing', 'marketing', 'legal', 'tutoring', 'cleaning'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`service-${type}`} 
                          checked={preferences.categoryPreferences?.services?.serviceTypes?.includes(type as ServiceSubcategory)} 
                          onCheckedChange={(checked) => {
                            const current = preferences.categoryPreferences?.services?.serviceTypes || [];
                            if (checked) {
                              handleServicePreferenceChange('serviceTypes', [...current, type as ServiceSubcategory]);
                            } else {
                              handleServicePreferenceChange('serviceTypes', current.filter(t => t !== type));
                            }
                          }}
                        />
                        <Label htmlFor={`service-${type}`} className="capitalize">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rentals" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rental-max-price">Maximum Price ($)</Label>
                    <Input 
                      id="rental-max-price" 
                      type="number" 
                      value={preferences.categoryPreferences?.rentals?.maxPrice || 2000} 
                      onChange={(e) => handleRentalPreferenceChange('maxPrice', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rental-location">Preferred Location</Label>
                    <Input 
                      id="rental-location" 
                      value={preferences.categoryPreferences?.rentals?.location || ''} 
                      onChange={(e) => handleRentalPreferenceChange('location', e.target.value)}
                      placeholder="City, neighborhood, or area"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-duration">Minimum Duration (months)</Label>
                    <Input 
                      id="min-duration" 
                      type="number" 
                      value={preferences.categoryPreferences?.rentals?.minDuration || 1} 
                      onChange={(e) => handleRentalPreferenceChange('minDuration', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-duration">Maximum Duration (months)</Label>
                    <Input 
                      id="max-duration" 
                      type="number" 
                      value={preferences.categoryPreferences?.rentals?.maxDuration || 12} 
                      onChange={(e) => handleRentalPreferenceChange('maxDuration', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rental-types">Rental Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['apartments', 'rooms', 'houses', 'offices', 'event-spaces'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`rental-${type}`} 
                          checked={preferences.categoryPreferences?.rentals?.rentalTypes?.includes(type as RentalSubcategory)} 
                          onCheckedChange={(checked) => {
                            const current = preferences.categoryPreferences?.rentals?.rentalTypes || [];
                            if (checked) {
                              handleRentalPreferenceChange('rentalTypes', [...current, type as RentalSubcategory]);
                            } else {
                              handleRentalPreferenceChange('rentalTypes', current.filter(t => t !== type));
                            }
                          }}
                        />
                        <Label htmlFor={`rental-${type}`} className="capitalize">{type.replace('-', ' ')}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Required Amenities</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {preferences.categoryPreferences?.rentals?.requiredAmenities?.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                        {amenity}
                        <MinusCircle 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeAmenity(amenity)} 
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      id="amenity-input" 
                      placeholder="Add an amenity" 
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addAmenity((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => {
                        const input = document.getElementById('amenity-input') as HTMLInputElement;
                        addAmenity(input.value);
                        input.value = '';
                      }}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Match Weight Factors</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adjust how much each factor influences your match scores
            </p>
            <div className="space-y-4">
              {Object.entries(preferences.weightPreferences || {}).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`weight-${key}`} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <span className="text-sm">{Math.round(value * 10)}/10</span>
                  </div>
                  <Slider 
                    id={`weight-${key}`}
                    min={0} 
                    max={10} 
                    step={1} 
                    value={[Math.round(value * 10)]} 
                    onValueChange={(val) => handleWeightPreferenceChange(key as WeightKey, val[0])}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
