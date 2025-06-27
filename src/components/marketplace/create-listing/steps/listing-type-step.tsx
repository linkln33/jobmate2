"use client";

import { useState } from "react";
import { MarketplaceListing } from "@/types/marketplace";
import { 
  Briefcase, 
  ShoppingBag, 
  Wrench, 
  Home,
  CheckCircle2
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ListingTypeStepProps {
  data: Partial<MarketplaceListing>;
  updateData: (data: Partial<MarketplaceListing>) => void;
  errors: Record<string, string>;
}

const LISTING_TYPES = [
  { 
    id: "item", 
    name: "Item for Sale", 
    description: "Sell physical items like electronics, furniture, clothing, etc.", 
    icon: ShoppingBag,
    color: "bg-green-100 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
  },
  { 
    id: "service", 
    name: "Service", 
    description: "Offer services like web design, tutoring, consulting, etc.", 
    icon: Wrench,
    color: "bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
  },
  { 
    id: "rental", 
    name: "Rental", 
    description: "Rent out property, equipment, vehicles, etc.", 
    icon: Home,
    color: "bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
  },
  { 
    id: "job", 
    name: "Job", 
    description: "Post job opportunities, gigs, or freelance work.", 
    icon: Briefcase,
    color: "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
  },
];

// Categories based on listing type
const CATEGORIES = {
  item: [
    "Electronics", "Furniture", "Clothing", "Books", "Sports & Outdoors",
    "Home & Garden", "Toys & Games", "Automotive", "Collectibles", "Other"
  ],
  service: [
    "Web Development", "Design", "Writing", "Marketing", "Tutoring",
    "Home Services", "Business Services", "Health & Wellness", "Events", "Other"
  ],
  rental: [
    "Apartments", "Houses", "Rooms", "Office Space", "Storage",
    "Vehicles", "Equipment", "Event Spaces", "Vacation Rentals", "Other"
  ],
  job: [
    "Full-time", "Part-time", "Contract", "Freelance", "Internship",
    "Remote", "Entry Level", "Mid Level", "Senior Level", "Other"
  ]
};

export function ListingTypeStep({ data, updateData, errors }: ListingTypeStepProps) {
  const selectedType = data.type as 'item' | 'service' | 'rental' | 'job' || 'item';
  
  // Get categories for the selected type
  const categories = CATEGORIES[selectedType] || CATEGORIES.item;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">What type of listing are you creating?</h2>
        <p className="text-muted-foreground mb-6">
          Select the type that best describes what you're offering
        </p>
        
        <RadioGroup 
          value={selectedType} 
          onValueChange={(value) => updateData({ 
            type: value as 'item' | 'service' | 'rental' | 'job',
            // Reset category when type changes
            category: ''
          })}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {LISTING_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <div 
                key={type.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all
                  ${isSelected 
                    ? `border-2 ${type.color} shadow-sm` 
                    : 'border-border hover:border-muted-foreground/50'
                  }`}
              >
                <RadioGroupItem 
                  value={type.id} 
                  id={`type-${type.id}`} 
                  className="sr-only"
                />
                <Label 
                  htmlFor={`type-${type.id}`}
                  className="cursor-pointer block"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-md ${isSelected ? type.color : 'bg-muted'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </Label>
                {isSelected && (
                  <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
                )}
              </div>
            );
          })}
        </RadioGroup>
        
        {errors.type && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Select a category</h2>
        <p className="text-muted-foreground mb-6">
          Choose the category that best fits your {selectedType}
        </p>
        
        <Select 
          value={data.category || ''} 
          onValueChange={(value) => updateData({ category: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {errors.category && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
        )}
      </div>
    </div>
  );
}
