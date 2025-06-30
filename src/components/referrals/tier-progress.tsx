'use client';

import { Progress } from '@/components/ui/progress';
import { calculateTierProgress } from '@/lib/referral-tiers';
import { Card } from '@/components/ui/card';

interface TierProgressProps {
  referralCount: number;
}

export function TierProgress({ referralCount }: TierProgressProps) {
  const { currentTier, nextTier, progress, remaining } = calculateTierProgress(referralCount);
  
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Current Tier</h3>
            <div className="flex items-center gap-2 mt-1">
              <div 
                className="h-4 w-4 rounded-full" 
                style={{ backgroundColor: currentTier.color }} 
              />
              <span className="font-semibold">{currentTier.name}</span>
            </div>
          </div>
          
          <div className="text-right">
            <h3 className="text-sm font-medium">Commission Rate</h3>
            <p className="font-semibold">{(currentTier.commissionRate * 100).toFixed(0)}%</p>
          </div>
        </div>
        
        {nextTier ? (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">
                {referralCount} referrals
              </span>
              <span className="text-xs text-gray-500">
                {nextTier.minReferrals} referrals
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {remaining} more referrals to reach {nextTier.name} tier ({(nextTier.commissionRate * 100).toFixed(0)}% commission)
            </p>
          </div>
        ) : (
          <div>
            <Progress value={100} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              You've reached the highest tier! Enjoy your {(currentTier.commissionRate * 100).toFixed(0)}% commission rate.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
