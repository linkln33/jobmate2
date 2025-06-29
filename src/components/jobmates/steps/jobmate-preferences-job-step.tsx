"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { JobPreferences, MainCategory, UserPreferences } from "@/types/compatibility";

interface JobMatePreferencesJobStepProps {
  preferences: Partial<UserPreferences>;
  onUpdate: (preferences: Partial<UserPreferences>) => void;
  onBack?: () => void;
  category?: MainCategory; // Added category prop to customize skill suggestions
  isHiring?: boolean; // Added isHiring prop for hiring-specific UI
}

export function JobMatePreferencesJobStep({ 
  preferences, 
  onUpdate,
  onBack,
  category = 'jobs', // Default to 'jobs' if no category is provided
  isHiring = false // Default to job seeking if not specified
}: JobMatePreferencesJobStepProps) {
  const [jobPrefs, setJobPrefs] = useState<JobPreferences>(preferences.categoryPreferences?.jobs || {
    minSalary: 0,
    maxSalary: 150000,
    desiredSkills: [] as string[],
    workArrangement: "hybrid",
    experienceLevel: "mid",
    companySize: "any",
    industryPreference: [] as string[],
    benefitsPreference: [] as string[],
    workSchedulePreference: "full-time"
  });
  
  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  
  // Category-specific skill suggestions
  const categorySkills: Record<string, string[]> = {
    // Original category
    'jobs': [
      "Project Management", "Microsoft Office", "Communication", "Leadership", 
      "Problem Solving", "Customer Service", "Time Management", "Teamwork"
    ],
    // New categories for earning money
    'business': [
      "Business Development", "Sales", "Marketing", "Entrepreneurship", 
      "Financial Analysis", "Strategic Planning", "Negotiation", "Leadership"
    ],
    'digital': [
      "Web Development", "Digital Marketing", "Content Creation", "SEO", 
      "Social Media Management", "Graphic Design", "Video Editing", "Analytics"
    ],
    'creative': [
      "Graphic Design", "Photography", "Video Production", "Writing", 
      "Illustration", "Animation", "Music Production", "Creative Direction"
    ],
    'professional': [
      "Consulting", "Legal Knowledge", "Accounting", "Project Management", 
      "Research", "Data Analysis", "Technical Writing", "Public Speaking"
    ],
    // Home services specific skills
    'home-services': [
      "Cleaning", "Gardening", "Lawn Care", "Plumbing", "Electrical Work", 
      "Carpentry", "Painting", "Furniture Assembly", "Appliance Repair", "Handyman Skills"
    ],
    'garden': [
      "Lawn Maintenance", "Plant Knowledge", "Landscaping", "Irrigation", 
      "Garden Design", "Pruning", "Pest Control", "Soil Management", "Outdoor Construction"
    ],
    'cleaning': [
      "Deep Cleaning", "Sanitization", "Organizing", "Window Cleaning", 
      "Carpet Cleaning", "Appliance Cleaning", "Eco-friendly Methods", "Stain Removal"
    ],
    'handyman': [
      "Carpentry", "Plumbing", "Electrical", "Drywall Repair", 
      "Furniture Assembly", "Painting", "Door/Window Repair", "Tool Knowledge"
    ],
    // Default for other categories
    'default': [
      "Communication", "Organization", "Time Management", "Problem Solving", 
      "Attention to Detail", "Customer Service", "Teamwork", "Adaptability"
    ]
  };
  
  // Get relevant skills based on the selected category
  const suggestedSkills = categorySkills[category] || categorySkills['jobs'];
  
  // Category-specific industry preferences
  const categoryIndustries: Record<string, string[]> = {
    // Original category
    'jobs': [
      "Technology", "Healthcare", "Finance", "Education", "Retail", 
      "Manufacturing", "Hospitality", "Construction", "Media", "Government"
    ],
    // New categories
    'business': [
      "Consulting", "E-commerce", "Real Estate", "Financial Services", 
      "Marketing Agency", "Legal Services", "Tech Startups", "Retail"
    ],
    'digital': [
      "Software Development", "Digital Marketing", "E-commerce", "Social Media", 
      "Content Creation", "Web Design", "App Development", "Online Education"
    ],
    'creative': [
      "Design Agency", "Media Production", "Advertising", "Publishing", 
      "Entertainment", "Fashion", "Gaming", "Arts & Culture"
    ],
    'professional': [
      "Consulting", "Legal", "Financial Services", "Healthcare", 
      "Education", "Non-profit", "Government", "Corporate"
    ],
    // Home services specific industries/service areas
    'home-services': [
      "Residential", "Commercial", "Apartment Complexes", "Condominiums", 
      "Single-Family Homes", "Rental Properties", "Offices", "Retail Spaces"
    ],
    'garden': [
      "Residential Gardens", "Commercial Landscapes", "Community Gardens", 
      "Parks", "Estates", "Rooftop Gardens", "Urban Gardens", "Garden Centers"
    ],
    'cleaning': [
      "Residential Cleaning", "Office Cleaning", "Move-in/Move-out", "Post-Construction", 
      "Commercial Spaces", "Vacation Rentals", "Regular Maintenance", "Deep Cleaning"
    ],
    'handyman': [
      "Residential Repairs", "Small Businesses", "Rental Properties", "Offices", 
      "Retail Spaces", "Restaurants", "Hotels", "Educational Facilities"
    ],
    // Default for other categories
    'default': [
      "Technology", "Retail", "Services", "Education", "Healthcare", 
      "Entertainment", "Food & Beverage", "Transportation", "Construction"
    ]
  };
  
  // Get relevant industries based on the selected category
  const commonIndustries = categoryIndustries[category] || categoryIndustries['jobs'];
  
  // Common benefits - must match string[] type
  const commonBenefits: string[] = [
    "Health Insurance", "Dental Insurance", "Vision Insurance", "401(k) Plan", 
    "Remote Work", "Flexible Hours", "Paid Time Off", "Professional Development", 
    "Parental Leave", "Wellness Programs"
  ];
  
  // Hiring-specific benefits by category
  const hiringBenefits: Record<string, string[]> = {
    'home-services': [
      "Transportation Provided", "Tools/Equipment Provided", "Flexible Schedule", 
      "Performance Bonuses", "Training Provided", "Growth Opportunities", 
      "Recurring Work", "Referral Bonuses"
    ],
    'garden': [
      "Equipment Provided", "Seasonal Bonuses", "Weather Accommodations", 
      "Training Provided", "Flexible Schedule", "Year-round Work Opportunities"
    ],
    'cleaning': [
      "Supplies Provided", "Flexible Schedule", "Regular Clients", 
      "Transportation Assistance", "Performance Bonuses", "Team Environment"
    ],
    'handyman': [
      "Tools Provided", "Vehicle Allowance", "Liability Insurance", 
      "Flexible Schedule", "Ongoing Training", "Performance Bonuses"
    ],
    'default': [
      "Competitive Pay", "Flexible Schedule", "Equipment Provided", 
      "Training Opportunities", "Growth Potential", "Regular Work"
    ]
  };
  
  // State for certification input
  const [requirementInput, setRequirementInput] = useState("");

  // Add a skill
  const addSkill = () => {
    if (skillInput.trim() && !jobPrefs.desiredSkills?.includes(skillInput.trim())) {
      setJobPrefs(prev => ({
        ...prev,
        desiredSkills: [...(prev.desiredSkills || []), skillInput.trim()]
      }));
      setSkillInput("");
    }
  };
  
  // Remove a skill
  const removeSkill = (i: number) => {
    setJobPrefs(prev => ({
      ...prev,
      desiredSkills: prev.desiredSkills?.filter((_, index) => index !== i) || []
    }));
  };
  
  // Add an industry
  const addIndustry = (industry: string) => {
    if (industry.trim() && !jobPrefs.industryPreference?.includes(industry.trim())) {
      setJobPrefs(prev => ({
        ...prev,
        industryPreference: [...(prev.industryPreference || []), industry.trim()]
      }));
      setIndustryInput("");
    }
  };
  
  // Remove an industry
  const removeIndustry = (industry: string) => {
    setJobPrefs(prev => ({
      ...prev,
      industryPreference: prev.industryPreference?.filter((item: string) => item !== industry) || []
    }));
  };
  
  // Toggle a benefit
  const toggleBenefit = (benefit: string) => {
    if (jobPrefs.benefitsPreference?.includes(benefit)) {
      setJobPrefs(prev => ({
        ...prev,
        benefitsPreference: prev.benefitsPreference?.filter(b => b !== benefit) || []
      }));
    } else {
      setJobPrefs(prev => ({
        ...prev,
        benefitsPreference: [...(prev.benefitsPreference || []), benefit]
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Prepare the job preferences with hiring-specific fields if applicable
    const updatedJobPrefs = isHiring ? {
      ...jobPrefs,
      isHiring: true,
      hiringCategory: category
    } : jobPrefs;
    
    // Save the job preferences to the parent component
    onUpdate({
      ...preferences,
      categoryPreferences: {
        ...preferences.categoryPreferences,
        jobs: updatedJobPrefs
      }
    });
    
    // If there's an onBack handler, call it to move to the next step
    if (onBack) {
      onBack();
    }
  };
  
  // Get hiring benefits if applicable
  const hiringBenefitOptions = isHiring && category && hiringBenefits[category as keyof typeof hiringBenefits]
    ? hiringBenefits[category as keyof typeof hiringBenefits]
    : hiringBenefits['default'];

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">
          {isHiring ? "Hiring Preferences" : "Job Preferences"}
        </h2>
        <p className="text-muted-foreground">
          {isHiring 
            ? `Tell us what you're looking for in a ${category.replace(/-/g, ' ')} worker` 
            : "Tell us what you're looking for in your next job"}
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Salary/Budget Range */}
        <div className="space-y-4">
          <h3 className="font-medium">{isHiring ? "Budget Range" : "Salary Range"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary">{isHiring ? "Minimum Budget ($)" : "Minimum Salary ($)"}</Label>
              <Input
                id="minSalary"
                type="number"
                value={jobPrefs.minSalary || 0}
                onChange={(e) => setJobPrefs(prev => ({
                  ...prev,
                  minSalary: parseInt(e.target.value)
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSalary">{isHiring ? "Maximum Budget ($)" : "Maximum Salary ($)"}</Label>
              <Input
                id="maxSalary"
                type="number"
                value={jobPrefs.maxSalary || 150000}
                onChange={(e) => setJobPrefs(prev => ({
                  ...prev,
                  maxSalary: parseInt(e.target.value)
                }))}
              />
            </div>
          </div>
          {isHiring && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {["hourly", "fixed-price", "negotiable"].map((option) => (
                <Button
                  key={option}
                  variant={jobPrefs.paymentType === option ? "default" : "outline"}
                  onClick={() => setJobPrefs(prev => ({ ...prev, paymentType: option }))}
                  className="capitalize"
                >
                  {option.replace("-", " ")}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* Skills */}
        <div className="space-y-4">
          <h3 className="font-medium">{isHiring ? "Required Skills" : "Desired Skills"}</h3>
          <div className="flex gap-2">
            <Input
              placeholder={isHiring 
                ? `Add a required skill for ${category.replace(/-/g, ' ')}` 
                : "Add a skill (e.g., JavaScript, Project Management)"}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill}>Add</Button>
          </div>
          
          {/* Display selected skills */}
          <div className="flex flex-wrap gap-2 mt-2">
            {jobPrefs.desiredSkills?.map((skill, i) => (
              <Badge key={i} variant="secondary" className="flex items-center gap-1">
                {skill}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeSkill(i)}
                />
              </Badge>
            ))}
            {!jobPrefs.desiredSkills?.length && (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
          
          {/* Suggested skills based on category */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              {isHiring 
                ? `Suggested skills to require for ${category.replace(/-/g, ' ')}:` 
                : `Suggested skills for ${category}:`}
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill: string) => (
                <Badge 
                  key={skill} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => {
                    if (!jobPrefs.desiredSkills?.includes(skill)) {
                      setJobPrefs((prev: JobPreferences) => ({
                        ...prev,
                        desiredSkills: [...(prev.desiredSkills || []), skill]
                      }));
                    }
                  }}
                >
                  + {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Work Location */}
        <div className="space-y-4">
          <h3 className="font-medium">{isHiring ? "Work Location" : "Remote Work Preference"}</h3>
          <div className="grid grid-cols-3 gap-2">
            {["remote", "hybrid", "onsite"].map((option) => (
              <Button
                key={option}
                variant={jobPrefs.remotePreference === option ? "default" : "outline"}
                onClick={() => setJobPrefs(prev => ({ ...prev, remotePreference: option }))}
                className="capitalize"
                disabled={isHiring && typeof category === 'string' && category.includes('home') && option === "remote"}
              >
                {option}
                {isHiring && typeof category === 'string' && category.includes('home') && option === "remote" && " (N/A)"}
              </Button>
            ))}
          </div>
          {isHiring && category.includes('home') && (
            <p className="text-sm text-muted-foreground">Home services typically require on-site work</p>
          )}
        </div>
        
        {/* Experience Level */}
        <div className="space-y-4">
          <h3 className="font-medium">Experience Level</h3>
          <div className="grid grid-cols-4 gap-2">
            {["entry", "mid", "senior", "executive"].map((option) => (
              <Button
                key={option}
                variant={jobPrefs.experienceLevel === option ? "default" : "outline"}
                onClick={() => setJobPrefs(prev => ({ ...prev, experienceLevel: option }))}
                className="capitalize"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Company Size or Provider Type */}
        <div className="space-y-4">
          <h3 className="font-medium">{isHiring ? "Service Provider Type" : "Company Size"}</h3>
          <div className="grid grid-cols-3 gap-2">
            {isHiring ? [
              // Options for hiring
              "individual", "small-business", "professional"
            ].map((option) => (
              <Button
                key={option}
                variant={jobPrefs.providerType === option ? "default" : "outline"}
                onClick={() => setJobPrefs(prev => ({ ...prev, providerType: option }))}
                className="capitalize"
              >
                {option.replace("-", " ")}
              </Button>
            )) : [
              // Options for job seeking
              "startup", "small", "medium", "large", "any"
            ].map((option) => (
              <Button
                key={option}
                variant={jobPrefs.companySize === option ? "default" : "outline"}
                onClick={() => setJobPrefs(prev => ({ ...prev, companySize: option }))}
                className="capitalize"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Industry Preference */}
        <div className="space-y-4">
          <h3 className="font-medium">
            {isHiring ? "Service Areas" : "Industry Preferences"}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonIndustries.map((industry) => (
              <Badge 
                key={industry} 
                variant={jobPrefs.industryPreference?.includes(industry) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => jobPrefs.industryPreference?.includes(industry) 
                  ? removeIndustry(industry) 
                  : addIndustry(industry)
                }
              >
                {industry}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={isHiring 
                ? "Add another service area" 
                : "Add another industry"}
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIndustry(industryInput)}
            />
            <Button onClick={() => addIndustry(industryInput)}>Add</Button>
          </div>
        </div>
        
        {isHiring ? (
          /* Hiring-specific sections */
          <>
            {/* Availability Requirements */}
            <div className="space-y-4">
              <h3 className="font-medium">Availability Requirements</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Weekdays", "Weekends", "Evenings", "Early Mornings",
                  "Flexible Hours", "On-Call", "Regular Schedule", "Seasonal"
                ].map((availability) => (
                  <div key={availability} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`availability-${availability}`} 
                      checked={jobPrefs.availabilityRequirements?.includes(availability)}
                      onCheckedChange={() => {
                        setJobPrefs(prev => {
                          const current = [...(prev.availabilityRequirements || [])];
                          if (current.includes(availability)) {
                            return {
                              ...prev,
                              availabilityRequirements: current.filter(a => a !== availability)
                            };
                          } else {
                            return {
                              ...prev,
                              availabilityRequirements: [...current, availability]
                            };
                          }
                        });
                      }}
                    />
                    <Label htmlFor={`availability-${availability}`}>{availability}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Benefits Offered */}
            <div className="space-y-4">
              <h3 className="font-medium">Benefits Offered</h3>
              <div className="grid grid-cols-2 gap-2">
                {hiringBenefitOptions.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`hiring-benefit-${benefit}`} 
                      checked={jobPrefs.benefitsOffered?.includes(benefit)}
                      onCheckedChange={() => {
                        setJobPrefs(prev => {
                          const current = [...(prev.benefitsOffered || [])];
                          if (current.includes(benefit)) {
                            return {
                              ...prev,
                              benefitsOffered: current.filter(b => b !== benefit)
                            };
                          } else {
                            return {
                              ...prev,
                              benefitsOffered: [...current, benefit]
                            };
                          }
                        });
                      }}
                    />
                    <Label htmlFor={`hiring-benefit-${benefit}`}>{benefit}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Certification Requirements */}
            <div className="space-y-4">
              <h3 className="font-medium">Certification Requirements</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Add required certification"
                  value={requirementInput || ''}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && requirementInput) {
                      setJobPrefs(prev => ({
                        ...prev,
                        certificationRequirements: [...(prev.certificationRequirements || []), requirementInput]
                      }));
                      setRequirementInput('');
                    }
                  }}
                />
                <Button onClick={() => {
                  if (requirementInput) {
                    setJobPrefs(prev => ({
                      ...prev,
                      certificationRequirements: [...(prev.certificationRequirements || []), requirementInput]
                    }));
                    setRequirementInput('');
                  }
                }}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(jobPrefs.certificationRequirements || []).map((cert: string) => (
                  <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                    {cert}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setJobPrefs(prev => ({
                        ...prev,
                        certificationRequirements: prev.certificationRequirements?.filter((c: string) => c !== cert) || []
                      }))}
                    />
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Work Duration */}
            <div className="space-y-4">
              <h3 className="font-medium">Work Duration</h3>
              <div className="grid grid-cols-3 gap-2">
                {["one-time", "short-term", "long-term"].map((option) => (
                  <Button
                    key={option}
                    variant={jobPrefs.workDuration === option ? "default" : "outline"}
                    onClick={() => setJobPrefs(prev => ({ ...prev, workDuration: option }))}
                    className="capitalize"
                  >
                    {option.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Job seeker specific sections */
          <>
            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="font-medium">Important Benefits</h3>
              <div className="grid grid-cols-2 gap-2">
                {commonBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`benefit-${benefit}`} 
                      checked={jobPrefs.benefitsPreference?.includes(benefit)}
                      onCheckedChange={() => toggleBenefit(benefit)}
                    />
                    <Label htmlFor={`benefit-${benefit}`}>{benefit}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Work Schedule */}
            <div className="space-y-4">
              <h3 className="font-medium">Work Schedule</h3>
              <div className="grid grid-cols-3 gap-2">
                {["full-time", "part-time", "contract"].map((option) => (
                  <Button
                    key={option}
                    variant={jobPrefs.workSchedulePreference === option ? "default" : "outline"}
                    onClick={() => setJobPrefs(prev => ({ ...prev, workSchedulePreference: option }))}
                    className="capitalize"
                  >
                    {option.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Navigation buttons moved to main wizard footer */}
      <div className="hidden">
        <Button onClick={handleSubmit}>Continue</Button>
      </div>
    </div>
  );
}
