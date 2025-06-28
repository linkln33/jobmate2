import React from 'react';
import { useUserToUserCompatibility } from '@/hooks/use-user-to-user-compatibility';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCompatibilityBadge } from '@/components/ui/enhanced-compatibility-badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, MessageCircleIcon, UserPlusIcon } from 'lucide-react';

interface ProfileCompatibilityCardProps {
  userId: string;
  className?: string;
}

/**
 * A card component that shows compatibility between the current user and another user
 */
export function ProfileCompatibilityCard({
  userId,
  className = ''
}: ProfileCompatibilityCardProps) {
  const { compatibilityResult, loading, error } = useUserToUserCompatibility({
    targetUserId: userId
  });

  // Helper functions for styling based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-emerald-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getScoreIcon = (score: number) => {
    if (score >= 70) return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
    if (score <= 30) return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    return <MinusIcon className="h-4 w-4 text-amber-500" />;
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-emerald-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-3/4" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center py-4">
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !compatibilityResult) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle>Compatibility</CardTitle>
          <CardDescription>
            {error ? 'Error loading compatibility data' : 'Complete your profile to see compatibility'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error 
              ? 'We encountered an issue calculating compatibility. Please try again later.' 
              : 'Add more preferences to your profile to see how well you match with this user.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Compatibility</CardTitle>
            <CardDescription>How well you match with this user</CardDescription>
          </div>
          <EnhancedCompatibilityBadge 
            score={compatibilityResult.overallScore} 
            size="md"
            primaryReason={compatibilityResult.primaryMatchReason}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary match reason */}
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="font-medium text-sm">{compatibilityResult.primaryMatchReason}</p>
        </div>
        
        {/* Top dimensions */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Compatibility Factors</h3>
          
          {compatibilityResult.dimensions.slice(0, 3).map((dimension, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getScoreIcon(dimension.score)}
                  <span className="text-sm font-medium">{dimension.name}</span>
                </div>
                <span className={`text-sm font-medium ${getScoreColor(dimension.score)}`}>
                  {dimension.score}%
                </span>
              </div>
              <Progress 
                value={dimension.score} 
                className={`h-2 ${getProgressColor(dimension.score)}`}
              />
              <p className="text-xs text-muted-foreground">{dimension.description}</p>
            </div>
          ))}
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <MessageCircleIcon className="h-4 w-4" />
            Message
          </Button>
          <Button variant="default" className="w-full flex items-center gap-2">
            <UserPlusIcon className="h-4 w-4" />
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
