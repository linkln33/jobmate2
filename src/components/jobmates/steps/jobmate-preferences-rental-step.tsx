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

interface JobMatePreferencesRentalStepProps {
  preferences: Partial<UserPreferences>;
  onUpdate: (preferences: Partial<UserPreferences>) => void;
  onBack?: () => void;
}

export function JobMatePreferencesRentalStep({ 
  preferences, 
  onUpdate,
  onBack 
}: JobMatePreferencesRentalStepProps) {
  const [rentalPrefs, setRentalPrefs] = useState(preferences.categoryPreferences?.rentals || {
    minPrice: 0,
    maxPrice: 5000,
    minBedrooms: 0,
    maxBedrooms: 5,
    minBathrooms: 1,
    maxBathrooms: 3,
    propertyTypes: [],
    amenities: [],
    petFriendly: true,
    furnished: false,
    parkingIncluded: false,
    utilitiesIncluded: false,
    minSquareFeet: 0,
    maxSquareFeet: 3000,
    leaseLength: "any",
    moveInDate: new Date().toISOString().split('T')[0]
  });
  
  const [amenityInput, setAmenityInput] = useState("");
  
  // Common property types
  const propertyTypes = [
    "Apartment", "House", "Condo", "Townhouse", 
    "Studio", "Loft", "Room", "Duplex"
  ];
  
  // Common amenities
  const commonAmenities = [
    "Air Conditioning", "Washer/Dryer", "Dishwasher", 
    "Balcony", "Pool", "Gym", "Elevator", "Security System"
  ];
  
  // Lease length options
  const leaseLengths = [
    "month-to-month", "3-month", "6-month", "1-year", "2-year", "any"
  ];
  
  // Toggle property type
  const togglePropertyType = (type: string) => {
    if (rentalPrefs.propertyTypes?.includes(type)) {
      setRentalPrefs(prev => ({
        ...prev,
        propertyTypes: prev.propertyTypes?.filter(t => t !== type) || []
      }));
    } else {
      setRentalPrefs(prev => ({
        ...prev,
        propertyTypes: [...(prev.propertyTypes || []), type]
      }));
    }
  };
  
  // Add an amenity
  const addAmenity = () => {
    if (amenityInput.trim() && !rentalPrefs.amenities?.includes(amenityInput.trim())) {
      setRentalPrefs(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenityInput.trim()]
      }));
      setAmenityInput("");
    }
  };
  
  // Remove an amenity
  const removeAmenity = (amenity: string) => {
    setRentalPrefs(prev => ({
      ...prev,
      amenities: prev.amenities?.filter(a => a !== amenity) || []
    }));
  };
  
  // Toggle common amenity
  const toggleCommonAmenity = (amenity: string) => {
    if (rentalPrefs.amenities?.includes(amenity)) {
      removeAmenity(amenity);
    } else {
      setRentalPrefs(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenity]
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    const updatedPreferences = {
      ...preferences,
      categoryPreferences: {
        ...preferences.categoryPreferences,
        rentals: rentalPrefs
      }
    };
    onUpdate(updatedPreferences);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Rental Preferences</h2>
        <p className="text-muted-foreground mt-2">
          Tell your JobMate what kind of rental properties you're looking for
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Price Range */}
        <div className="space-y-4">
          <h3 className="font-medium">Monthly Price Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice">Minimum ($)</Label>
              <Input
                id="minPrice"
                type="number"
                value={rentalPrefs.minPrice || 0}
                onChange={(e) => setRentalPrefs(prev => ({
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
                value={rentalPrefs.maxPrice || 5000}
                onChange={(e) => setRentalPrefs(prev => ({
                  ...prev,
                  maxPrice: parseInt(e.target.value)
                }))}
              />
            </div>
          </div>
        </div>
        
        {/* Bedrooms */}
        <div className="space-y-4">
          <h3 className="font-medium">Bedrooms</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBedrooms">Minimum</Label>
              <Input
                id="minBedrooms"
                type="number"
                min="0"
                max="10"
                value={rentalPrefs.minBedrooms || 0}
                onChange={(e) => setRentalPrefs(prev => ({
                  ...prev,
                  minBedrooms: parseInt(e.target.value)
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxBedrooms">Maximum</Label>
              <Input
                id="maxBedrooms"
                type="number"
                min="0"
                max="10"
                value={rentalPrefs.maxBedrooms || 5}
                onChange={(e) => setRentalPrefs(prev => ({
                  ...prev,
                  maxBedrooms: parseInt(e.target.value)
                }))}
              />
            </div>
          </div>
        </div>
        
        {/* Bathrooms */}
        <div className="space-y-4">
          <h3 className="font-medium">Bathrooms</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBathrooms">Minimum</Label>
              <Input
                id="minBathrooms"
                type="number"
                min="0"
                step="0.5"
                max="10"
                value={rentalPrefs.minBathrooms || 1}
                onChange={(e) => setRentalPrefs(prev => ({
                  ...prev,
                  minBathrooms: parseFloat(e.target.value)
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxBathrooms">Maximum</Label>
              <Input
                id="maxBathrooms"
                type="number"
                min="0"
                step="0.5"
                max="10"
                value={rentalPrefs.maxBathrooms || 3}
                onChange={(e) => setRentalPrefs(prev => ({
                  ...prev,
                  maxBathrooms: parseFloat(e.target.value)
                }))}
              />
            </div>
          </div>
        </div>
        
        {/* Square Feet */}
        <div className="space-y-4">
          <h3 className="font-medium">Square Feet</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSquareFeet">Minimum</Label>
              <Input
                id="minSquareFeet"
                type="number"
                min="0"
                value={rentalPrefs.minSquareFeet || 0}
                onChange={(e) => setRentalPrefs(prev => ({
                  ...prev,
                  minSquareFeet: parseInt(e.target.value)
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSquareFeet">Maximum</Label>
              <Input
                id="maxSquareFeet"
                type="number"
                min="0"
                value={rentalPrefs.maxSquareFeet || 3000}
                onChange={(e) => setRentalPrefs(prev => ({
                  ...prev,
                  maxSquareFeet: parseInt(e.target.value)
                }))}
              />
            </div>
          </div>
        </div>
        
        {/* Property Types */}
        <div className="space-y-4">
          <h3 className="font-medium">Property Types</h3>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <Badge 
                key={type} 
                variant={rentalPrefs.propertyTypes?.includes(type) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => togglePropertyType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="font-medium">Desired Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {commonAmenities.map((amenity) => (
              <Badge 
                key={amenity} 
                variant={rentalPrefs.amenities?.includes(amenity) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleCommonAmenity(amenity)}
              >
                {amenity}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add another amenity"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
            />
            <Button onClick={addAmenity}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {rentalPrefs.amenities?.filter(a => !commonAmenities.includes(a)).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                {amenity}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeAmenity(amenity)}
                />
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Additional Preferences */}
        <div className="space-y-4">
          <h3 className="font-medium">Additional Preferences</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="petFriendly" 
                checked={rentalPrefs.petFriendly}
                onCheckedChange={(checked) => setRentalPrefs(prev => ({
                  ...prev,
                  petFriendly: checked === true
                }))}
              />
              <Label htmlFor="petFriendly">Pet Friendly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="furnished" 
                checked={rentalPrefs.furnished}
                onCheckedChange={(checked) => setRentalPrefs(prev => ({
                  ...prev,
                  furnished: checked === true
                }))}
              />
              <Label htmlFor="furnished">Furnished</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="parkingIncluded" 
                checked={rentalPrefs.parkingIncluded}
                onCheckedChange={(checked) => setRentalPrefs(prev => ({
                  ...prev,
                  parkingIncluded: checked === true
                }))}
              />
              <Label htmlFor="parkingIncluded">Parking Included</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="utilitiesIncluded" 
                checked={rentalPrefs.utilitiesIncluded}
                onCheckedChange={(checked) => setRentalPrefs(prev => ({
                  ...prev,
                  utilitiesIncluded: checked === true
                }))}
              />
              <Label htmlFor="utilitiesIncluded">Utilities Included</Label>
            </div>
          </div>
        </div>
        
        {/* Lease Length */}
        <div className="space-y-4">
          <h3 className="font-medium">Lease Length</h3>
          <div className="grid grid-cols-3 gap-2">
            {leaseLengths.map((length) => (
              <Button
                key={length}
                variant={rentalPrefs.leaseLength === length ? "default" : "outline"}
                onClick={() => setRentalPrefs(prev => ({ ...prev, leaseLength: length }))}
                className="capitalize"
              >
                {length}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Move-in Date */}
        <div className="space-y-4">
          <h3 className="font-medium">Earliest Move-in Date</h3>
          <Input
            type="date"
            value={rentalPrefs.moveInDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setRentalPrefs(prev => ({
              ...prev,
              moveInDate: e.target.value
            }))}
          />
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
