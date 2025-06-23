'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ToneStyle, TonePreference } from '@/services/assistant/toneService';
import { AssistantMode } from '@/contexts/AssistantContext/types';
import { useAssistantContext } from '@/contexts/AssistantContext';

const toneOptions: { value: ToneStyle; label: string; description: string }[] = [
  { 
    value: 'professional', 
    label: 'Professional', 
    description: 'Clear, formal, and business-oriented communication'
  },
  { 
    value: 'friendly', 
    label: 'Friendly', 
    description: 'Warm, approachable, and conversational'
  },
  { 
    value: 'technical', 
    label: 'Technical', 
    description: 'Precise, detailed, and terminology-focused'
  },
  { 
    value: 'casual', 
    label: 'Casual', 
    description: 'Relaxed, informal, and straightforward'
  },
  { 
    value: 'encouraging', 
    label: 'Encouraging', 
    description: 'Supportive, positive, and motivational'
  },
];

const modeLabels: Record<AssistantMode, string> = {
  JOB_SEARCH: 'Job Search',
  PROJECT_SETUP: 'Project Setup',
  MARKETPLACE: 'Marketplace',
  PAYMENTS: 'Payments',
  MESSAGES: 'Messages',
  PROFILE: 'Profile',
  DASHBOARD: 'Dashboard'
};

export default function ToneSelector() {
  const { data: session } = useSession();
  const { mode } = useAssistantContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'default' | 'advanced'>('default');
  
  const [preferences, setPreferences] = useState<TonePreference>({
    userId: session?.user?.id || '',
    defaultTone: 'professional',
    modeSpecificTones: {
      JOB_SEARCH: 'encouraging',
      PROJECT_SETUP: 'professional',
      MARKETPLACE: 'friendly',
      PAYMENTS: 'professional',
      MESSAGES: 'casual',
      PROFILE: 'friendly',
      DASHBOARD: 'professional'
    }
  });

  // Fetch user's tone preferences
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const fetchPreferences = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/assistant/preferences?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.preferences?.tonePreferences) {
            setPreferences(data.preferences.tonePreferences);
          }
        }
      } catch (error) {
        console.error('Error fetching tone preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPreferences();
  }, [session?.user?.id]);

  // Save preferences
  const savePreferences = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/assistant/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          tonePreferences: preferences
        }),
      });
      
      if (response.ok) {
        toast({
          title: 'Preferences saved',
          description: 'Your tone preferences have been updated.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save preferences. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving tone preferences:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle default tone change
  const handleDefaultToneChange = (value: ToneStyle) => {
    setPreferences(prev => ({
      ...prev,
      defaultTone: value
    }));
  };

  // Handle mode-specific tone change
  const handleModeToneChange = (mode: AssistantMode, value: ToneStyle) => {
    setPreferences(prev => ({
      ...prev,
      modeSpecificTones: {
        ...(prev.modeSpecificTones || {}),
        [mode]: value
      }
    }));
  };

  // Preview message with selected tone
  const getTonePreview = (tone: ToneStyle): string => {
    const previews: Record<ToneStyle, string> = {
      professional: "I've analyzed your requirements and can provide a detailed solution that meets your business needs.",
      friendly: "Hey there! I've looked at what you need and I think I've got a great solution for you!",
      technical: "Based on the parameters provided, I've formulated an optimal approach utilizing the available resources and constraints.",
      casual: "So I checked out what you're looking for and came up with a pretty good solution.",
      encouraging: "You're making great progress! I've found an excellent solution that will help you achieve your goals."
    };
    
    return previews[tone] || "I can help you with that.";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assistant Tone Preferences</CardTitle>
        <CardDescription>
          Customize how your assistant communicates with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'default' | 'advanced')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="default">Default Tone</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Default Tone</h3>
              <RadioGroup 
                value={preferences.defaultTone} 
                onValueChange={handleDefaultToneChange}
                className="space-y-3"
              >
                {toneOptions.map((option) => (
                  <div key={option.value} className="flex items-start space-x-2">
                    <RadioGroupItem value={option.value} id={`tone-${option.value}`} />
                    <div className="grid gap-1.5">
                      <Label htmlFor={`tone-${option.value}`} className="font-medium">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                      <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                        {getTonePreview(option.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mode-Specific Tones</h3>
              <p className="text-sm text-muted-foreground">
                Customize the assistant's tone for different contexts
              </p>
              
              {Object.entries(modeLabels).map(([modeKey, modeLabel]) => (
                <div key={modeKey} className="grid gap-2">
                  <Label htmlFor={`mode-${modeKey}`}>{modeLabel}</Label>
                  <Select 
                    value={preferences.modeSpecificTones?.[modeKey as AssistantMode] || preferences.defaultTone}
                    onValueChange={(value) => handleModeToneChange(modeKey as AssistantMode, value as ToneStyle)}
                  >
                    <SelectTrigger id={`mode-${modeKey}`}>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((option) => (
                        <SelectItem key={`${modeKey}-${option.value}`} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab(activeTab === 'default' ? 'advanced' : 'default')}>
          {activeTab === 'default' ? 'Advanced Settings' : 'Default Settings'}
        </Button>
        <Button onClick={savePreferences} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardFooter>
    </Card>
  );
}
