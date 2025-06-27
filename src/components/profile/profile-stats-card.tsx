"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Briefcase, Clock, Star, Users } from 'lucide-react';

interface ProfileStatsCardProps {
  stats: {
    jobsCompleted?: number;
    responseRate?: number;
    averageResponseTime?: string;
    rating?: number;
    totalReviews?: number;
    memberSince?: string;
    completionRate?: number;
  };
  className?: string;
}

export function ProfileStatsCard({ stats = {}, className }: ProfileStatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Performance Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>Jobs Completed</span>
            </div>
            <div className="font-medium">{stats?.jobsCompleted || 0}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-4 w-4 mr-1" />
              <span>Rating</span>
            </div>
            <div className="font-medium">
              {stats?.rating?.toFixed(1) || '0.0'} ({stats?.totalReviews || 0})
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Response Time</span>
            </div>
            <div className="font-medium">{stats?.averageResponseTime || 'N/A'}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>Member Since</span>
            </div>
            <div className="font-medium">{stats?.memberSince || 'N/A'}</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Response Rate</span>
              <span>{stats?.responseRate || 0}%</span>
            </div>
            <Progress value={stats?.responseRate || 0} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span>{stats?.completionRate || 0}%</span>
            </div>
            <Progress value={stats?.completionRate || 0} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
