"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobMateFormData } from "@/types/jobmate";
import { 
  Calendar,
  Clock, 
  Bell,
  Users,
  Share2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  DollarSign,
  MapPin,
  Briefcase,
  Building,
  Star,
  Home
} from "lucide-react";
import { useState } from "react";

interface JobMatePreviewStepProps {
  formData: JobMateFormData;
  onUpdate: (formData: JobMateFormData) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function JobMatePreviewStep({ 
  formData, 
  onUpdate,
  onBack,
  onSubmit,
  isSubmitting
}: JobMatePreviewStepProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("basic");
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Get category icon
  const getCategoryIcon = () => {
    switch (formData.categoryFocus) {
      case "jobs":
        return <Briefcase className="h-5 w-5" />;
      case "rentals":
        return <Home className="h-5 w-5" />;
      case "services":
        return <Star className="h-5 w-5" />;
      default:
        return <Briefcase className="h-5 w-5" />;
    }
  };
  
  // Format category name
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  // Get intent display text
  const getIntentDisplay = () => {
    switch (formData.intent) {
      case "earn":
        return "Find Opportunities";
      case "hire":
        return "Hire Talent";
      case "rent":
        return "Find Rentals";
      case "list":
        return "List Property";
      case "buy":
        return "Buy Services";
      case "sell":
        return "Sell Services";
      case "browse":
        return "Browse Listings";
      case "help":
        return "Find Help";
      case "learn":
        return "Learn Skills";
      case "holiday":
        return "Holiday & Travel";
      default:
        return formData.intent;
    }
  };
  
  // Render preferences summary based on category
  const renderPreferencesSummary = () => {
    const categoryPrefs = formData.preferences?.categoryPreferences?.jobs || formData.preferences?.categoryPreferences?.rentals || formData.preferences?.categoryPreferences?.services;
    if (!categoryPrefs) return <p>No preferences set</p>;
    
    switch (formData.categoryFocus) {
      case "jobs":
        const jobPrefs = formData.preferences?.categoryPreferences?.jobs;
        if (!jobPrefs) return <p>No job preferences set</p>;
        
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>
                Salary: ${jobPrefs.minSalary || 0} - ${jobPrefs.maxSalary || 150000}
              </span>
            </div>
            {jobPrefs.desiredSkills && jobPrefs.desiredSkills.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {jobPrefs.desiredSkills.slice(0, 5).map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {jobPrefs.desiredSkills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{jobPrefs.desiredSkills.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">
                {jobPrefs.companySize || "Any"} company · {jobPrefs.remotePreference ? "Remote" : "On-site"} work
              </span>
            </div>
          </div>
        );
        
      case "rentals":
        const rentalPrefs = formData.preferences?.categoryPreferences?.rentals;
        if (!rentalPrefs) return <p>No rental preferences set</p>;
        
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>
                Price: ${rentalPrefs.minPrice || 0} - ${rentalPrefs.maxPrice || 5000}/month
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span>
                {rentalPrefs.bedrooms || 1} bed · {rentalPrefs.bathrooms || 1} bath
              </span>
            </div>
            {rentalPrefs.rentalTypes && rentalPrefs.rentalTypes.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Property Types:</p>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(rentalPrefs.rentalTypes) && rentalPrefs.rentalTypes.map((type: string) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case "services":
        const servicePrefs = formData.preferences?.categoryPreferences?.services;
        if (!servicePrefs) return <p>No service preferences set</p>;
        
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>
                Budget: ${servicePrefs.minPrice || 0} - ${servicePrefs.maxPrice || 1000}
              </span>
            </div>
            {servicePrefs.serviceTypes && servicePrefs.serviceTypes.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Service Types:</p>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(servicePrefs.serviceTypes) && servicePrefs.serviceTypes.slice(0, 5).map((type: string) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                  {Array.isArray(servicePrefs.serviceTypes) && servicePrefs.serviceTypes.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{servicePrefs.serviceTypes.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>
                Min Rating: {servicePrefs.minProviderRating || 4}/5
              </span>
            </div>
          </div>
        );
        
      default:
        return <p>No preferences set</p>;
    }
  };
  
  // Render weights summary
  const renderWeightsSummary = () => {
    const weights = formData.preferences?.weights;
    if (!weights || Object.keys(weights).length === 0) return <p>No weights set</p>;
    
    // Get top 3 weights
    const sortedWeights = Object.entries(weights)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3);
    
    return (
      <div className="space-y-2">
        {sortedWeights.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="capitalize">{key}</span>
            <Badge variant={(value as number) >= 4 ? "default" : "secondary"}>
              {value}/5
            </Badge>
          </div>
        ))}
      </div>
    );
  };
  
  // Render settings summary
  const renderSettingsSummary = () => {
    const settings = formData.settings;
    if (!settings) return <p>Default settings</p>;
    
    return (
      <div className="space-y-3">
        {settings.autoRun && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              Auto-runs {settings.runFrequency || "daily"}
            </span>
          </div>
        )}
        {settings.notifications && (
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span>Notifications enabled</span>
          </div>
        )}
        {settings.isPublic && (
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <span>Available as template</span>
          </div>
        )}
        {settings.isCollaborative && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Collaborative</span>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Review Your JobMate</h2>
        <p className="text-muted-foreground mt-2">
          Review and confirm your JobMate details before creating
        </p>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg border flex items-center gap-4">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl">
          {formData.emoji || "🤖"}
        </div>
        <div>
          <h3 className="text-xl font-bold">{formData.name || "Unnamed JobMate"}</h3>
          <div className="flex items-center gap-2 mt-1">
            {getCategoryIcon()}
            <Badge variant="outline" className="capitalize">
              {formatCategory(formData.categoryFocus)}
            </Badge>
            <Badge>{getIntentDisplay()}</Badge>
          </div>
        </div>
      </div>
      
      {formData.description && (
        <div className="bg-background border rounded-lg p-4">
          <p className="text-sm">{formData.description}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {/* Basic Information */}
        <Card>
          <CardHeader 
            className="p-4 cursor-pointer"
            onClick={() => toggleSection("basic")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Basic Information</CardTitle>
              {expandedSection === "basic" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedSection === "basic" && (
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{formData.name || "Unnamed"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="capitalize">{formData.categoryFocus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Intent</span>
                  <span>{getIntentDisplay()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        
        {/* Preferences */}
        <Card>
          <CardHeader 
            className="p-4 cursor-pointer"
            onClick={() => toggleSection("preferences")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Preferences</CardTitle>
              {expandedSection === "preferences" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedSection === "preferences" && (
            <CardContent className="p-4 pt-0">
              {renderPreferencesSummary()}
            </CardContent>
          )}
        </Card>
        
        {/* Weights */}
        <Card>
          <CardHeader 
            className="p-4 cursor-pointer"
            onClick={() => toggleSection("weights")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Priority Weights</CardTitle>
              {expandedSection === "weights" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedSection === "weights" && (
            <CardContent className="p-4 pt-0">
              {renderWeightsSummary()}
            </CardContent>
          )}
        </Card>
        
        {/* Settings */}
        <Card>
          <CardHeader 
            className="p-4 cursor-pointer"
            onClick={() => toggleSection("settings")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Settings</CardTitle>
              {expandedSection === "settings" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedSection === "settings" && (
            <CardContent className="p-4 pt-0">
              {renderSettingsSummary()}
            </CardContent>
          )}
        </Card>
      </div>
      
      {/* Navigation handled by main wizard container */}
    </div>
  );
}
