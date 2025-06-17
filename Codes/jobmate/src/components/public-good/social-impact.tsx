"use client";

import React, { useState } from 'react';
import { Heart, Leaf, Globe, Users, ArrowRight, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface Cause {
  id: string;
  name: string;
  description: string;
  category: 'environment' | 'education' | 'health' | 'community' | 'emergency';
  icon: React.ReactNode;
  amountRaised: number;
  goal: number;
  contributorsCount: number;
  impactMetrics: {
    label: string;
    value: string;
  }[];
}

interface UserImpact {
  totalContributed: number;
  contributionsCount: number;
  causesSupported: number;
  impactBadges: {
    id: string;
    name: string;
    icon: React.ReactNode;
  }[];
  recentContributions: {
    id: string;
    causeId: string;
    causeName: string;
    amount: number;
    date: string;
  }[];
}

interface SocialImpactProps {
  userId: string;
  userType: 'customer' | 'specialist';
  featuredCauses: Cause[];
  userImpact: UserImpact;
  onContribute: (causeId: string, amount: number, isRecurring: boolean) => Promise<void>;
}

export function SocialImpact({
  userId,
  userType,
  featuredCauses,
  userImpact,
  onContribute,
}: SocialImpactProps) {
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(5);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [isContributing, setIsContributing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('featured');

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate progress percentage
  const calculateProgress = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  // Get icon based on cause category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'environment':
        return <Leaf className="h-4 w-4" />;
      case 'education':
        return <Users className="h-4 w-4" />;
      case 'health':
        return <Heart className="h-4 w-4" />;
      case 'community':
        return <Globe className="h-4 w-4" />;
      case 'emergency':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  // Handle contribution submission
  const handleContribute = async () => {
    if (!selectedCause) return;
    
    setIsContributing(true);
    try {
      await onContribute(selectedCause.id, contributionAmount, isRecurring);
      setSelectedCause(null);
      setContributionAmount(5);
      setIsRecurring(false);
    } catch (error) {
      console.error('Error making contribution:', error);
    } finally {
      setIsContributing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Impact Summary */}
      <Card className="border-brand-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Heart className="h-5 w-5 mr-2 text-brand-600" />
            Your Social Impact
          </CardTitle>
          <CardDescription>
            Track your contributions and the difference you're making
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{formatCurrency(userImpact.totalContributed)}</div>
              <div className="text-xs text-muted-foreground">Total Contributed</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{userImpact.contributionsCount}</div>
              <div className="text-xs text-muted-foreground">Contributions</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{userImpact.causesSupported}</div>
              <div className="text-xs text-muted-foreground">Causes Supported</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="flex justify-center space-x-1">
                {userImpact.impactBadges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="bg-brand-100 p-1 rounded-full">
                    {badge.icon}
                  </div>
                ))}
                {userImpact.impactBadges.length > 3 && (
                  <div className="bg-brand-100 p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium text-brand-700">
                    +{userImpact.impactBadges.length - 3}
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Impact Badges</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Causes and Contributions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="featured">
            <Leaf className="h-4 w-4 mr-2" />
            Featured Causes
          </TabsTrigger>
          <TabsTrigger value="my-impact">
            <BarChart3 className="h-4 w-4 mr-2" />
            My Impact
          </TabsTrigger>
          <TabsTrigger value="contribute">
            <Heart className="h-4 w-4 mr-2" />
            Contribute
          </TabsTrigger>
        </TabsList>
        
        {/* Featured Causes Tab */}
        <TabsContent value="featured" className="mt-4 space-y-4">
          {featuredCauses.map((cause) => (
            <Card key={cause.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="bg-brand-100 p-1.5 rounded-full">
                        {cause.icon}
                      </div>
                      <h3 className="font-medium">{cause.name}</h3>
                      <Badge variant="outline" className="capitalize">
                        {getCategoryIcon(cause.category)}
                        <span className="ml-1">{cause.category}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {cause.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{formatCurrency(cause.amountRaised)} raised</span>
                        <span>Goal: {formatCurrency(cause.goal)}</span>
                      </div>
                      <Progress 
                        value={calculateProgress(cause.amountRaised, cause.goal)} 
                        className="h-2" 
                      />
                      <div className="text-xs text-muted-foreground">
                        {cause.contributorsCount} contributors
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cause.impactMetrics.map((metric, index) => (
                        <div key={index} className="bg-gray-50 px-2 py-1 rounded text-xs">
                          <span className="font-medium">{metric.label}:</span> {metric.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setSelectedCause(cause);
                      setActiveTab('contribute');
                    }}
                  >
                    Contribute
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        {/* My Impact Tab */}
        <TabsContent value="my-impact" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contribution History</CardTitle>
            </CardHeader>
            <CardContent>
              {userImpact.recentContributions.length > 0 ? (
                <div className="space-y-4">
                  {userImpact.recentContributions.map((contribution) => (
                    <div key={contribution.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{contribution.causeName}</div>
                        <div className="text-xs text-muted-foreground">{contribution.date}</div>
                      </div>
                      <div className="font-medium">{formatCurrency(contribution.amount)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No contributions yet</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('contribute')}>
                Make a Contribution
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Contribute Tab */}
        <TabsContent value="contribute" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Make a Contribution</CardTitle>
              <CardDescription>
                Support causes that matter to you and track your impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cause Selection */}
              <div className="space-y-2">
                <Label>Select a Cause</Label>
                <RadioGroup 
                  value={selectedCause?.id || ''} 
                  onValueChange={(value) => {
                    const cause = featuredCauses.find(c => c.id === value);
                    setSelectedCause(cause || null);
                  }}
                >
                  {featuredCauses.map((cause) => (
                    <div key={cause.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={cause.id} id={`cause-${cause.id}`} />
                      <Label htmlFor={`cause-${cause.id}`} className="flex items-center">
                        <div className="bg-brand-100 p-1 rounded-full mr-2">
                          {cause.icon}
                        </div>
                        {cause.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <Separator />
              
              {/* Amount Selection */}
              <div className="space-y-4">
                <Label>Contribution Amount: {formatCurrency(contributionAmount)}</Label>
                <Slider
                  value={[contributionAmount]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => setContributionAmount(value[0])}
                />
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setContributionAmount(5)}
                  >
                    $5
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setContributionAmount(10)}
                  >
                    $10
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setContributionAmount(25)}
                  >
                    $25
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setContributionAmount(50)}
                  >
                    $50
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Input
                    type="number"
                    min={1}
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(Number(e.target.value))}
                    className="w-24"
                  />
                  <Label>Custom Amount</Label>
                </div>
              </div>
              
              <Separator />
              
              {/* Recurring Option */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="recurring">Make this a monthly contribution</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCause(null);
                  setActiveTab('featured');
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleContribute}
                disabled={!selectedCause || contributionAmount <= 0 || isContributing}
              >
                {isContributing ? 'Processing...' : 'Contribute'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
