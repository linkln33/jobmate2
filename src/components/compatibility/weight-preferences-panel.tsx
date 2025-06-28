import React, { useState } from 'react';
import { WeightPreferences } from '@/types/compatibility';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface WeightPreferencesPanelProps {
  initialWeights: WeightPreferences;
  onSave: (weights: WeightPreferences) => void;
  onCancel?: () => void;
}

export function WeightPreferencesPanel({ 
  initialWeights, 
  onSave, 
  onCancel 
}: WeightPreferencesPanelProps) {
  const [weights, setWeights] = useState<WeightPreferences>({...initialWeights});
  
  const handleWeightChange = (key: keyof WeightPreferences, value: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    // Normalize weights to ensure they sum to 1
    const sum = Object.values(weights).reduce((acc, val) => acc + val, 0);
    const normalizedWeights = Object.entries(weights).reduce((acc, [key, value]) => {
      acc[key as keyof WeightPreferences] = value / sum;
      return acc;
    }, {} as WeightPreferences);
    
    onSave(normalizedWeights);
  };
  
  const factorLabels: Record<keyof WeightPreferences, string> = {
    skills: 'Skills & Tags Match',
    location: 'Location Proximity',
    availability: 'Availability Match',
    price: 'Price/Salary Match',
    userPreferences: 'Personal Preferences',
    previousInteractions: 'Previous Interactions',
    reputation: 'Reputation & Ratings',
    aiTrend: 'AI Trend Boost'
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Customize Compatibility Factors</CardTitle>
        <CardDescription>
          Adjust the importance of each factor in calculating compatibility scores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(weights).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">
                {factorLabels[key as keyof WeightPreferences]}
              </label>
              <span className="text-sm text-muted-foreground">
                {Math.round(value * 100)}%
              </span>
            </div>
            <Slider
              value={[value * 100]}
              min={0}
              max={100}
              step={5}
              onValueChange={(vals) => handleWeightChange(key as keyof WeightPreferences, vals[0] / 100)}
              className="w-full"
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave}>
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}
