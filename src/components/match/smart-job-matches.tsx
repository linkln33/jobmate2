"use client";

import React, { useState, useEffect } from 'react';
import { Job } from '@/components/map/enhanced-job-map';
import { Specialist, matchService, MatchResult } from '@/services/match-service';
import { JobMatchCard } from './job-match-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Filter, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SmartJobMatchesProps {
  jobs: Job[];
  specialist: Specialist;
  onSelectJob?: (jobId: string) => void;
}

export function SmartJobMatches({ jobs, specialist, onSelectJob }: SmartJobMatchesProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [jobMatches, setJobMatches] = useState<Array<{ job: Job; matchResult: MatchResult }>>([]);
  const [activeTab, setActiveTab] = useState('best');

  // Calculate match scores for all jobs
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const matches = jobs.map(job => ({
        job,
        matchResult: matchService.calculateMatchScore(job, specialist)
      }));
      
      setJobMatches(matches);
      setIsLoading(false);
    }, 800);
  }, [jobs, specialist]);
  
  // Filter and sort matches based on active tab
  const getFilteredMatches = () => {
    let filtered = [...jobMatches];
    
    switch (activeTab) {
      case 'best':
        // Sort by highest match score
        return filtered.sort((a, b) => b.matchResult.score - a.matchResult.score).slice(0, 10);
      case 'nearby':
        // Sort by proximity
        return filtered
          .sort((a, b) => 
            b.matchResult.factors.locationProximity - a.matchResult.factors.locationProximity
          )
          .slice(0, 10);
      case 'urgent':
        // Filter for urgent jobs and sort by match score
        return filtered
          .filter(match => match.job.urgencyLevel === 'high')
          .sort((a, b) => b.matchResult.score - a.matchResult.score);
      case 'new':
        // Sort by newest (using createdAt)
        return filtered
          .sort((a, b) => 
            new Date(b.job.createdAt).getTime() - new Date(a.job.createdAt).getTime()
          )
          .slice(0, 10);
      default:
        return filtered.slice(0, 10);
    }
  };
  
  const filteredMatches = getFilteredMatches();
  
  // Handle refresh button click
  const handleRefresh = () => {
    setIsLoading(true);
    // In a real app, this would fetch fresh job data from the API
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Smart Job Matches</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="best" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="best">Best Match</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/6" />
                  </div>
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 w-1/2" />
                    <Skeleton className="h-9 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="space-y-4">
              {filteredMatches.map(({ job, matchResult }) => (
                <JobMatchCard 
                  key={job.id} 
                  job={job} 
                  matchResult={matchResult}
                  onViewDetails={() => onSelectJob && onSelectJob(job.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-700">No matches found</h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your filters or refreshing the matches
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Matches
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
