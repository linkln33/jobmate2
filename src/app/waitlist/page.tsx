/**
 * @file Waitlist landing page
 * @module app/waitlist/page
 * 
 * This page serves as the main entry point for the waitlist system,
 * handling user registration and referral tracking.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignupForm } from '@/components/waitlist/signup-form';
import { ReferralLink } from '@/components/waitlist/referral-link';
import { Leaderboard } from '@/components/waitlist/leaderboard';
import { RewardsTracker } from '@/components/waitlist/rewards-tracker';
import { MapPreview } from '@/components/waitlist/map-preview';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Share2, Trophy, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Waitlist page component
 */
export default function WaitlistPage() {
  // Get referral code from URL if present
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  // User state
  const [user, setUser] = useState<any>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [userStatus, setUserStatus] = useState<any>(null);
  
  // Handle successful signup
  const handleSignupSuccess = (userData: any) => {
    setUser(userData);
    setRegistrationComplete(true);
    
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Fetch user status
    fetchUserStatus(userData.id);
  };
  
  // Fetch user status data
  const fetchUserStatus = async (userId: string) => {
    try {
      const response = await fetch(`/api/waitlist/status?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user status');
      }
      
      const data = await response.json();
      setUserStatus(data.status);
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join the JobMate Waitlist
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Be among the first to access our revolutionary marketplace connecting skilled professionals with exciting opportunities.
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          {!registrationComplete ? (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <h2 className="text-2xl font-semibold mb-6">
                    {referralCode ? 'You\'ve been invited!' : 'Sign up for early access'}
                  </h2>
                  <SignupForm 
                    referralCode={referralCode || undefined} 
                    onSuccess={handleSignupSuccess}
                  />
                </div>
                
                <div className="hidden md:block">
                  <MapPreview />
                </div>
              </div>
              
              <div className="mt-16">
                <HowItWorksSection />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🎉 You're on the list!
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Thanks for joining the JobMate waitlist. Invite friends to earn rewards and move up the queue!
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <ReferralLink referralCode={user.referralCode} />
                </div>
                
                <Tabs defaultValue="rewards" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="rewards" className="flex items-center">
                      <Gift className="h-4 w-4 mr-2" /> Rewards
                    </TabsTrigger>
                    <TabsTrigger value="leaderboard" className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2" /> Leaderboard
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center">
                      <Share2 className="h-4 w-4 mr-2" /> Preview
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="rewards">
                    {userStatus ? (
                      <RewardsTracker
                        referralCount={userStatus.stats.totalReferrals}
                        unlockedRewards={userStatus.rewards.map((r: any) => r.reward_name)}
                        points={userStatus.user.points}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <p>Loading your rewards...</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="leaderboard">
                    <Leaderboard 
                      limit={10}
                      currentUserCode={user.referralCode}
                      autoRefresh={true}
                    />
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    <div className="space-y-6">
                      <MapPreview height="500px" />
                      <div className="text-center">
                        <Button size="lg" className="mt-4">
                          Join Now to Access the Full Platform
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
