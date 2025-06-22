"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Star, TrendingUp, Users, Zap, BadgeCheck, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  dateEarned: string;
  category: 'service' | 'community' | 'reliability' | 'skill';
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface ExternalReview {
  platform: string;
  url: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  logoUrl: string;
}

interface ReputationStats {
  overallRating: number;
  totalReviews: number;
  completionRate: number;
  responseRate: number;
  avgResponseTime: string;
  memberSince: string;
  totalJobsCompleted: number;
  repeatCustomerRate: number;
  specialistLevel: 'Newcomer' | 'Rising Talent' | 'Established' | 'Top Rated' | 'Elite';
  nextLevelProgress: number;
  nextLevelRequirements: {
    jobsNeeded: number;
    ratingNeeded: number;
    daysNeeded?: number;
  };
}

interface ReputationSystemProps {
  userId: string;
  userType: 'customer' | 'specialist';
  stats: ReputationStats;
  achievements: Achievement[];
  externalReviews: ExternalReview[];
}

export function ReputationSystem({
  userId,
  userType,
  stats,
  achievements,
  externalReviews,
}: ReputationSystemProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);

  // Get color based on specialist level
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Newcomer':
        return 'text-gray-600 bg-gray-100';
      case 'Rising Talent':
        return 'text-blue-600 bg-blue-100';
      case 'Established':
        return 'text-green-600 bg-green-100';
      case 'Top Rated':
        return 'text-purple-600 bg-purple-100';
      case 'Elite':
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get badge color based on achievement level
  const getAchievementColor = (level: 'bronze' | 'silver' | 'gold' | 'platinum') => {
    switch (level) {
      case 'bronze':
        return 'bg-amber-700';
      case 'silver':
        return 'bg-gray-400';
      case 'gold':
        return 'bg-amber-400';
      case 'platinum':
        return 'bg-blue-300';
      default:
        return 'bg-gray-400';
    }
  };

  // Format rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  // View achievement details
  const viewAchievementDetails = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsAchievementDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Reputation Overview Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Shield className="h-5 w-5 mr-2 text-brand-600" />
            Reputation Overview
          </CardTitle>
          <CardDescription>
            {userType === 'specialist' 
              ? 'Your professional reputation and performance metrics'
              : 'Customer reputation and platform engagement'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Main Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{stats.overallRating.toFixed(1)}</div>
              <div className="flex justify-center my-1">{renderStars(Math.round(stats.overallRating))}</div>
              <div className="text-xs text-muted-foreground">{stats.totalReviews} reviews</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <div className="text-sm font-medium">Completion Rate</div>
              <div className="text-xs text-muted-foreground">{stats.totalJobsCompleted} jobs</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{stats.responseRate}%</div>
              <div className="text-sm font-medium">Response Rate</div>
              <div className="text-xs text-muted-foreground">Avg {stats.avgResponseTime}</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{stats.repeatCustomerRate}%</div>
              <div className="text-sm font-medium">Repeat Clients</div>
              <div className="text-xs text-muted-foreground">Member since {stats.memberSince}</div>
            </div>
          </div>
          
          {/* Specialist Level (for specialists only) */}
          {userType === 'specialist' && (
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Badge className={`mr-2 ${getLevelColor(stats.specialistLevel)}`}>
                    {stats.specialistLevel}
                  </Badge>
                  <span className="text-sm font-medium">Specialist Level</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Users className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Specialist levels are calculated based on job completion, ratings, response time, and platform tenure.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Current Level</span>
                  <span>Next Level</span>
                </div>
                <Progress value={stats.nextLevelProgress} className="h-2" />
                
                <div className="text-xs text-muted-foreground">
                  {stats.nextLevelRequirements.jobsNeeded > 0 && (
                    <span className="block">
                      {stats.nextLevelRequirements.jobsNeeded} more jobs
                    </span>
                  )}
                  {stats.nextLevelRequirements.ratingNeeded > 0 && (
                    <span className="block">
                      Maintain {stats.nextLevelRequirements.ratingNeeded}+ rating
                    </span>
                  )}
                  {stats.nextLevelRequirements.daysNeeded && (
                    <span className="block">
                      {stats.nextLevelRequirements.daysNeeded} more days of activity
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Achievements and External Reviews Tabs */}
      <Tabs defaultValue="achievements">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="external">
            <ExternalLink className="h-4 w-4 mr-2" />
            External Reviews
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.03 }}
                className="cursor-pointer"
                onClick={() => viewAchievementDetails(achievement)}
              >
                <div className="flex flex-col items-center p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`p-2 rounded-full mb-2 ${getAchievementColor(achievement.level)}`}>
                    {achievement.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{achievement.category}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {achievements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No achievements earned yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="external" className="mt-4">
          <div className="space-y-3">
            {externalReviews.map((review) => (
              <Card key={review.platform}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={review.logoUrl} 
                        alt={review.platform} 
                        className="h-8 w-8 object-contain"
                      />
                      <div>
                        <div className="font-medium">{review.platform}</div>
                        <div className="text-xs text-muted-foreground">
                          {review.reviewCount} reviews
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex">{renderStars(review.rating)}</div>
                      {review.verified && (
                        <Badge variant="outline" className="flex items-center">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="outline" asChild>
                      <a href={review.url} target="_blank" rel="noopener noreferrer">
                        View Reviews
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {externalReviews.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ExternalLink className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No external reviews connected</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Connect External Reviews
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Achievement Dialog */}
      <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
        <DialogContent>
          {selectedAchievement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${getAchievementColor(selectedAchievement.level)}`}>
                    {selectedAchievement.icon}
                  </div>
                  {selectedAchievement.name}
                </DialogTitle>
                <DialogDescription>
                  Earned on {selectedAchievement.dateEarned}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <p>{selectedAchievement.description}</p>
                
                <div className="mt-4 flex items-center">
                  <Badge className="capitalize">{selectedAchievement.category}</Badge>
                  <Badge variant="outline" className="ml-2 capitalize">{selectedAchievement.level}</Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
