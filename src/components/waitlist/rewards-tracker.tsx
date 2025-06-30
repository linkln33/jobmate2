/**
 * @file Waitlist rewards tracker component
 * @module components/waitlist/rewards-tracker
 * 
 * This component displays a user's progress toward rewards and unlocked badges.
 */

"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gift, Award, Star, Zap, Lock, Check } from 'lucide-react';

/**
 * Interface for reward milestone
 */
interface RewardMilestone {
  threshold: number;
  type: 'badge' | 'credit' | 'feature' | 'perk';
  name: string;
  description: string;
  icon: React.ReactNode;
}

/**
 * Props for the RewardsTracker component
 */
interface RewardsTrackerProps {
  /**
   * Current number of referrals
   */
  referralCount: number;
  
  /**
   * List of rewards already unlocked by the user
   */
  unlockedRewards: string[];
  
  /**
   * Total points accumulated by the user
   */
  points: number;
}

/**
 * Waitlist rewards tracker component
 * 
 * @component
 * @example
 * ```tsx
 * <RewardsTracker 
 *   referralCount={3} 
 *   unlockedRewards={['Early Adopter', 'Beta Spotlight']} 
 *   points={310} 
 * />
 * ```
 */
export function RewardsTracker({ 
  referralCount, 
  unlockedRewards, 
  points 
}: RewardsTrackerProps) {
  // Define reward milestones
  const rewardMilestones: RewardMilestone[] = [
    {
      threshold: 1,
      type: 'badge',
      name: 'Early Adopter',
      description: 'First to join our community',
      icon: <Star className="h-5 w-5 text-purple-500" />
    },
    {
      threshold: 3,
      type: 'feature',
      name: 'Beta Spotlight',
      description: 'Early access to beta features',
      icon: <Zap className="h-5 w-5 text-yellow-500" />
    },
    {
      threshold: 5,
      type: 'credit',
      name: 'Platform Credit ($5)',
      description: '$5 credit for JobMate services',
      icon: <Gift className="h-5 w-5 text-green-500" />
    },
    {
      threshold: 10,
      type: 'perk',
      name: '0% Fee for Life',
      description: 'No platform fees forever',
      icon: <Award className="h-5 w-5 text-blue-500" />
    }
  ];
  
  // Find the next milestone
  const nextMilestone = rewardMilestones.find(milestone => 
    milestone.threshold > referralCount
  );
  
  // Calculate progress to next milestone
  const calculateProgress = () => {
    if (!nextMilestone) return 100;
    
    const prevMilestone = rewardMilestones
      .filter(m => m.threshold <= referralCount)
      .pop();
    
    const prevThreshold = prevMilestone ? prevMilestone.threshold : 0;
    const progress = ((referralCount - prevThreshold) / 
      (nextMilestone.threshold - prevThreshold)) * 100;
    
    return Math.max(0, Math.min(100, progress));
  };
  
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Gift className="h-5 w-5 mr-2 text-indigo-500" />
          Your Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">
              {referralCount} {referralCount === 1 ? 'referral' : 'referrals'}
            </div>
            <div className="text-sm font-medium">
              {nextMilestone ? `${nextMilestone.threshold} referrals` : 'All rewards unlocked!'}
            </div>
          </div>
          
          <Progress value={calculateProgress()} className="h-2" />
          
          {nextMilestone && (
            <div className="mt-2 text-sm text-gray-500">
              {nextMilestone.threshold - referralCount} more {(nextMilestone.threshold - referralCount) === 1 ? 'referral' : 'referrals'} to unlock <span className="font-medium">{nextMilestone.name}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {rewardMilestones.map(milestone => {
            const isUnlocked = unlockedRewards.includes(milestone.name) || 
              referralCount >= milestone.threshold;
            
            return (
              <div 
                key={milestone.name}
                className={`flex items-center p-3 rounded-lg border ${
                  isUnlocked 
                    ? 'border-green-100 bg-green-50' 
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  {milestone.icon}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium flex items-center">
                    {milestone.name}
                    <Badge 
                      className={`ml-2 ${
                        isUnlocked 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    >
                      {isUnlocked ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <Lock className="h-3 w-3 mr-1" />
                      )}
                      {isUnlocked ? 'Unlocked' : `${milestone.threshold} referrals`}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {milestone.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-2xl font-bold text-indigo-600">{points}</div>
          <div className="text-sm text-gray-500">Total Points</div>
        </div>
      </CardContent>
    </Card>
  );
}
