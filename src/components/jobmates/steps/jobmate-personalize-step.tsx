"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobMateFormData } from "@/types/jobmate";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MainCategory } from "@/types/compatibility";
import { 
  Smile,
  Clock,
  Bell,
  Users,
  Share2,
  Lock
} from "lucide-react";

interface JobMatePersonalizeStepProps {
  formData: JobMateFormData;
  onUpdate: (formData: JobMateFormData) => void;
  onBack: () => void;
}

// List of emoji suggestions based on category
const categoryEmojis: Record<string, string[]> = {
  jobs: ["💼", "🚀", "💻", "📊", "👔", "🔍", "💰", "📈", "🏢", "🌟"],
  rentals: ["🏠", "🔑", "🏙️", "🏘️", "🌆", "🛋️", "🏡", "🌇", "🏢", "🏕️"],
  services: ["🛠️", "🧰", "🔧", "💪", "🧹", "👨‍🔧", "👩‍🔧", "🚚", "📦", "🧾"],
  marketplace: ["🛒", "🏪", "💲", "🛍️", "📦", "🔖", "💰", "📱", "🏷️", "🧸"],
  learning: ["📚", "🎓", "✏️", "🧠", "💡", "🔬", "🧪", "📝", "📊", "🎯"],
  travel: ["✈️", "🏝️", "🗺️", "🧳", "🏨", "🚆", "🚗", "🌍", "🏔️", "⛱️"]
};

// Name suggestions based on category
const categoryNameSuggestions: Record<string, string[]> = {
  jobs: ["Career Scout", "Job Hunter", "Opportunity Finder", "Resume Matcher", "Career Compass"],
  rentals: ["Home Finder", "Rental Scout", "Property Matcher", "Space Hunter", "Nest Seeker"],
  services: ["Service Pro", "Expert Finder", "Task Matcher", "Service Scout", "Pro Connector"],
  marketplace: ["Deal Finder", "Market Scout", "Item Matcher", "Bargain Hunter", "Shop Assistant"],
  learning: ["Knowledge Guide", "Skill Finder", "Learning Companion", "Study Buddy", "Course Matcher"],
  travel: ["Travel Planner", "Adventure Scout", "Trip Finder", "Destination Matcher", "Journey Guide"]
};

export function JobMatePersonalizeStep({ 
  formData, 
  onUpdate,
  onBack 
}: JobMatePersonalizeStepProps) {
  const [name, setName] = useState(formData.name || "");
  const [emoji, setEmoji] = useState(formData.emoji || "");
  const [description, setDescription] = useState(formData.description || "");
  const [autoRun, setAutoRun] = useState(formData.settings?.autoRun || false);
  const [runFrequency, setRunFrequency] = useState(formData.settings?.runFrequency || "daily");
  const [notifications, setNotifications] = useState(formData.settings?.notifications || false);
  const [isPublic, setIsPublic] = useState(formData.settings?.isPublic || false);
  const [isCollaborative, setIsCollaborative] = useState(formData.settings?.isCollaborative || false);
  const [nameError, setNameError] = useState("");
  
  // Suggested emojis for the selected category
  const suggestedEmojis = categoryEmojis[formData.categoryFocus] || categoryEmojis.jobs;
  
  // Suggested names for the selected category
  const suggestedNames = categoryNameSuggestions[formData.categoryFocus] || categoryNameSuggestions.jobs;
  
  // Validate name on change
  useEffect(() => {
    if (name.trim() === "") {
      setNameError("Name is required");
    } else if (name.length > 30) {
      setNameError("Name must be 30 characters or less");
    } else {
      setNameError("");
    }
  }, [name]);
  
  // Select an emoji
  const selectEmoji = (selectedEmoji: string) => {
    setEmoji(selectedEmoji);
  };
  
  // Use a name suggestion
  const useNameSuggestion = (suggestion: string) => {
    setName(suggestion);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (nameError) {
      return;
    }
    
    const updatedFormData = {
      ...formData,
      name,
      emoji,
      description,
      settings: {
        ...formData.settings,
        autoRun,
        runFrequency,
        notifications,
        isPublic,
        isCollaborative
      }
    };
    onUpdate(updatedFormData);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Personalize Your JobMate</h2>
        <p className="text-muted-foreground mt-2">
          Give your JobMate a name, emoji, and configure its settings
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">JobMate Name</Label>
          <Input
            id="name"
            placeholder="Enter a name for your JobMate"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={nameError ? "border-red-500" : ""}
          />
          {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedNames.map((suggestion) => (
                <Badge 
                  key={suggestion} 
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => useNameSuggestion(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Emoji */}
        <div className="space-y-2">
          <Label>Select an Emoji</Label>
          <div className="grid grid-cols-5 gap-2">
            {suggestedEmojis.map((emojiOption) => (
              <Button
                key={emojiOption}
                variant={emoji === emojiOption ? "default" : "outline"}
                className="text-2xl h-12"
                onClick={() => selectEmoji(emojiOption)}
              >
                {emojiOption}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            This emoji will help you quickly identify your JobMate
          </p>
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe what this JobMate is for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        {/* Settings */}
        <div className="space-y-4">
          <h3 className="font-medium">JobMate Settings</h3>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Auto-Run</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically run this JobMate to find matches
                    </p>
                  </div>
                </div>
                <Switch
                  checked={autoRun}
                  onCheckedChange={setAutoRun}
                />
              </div>
            </CardContent>
          </Card>
          
          {autoRun && (
            <Card>
              <CardContent className="p-4">
                <Label className="mb-2 block">Run Frequency</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["daily", "weekly", "monthly"].map((frequency) => (
                    <Button
                      key={frequency}
                      variant={runFrequency === frequency ? "default" : "outline"}
                      onClick={() => setRunFrequency(frequency)}
                      className="capitalize"
                    >
                      {frequency}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new matches are found
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Public Template</p>
                    <p className="text-sm text-muted-foreground">
                      Allow others to use this as a template
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Collaborative</p>
                    <p className="text-sm text-muted-foreground">
                      Allow others to collaborate on this JobMate
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isCollaborative}
                  onCheckedChange={setIsCollaborative}
                />
              </div>
            </CardContent>
          </Card>
          
          {(isPublic || isCollaborative) && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <Lock className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                {isPublic && isCollaborative 
                  ? "This JobMate will be available as a template and open for collaboration."
                  : isPublic 
                    ? "This JobMate will be available as a template for others to use."
                    : "This JobMate will be open for collaboration with others you invite."}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation handled by main wizard container */}
    </div>
  );
}
