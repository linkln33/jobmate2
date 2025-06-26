"use client";

import React, { useState } from 'react';
// Update ProfileReview interface to include needed properties
import { ProfileReview as BaseProfileReview } from '@/types/profile';

interface ProfileReview extends BaseProfileReview {
  title?: string;
  tags?: string[];
  response?: string;
  detailedRatings?: {
    completionRate: number;
    timing: number;
    satisfaction: number;
    cost: number;
    overallExperience: number;
  };
  completionRate?: number;
  timing?: number;
  satisfaction?: number;
  cost?: number;
  overallExperience?: number;
  verified?: boolean;
  type?: string;
  reviewerName?: string;
  reviewerAvatar?: string;
  reviewerLocation?: string;
  reviewerJobsCompleted?: number;
}

// UI Component imports
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Icon imports
import { 
  Award, 
  BadgeCheck, 
  Calendar, 
  ChevronDown, 
  ExternalLink, 
  Filter, 
  HelpCircle, 
  Shield, 
  Star, 
  StarHalf, 
  ThumbsDown, 
  ThumbsUp, 
  Users 
} from 'lucide-react';

// Interfaces
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

interface FeedbackSystem {
  positiveAttributes: Array<{ name: string; count: number }>;
  negativeAttributes: Array<{ name: string; count: number }>;
  recentFeedback: Array<{ attribute: string; date: string }>;
}

interface UnifiedReviewsCardProps {
  userId: string;
  userType: 'customer' | 'specialist';
  reputation: {
    stats: ReputationStats;
    achievements: Achievement[];
    externalReviews: ExternalReview[];
    feedbackSystem?: FeedbackSystem;
  };
  reviews: ProfileReview[];
  reviewStats: {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: Record<string, number>;
  };
  onLoadMore?: () => void;
}

export function UnifiedReviewsCard({
  userId,
  userType,
  reputation,
  reviews,
  reviewStats,
  onLoadMore
}: UnifiedReviewsCardProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  
  // Review form state variables
  const [overallRating, setOverallRating] = useState<number>(0);
  const [satisfactionRating, setSatisfactionRating] = useState<number>(0);
  const [costRating, setCostRating] = useState<number>(0);
  const [completionRating, setCompletionRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');

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

  // Helper function to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Component to display detailed ratings
  const DetailedRatings = ({ ratings }: { ratings?: ProfileReview['detailedRatings'] }) => {
    if (!ratings) return null;

    const criteriaLabels = {
      completionRate: "Completion Rate",
      timing: "Timing",
      satisfaction: "Satisfaction",
      cost: "Cost",
      overallExperience: "Overall Experience"
    };

    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <h5 className="text-sm font-medium mb-2">Detailed Ratings</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(ratings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{criteriaLabels[key as keyof typeof criteriaLabels]}:</span>
              <div className="flex">
                {renderStars(value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Component for users to leave ratings
  const RatingInput = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (value: number) => void 
  }) => {
    return (
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <label className="text-sm font-medium">{label}</label>
          <span className="text-sm text-muted-foreground">{value}/5</span>
        </div>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="p-1"
            >
              <Star
                className={`h-6 w-6 ${star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Badge thresholds based on eBay's star system with base colors first, then middle colors
  const BADGE_THRESHOLDS = [
    { points: 0, name: 'New Member', icon: null },
    { points: 10, name: 'Red Star', icon: <Star className="h-5 w-5 text-red-500" fill="currentColor" /> },
    { points: 50, name: 'Orange Star', icon: <Star className="h-5 w-5 text-orange-500" fill="currentColor" /> },
    { points: 100, name: 'Yellow Star', icon: <Star className="h-5 w-5 text-yellow-400" fill="currentColor" /> },
    { points: 500, name: 'Green Star', icon: <Star className="h-5 w-5 text-green-500" fill="currentColor" /> },
    { points: 1000, name: 'Light Blue Star', icon: <Star className="h-5 w-5 text-sky-400" fill="currentColor" /> },
    { points: 5000, name: 'Blue Star', icon: <Star className="h-5 w-5 text-blue-500" fill="currentColor" /> },
    { points: 10000, name: 'Purple Star', icon: <Star className="h-5 w-5 text-purple-500" fill="currentColor" /> },
    { points: 25000, name: 'Pink Star', icon: <Star className="h-5 w-5 text-pink-500" fill="currentColor" /> },
    { points: 50000, name: 'Magenta Star', icon: <Star className="h-5 w-5 text-pink-600" fill="currentColor" /> },
    { points: 100000, name: 'Indigo Star', icon: <Star className="h-5 w-5 text-indigo-500" fill="currentColor" /> },
    { points: 500000, name: 'Teal Star', icon: <Star className="h-5 w-5 text-teal-500" fill="currentColor" /> },
    { points: 1000000, name: 'Silver Star', icon: <Star className="h-5 w-5 text-gray-300" fill="currentColor" /> },
  ];

  // Get current badge based on feedback points
  function getCurrentBadgeIndex(points: number): number {
    for (let i = BADGE_THRESHOLDS.length - 1; i >= 0; i--) {
      if (points >= BADGE_THRESHOLDS[i].points) {
        return i;
      }
    }
    return 0;
  }

  // Get badge icon based on feedback points
  function getFeedbackBadge(points: number) {
    const badgeIndex = getCurrentBadgeIndex(points);
    return BADGE_THRESHOLDS[badgeIndex].icon || <Award className="h-5 w-5 text-gray-400" />;
  }

  // Get badge name based on feedback points
  function getFeedbackBadgeName(points: number): string {
    const badgeIndex = getCurrentBadgeIndex(points);
    return BADGE_THRESHOLDS[badgeIndex].name;
  }

  // Get next badge name
  function getNextBadgeName(points: number): string {
    const currentIndex = getCurrentBadgeIndex(points);
    if (currentIndex === BADGE_THRESHOLDS.length - 1) {
      return 'Maximum Level Achieved';
    }
    return BADGE_THRESHOLDS[currentIndex + 1].name;
  }

  // Calculate progress percentage to next badge
  function getProgressToNextBadge(points: number): number {
    const currentIndex = getCurrentBadgeIndex(points);
    if (currentIndex === BADGE_THRESHOLDS.length - 1) {
      return 100; // Max level
    }
    
    const currentThreshold = BADGE_THRESHOLDS[currentIndex].points;
    const nextThreshold = BADGE_THRESHOLDS[currentIndex + 1].points;
    const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  // Get points needed to reach next badge
  function getPointsToNextBadge(points: number): number {
    const currentIndex = getCurrentBadgeIndex(points);
    if (currentIndex === BADGE_THRESHOLDS.length - 1) {
      return 0; // Max level
    }
    
    const nextThreshold = BADGE_THRESHOLDS[currentIndex + 1].points;
    return nextThreshold - points;
  }
  
  // Get badge color for progress bar
  function getBadgeColor(points: number): string {
    const currentIndex = getCurrentBadgeIndex(points);
    if (currentIndex === 0) return '#9ca3af'; // Gray for new member
    
    // Map of badge colors
    const badgeColors = {
      'Red Star': '#ef4444', // red-500
      'Orange Star': '#f97316', // orange-500
      'Yellow Star': '#fbbf24', // yellow-400
      'Green Star': '#22c55e', // green-500
      'Light Blue Star': '#38bdf8', // sky-400
      'Blue Star': '#3b82f6', // blue-500
      'Purple Star': '#a855f7', // purple-500
      'Pink Star': '#ec4899', // pink-500
      'Magenta Star': '#db2777', // pink-600
      'Indigo Star': '#6366f1', // indigo-500
      'Teal Star': '#14b8a6', // teal-500
      'Silver Star': '#94a3b8', // slate-400
    };
    
    const badgeName = BADGE_THRESHOLDS[currentIndex].name;
    return badgeColors[badgeName as keyof typeof badgeColors] || '#9ca3af';
  }

  // View achievement details
  function viewAchievementDetails(achievement: Achievement) {
    setSelectedAchievement(achievement);
    setIsAchievementDialogOpen(true);
  };
  
  // Filter reviews by rating
  const filteredReviews = filterRating 
    ? reviews.filter(review => Math.round(review.rating) === filterRating)
    : reviews;
    
  // Paginate reviews
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle filter change
  const handleFilterChange = (rating: number | null) => {
    setFilterRating(rating === filterRating ? null : rating);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Reviews & Reputation</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {/* Reputation Stats Overview */}
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-brand-600" />
              <h3 className="text-lg font-medium">Reputation Overview</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {userType === 'specialist' 
                ? 'Professional reputation and performance metrics'
                : 'Customer reputation and platform engagement'}
            </p>
          </div>
          
          <div className="p-4 space-y-6">
            {/* Detailed Rating Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{reputation.stats.overallRating.toFixed(1)}</div>
                <div className="flex justify-center my-1">{renderStars(Math.round(reputation.stats.overallRating))}</div>
                <div className="text-sm font-medium">Overall Experience</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">
                  {reviewStats.averageRating ? (reviewStats.averageRating * 20).toFixed(0) : 0}%
                </div>
                <div className="flex justify-center my-1">{renderStars(Math.round(reviewStats.averageRating || 0))}</div>
                <div className="text-sm font-medium">Satisfaction</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">
                  {reviewStats.averageRating ? ((reviewStats.averageRating - 1) * 25).toFixed(0) : 0}%
                </div>
                <div className="flex justify-center my-1">{renderStars(Math.round(reviewStats.averageRating || 0))}</div>
                <div className="text-sm font-medium">Cost</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{reputation.stats.completionRate}%</div>
                <div className="flex justify-center my-1">{renderStars(Math.round(reputation.stats.completionRate / 20))}</div>
                <div className="text-sm font-medium">Completion in Time</div>
              </div>
            </div>
            
            {/* Achievement Badges - eBay Style Star System */}
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-amber-500" />
                  <span className="text-sm font-medium">Achievement Badges</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs">
                        Badges are awarded based on feedback points earned from completed jobs and reviews.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Current Badge */}
              <div className="flex items-center mb-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-full">
                  {getFeedbackBadge(reputation.stats.totalJobsCompleted)}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">
                    {getFeedbackBadgeName(reputation.stats.totalJobsCompleted)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {reputation.stats.totalJobsCompleted} jobs completed
                  </div>
                </div>
              </div>
              
              {/* Progress to next badge */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Current Badge</span>
                  <span>Next Badge: {getNextBadgeName(reputation.stats.totalJobsCompleted)}</span>
                </div>
                <div className="relative">
                  <div className="mt-2 relative h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${getProgressToNextBadge(reputation.stats.totalJobsCompleted)}%`,
                        backgroundColor: getBadgeColor(reputation.stats.totalJobsCompleted)
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span 
                        className="text-[10px] font-medium" 
                        style={{ 
                          color: getBadgeColor(reputation.stats.totalJobsCompleted)
                        }}
                      >
                        {Math.round(getProgressToNextBadge(reputation.stats.totalJobsCompleted))}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {getPointsToNextBadge(reputation.stats.totalJobsCompleted)} more jobs completed needed
                </div>
              </div>
              
              {/* All Achievement Badges */}
              <div className="mt-4 pt-3 border-t">
                <div className="text-xs font-medium mb-2">Achievement Progress</div>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {BADGE_THRESHOLDS.slice(1).map((badge, index) => {
                      // Format job count with k+ notation
                      const formattedJobs = badge.points >= 1000 ? 
                        `${(badge.points / 1000).toLocaleString()}k+` : 
                        `${badge.points}+`;
                        
                      return (
                        <div 
                          key={index} 
                          className="flex items-center gap-2 mr-2"
                        >
                          {badge.icon ? (
                            <div className={`h-5 w-5 ${reputation.stats.totalJobsCompleted >= badge.points ? '' : 'text-gray-400'}`}>
                              {badge.icon}
                            </div>
                          ) : (
                            <div className="h-5 w-5 text-gray-400">
                              <Award size={20} />
                            </div>
                          )}
                          <span className="text-xs font-medium text-black">
                            {formattedJobs}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* We don't need a separate legend anymore */}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Reviews Section (eBay-style) */}
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Last 12 months: {Math.round((reviewStats.averageRating / 5) * 100)}% Positive
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{Math.round((reviewStats.averageRating / 5) * 100)}%</div>
                <div className="text-sm text-muted-foreground">
                  <div>Positive Feedback</div>
                  <div className="text-xs">({reviewStats.totalReviews} total reviews)</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {/* eBay-style layout with two columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column: Rating summary */}
              <div className="col-span-1">
                <div className="space-y-6">
                  {/* Overall rating */}
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-4xl font-bold">{reviewStats.averageRating.toFixed(1)}</div>
                    <div className="flex">
                      {renderStars(Math.round(reviewStats.averageRating))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on {reviewStats.totalReviews} reviews
                    </div>
                  </div>
                  
                  {/* Rating breakdown bars */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviewStats.ratingBreakdown[rating.toString()] || 0;
                      const percentage = reviewStats.totalReviews > 0 
                        ? Math.round((count / reviewStats.totalReviews) * 100) 
                        : 0;
                      
                      return (
                        <div key={rating} className="flex items-center space-x-2">
                          <div className="w-8 text-sm">{rating} ★</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-8 text-sm text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`px-2 py-0 h-6 ${filterRating === rating ? 'bg-yellow-100' : ''}`}
                              onClick={() => handleFilterChange(rating)}
                            >
                              {count}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Recent feedback summary */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Recent Feedback</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Last 30 days:</span>
                        <span>{Math.round((reviewStats.averageRating / 5) * 100)}% Positive</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last 6 months:</span>
                        <span>{Math.round((reviewStats.averageRating / 5) * 100)}% Positive</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last 12 months:</span>
                        <span>{Math.round((reviewStats.averageRating / 5) * 100)}% Positive</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right column: Reviews filters and summary */}
              <div className="col-span-1 md:col-span-2">
                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Select 
                    defaultValue="all"
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All feedback</SelectItem>
                      <SelectItem value="1month">Last month</SelectItem>
                      <SelectItem value="6months">Last 6 months</SelectItem>
                      <SelectItem value="12months">Last 12 months</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    defaultValue="all"
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All feedback</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Reviews summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.entries(reviewStats.ratingBreakdown)
                        .filter(([rating]) => parseInt(rating) >= 4)
                        .reduce((sum, [_, count]) => sum + count, 0)}
                    </div>
                    <div className="text-sm text-green-700">Positive</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {reviewStats.ratingBreakdown['3'] || 0}
                    </div>
                    <div className="text-sm text-gray-700">Neutral</div>
                  </div>
                  <div className="rounded-lg bg-red-50 p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {Object.entries(reviewStats.ratingBreakdown)
                        .filter(([rating]) => parseInt(rating) <= 2)
                        .reduce((sum, [_, count]) => sum + count, 0)}
                    </div>
                    <div className="text-sm text-red-700">Negative</div>
                  </div>
                </div>
                
                {filterRating && (
                  <div className="flex justify-between items-center mb-4 bg-yellow-50 p-2 rounded-md">
                    <div className="text-sm">
                      Showing {filterRating}-star reviews only
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => handleFilterChange(null)}
                    >
                      Clear filter
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Review List - eBay Style with Detailed Ratings */}
            <div className="space-y-6 mt-6">
              {currentReviews.length > 0 ? (
                currentReviews.map((review, index) => (
                  <div key={index} className="border rounded-md p-4 bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Reviewer info column */}
                      <div className="md:w-48 flex flex-row md:flex-col items-center md:items-start gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          <Avatar>
                            {review.reviewerAvatar ? (
                              <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
                            ) : (
                              <AvatarFallback className="bg-brand-100 text-brand-700">
                                {review.reviewerName?.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </div>
                        
                        <div>
                          <div className="font-medium text-sm">{review.reviewerName}</div>
                          <div className="text-xs text-muted-foreground">
                            {review.reviewerLocation || 'Member'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {review.reviewerJobsCompleted || '5'} jobs completed
                          </div>
                        </div>
                      </div>
                      
                      {/* Review content column */}
                      <div className="flex-1">
                        {/* Review header with rating, date and badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          
                          {/* Review badges */}
                          {review.verified && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                              <BadgeCheck className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                          )}
                          
                          {review.type && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {review.type}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Review title if available */}
                        {review.title && (
                          <h4 className="font-medium text-base mb-2">{review.title}</h4>
                        )}
                        
                        {/* Review comment */}
                        <div className="text-sm">
                          <p>{review.comment}</p>
                        </div>
                        
                        {/* Detailed ratings */}
                        {review.detailedRatings && (
                          <DetailedRatings ratings={review.detailedRatings} />
                        )}
                        
                        {/* Review tags if available */}
                        {review.tags && review.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {review.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Response to review if available */}
                        {review.response && (
                          <div className="mt-3 pl-3 border-l-2 border-brand-200">
                            <div className="text-xs font-medium text-brand-700 mb-1">Response:</div>
                            <p className="text-sm text-muted-foreground">{review.response}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-md bg-gray-50">
                  <div className="mb-2">🔍</div>
                  <div className="font-medium">
                    {filterRating 
                      ? `No ${filterRating}-star reviews found` 
                      : 'No reviews found'}
                  </div>
                  <div className="text-sm">Be the first to leave a review</div>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Load More Button */}
              {onLoadMore && filteredReviews.length >= 10 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={onLoadMore}>
                    Load more reviews
                  </Button>
                </div>
              )}
              
              {/* Leave a Review Section */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                <div className="space-y-4">
                  {/* Overall Experience */}
                  <div>
                    <div className="text-sm font-medium mb-1">Overall Experience</div>
                    <div className="flex items-center mt-1">
                      <RatingInput 
                        label="" 
                        value={overallRating} 
                        onChange={setOverallRating} 
                      />
                    </div>
                  </div>
                  
                  {/* Satisfaction */}
                  <div>
                    <div className="text-sm font-medium mb-1">Satisfaction</div>
                    <div className="flex items-center mt-1">
                      <RatingInput 
                        label="" 
                        value={satisfactionRating} 
                        onChange={setSatisfactionRating} 
                      />
                    </div>
                  </div>
                  
                  {/* Cost */}
                  <div>
                    <div className="text-sm font-medium mb-1">Cost</div>
                    <div className="flex items-center mt-1">
                      <RatingInput 
                        label="" 
                        value={costRating} 
                        onChange={setCostRating} 
                      />
                    </div>
                  </div>
                  
                  {/* Completion in Time */}
                  <div>
                    <div className="text-sm font-medium mb-1">Completion in Time</div>
                    <div className="flex items-center mt-1">
                      <RatingInput 
                        label="" 
                        value={completionRating} 
                        onChange={setCompletionRating} 
                      />
                    </div>
                  </div>
                  
                  {/* Review Title */}
                  <div>
                    <div className="text-sm font-medium mb-1">Title</div>
                    <input 
                      type="text" 
                      id="review-title"
                      className="w-full p-2 border rounded-md" 
                      placeholder="Summarize your experience"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                  </div>
                  
                  {/* Review Comment */}
                  <div>
                    <div className="text-sm font-medium mb-1">Comment</div>
                    <textarea 
                      id="review-comment"
                      className="w-full p-2 border rounded-md min-h-[100px]" 
                      placeholder="Share details of your experience"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    ></textarea>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button className="w-full md:w-auto" onClick={() => {
                      console.log({
                        overallRating,
                        satisfactionRating,
                        costRating,
                        completionRating,
                        reviewTitle,
                        reviewComment
                      });
                      // Reset form
                      setOverallRating(0);
                      setSatisfactionRating(0);
                      setCostRating(0);
                      setCompletionRating(0);
                      setReviewTitle('');
                      setReviewComment('');
                    }}>
                      Submit Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements Section */}
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-brand-600" />
              <h3 className="text-lg font-medium">Achievements</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Recognition for outstanding performance and milestones
            </p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {reputation.achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="border rounded-md p-3 cursor-pointer hover:border-brand-200 transition-colors"
                  onClick={() => viewAchievementDetails(achievement)}
                >
                  <div className="flex items-center mb-2">
                    <div className={`p-1.5 rounded-full mr-2 ${getAchievementColor(achievement.level)}`}>
                      {achievement.icon || <Award className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">{achievement.dateEarned}</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{achievement.description}</p>
                </div>
              ))}
              
              {reputation.achievements.length === 0 && (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  No achievements yet
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* External Reviews Section */}
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <ExternalLink className="h-5 w-5 mr-2 text-brand-600" />
              <h3 className="text-lg font-medium">External Reviews</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Reviews and ratings from external platforms
            </p>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              {reputation.externalReviews.map((review, index) => (
                <a 
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                  className="flex items-center justify-between border rounded-md p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 mr-3 flex-shrink-0">
                      <img 
                        src={review.logoUrl} 
                        alt={review.platform} 
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{review.platform}</div>
                      <div className="flex items-center">
                        <div className="flex mr-1">{renderStars(review.rating)}</div>
                        <span className="text-xs text-muted-foreground">
                          ({review.reviewCount} reviews)
                        </span>
                        {review.verified && (
                          <Badge variant="outline" className="ml-2 text-xs py-0 h-5">
                            <BadgeCheck className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
              
              {reputation.externalReviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No external reviews linked
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Achievement Dialog */}
      <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedAchievement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <div className={`p-1.5 rounded-full mr-2 ${getAchievementColor(selectedAchievement.level)}`}>
                    {selectedAchievement.icon || <Award className="h-4 w-4 text-white" />}
                  </div>
                  {selectedAchievement.name}
                </DialogTitle>
                <DialogDescription>
                  Earned on {selectedAchievement.dateEarned}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>{selectedAchievement.description}</p>
                <div>
                  <div className="text-sm font-medium mb-1">Category</div>
                  <Badge variant="outline">
                    {selectedAchievement.category.charAt(0).toUpperCase() + selectedAchievement.category.slice(1)}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Level</div>
                  <Badge className={getAchievementColor(selectedAchievement.level)}>
                    {selectedAchievement.level.charAt(0).toUpperCase() + selectedAchievement.level.slice(1)}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
