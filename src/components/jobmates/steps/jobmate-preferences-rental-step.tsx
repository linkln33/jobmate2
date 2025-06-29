"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { MainCategory, RentalPreferences, RentalSubcategory, UserPreferences } from "@/types/compatibility";

interface JobMatePreferencesRentalStepProps {
  preferences: Partial<UserPreferences>;
  onUpdate: (preferences: Partial<UserPreferences>) => void;
  onBack?: () => void;
  category?: MainCategory; // Added category prop to customize rental suggestions
}

export function JobMatePreferencesRentalStep({ 
  preferences, 
  onUpdate,
  onBack,
  category
}: JobMatePreferencesRentalStepProps) {
  // Initialize rental preferences with proper typing
  const initialRentalPrefs: RentalPreferences = {
    rentalTypes: [],
    maxPrice: 5000,
    minPrice: 0,
    location: "",
    minDuration: 1,
    maxDuration: 12,
    requiredAmenities: [],
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 1000,
    petFriendly: true,
    furnished: false,
    parking: false,
    utilities: [],
    leaseLength: "any",
    moveInDate: new Date().toISOString().split('T')[0]
  };
  
  const [rentalPrefs, setRentalPrefs] = useState<RentalPreferences>(
    preferences.categoryPreferences?.rentals || initialRentalPrefs
  );
  
  const [amenityInput, setAmenityInput] = useState("");
  
  // Category-specific property types - must match RentalSubcategory type
  const categoryPropertyTypes: Record<string, RentalSubcategory[]> = {
    // Default rental types
    'rentals': [
      "apartments", "houses", "rooms", "offices", 
      "event-spaces", "equipment", "vehicles", "party"
    ],
    
    // Apartment specific
    'apartments': [
      "apartments", "studio", "loft", "penthouse", 
      "duplex", "high-rise", "garden-apartment", "condo"
    ],
    
    // House specific
    'houses': [
      "houses", "single-family", "townhouse", "cottage", 
      "cabin", "villa", "bungalow", "mansion"
    ],
    
    // Room specific
    'rooms': [
      "rooms", "shared-room", "private-room", "master-bedroom", 
      "guest-room", "student-housing", "co-living", "dormitory"
    ],
    
    // Vacation rentals
    'vacation-rentals': [
      "beach-house", "cabin", "villa", "resort", 
      "cottage", "chalet", "houseboat", "island-rental"
    ],
    
    // Commercial space
    'commercial-space': [
      "offices", "retail", "warehouse", "industrial", 
      "restaurant-space", "medical-office", "coworking", "studio-space"
    ],
    
    // Event venues
    'event-venues': [
      "event-spaces", "party", "wedding-venue", "conference-center", 
      "banquet-hall", "outdoor-venue", "studio-space", "theater"
    ],
    
    // Parking & storage
    'parking-storage': [
      "parking", "storage-unit", "garage", "warehouse", 
      "self-storage", "boat-storage", "rv-parking", "vehicle-storage"
    ]
  };
  
  // Determine which property types to show based on category
  const propertyTypes: RentalSubcategory[] = 
    (category && categoryPropertyTypes[category]) ? 
    categoryPropertyTypes[category] : 
    categoryPropertyTypes['rentals'];
  
  // Category-specific amenities
  const categoryAmenities: Record<string, string[]> = {
    // Default rental amenities
    'rentals': [
      "Parking", "Laundry", "Dishwasher", "Air Conditioning", 
      "Gym", "Pool", "Balcony", "Pets Allowed", "Furnished"
    ],
    
    // Apartment specific amenities
    'apartments': [
      "In-unit Laundry", "Dishwasher", "Central AC", "Balcony", 
      "Elevator", "Doorman", "Gym", "Pool", "Rooftop", "Package Service"
    ],
    
    // House specific amenities
    'houses': [
      "Yard", "Garage", "Basement", "Porch", "Deck", 
      "Fireplace", "Washer/Dryer", "Smart Home", "Garden", "Driveway"
    ],
    
    // Room specific amenities
    'rooms': [
      "Private Bathroom", "Furnished", "Utilities Included", "Closet", 
      "Kitchen Access", "Private Entrance", "WiFi", "Cable TV"
    ],
    
    // Vacation rental amenities
    'vacation-rentals': [
      "Ocean View", "Hot Tub", "WiFi", "Kitchen", "BBQ", 
      "Waterfront", "Private Pool", "Outdoor Space", "Entertainment System"
    ],
    
    // Commercial space amenities
    'commercial-space': [
      "High-speed Internet", "Conference Room", "Reception Area", "Kitchen", 
      "Security System", "24/7 Access", "Utilities Included", "Parking"
    ],
    
    // Event venue amenities
    'event-venues': [
      "Sound System", "Lighting", "Catering Kitchen", "Tables/Chairs", 
      "Restrooms", "Parking", "Outdoor Space", "AV Equipment", "Stage"
    ],
    
    // Parking & storage amenities
    'parking-storage': [
      "24/7 Access", "Climate Control", "Security Camera", "Gated Entry", 
      "Drive-up Access", "Indoor", "Covered", "Electricity"
    ]
  };
  
  // Determine which amenities to show based on category
  const commonAmenities: string[] = 
    (category && categoryAmenities[category]) ? 
    categoryAmenities[category] : 
    categoryAmenities['rentals'];
  
  // Lease length options
  const leaseLengthOptions: string[] = [
    "Month-to-Month", "3 Months", "6 Months", "1 Year", "2+ Years"
  ];
  
  // Toggle property type
  const togglePropertyType = (t: string): void => {
    setRentalPrefs(prev => {
      // Get current rental types or initialize empty array
      const currentTypes = [...(prev.rentalTypes || [])];
      
      if (currentTypes.includes(t)) {
        return {
          ...prev,
          rentalTypes: currentTypes.filter(type => type !== t)
        };
      } else {
        return {
          ...prev,
          rentalTypes: [...currentTypes, t]
        };
      }
    });
  };
  
  // Add an amenity
  const addAmenity = (): void => {
    if (amenityInput.trim() === "") return;
    
    setRentalPrefs(prev => {
      // Get current required amenities or initialize empty array
      const currentAmenities = [...(prev.requiredAmenities || [])];
      
      if (!currentAmenities.includes(amenityInput.trim())) {
        return {
          ...prev,
          requiredAmenities: [...currentAmenities, amenityInput.trim()]
        };
      }
      return prev;
    });
    
    setAmenityInput("");
  };
  
  // Remove an amenity
  const removeAmenity = (a: string): void => {
    setRentalPrefs(prev => {
      const currentAmenities = [...(prev.requiredAmenities || [])];
      return {
        ...prev,
        requiredAmenities: currentAmenities.filter(amenity => amenity !== a)
      };
    });
  };
  
  // Toggle common amenity
  const toggleCommonAmenity = (amenity: string): void => {
    if (rentalPrefs.requiredAmenities?.includes(amenity)) {
      removeAmenity(amenity);
    } else {
      setRentalPrefs(prev => ({
        ...prev,
        requiredAmenities: [...(prev.requiredAmenities || []), amenity]
      }));
    }
  };
  
  // Handle form submission
  const handleSavePreferences = (): void => {
    const updatedPreferences = {
      ...preferences,
      categoryPreferences: {
        ...preferences.categoryPreferences,
        rentals: rentalPrefs
      }
    };
    
    onUpdate(updatedPreferences);
  };
  
  const handleSubmit = (): void => {
    handleSavePreferences();
    
    if (onBack) {
      onBack();
    }
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
            {propertyTypes.map((type: string) => (
              <Badge 
                key={type} 
                className={`mr-1 mb-1 cursor-pointer ${rentalPrefs.rentalTypes?.includes(type) ? 'bg-primary' : 'bg-secondary'}`}
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
            {commonAmenities.map((amenity: string) => (
              <Badge 
                key={amenity} 
                variant={rentalPrefs.requiredAmenities?.includes(amenity) ? "default" : "outline"}
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
            {rentalPrefs.requiredAmenities?.filter((a: string) => !commonAmenities.includes(a)).map((amenity: string) => (
              <Badge key={amenity} className="mr-1 mb-1">
                {amenity}
                <button
                  className="ml-1 hover:text-red-500"
                  onClick={() => removeAmenity(amenity)}
                >
                  <X className="h-3 w-3" />
                </button>
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
            {leaseLengthOptions.map((length) => (
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
      
      {/* Navigation buttons moved to main wizard footer */}
      <div className="hidden">
        <Button onClick={handleSubmit}>Continue</Button>
      </div>
    </div>
  );
}
