/**
 * @file Waitlist leaderboard component
 * @module components/waitlist/leaderboard
 * 
 * This component displays the top referrers in the waitlist system.
 */

"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award } from 'lucide-react';

/**
 * Interface for leaderboard entry
 */
interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  referral_count: number;
  referral_code: string;
}

/**
 * Props for the Leaderboard component
 */
interface LeaderboardProps {
  /**
   * Maximum number of entries to display
   * @default 10
   */
  limit?: number;
  
  /**
   * Current user's referral code to highlight their position
   */
  currentUserCode?: string;
  
  /**
   * Whether to auto-refresh the leaderboard periodically
   * @default false
   */
  autoRefresh?: boolean;
}

/**
 * Waitlist leaderboard component
 * 
 * @component
 * @example
 * ```tsx
 * <Leaderboard limit={5} currentUserCode="user123" />
 * ```
 */
export function Leaderboard({ limit = 10, currentUserCode, autoRefresh = false }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch leaderboard data from API
   */
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/waitlist/leaderboard?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      setLeaderboard(data.leaderboard);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch leaderboard on component mount
  useEffect(() => {
    fetchLeaderboard();
    
    // Set up auto-refresh if enabled
    let intervalId: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      intervalId = setInterval(fetchLeaderboard, 60000); // Refresh every minute
    }
    
    // Clean up interval on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [limit, autoRefresh]);
  
  /**
   * Get avatar fallback text from name
   */
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  /**
   * Get badge for top positions
   */
  const getPositionBadge = (position: number) => {
    switch (position) {
      case 0:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Trophy className="h-3 w-3 mr-1" /> Champion
          </Badge>
        );
      case 1:
        return (
          <Badge className="bg-gray-400 hover:bg-gray-500">
            <Medal className="h-3 w-3 mr-1" /> Silver
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-amber-700 hover:bg-amber-800">
            <Award className="h-3 w-3 mr-1" /> Bronze
          </Badge>
        );
      default:
        return null;
    }
  };
  
  /**
   * Render loading skeletons
   */
  const renderSkeletons = () => {
    return Array(limit)
      .fill(0)
      .map((_, i) => (
        <div key={`skeleton-${i}`} className="flex items-center space-x-4 py-3">
          <div className="flex-shrink-0 w-8 text-center">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ));
  };
  
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Referral Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 bg-red-50 rounded-md text-red-600 text-sm mb-4">
            {error}
          </div>
        )}
        
        <div className="space-y-1">
          {loading ? (
            renderSkeletons()
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No referrals yet. Be the first to invite friends!
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const isCurrentUser = entry.referral_code === currentUserCode;
              
              return (
                <div 
                  key={entry.id}
                  className={`flex items-center space-x-4 py-3 px-2 rounded-md ${
                    isCurrentUser ? 'bg-blue-50' : index % 2 === 0 ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-8 text-center font-semibold">
                    {index + 1}
                  </div>
                  
                  <Avatar className={`border-2 ${index === 0 ? 'border-yellow-500' : index === 1 ? 'border-gray-400' : index === 2 ? 'border-amber-700' : 'border-transparent'}`}>
                    <AvatarFallback>
                      {getInitials(entry.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="font-medium flex items-center">
                      {entry.name}
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.referral_count} {entry.referral_count === 1 ? 'referral' : 'referrals'}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-semibold">{entry.points}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                    {getPositionBadge(index)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
