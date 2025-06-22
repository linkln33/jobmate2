"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Job, MatchResult, Specialist } from '@/types/job-match-types';
import { MapPin, Clock, DollarSign, Star, Zap, ExternalLink, Send, MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MatchBadge, getMatchBadges, BadgeType } from './match-badge';
import { AutoReplyGenerator } from './auto-reply-generator';

interface JobMatchCardProps {
  job: Job;
  matchResult: MatchResult;
  specialist?: Partial<Specialist>;
  onSelect?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export function JobMatchCard({ job, matchResult, specialist, onSelect, isSelected, className }: JobMatchCardProps) {
  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };
  
  // Get badges for this job match
  const badges = getMatchBadges(matchResult.score, {
    skillMatch: matchResult.factors.skillMatch,
    locationProximity: matchResult.factors.locationProximity,
    reputationScore: matchResult.factors.reputationScore,
    responseTime: specialist?.premium?.isPremium ? 5 : 15, // Mock response time
    urgencyLevel: job.urgencyLevel,
    isVerified: job.isVerifiedPayment,
    isPremium: specialist?.premium?.isPremium,
    clientRating: job.customer?.reputation?.overallRating
  });
  
  // Format currency
  const formatCurrency = (amount?: number) => {
    if (!amount && amount !== 0) return 'N/A';
    return `$${amount.toFixed(0)}`;
  };
  
  return (
    <Card className={cn("w-full overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-2 relative">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-sm text-gray-500 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {job.city}, {job.state}
            </p>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                {matchResult.score}%
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium">Match Score</div>
                <div className="text-xs text-muted-foreground">
                  {matchResult.score >= 90 ? 'Excellent' : 
                   matchResult.score >= 70 ? 'Good' : 
                   matchResult.score >= 50 ? 'Fair' : 'Low'} match
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
              {/* Smart match badges */}
              {badges.map((badge) => (
                <MatchBadge key={badge} type={badge as BadgeType} />
              ))}
              
              {/* Legacy badges */}
              {badges.length === 0 && job.urgencyLevel === 'high' && (
                <Badge variant="destructive" className="text-xs">Urgent</Badge>
              )}
              {badges.length === 0 && new Date(job.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                <Badge variant="secondary" className="text-xs">New</Badge>
              )}
            </div>
          </div>
        </div>
        
        {job.urgencyLevel === 'high' && (
          <Badge variant="destructive" className="absolute top-2 right-2 text-xs flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            Urgent
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-3">
          {/* Match score visualization */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Match Score</span>
              <span className="font-medium">{matchResult.score}%</span>
            </div>
            <Progress value={matchResult.score} className="h-2" />
          </div>
          
          {/* Match factors */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <Star className="h-3 w-3 mr-1 text-yellow-500" />
              <span>Skills: {Math.round(matchResult.factors.skillMatch * 100)}%</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-blue-500" />
              <span>Location: {Math.round(matchResult.factors.locationProximity * 100)}%</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-3 w-3 mr-1 text-green-500" />
              <span>Price: {Math.round(matchResult.factors.priceMatch * 100)}%</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-purple-500" />
              <span>Timing: {Math.round(matchResult.factors.availabilityMatch * 100)}%</span>
            </div>
          </div>
          
          {/* Job details */}
          <div className="pt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{job.serviceCategory?.name}</span>
              <span className="text-sm text-green-600 font-medium">
                {job.budgetMin && job.budgetMax 
                  ? `${formatCurrency(job.budgetMin)} - ${formatCurrency(job.budgetMax)}`
                  : job.budgetMin 
                  ? `From ${formatCurrency(job.budgetMin)}`
                  : job.budgetMax
                  ? `Up to ${formatCurrency(job.budgetMax)}`
                  : 'Price not specified'}
              </span>
            </div>
            
            <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
          </div>
          
          {/* Match explanations */}
          <div className="pt-1">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Why this matches you:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {matchResult.explanations && matchResult.explanations.slice(0, 3).map((explanation: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>{explanation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="w-full flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/jobs/${job.id}`}>
              View Details
            </Link>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/jobs/${job.id}/apply`}>
              Apply Now
            </Link>
          </Button>
        </div>
        
        {/* Smart Auto-Reply Generator */}
        {specialist && (
          <AutoReplyGenerator 
            job={job}
            specialist={specialist}
            matchResult={matchResult}
            trigger={
              <Button variant="outline" size="sm" className="mt-2 w-full">
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Generate Response
              </Button>
            }
          />
        )}
      </CardFooter>
    </Card>
  );
}
