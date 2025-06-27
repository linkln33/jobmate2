"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProfileCompletionCardProps {
  profile: any;
  className?: string;
}

export function ProfileCompletionCard({ profile, className }: ProfileCompletionCardProps) {
  // Calculate profile completion percentage
  const calculateCompletion = () => {
    // Handle case when profile is undefined or null
    if (!profile) {
      return 0;
    }
    
    const requiredFields = [
      'name',
      'bio',
      'location',
      'skills',
      'avatar',
      'coverImage',
      'email',
      'phone'
    ];
    
    const completedFields = requiredFields.filter(field => {
      if (field === 'skills') {
        return profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0;
      }
      return profile[field] !== undefined && profile[field] !== null && 
        String(profile[field]).trim() !== '';
    });
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };
  
  const completionPercentage = calculateCompletion();
  
  // Define completion steps
  const completionSteps = [
    { name: 'Add profile picture', completed: !!profile?.avatar },
    { name: 'Add cover image', completed: !!profile?.coverImage },
    { name: 'Complete basic info', completed: !!profile?.name && !!profile?.email },
    { name: 'Add your bio', completed: !!profile?.bio && profile?.bio?.length > 10 },
    { name: 'Add your skills', completed: profile?.skills && Array.isArray(profile?.skills) && profile?.skills?.length > 0 },
    { name: 'Add your location', completed: !!profile?.location },
    { name: 'Add contact info', completed: !!profile?.phone }
  ];
  
  const incompleteSteps = completionSteps.filter(step => !step.completed);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Profile Completion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Profile completion</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Remaining steps</h4>
          {incompleteSteps.length > 0 ? (
            <ul className="space-y-2">
              {incompleteSteps.map((step, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Circle className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{step.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <span>Your profile is complete!</span>
            </div>
          )}
        </div>
        
        {incompleteSteps.length > 0 && (
          <Button size="sm" className="w-full">
            Complete Your Profile
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
