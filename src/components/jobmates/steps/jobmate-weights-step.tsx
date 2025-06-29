"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MainCategory, UserPreferences, WeightPreferences } from "@/types/compatibility";
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
    
    // Define job-related weights that are common across job categories
    const getJobWeights = () => [
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
    
    // Define service-related weights that are common across service categories
    const getServiceWeights = () => [
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
    
    // Define rental-related weights that are common across rental categories
    const getRentalWeights = () => [
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
        id: "leaseTerms",
        label: "Lease Terms",
        value: weights.leaseTerms || 3,
        icon: <Clock className="h-5 w-5" />,
        description: "How important are the lease terms and flexibility"
      }
    ];
    
    // Define marketplace-related weights
    const getMarketplaceWeights = () => [
      {
        id: "price",
        label: "Price",
        value: weights.price || 5,
        icon: <DollarSign className="h-5 w-5" />,
        description: "How important is the item price"
      },
      {
        id: "condition",
        label: "Condition",
        value: weights.condition || 4,
        icon: <Star className="h-5 w-5" />,
        description: "How important is the item condition"
      },
      {
        id: "location",
        label: "Location/Distance",
        value: weights.location || 3,
        icon: <MapPin className="h-5 w-5" />,
        description: "How important is the item location or distance"
      },
      {
        id: "sellerRating",
        label: "Seller Rating",
        value: weights.sellerRating || 3,
        icon: <Award className="h-5 w-5" />,
        description: "How important is the seller's rating and reputation"
      }
    ];
    
    // Define learning-related weights
    const getLearningWeights = () => [
      {
        id: "price",
        label: "Price",
        value: weights.price || 4,
        icon: <DollarSign className="h-5 w-5" />,
        description: "How important is the course or learning resource price"
      },
      {
        id: "quality",
        label: "Quality & Rating",
        value: weights.quality || 5,
        icon: <Star className="h-5 w-5" />,
        description: "How important is the quality and ratings"
      },
      {
        id: "format",
        label: "Learning Format",
        value: weights.format || 4,
        icon: <Layers className="h-5 w-5" />,
        description: "How important is the learning format (online, in-person, etc.)"
      },
      {
        id: "expertise",
        label: "Instructor Expertise",
        value: weights.expertise || 4,
        icon: <Award className="h-5 w-5" />,
        description: "How important is the instructor's expertise"
      }
    ];
    
    // Define travel-related weights
    const getTravelWeights = () => [
      {
        id: "price",
        label: "Price",
        value: weights.price || 5,
        icon: <DollarSign className="h-5 w-5" />,
        description: "How important is staying within your travel budget"
      },
      {
        id: "location",
        label: "Destination",
        value: weights.location || 5,
        icon: <MapPin className="h-5 w-5" />,
        description: "How important is the specific destination"
      },
      {
        id: "amenities",
        label: "Amenities & Features",
        value: weights.amenities || 4,
        icon: <Star className="h-5 w-5" />,
        description: "How important are the amenities and features"
      },
      {
        id: "duration",
        label: "Duration",
        value: weights.duration || 3,
        icon: <Clock className="h-5 w-5" />,
        description: "How important is the trip duration"
      },
      {
        id: "reviews",
        label: "Reviews & Ratings",
        value: weights.reviews || 4,
        icon: <Award className="h-5 w-5" />,
        description: "How important are reviews and ratings"
      }
    ];
    
    switch (formData.categoryFocus) {
      // Original categories
      case "jobs":
        categoryWeights = getJobWeights();
        break;
        
      case "rentals":
        categoryWeights = getRentalWeights();
        break;
        
      case "services":
        categoryWeights = getServiceWeights();
        break;
      
      // Earn money job categories
      case "business":
        categoryWeights = [
          ...getJobWeights(),
          {
            id: "clientRelations",
            label: "Client Relations",
            value: weights.clientRelations || 4,
            icon: <Star className="h-5 w-5" />,
            description: "How important are client relationship skills"
          }
        ];
        break;
        
      case "digital":
        categoryWeights = [
          ...getJobWeights(),
          {
            id: "techSkills",
            label: "Technical Skills",
            value: weights.techSkills || 5,
            icon: <Award className="h-5 w-5" />,
            description: "How important are specific technical skills"
          },
          {
            id: "remoteWork",
            label: "Remote Work",
            value: weights.remoteWork || 4,
            icon: <MapPin className="h-5 w-5" />,
            description: "How important is remote work capability"
          }
        ];
        break;
        
      case "skilled-trades":
        categoryWeights = [
          ...getJobWeights(),
          {
            id: "certification",
            label: "Certifications",
            value: weights.certification || 5,
            icon: <Award className="h-5 w-5" />,
            description: "How important are formal certifications"
          }
        ];
        break;
        
      case "transport":
        categoryWeights = [
          ...getJobWeights(),
          {
            id: "reliability",
            label: "Reliability",
            value: weights.reliability || 5,
            icon: <Clock className="h-5 w-5" />,
            description: "How important is reliability and punctuality"
          }
        ];
        break;
        
      case "education":
        categoryWeights = [
          ...getJobWeights(),
          {
            id: "qualifications",
            label: "Qualifications",
            value: weights.qualifications || 5,
            icon: <Award className="h-5 w-5" />,
            description: "How important are educational qualifications"
          }
        ];
        break;
        
      case "personal":
      case "outdoor-garden":
      case "errands":
      case "niche":
      case "community":
        categoryWeights = getJobWeights();
        break;
        
      // Service-oriented categories
      case "home-services":
      case "care-assistance":
      case "services-offered":
      case "tech-help":
      case "creative-help":
      case "event-help":
      case "household":
      case "pet-care":
      case "plant-care":
      case "childcare":
      case "elder-care":
      case "tutoring":
        categoryWeights = getServiceWeights();
        break;
        
      // Hire someone categories
      case "professional":
      case "tech-talent":
      case "creative":
      case "trade-workers":
      case "home-help":
      case "caregivers":
      case "education-staff":
      case "hospitality":
      case "retail-staff":
      case "drivers":
      case "admin-support":
      case "seasonal":
        categoryWeights = [
          ...getJobWeights(),
          {
            id: "reliability",
            label: "Reliability",
            value: weights.reliability || 5,
            icon: <Clock className="h-5 w-5" />,
            description: "How important is candidate reliability"
          },
          {
            id: "availability",
            label: "Availability",
            value: weights.availability || 4,
            icon: <Clock className="h-5 w-5" />,
            description: "How important is candidate availability"
          }
        ];
        break;
        
      // Rental categories
      case "apartments":
      case "houses":
      case "rooms":
      case "vacation-rentals":
      case "commercial-space":
      case "event-venues":
      case "parking-storage":
        categoryWeights = getRentalWeights();
        break;
        
      // Equipment rental categories
      case "equipment-rental":
      case "vehicle-rental":
      case "electronics-rental":
      case "furniture-rental":
      case "specialty-items":
        categoryWeights = [
          ...getRentalWeights(),
          {
            id: "condition",
            label: "Condition",
            value: weights.condition || 5,
            icon: <Star className="h-5 w-5" />,
            description: "How important is the condition of the rental item"
          },
          {
            id: "availability",
            label: "Availability",
            value: weights.availability || 4,
            icon: <Clock className="h-5 w-5" />,
            description: "How important is the rental availability"
          }
        ];
        break;
        
      // Marketplace categories
      case "electronics":
      case "home-goods":
      case "clothing":
      case "collectibles":
      case "sports-equipment":
      case "toys-games":
      case "vehicles":
      case "books-media":
      case "handmade":
      case "business-equipment":
      case "other-items":
      case "marketplace":
        categoryWeights = getMarketplaceWeights();
        break;
        
      // Learning categories
      case "academic":
      case "tech-skills":
      case "creative-arts":
      case "business-skills":
      case "trades-crafts":
      case "cooking-food":
      case "fitness-health":
      case "languages":
      case "personal-dev":
      case "hobbies":
      case "parenting-family":
      case "specialized-topics":
      case "learning":
      case "learning-resources":
        categoryWeights = getLearningWeights();
        break;
        
      // Travel categories
      case "beach-resorts":
      case "city-breaks":
      case "adventure-travel":
      case "cultural-tours":
      case "luxury-travel":
      case "budget-travel":
      case "family-trips":
      case "road-trips":
      case "cruises":
      case "wellness-retreats":
      case "food-wine":
      case "special-events":
      case "holiday":
      case "travel-destinations":
        categoryWeights = getTravelWeights();
        break;
        
      // Browsing and other categories
      case "trending":
      case "local-events":
      case "job-market":
      case "housing":
      case "community-groups":
      case "creative-showcase":
      case "deals-discounts":
      case "new-listings":
      case "browse":
      case "events":
      case "favors":
      case "transportation":
      case "community-service":
        categoryWeights = [
          {
            id: "relevance",
            label: "Relevance",
            value: weights.relevance || 5,
            icon: <Star className="h-5 w-5" />,
            description: "How important is content relevance"
          },
          {
            id: "recency",
            label: "Recency",
            value: weights.recency || 4,
            icon: <Clock className="h-5 w-5" />,
            description: "How important is content recency"
          },
          {
            id: "popularity",
            label: "Popularity",
            value: weights.popularity || 3,
            icon: <Award className="h-5 w-5" />,
            description: "How important is content popularity"
          },
          {
            id: "location",
            label: "Location",
            value: weights.location || 3,
            icon: <MapPin className="h-5 w-5" />,
            description: "How important is location relevance"
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
      
      {/* Navigation handled by main wizard container */}
    </div>
  );
}
