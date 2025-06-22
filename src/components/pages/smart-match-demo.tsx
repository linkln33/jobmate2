"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { JobMatchCard } from '@/components/match/job-match-card';
import { MatchExplainerModal } from '@/components/match/match-explainer-modal';
import { AutoReplyGenerator } from '@/components/match/auto-reply-generator';
import { Job, Specialist, MatchResult } from '@/types/job-match-types';
import { matchService } from '@/services/match-service';
import { premiumMatchService } from '@/services/premium-match-service';
import { AIMatchService } from '@/services/ai-match-service';
import { Crown, Sparkles, Lightbulb, Info } from 'lucide-react';

export default function SmartMatchDemo() {
  const [isPremium, setIsPremium] = useState(false);
  const [premiumLevel, setPremiumLevel] = useState<'basic' | 'pro' | 'elite'>('basic');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showExplainer, setShowExplainer] = useState(false);
  
  // Mock data
  const specialist: Specialist = {
    id: 'spec-123',
    firstName: 'Alex',
    lastName: 'Morgan',
    skills: ['Plumbing', 'Pipe Fitting', 'Water Heater Installation', 'Leak Detection'],
    hourlyRate: 65,
    rating: 4.8,
    completedJobs: 47,
    responseTime: 15, // minutes
    verificationLevel: 2,
    yearsOfExperience: 8,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103'
    },
    premium: {
      isPremium: isPremium,
      premiumLevel: premiumLevel,
      featuredProfile: premiumLevel === 'pro' || premiumLevel === 'elite',
      priorityMatching: premiumLevel === 'elite',
      boostFactor: premiumLevel === 'basic' ? 1.1 : 
                   premiumLevel === 'pro' ? 1.2 : 
                   premiumLevel === 'elite' ? 1.3 : 1
    }
  };
  
  const jobs: Job[] = [
    {
      id: 'job-1',
      title: 'Fix Leaking Kitchen Sink',
      description: 'Need a plumber to fix a leaking kitchen sink pipe. Water is collecting under the sink and causing damage.',
      status: 'open',
      lat: 37.7739,
      lng: -122.4312,
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      budgetMin: 60,
      budgetMax: 100,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      urgencyLevel: 'high',
      isVerifiedPayment: true,
      serviceCategory: {
        id: 'cat-1',
        name: 'Plumbing'
      },
      customer: {
        id: 'cust-1',
        firstName: 'Jamie',
        lastName: 'Smith',
        reputation: {
          overallRating: 4.7,
          totalRatings: 12
        }
      }
    },
    {
      id: 'job-2',
      title: 'Water Heater Installation',
      description: 'Need a professional to install a new 50-gallon water heater. Old one has been removed already.',
      status: 'open',
      lat: 37.7833,
      lng: -122.4167,
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94109',
      budgetMin: 300,
      budgetMax: 500,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      urgencyLevel: 'medium',
      isVerifiedPayment: true,
      serviceCategory: {
        id: 'cat-1',
        name: 'Plumbing'
      },
      customer: {
        id: 'cust-2',
        firstName: 'Taylor',
        lastName: 'Johnson',
        reputation: {
          overallRating: 4.9,
          totalRatings: 23
        }
      }
    },
    {
      id: 'job-3',
      title: 'Bathroom Remodel Plumbing',
      description: 'Looking for a plumber to help with a bathroom remodel. Need to move some pipes and install new fixtures.',
      status: 'open',
      lat: 37.7935,
      lng: -122.3939,
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94133',
      budgetMin: 800,
      budgetMax: 1200,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      urgencyLevel: 'low',
      isVerifiedPayment: false,
      serviceCategory: {
        id: 'cat-1',
        name: 'Plumbing'
      },
      customer: {
        id: 'cust-3',
        firstName: 'Casey',
        lastName: 'Williams',
        reputation: {
          overallRating: 3.8,
          totalRatings: 5
        }
      }
    }
  ];
  
  // Calculate match scores
  const calculateMatches = () => {
    return jobs.map(job => {
      // Use the appropriate service and method based on isPremium flag
      const matchResult = isPremium 
        ? premiumMatchService.calculatePremiumMatchScore(job, specialist)
        : matchService.calculateMatchScore(job, specialist);
      
      return { job, matchResult };
    }).sort((a, b) => b.matchResult.score - a.matchResult.score);
  };
  
  const matches = calculateMatches();
  
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Smart Job Match Enhancements Demo
          </CardTitle>
          <CardDescription>
            Explore the new premium features, match badges, and smart auto-reply capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Premium Membership</h3>
              <div className="flex items-center space-x-2 mb-4">
                <Switch 
                  checked={isPremium} 
                  onCheckedChange={setIsPremium} 
                  id="premium-mode"
                />
                <Label htmlFor="premium-mode">
                  Enable Premium Features
                </Label>
              </div>
              
              {isPremium && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button 
                    variant={premiumLevel === 'basic' ? "default" : "outline"} 
                    onClick={() => setPremiumLevel('basic')}
                    className="flex items-center gap-2"
                  >
                    <Crown className="h-4 w-4" />
                    Basic
                  </Button>
                  <Button 
                    variant={premiumLevel === 'pro' ? "default" : "outline"} 
                    onClick={() => setPremiumLevel('pro')}
                    className="flex items-center gap-2"
                  >
                    <Crown className="h-4 w-4" />
                    Pro
                  </Button>
                  <Button 
                    variant={premiumLevel === 'elite' ? "default" : "outline"} 
                    onClick={() => setPremiumLevel('elite')}
                    className="flex items-center gap-2"
                  >
                    <Crown className="h-4 w-4" />
                    Elite
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Smart Match Features</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowExplainer(true)}
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  How It Works
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Match badges highlight key match factors</li>
                  <li>Premium members get priority in match results</li>
                  <li>Smart auto-reply helps craft personalized responses</li>
                  <li>AI-powered match explanations provide insights</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 mt-6">
        <h2 className="text-2xl font-bold">Your Job Matches</h2>
        
        {matches.map(({ job, matchResult }) => (
          <JobMatchCard 
            key={job.id}
            job={job}
            matchResult={matchResult}
            specialist={specialist}
            onSelect={(id) => setSelectedJobId(id)}
            isSelected={selectedJobId === job.id}
          />
        ))}
      </div>
      
      {/* Match Explainer Modal */}
      <MatchExplainerModal 
        open={showExplainer} 
        onOpenChange={setShowExplainer} 
      />
    </div>
  );
}
