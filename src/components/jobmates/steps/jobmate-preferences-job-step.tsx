"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPreferences } from "@/types/compatibility";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface JobMatePreferencesJobStepProps {
  preferences: Partial<UserPreferences>;
  onUpdate: (preferences: Partial<UserPreferences>) => void;
  onBack?: () => void;
}

export function JobMatePreferencesJobStep({ 
  preferences, 
  onUpdate,
  onBack 
}: JobMatePreferencesJobStepProps) {
  const [jobPrefs, setJobPrefs] = useState(preferences.categoryPreferences?.jobs || {
    minSalary: 0,
    maxSalary: 150000,
    desiredSkills: [],
    remotePreference: "hybrid",
    experienceLevel: "mid",
    companySize: "any",
    industryPreference: [],
    benefitsPreference: [],
    workSchedulePreference: "full-time"
  });
  
  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  
  // Common industries for suggestions
  const commonIndustries = [
    "Technology", "Healthcare", "Finance", "Education", 
    "Manufacturing", "Retail", "Marketing", "Design",
    "Construction", "Hospitality", "Legal", "Engineering"
  ];
  
  // Common benefits for checkboxes
  const commonBenefits = [
    "Health Insurance", "Remote Work", "Flexible Hours", 
    "401k", "Paid Time Off", "Professional Development",
    "Parental Leave", "Wellness Programs"
  ];
  
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
  const removeSkill = (skill: string) => {
    setJobPrefs(prev => ({
      ...prev,
      desiredSkills: prev.desiredSkills?.filter(s => s !== skill) || []
    }));
  };
  
  // Add an industry
  const addIndustry = (industry: string) => {
    if (!jobPrefs.industryPreference?.includes(industry)) {
      setJobPrefs(prev => ({
        ...prev,
        industryPreference: [...(prev.industryPreference || []), industry]
      }));
      setIndustryInput("");
    }
  };
  
  // Remove an industry
  const removeIndustry = (industry: string) => {
    setJobPrefs(prev => ({
      ...prev,
      industryPreference: prev.industryPreference?.filter(i => i !== industry) || []
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
    const updatedPreferences = {
      ...preferences,
      categoryPreferences: {
        ...preferences.categoryPreferences,
        jobs: jobPrefs
      }
    };
    onUpdate(updatedPreferences);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Job Preferences</h2>
        <p className="text-muted-foreground mt-2">
          Tell your JobMate what kind of job opportunities you're looking for
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Salary Range */}
        <div className="space-y-4">
          <h3 className="font-medium">Salary Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary">Minimum ($)</Label>
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
              <Label htmlFor="maxSalary">Maximum ($)</Label>
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
        </div>
        
        {/* Skills */}
        <div className="space-y-4">
          <h3 className="font-medium">Desired Skills</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill (e.g., JavaScript, Project Management)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {jobPrefs.desiredSkills?.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                {skill}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeSkill(skill)}
                />
              </Badge>
            ))}
            {!jobPrefs.desiredSkills?.length && (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
        </div>
        
        {/* Remote Preference */}
        <div className="space-y-4">
          <h3 className="font-medium">Remote Work Preference</h3>
          <div className="grid grid-cols-3 gap-2">
            {["remote", "hybrid", "onsite"].map((option) => (
              <Button
                key={option}
                variant={jobPrefs.remotePreference === option ? "default" : "outline"}
                onClick={() => setJobPrefs(prev => ({ ...prev, remotePreference: option }))}
                className="capitalize"
              >
                {option}
              </Button>
            ))}
          </div>
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
        
        {/* Company Size */}
        <div className="space-y-4">
          <h3 className="font-medium">Company Size</h3>
          <div className="grid grid-cols-5 gap-2">
            {["startup", "small", "medium", "large", "any"].map((option) => (
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
          <h3 className="font-medium">Industry Preferences</h3>
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
              placeholder="Add another industry"
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIndustry(industryInput)}
            />
            <Button onClick={() => addIndustry(industryInput)}>Add</Button>
          </div>
        </div>
        
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
                {option}
              </Button>
            ))}
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
