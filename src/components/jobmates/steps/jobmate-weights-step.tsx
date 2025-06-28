"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { UserPreferences } from "@/types/compatibility";
import { JobMateFormData } from "@/types/jobmate";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DollarSign, 
  MapPin, 
  Star, 
  Clock, 
  Briefcase, 
  Building, 
  Layers, 
  Award
} from "lucide-react";

interface JobMateWeightsStepProps {
  formData: JobMateFormData;
  onUpdate: (formData: JobMateFormData) => void;
  onBack?: () => void;
}

interface WeightItem {
  id: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

export function JobMateWeightsStep({ 
  formData, 
  onUpdate,
  onBack = () => {}
}: JobMateWeightsStepProps) {
  const [weights, setWeights] = useState<Record<string, number>>(
    formData.preferences?.weights || {}
  );
  const [weightItems, setWeightItems] = useState<WeightItem[]>([]);
  
  // Initialize weight items based on the selected category
  useEffect(() => {
    let categoryWeights: WeightItem[] = [];
    
    switch (formData.categoryFocus) {
      case "jobs":
        categoryWeights = [
          {
            id: "salary",
            label: "Salary Match",
            value: weights.salary || 5,
            icon: <DollarSign className="h-5 w-5" />,
            description: "How important is meeting your salary requirements"
          },
          {
            id: "skills",
            label: "Skills Match",
            value: weights.skills || 5,
            icon: <Award className="h-5 w-5" />,
            description: "How important is matching your skills and experience"
          },
          {
            id: "location",
            label: "Location",
            value: weights.location || 3,
            icon: <MapPin className="h-5 w-5" />,
            description: "How important is the job location or remote options"
          },
          {
            id: "companySize",
            label: "Company Size",
            value: weights.companySize || 2,
            icon: <Building className="h-5 w-5" />,
            description: "How important is the size of the company"
          },
          {
            id: "industry",
            label: "Industry",
            value: weights.industry || 4,
            icon: <Briefcase className="h-5 w-5" />,
            description: "How important is the industry sector"
          },
          {
            id: "benefits",
            label: "Benefits",
            value: weights.benefits || 3,
            icon: <Star className="h-5 w-5" />,
            description: "How important are the offered benefits"
          }
        ];
        break;
        
      case "rentals":
        categoryWeights = [
          {
            id: "price",
            label: "Price",
            value: weights.price || 5,
            icon: <DollarSign className="h-5 w-5" />,
            description: "How important is staying within your budget"
          },
          {
            id: "location",
            label: "Location",
            value: weights.location || 5,
            icon: <MapPin className="h-5 w-5" />,
            description: "How important is the property location"
          },
          {
            id: "size",
            label: "Size & Layout",
            value: weights.size || 4,
            icon: <Layers className="h-5 w-5" />,
            description: "How important is the property size and layout"
          },
          {
            id: "amenities",
            label: "Amenities",
            value: weights.amenities || 3,
            icon: <Star className="h-5 w-5" />,
            description: "How important are the property amenities"
          },
          {
            id: "petFriendly",
            label: "Pet Friendly",
            value: weights.petFriendly || 2,
            icon: <Award className="h-5 w-5" />,
            description: "How important is pet-friendliness"
          },
          {
            id: "leaseTerms",
            label: "Lease Terms",
            value: weights.leaseTerms || 3,
            icon: <Clock className="h-5 w-5" />,
            description: "How important are the lease terms and flexibility"
          }
        ];
        break;
        
      case "services":
        categoryWeights = [
          {
            id: "price",
            label: "Price",
            value: weights.price || 4,
            icon: <DollarSign className="h-5 w-5" />,
            description: "How important is the service price"
          },
          {
            id: "quality",
            label: "Quality & Rating",
            value: weights.quality || 5,
            icon: <Star className="h-5 w-5" />,
            description: "How important is the service quality and ratings"
          },
          {
            id: "responseTime",
            label: "Response Time",
            value: weights.responseTime || 3,
            icon: <Clock className="h-5 w-5" />,
            description: "How important is quick response time"
          },
          {
            id: "experience",
            label: "Provider Experience",
            value: weights.experience || 4,
            icon: <Award className="h-5 w-5" />,
            description: "How important is the provider's experience level"
          },
          {
            id: "location",
            label: "Location",
            value: weights.location || 2,
            icon: <MapPin className="h-5 w-5" />,
            description: "How important is the service location"
          },
          {
            id: "availability",
            label: "Availability",
            value: weights.availability || 3,
            icon: <Clock className="h-5 w-5" />,
            description: "How important is the provider's availability"
          }
        ];
        break;
        
      default:
        categoryWeights = [];
    }
    
    setWeightItems(categoryWeights);
  }, [formData.categoryFocus, weights]);
  
  // Update a weight value
  const updateWeight = (id: string, value: number) => {
    setWeights(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Create a new formData object with updated weights
    const updatedFormData = {
      ...formData,
      preferences: {
        ...formData.preferences,
        weights: weights
      }
    };
    
    // Update the form data in the parent component
    // This will trigger the nextStep() function in the wizard
    onUpdate(updatedFormData);
  };
  
  // Get color based on weight value
  const getWeightColor = (value: number) => {
    if (value >= 4) return "bg-green-100 border-green-200";
    if (value >= 2) return "bg-yellow-100 border-yellow-200";
    return "bg-gray-100 border-gray-200";
  };
  
  // Get text description based on weight value
  const getWeightDescription = (value: number) => {
    if (value >= 5) return "Critical";
    if (value >= 4) return "Very Important";
    if (value >= 3) return "Important";
    if (value >= 2) return "Somewhat Important";
    return "Not Important";
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Set Your Priorities</h2>
        <p className="text-muted-foreground mt-2">
          Adjust how much weight your JobMate should give to each factor when finding matches
        </p>
      </div>
      
      <div className="space-y-4">
        {weightItems.map((item) => (
          <Card key={item.id} className={`border ${getWeightColor(item.value)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <h3 className="font-medium">{item.label}</h3>
                </div>
                <span className="font-medium text-sm">
                  {getWeightDescription(item.value)} ({item.value}/5)
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">Not Important</span>
                <Slider
                  defaultValue={[item.value]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => updateWeight(item.id, value[0])}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Critical</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
}
