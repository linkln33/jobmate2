"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
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
  
  const updateNameAndDetails = (name: string, emoji: string, description: string, settings?: JobMateFormData['settings']) => {
    setFormData(prev => ({
      ...prev,
      name,
      emoji,
      description,
      settings: settings || prev.settings
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
                { value: "holiday", label: "Holiday & Travel", icon: "🌴" },
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
        // Show different category options based on the selected intent
        if (formData.intent === "earn") {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What type of work are you looking for?</h2>
              <p className="text-center text-muted-foreground">
                Choose the category that best matches your skills and interests
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  // Job categories for earning money
                  { value: "business", label: "Business Services", icon: "💼", description: "Virtual assistance, data entry, bookkeeping" },
                  { value: "digital", label: "Digital & Creative", icon: "💻", description: "Web development, design, content writing" },
                  { value: "skilled-trades", label: "Skilled Trades", icon: "🛠️", description: "Carpentry, electrical, plumbing" },
                  { value: "home-services", label: "Home Services", icon: "🏠", description: "Cleaning, repairs, maintenance" },
                  { value: "care-assistance", label: "Care & Assistance", icon: "👶", description: "Babysitting, elder care, pet sitting" },
                  { value: "transport", label: "Transport & Driving", icon: "🚚", description: "Delivery, moving, ride services" },
                  { value: "education", label: "Education & Coaching", icon: "🎓", description: "Tutoring, coaching, mentorship" },
                  { value: "personal", label: "Personal & Lifestyle", icon: "👗", description: "Event planning, beauty services, photography" },
                  { value: "outdoor-garden", label: "Outdoor & Garden", icon: "🌿", description: "Landscaping, lawn care, gardening" },
                  { value: "errands", label: "Errands & Daily Help", icon: "🛒", description: "Shopping, deliveries, meal prep" },
                  { value: "niche", label: "Niche Services", icon: "🧱", description: "Specialized skills and unique services" },
                  { value: "community", label: "Community Services", icon: "💡", description: "Non-profit, public benefit work" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 text-center"
                    onClick={() => updateCategory(option.value as MainCategory)}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground px-2">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        } else if (formData.intent === "hire") {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What type of talent are you looking to hire?</h2>
              <p className="text-center text-muted-foreground">
                Choose the category that best matches your hiring needs
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  // Hiring categories
                  { value: "professional", label: "Professional Services", icon: "👔", description: "Consultants, advisors, specialists" },
                  { value: "tech-talent", label: "Tech & Development", icon: "💻", description: "Developers, designers, IT specialists" },
                  { value: "creative", label: "Creative & Media", icon: "🎨", description: "Writers, designers, artists, photographers" },
                  { value: "trade-workers", label: "Skilled Trades", icon: "🛠️", description: "Contractors, technicians, craftspeople" },
                  { value: "home-help", label: "Home Services", icon: "🏠", description: "Cleaners, maintenance, repairs" },
                  { value: "caregivers", label: "Care & Support", icon: "🤲", description: "Childcare, elder care, healthcare" },
                  { value: "education-staff", label: "Education & Training", icon: "🎓", description: "Teachers, trainers, coaches" },
                  { value: "hospitality", label: "Hospitality & Events", icon: "🍽️", description: "Food service, event staff, hotel workers" },
                  { value: "retail-staff", label: "Retail & Customer Service", icon: "🛍️", description: "Sales associates, customer support" },
                  { value: "drivers", label: "Drivers & Delivery", icon: "🚚", description: "Delivery drivers, chauffeurs, couriers" },
                  { value: "admin-support", label: "Administrative Support", icon: "📊", description: "Assistants, data entry, office support" },
                  { value: "seasonal", label: "Seasonal & Temporary", icon: "⏱️", description: "Short-term help, event staff, seasonal work" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 text-center"
                    onClick={() => updateCategory(option.value as MainCategory)}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground px-2">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        } else if (formData.intent === "sell") {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What are you looking to sell?</h2>
              <p className="text-center text-muted-foreground">
                Choose the category that best matches your items or services
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  // Selling categories
                  { value: "electronics", label: "Electronics & Tech", icon: "📱", description: "Phones, computers, gadgets, accessories" },
                  { value: "home-goods", label: "Home & Furniture", icon: "🛋️", description: "Furniture, decor, appliances" },
                  { value: "clothing", label: "Clothing & Fashion", icon: "👗", description: "Clothes, shoes, accessories, jewelry" },
                  { value: "collectibles", label: "Collectibles & Art", icon: "🏺", description: "Art, antiques, memorabilia, rare items" },
                  { value: "sports-equipment", label: "Sports & Outdoors", icon: "⚽", description: "Sporting goods, outdoor gear, fitness equipment" },
                  { value: "toys-games", label: "Toys & Games", icon: "🎮", description: "Toys, board games, video games" },
                  { value: "vehicles", label: "Vehicles & Parts", icon: "🚗", description: "Cars, bikes, boats, auto parts" },
                  { value: "books-media", label: "Books & Media", icon: "📚", description: "Books, music, movies, instruments" },
                  { value: "handmade", label: "Handmade & Crafts", icon: "🧲", description: "Handcrafted items, art, crafting supplies" },
                  { value: "business-equipment", label: "Business Equipment", icon: "💼", description: "Office furniture, tools, industrial equipment" },
                  { value: "services-offered", label: "Services Offered", icon: "🛠️", description: "Professional services, freelance work" },
                  { value: "other-items", label: "Other Items", icon: "💰", description: "Miscellaneous items for sale" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 text-center"
                    onClick={() => updateCategory(option.value as MainCategory)}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground px-2">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        } else if (formData.intent === "rent") {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What type of rental are you looking for?</h2>
              <p className="text-center text-muted-foreground">
                Choose the category that best matches your rental needs
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  // Rental categories
                  { value: "apartments", label: "Apartments & Flats", icon: "🏢", description: "Studios, 1-3 bedroom apartments, penthouses" },
                  { value: "houses", label: "Houses & Villas", icon: "🏠", description: "Single family homes, townhouses, villas" },
                  { value: "rooms", label: "Rooms & Shared", icon: "🛏️", description: "Private rooms, shared accommodations" },
                  { value: "vacation-rentals", label: "Vacation Properties", icon: "🏖️", description: "Holiday homes, cabins, beach houses" },
                  { value: "commercial-space", label: "Commercial Space", icon: "🏢", description: "Offices, retail, industrial spaces" },
                  { value: "event-venues", label: "Event Venues", icon: "🎉", description: "Party venues, conference rooms, halls" },
                  { value: "parking-storage", label: "Parking & Storage", icon: "🚗", description: "Parking spaces, storage units, garages" },
                  { value: "equipment-rental", label: "Equipment Rental", icon: "🛠️", description: "Tools, machinery, equipment" },
                  { value: "vehicle-rental", label: "Vehicle Rental", icon: "🚙", description: "Cars, bikes, boats, RVs" },
                  { value: "electronics-rental", label: "Electronics Rental", icon: "💻", description: "Cameras, computers, AV equipment" },
                  { value: "furniture-rental", label: "Furniture Rental", icon: "🛋️", description: "Home and office furniture" },
                  { value: "specialty-items", label: "Specialty Items", icon: "💎", description: "Formal wear, costumes, unique items" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 text-center"
                    onClick={() => updateCategory(option.value as MainCategory)}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground px-2">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        } else if (formData.intent === "help") {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What type of help are you looking for?</h2>
              <p className="text-center text-muted-foreground">
                Choose the category that best matches the assistance you need
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  // Help/favor categories
                  { value: "household", label: "Household Tasks", icon: "🏠", description: "Moving, assembly, repairs, cleaning" },
                  { value: "errands", label: "Errands & Deliveries", icon: "🛒", description: "Shopping, pickup/delivery, waiting in line" },
                  { value: "tech-help", label: "Tech Support", icon: "💻", description: "Computer help, device setup, troubleshooting" },
                  { value: "pet-care", label: "Pet Care", icon: "🐶", description: "Pet sitting, dog walking, pet transportation" },
                  { value: "plant-care", label: "Plant & Garden Care", icon: "🌿", description: "Watering plants, garden maintenance" },
                  { value: "transportation", label: "Transportation", icon: "🚗", description: "Rides, carpooling, airport pickup" },
                  { value: "childcare", label: "Childcare & Babysitting", icon: "👶", description: "Babysitting, school pickup, playdates" },
                  { value: "elder-care", label: "Elder Care & Support", icon: "👨‍🦳", description: "Companionship, assistance, check-ins" },
                  { value: "tutoring", label: "Tutoring & Mentoring", icon: "📚", description: "Academic help, skill teaching, mentorship" },
                  { value: "event-help", label: "Event Assistance", icon: "🎉", description: "Party setup, serving, cleanup" },
                  { value: "creative-help", label: "Creative Projects", icon: "🎨", description: "Design help, photography, creative input" },
                  { value: "community-service", label: "Community Service", icon: "🤝", description: "Volunteering, community projects, activism" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 text-center"
                    onClick={() => updateCategory(option.value as MainCategory)}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground px-2">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        } else if (formData.intent === "learn") {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What would you like to learn about?</h2>
              <p className="text-center text-muted-foreground">
                Choose the category that best matches your learning interests
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  // Learning categories
                  { value: "academic", label: "Academic Subjects", icon: "📚", description: "Math, science, languages, humanities" },
                  { value: "tech-skills", label: "Technology Skills", icon: "💻", description: "Programming, digital tools, IT skills" },
                  { value: "creative-arts", label: "Creative Arts", icon: "🎨", description: "Drawing, music, writing, photography" },
                  { value: "business-skills", label: "Business & Career", icon: "💼", description: "Marketing, finance, leadership, entrepreneurship" },
                  { value: "trades-crafts", label: "Trades & Crafts", icon: "🛠️", description: "Woodworking, electrical, plumbing, crafting" },
                  { value: "cooking-food", label: "Cooking & Food", icon: "🍳", description: "Recipes, techniques, nutrition, baking" },
                  { value: "fitness-health", label: "Fitness & Health", icon: "🏋️", description: "Exercise, nutrition, wellness, sports" },
                  { value: "languages", label: "Languages", icon: "🌐", description: "Foreign languages, conversation practice" },
                  { value: "personal-dev", label: "Personal Development", icon: "💡", description: "Life skills, mindfulness, productivity" },
                  { value: "hobbies", label: "Hobbies & Leisure", icon: "🎮", description: "Games, collecting, outdoor activities" },
                  { value: "parenting-family", label: "Parenting & Family", icon: "👪", description: "Childcare, family dynamics, education" },
                  { value: "specialized-topics", label: "Specialized Topics", icon: "🔍", description: "Niche subjects, advanced topics" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 text-center"
                    onClick={() => updateCategory(option.value as MainCategory)}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground px-2">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        } else if (formData.intent === "holiday") {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What type of travel experience are you looking for?</h2>
              <p className="text-center text-muted-foreground">
                Choose the category that best matches your travel interests
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  // Travel categories
                  { value: "beach-resorts", label: "Beach & Resorts", icon: "🏖️", description: "Beach vacations, all-inclusive resorts" },
                  { value: "city-breaks", label: "City Breaks", icon: "🏙️", description: "Urban exploration, weekend getaways" },
                  { value: "adventure-travel", label: "Adventure Travel", icon: "🏔️", description: "Hiking, camping, outdoor activities" },
                  { value: "cultural-tours", label: "Cultural Experiences", icon: "🌍", description: "Historical sites, museums, local culture" },
                  { value: "luxury-travel", label: "Luxury Travel", icon: "💎", description: "High-end accommodations, exclusive experiences" },
                  { value: "budget-travel", label: "Budget Travel", icon: "💰", description: "Affordable trips, backpacking, hostels" },
                  { value: "family-trips", label: "Family Vacations", icon: "👪", description: "Kid-friendly destinations and activities" },
                  { value: "road-trips", label: "Road Trips", icon: "🚗", description: "Driving tours, scenic routes, car rentals" },
                  { value: "cruises", label: "Cruises & Sailing", icon: "🚢", description: "Ocean cruises, river cruises, sailing trips" },
                  { value: "wellness-retreats", label: "Wellness Retreats", icon: "🥕", description: "Spa vacations, yoga retreats, wellness centers" },
                  { value: "food-wine", label: "Food & Wine Tours", icon: "🍷", description: "Culinary experiences, wine tasting, food tours" },
                  { value: "special-events", label: "Special Events", icon: "🎉", description: "Festivals, sporting events, concerts" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 text-center"
                    onClick={() => updateCategory(option.value as MainCategory)}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground px-2">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        } else if (formData.intent === "browse") {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What are you interested in browsing?</h2>
              <p className="text-center text-muted-foreground">
                Choose a category to explore listings and opportunities
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  // Browsing categories
                  { value: "trending", label: "Trending Now", icon: "🔥", description: "Popular listings across all categories" },
                  { value: "local-events", label: "Local Events", icon: "🎉", description: "Happenings in your area" },
                  { value: "job-market", label: "Job Market", icon: "💼", description: "Employment opportunities and trends" },
                  { value: "marketplace", label: "Marketplace", icon: "🛒", description: "Items for sale from all categories" },
                  { value: "housing", label: "Housing Options", icon: "🏠", description: "Rentals, real estate, shared living" },
                  { value: "services", label: "Services Directory", icon: "🛠️", description: "Professional and personal services" },
                  { value: "learning-resources", label: "Learning Resources", icon: "📚", description: "Courses, workshops, educational content" },
                  { value: "community-groups", label: "Community Groups", icon: "👥", description: "Local organizations and meetups" },
                  { value: "creative-showcase", label: "Creative Showcase", icon: "🎨", description: "Art, design, and creative projects" },
                  { value: "travel-destinations", label: "Travel Destinations", icon: "🌎", description: "Places to visit and explore" },
                  { value: "deals-discounts", label: "Deals & Discounts", icon: "💳", description: "Special offers and promotions" },
                  { value: "new-listings", label: "New Listings", icon: "✨", description: "Recently added opportunities" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 text-center"
                    onClick={() => updateCategory(option.value as MainCategory)}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground px-2">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        } else {
          // Default category selection for other intents
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
        }
      
      case "preferences":
        // Render different preference forms based on category
        switch (formData.categoryFocus) {
          // Original categories
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
            
          // Earn money job categories
          case "business":
          case "digital":
          case "skilled-trades":
          case "transport":
          case "education":
          case "personal":
          case "outdoor-garden":
          case "errands":
          case "niche":
          case "community":
            return (
              <JobMatePreferencesJobStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                category={formData.categoryFocus}
              />
            );
            
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
            return (
              <JobMatePreferencesServiceStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                category={formData.categoryFocus}
              />
            );
            
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
            return (
              <JobMatePreferencesJobStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                category={formData.categoryFocus}
                isHiring={true}
              />
            );
            
          // Rental categories
          case "apartments":
          case "houses":
          case "rooms":
          case "vacation-rentals":
          case "commercial-space":
          case "event-venues":
          case "parking-storage":
            return (
              <JobMatePreferencesRentalStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                category={formData.categoryFocus}
              />
            );
            
          // Equipment rental categories
          case "equipment-rental":
          case "vehicle-rental":
          case "electronics-rental":
          case "furniture-rental":
          case "specialty-items":
            return (
              <JobMatePreferencesServiceStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                category={formData.categoryFocus}
                isRental={true}
              />
            );
            
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
            return (
              <JobMatePreferencesServiceStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                category={formData.categoryFocus}
                isMarketplace={true}
              />
            );
            
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
            return (
              <JobMatePreferencesServiceStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                category={formData.categoryFocus}
                isLearning={true}
              />
            );
            
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
            return (
              <JobMatePreferencesServiceStep
                preferences={formData.preferences || {}}
                onUpdate={updatePreferences}
                category={formData.categoryFocus}
                isTravel={true}
              />
            );
            
          // Browsing categories
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
            return (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Set Your Preferences</h2>
                <p className="text-center text-muted-foreground">
                  Tell us what you're looking for in {formData.categoryFocus}
                </p>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea 
                      id="description"
                      className="w-full min-h-[100px] p-3 border rounded-md"
                      placeholder="Describe what you're looking for..."
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            );
        }
        break;
        
      case "weights":
        return (
          <JobMateWeightsStep
            formData={formData}
            onUpdate={(updatedFormData) => {
              // Extract just the weights from the updated form data
              const weights = updatedFormData.preferences?.weights || {};
              // Update the form data with the new weights
              setFormData(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  weights: weights
                }
              }));
              // Move to the next step
              nextStep();
            }}
            onBack={prevStep}
          />
        );
        
      case "name":
        return (
          <JobMatePersonalizeStep
            formData={formData}
            onUpdate={(updatedFormData) => {
              // Extract the name, emoji, description, and settings from the updated form data
              const { name, emoji, description, settings } = updatedFormData;
              // Update the form data with the new name and details
              setFormData(prev => ({
                ...prev,
                name,
                emoji,
                description,
                settings
              }));
              // Move to the next step
              nextStep();
            }}
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
      
      <CardContent className="pt-6 bg-white/5 backdrop-blur-sm max-h-[70vh] overflow-y-auto scrollbar-hide">
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-md shadow-inner">
          {renderStep()}
        </div>
      </CardContent>
      
      {/* Wizard navigation footer */}
      {currentStep > 0 && (
        <CardFooter className="border-t border-white/10 bg-white/5 flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={nextStep}>
              Continue
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Finish
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
