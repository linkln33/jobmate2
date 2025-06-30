'use client';

import { ReferralDashboard } from '@/components/referrals/referral-dashboard';
import { TierProgress } from '@/components/referrals/tier-progress';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { useState, useEffect } from 'react';
import { getUserReferralStats } from '@/services/referral/referralService';

export default function ReferralsPage() {
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Mock user ID - in a real app, this would come from authentication
  const mockUserId = 'user123';
  
  useEffect(() => {
    async function loadReferralData() {
      try {
        setLoading(true);
        const userStats = await getUserReferralStats(mockUserId);
        setReferralCount(userStats.convertedReferrals);
      } catch (error) {
        console.error('Failed to load referral data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadReferralData();
  }, [mockUserId]);
  
  return (
    <UnifiedDashboardLayout title="Referral Program" hideSidebar={false} showMap={false} isPublicPage={false}>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">Referral Program</h1>
            <p className="text-muted-foreground">
              Share listings with friends and earn rewards when they make a purchase or booking.
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Referral Tier</h2>
            <TierProgress referralCount={referralCount} />
          </div>
          
          <ReferralDashboard />
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
