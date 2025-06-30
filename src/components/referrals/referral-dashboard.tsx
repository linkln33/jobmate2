'use client';

import { useState, useEffect } from 'react';
import { 
  getUserReferralStats, 
  getReferralsByUser, 
  ReferralData 
} from '@/services/referral/referralService';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { DollarSign, Users, Clock } from 'lucide-react';

// Stats card component
function StatsCard({ 
  title, 
  value, 
  icon 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode 
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>
    </Card>
  );
}

// Referral history table component
function ReferralHistoryTable({ referrals }: { referrals: ReferralData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Listing</th>
            <th className="text-left py-3 px-4">Type</th>
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-right py-3 px-4">Commission</th>
          </tr>
        </thead>
        <tbody>
          {referrals.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No referrals yet
              </td>
            </tr>
          ) : (
            referrals.map((referral) => (
              <tr key={referral.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{referral.listingId}</td>
                <td className="py-3 px-4 capitalize">{referral.listingType}</td>
                <td className="py-3 px-4">
                  {formatDistanceToNow(new Date(referral.createdAt), { addSuffix: true })}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    referral.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : referral.status === 'converted' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {referral.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  ${referral.commission.toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Payout history table component
function PayoutHistoryTable({ referrals }: { referrals: ReferralData[] }) {
  const paidReferrals = referrals.filter(r => r.status === 'paid');
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Listing</th>
            <th className="text-left py-3 px-4">Type</th>
            <th className="text-left py-3 px-4">Paid Date</th>
            <th className="text-right py-3 px-4">Amount</th>
          </tr>
        </thead>
        <tbody>
          {paidReferrals.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No payouts yet
              </td>
            </tr>
          ) : (
            paidReferrals.map((referral) => (
              <tr key={referral.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{referral.listingId}</td>
                <td className="py-3 px-4 capitalize">{referral.listingType}</td>
                <td className="py-3 px-4">
                  {referral.paidAt ? formatDistanceToNow(new Date(referral.paidAt), { addSuffix: true }) : '-'}
                </td>
                <td className="py-3 px-4 text-right">
                  ${referral.commission.toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Main referral dashboard component
export function ReferralDashboard() {
  const [stats, setStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    convertedReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0
  });
  
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock user ID - in a real app, this would come from authentication
  const mockUserId = 'user123';
  
  useEffect(() => {
    async function loadReferralData() {
      try {
        setLoading(true);
        const userStats = await getUserReferralStats(mockUserId);
        const userReferrals = await getReferralsByUser(mockUserId);
        
        setStats(userStats);
        setReferrals(userReferrals);
      } catch (error) {
        console.error('Failed to load referral data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadReferralData();
  }, [mockUserId]);
  
  if (loading) {
    return <div className="p-6">Loading referral data...</div>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Referral Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard 
          title="Total Earnings" 
          value={`$${stats.totalEarnings.toFixed(2)}`}
          icon={<DollarSign size={24} />}
        />
        <StatsCard 
          title="Pending Earnings" 
          value={`$${stats.pendingEarnings.toFixed(2)}`}
          icon={<Clock size={24} />}
        />
        <StatsCard 
          title="Total Referrals" 
          value={stats.totalReferrals}
          icon={<Users size={24} />}
        />
      </div>
      
      <Tabs defaultValue="history" className="mb-6">
        <TabsList>
          <TabsTrigger value="history">Referral History</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-4">
          <Card className="p-4">
            <ReferralHistoryTable referrals={referrals} />
          </Card>
        </TabsContent>
        
        <TabsContent value="payouts" className="mt-4">
          <Card className="p-4">
            <PayoutHistoryTable referrals={referrals} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
