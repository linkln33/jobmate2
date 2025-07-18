"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check, Twitter, Facebook, Instagram, Linkedin, Trophy, Star, Users, Award } from 'lucide-react';
import { GlassCard, ProgressBar, CountdownTimer, CallToAction } from '@/components/waitlist/dashboard/glassmorphism';
import { ReferralBarChart, PointsPieChart, LeaderboardChart } from '@/components/waitlist/dashboard/charts';
import { WaitlistGrowthChart } from '@/components/waitlist/dashboard/growth-chart';
import { BadgeGrid, AchievementBadge } from '@/components/waitlist/dashboard/achievement-badges';
import { PointsLegend } from '@/components/waitlist/dashboard/points-legend';
import { BackToHomeButton } from '@/components/waitlist/dashboard/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserStats } from '@/utils/progress-tracker';
import { ProgressTracker } from '@/components/waitlist/dashboard/progress-tracker';
// import { ParticleBackground } from '@/components/ui/particle-background';
import { supabaseAdmin } from '@/utils/supabase-admin';

// Define CSS variables for our theme
const cssVariables = {
  '--glass-bg': 'rgba(255, 255, 255, 0.7)',
  '--glass-bg-dark': 'rgba(17, 24, 39, 0.7)',
  '--glass-border': 'rgba(255, 255, 255, 0.2)',
  '--glass-border-dark': 'rgba(55, 65, 81, 0.3)',
  '--glass-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
  '--glass-shadow-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  '--glass-blur': 'blur(10px)',
  '--purple': '#8364e2',
  '--blue': '#4a6cf7',
  '--pink': '#f74a6c',
  '--green': '#4af7a6',
  '--orange': '#f7a64a',
};

export default function WaitlistDashboard() {
  const [user, setUser] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [referralData, setReferralData] = useState<any[]>([]);
  // Fetch user stats
  const userStats: UserStats & {
    position: number;
    totalUsers: number;
    joinDate: Date;
    nextMilestone: number;
  } = {
    position: 42,
    totalUsers: 500,
    referrals: 3,
    points: 75,
    rank: 15,
    joinDate: new Date('2023-09-15'),
    previousAchievements: [],
    nextMilestone: 100
  };
  
  // User ID for progress tracking (in a real app, this would come from authentication)
  const userId = 'current-user-id';

  // Set launch date to 30 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  // Mock milestones data
  const milestones = [
    { points: 10, reward: 'Early Access', description: 'Early access to platform' },
    { points: 50, reward: 'Free Pro - 1 Month', description: 'Free pro plan for the 1st month' },
    { points: 150, reward: 'Pro + Year Discount', description: '1st month free + 50% discount on year plan' },
    { points: 350, reward: 'Pro - 6 Months', description: 'Free pro plan for 6 months' },
    { points: 540, reward: 'Pro - 1 Year', description: 'Free pro plan for 1 year' },
    { points: 1000, reward: 'Pro - 2 Years', description: 'Free pro plan for two years' },
    { points: 3000, reward: 'Pro Lifetime', description: 'Free pro plan lifetime with special perks' },
  ];

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if we have user data in localStorage
        const storedUser = localStorage.getItem('waitlist_user');
        let userData = null;
        
        if (storedUser) {
          userData = JSON.parse(storedUser);
          setUser(userData);
        } else {
          // If no user in localStorage, redirect to waitlist page
          window.location.href = '/waitlist';
          return;
        }

        if (userData) {
          // Update user stats - in a real app, we would update the state here
          // For now, we'll just use the mock data
          
          // Set referral code
          setUser(userData);
        }
        
        // Fetch leaderboard data
        const leaderboardResponse = await fetch('/api/waitlist/leaderboard');
        const leaderboardData = await leaderboardResponse.json();
        
        if (leaderboardResponse.ok) {
          setLeaderboard(leaderboardData.leaderboard || []);
          
          // If we have a user and leaderboard, find user's rank and stats
          if (userData) {
            const userInLeaderboard = leaderboardData.leaderboard.find(
              (item: any) => item.email === userData.email
            ) || { points: userData.points || 0, rank: 999, referrals: userData.referrals || 0 };
            
            // Update userStats with actual data
            userStats.points = userInLeaderboard.points || 0;
            userStats.rank = userInLeaderboard.rank || 999;
            userStats.referrals = userData.referrals || 0;
            
            if (userInLeaderboard) {
              // Find next milestone
              const currentPoints = userInLeaderboard.points || 0;
              const nextMilestone = milestones.find(m => m.points > currentPoints)?.points || milestones[milestones.length - 1].points;
              
              // In a real app, we would update the state here
              // For now, we'll just use the mock data
              
              // Generate referral data for charts
              const topReferrers = leaderboardData.leaderboard
                .slice(0, 5)
                .map((item: any) => ({
                  name: item.name.split(' ')[0], // Just first name for display
                  referrals: item.referrals || 0,
                  points: item.points || 0,
                }));
              
              setReferralData(topReferrers);
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Only fetch once on component mount

  // Helper function to generate mock growth data
  const generateMockGrowthData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Generate increasing user numbers with some randomness
      const baseUsers = 50 + (30 - i) * 12;
      const randomFactor = Math.random() * 20 - 10; // Random number between -10 and 10
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: Math.max(0, Math.round(baseUsers + randomFactor)),
      });
    }
    
    return data;
  };

  // Handle share referral link
  const handleShareReferral = () => {
    if (user?.referralCode) {
      const referralLink = `${window.location.origin}/waitlist?ref=${user.referralCode}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Join JobMate Waitlist',
          text: 'I just joined the JobMate waitlist! Use my referral link to sign up and get priority access.',
          url: referralLink,
        }).catch(err => {
          console.error('Error sharing:', err);
          // Fallback to clipboard
          navigator.clipboard.writeText(referralLink);
          alert('Referral link copied to clipboard!');
        });
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="text-center text-white max-w-md p-8">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">{error || "You need to join the waitlist first"}</p>
          <a 
            href="/waitlist" 
            className="px-6 py-3 bg-blue-600 text-white rounded-full inline-block hover:bg-blue-700 transition"
          >
            Join Waitlist
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={cssVariables as React.CSSProperties} 
      className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
    >
      <BackToHomeButton />
      <ToastContainer position="bottom-right" theme="colored" />
      {/* <ParticleBackground /> */}
      <div className="container mx-auto px-4 py-8 relative z-10">{/* Main content container */}
        <div className="absolute inset-0 z-0">
          {/* Decorative elements - subtle blue accents matching home page */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-10 dark:opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-10 dark:opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-blue-600 dark:text-blue-400">Waitlist</span> Dashboard
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto whitespace-nowrap mb-8">
              Track your position, invite friends, and earn rewards while you wait for access.
            </p>
          </div>
          
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
            <GlassCard className="p-6" delay={0.1}>
              <div className="text-center">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">Rank</h3>
                  <Trophy className="text-amber-500" />
                </div>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  #{userStats.rank}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  on leaderboard
                </p>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6" delay={0.2}>
              <div className="text-center">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">Points</h3>
                  <Star className="text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {userStats.points}
                </p>
                <ProgressBar 
                  value={userStats.points} 
                  max={userStats.nextMilestone} 
                  color="purple" 
                  height={6} 
                />
              </div>
            </GlassCard>
            
            <GlassCard className="p-6" delay={0.3}>
              <div className="text-center">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">Referrals</h3>
                  <Share2 className="text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {userStats.referrals}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  invites sent
                </p>
              </div>
            </GlassCard>
          </div>
          
          {/* Achievement Badges Row */}
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="flex justify-center items-center gap-4 overflow-x-auto py-2 px-4">
              <AchievementBadge type="earlyAccess" earned={userStats.points >= 10} size="sm" showName={true} />
              <AchievementBadge type="freeProMonth" earned={userStats.points >= 50} size="sm" showName={true} />
              <AchievementBadge type="proYearDiscount" earned={userStats.points >= 150} size="sm" showName={true} />
              <AchievementBadge type="proSixMonths" earned={userStats.points >= 350} size="sm" showName={true} />
              <AchievementBadge type="proOneYear" earned={userStats.points >= 540} size="sm" showName={true} />
              <AchievementBadge type="proTwoYears" earned={userStats.points >= 1000} size="sm" showName={true} />
              <AchievementBadge type="proLifetime" earned={userStats.points >= 3000} size="sm" showName={true} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Container for Notifications */}
      <ToastContainer />
      
      {/* Client-side progress tracker */}
      <ProgressTracker userId={userId} currentStats={userStats} />
      
      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Towards Next Reward */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-4">Progress Towards Next Reward</h2>
              <div className="mb-6">
                <ProgressBar 
                  value={userStats.points} 
                  max={userStats.nextMilestone} 
                  color={userStats.points >= 250 ? "purple" : userStats.points >= 100 ? "blue" : userStats.points >= 50 ? "lightblue" : "green"} 
                  height={12}
                  label="Current → Next"
                  showValue={true}
                  currentBadge={
                    userStats.points >= 3000 ? 
                      <AchievementBadge type="proLifetime" earned={true} size="sm" /> : 
                    userStats.points >= 1000 ? 
                      <AchievementBadge type="proTwoYears" earned={true} size="sm" /> : 
                    userStats.points >= 540 ? 
                      <AchievementBadge type="proOneYear" earned={true} size="sm" /> : 
                    userStats.points >= 350 ? 
                      <AchievementBadge type="proSixMonths" earned={true} size="sm" /> : 
                    userStats.points >= 150 ? 
                      <AchievementBadge type="proYearDiscount" earned={true} size="sm" /> : 
                    userStats.points >= 50 ? 
                      <AchievementBadge type="freeProMonth" earned={true} size="sm" /> : 
                    userStats.points >= 10 ? 
                      <AchievementBadge type="earlyAccess" earned={true} size="sm" /> :
                      <div className="w-8 h-8"></div>
                  }
                  nextBadge={
                    userStats.points >= 3000 ? 
                      <div className="w-8 h-8"></div> :
                    userStats.points >= 1000 ? 
                      <AchievementBadge type="proLifetime" earned={false} size="sm" /> : 
                    userStats.points >= 540 ? 
                      <AchievementBadge type="proTwoYears" earned={false} size="sm" /> : 
                    userStats.points >= 350 ? 
                      <AchievementBadge type="proOneYear" earned={false} size="sm" /> : 
                    userStats.points >= 150 ? 
                      <AchievementBadge type="proSixMonths" earned={false} size="sm" /> : 
                    userStats.points >= 50 ? 
                      <AchievementBadge type="proYearDiscount" earned={false} size="sm" /> : 
                    userStats.points >= 10 ? 
                      <AchievementBadge type="freeProMonth" earned={false} size="sm" /> : 
                      <AchievementBadge type="earlyAccess" earned={false} size="sm" />
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {milestones.map((milestone, index) => {
                  const earned = userStats.points >= milestone.points;
                  return (
                    <div 
                      key={index}
                      className={`text-center p-3 rounded-lg border ${
                        earned ? 'border-green-500 bg-green-500 bg-opacity-10' : 'border-gray-600 bg-gray-800 bg-opacity-30'
                      }`}
                    >
                      <div className="text-lg font-bold mb-1">{milestone.points}</div>
                      <div className="text-sm font-medium mb-1">{milestone.reward}</div>
                      <div className="text-xs opacity-70">{earned ? 'Unlocked' : 'Locked'}</div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
            
            {/* Beautiful Colorful Growth Chart */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-4">Waitlist Growth</h2>
              <div className="h-80">
                <WaitlistGrowthChart height="300px" />
              </div>
            </GlassCard>
            
            {/* Leaderboard */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Leaderboard</h2>
              <div className="h-80">
                <LeaderboardChart 
                  data={leaderboard.slice(0, 5).map((item: any) => ({
                    name: item.name,
                    points: item.points || 0,
                    rank: item.rank || 0,
                  }))} 
                />
              </div>
            </GlassCard>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Launch Countdown */}
            <GlassCard className="p-6">
              <CountdownTimer endDate={launchDate} />
            </GlassCard>
            
            {/* Share Referral Link */}
            <GlassCard className="p-5">
              <CallToAction 
                title="Boost Your Position"
                description="Share your referral link with friends to earn points and climb the leaderboard!"
                buttonText="Share Referral Link"
                onClick={handleShareReferral}
                showSocialButtons={true}
                referralLink={user?.referralCode ? `${typeof window !== 'undefined' ? window.location.origin : ''}/waitlist?ref=${user.referralCode}` : ''}
              />
            </GlassCard>
            

            
            {/* XP System & How to Earn Points */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">XP System</h2>
              <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                All points go toward your XP total. Higher XP → higher waitlist position and perks.
                XP thresholds unlock badges.
              </p>
              
              <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">Daily Activities</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-base mr-2">📝</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Post on Twitter <span className="font-bold text-green-600 dark:text-green-400 text-sm">+5 XP</span></p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Post with #jobmate and tag the official account</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-base mr-2">🧵</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Thread Challenge <span className="font-bold text-green-600 dark:text-green-400 text-sm">+10 XP</span></p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Write a tweet thread about JobMate or your experience</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-base mr-2">✍️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Write a Review on Medium <span className="font-bold text-green-600 dark:text-green-400 text-sm">+15 XP</span></p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Write an article/blog about your story or JobMate overview</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-base mr-2">🔁</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Daily Share Streak <span className="font-bold text-green-600 dark:text-green-400 text-sm">+2 XP</span></p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Share something every day (tweet/story/post with #jobmate)</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-base mr-2">🎁</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Daily Login Bonus <span className="font-bold text-green-600 dark:text-green-400 text-sm">+1 XP</span></p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Visit your dashboard daily</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">Other Ways to Earn</h3>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="mr-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    <Star className="text-blue-500" size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Join Waitlist <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">+10 XP</span></p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Sign up for the JobMate waitlist</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="mr-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    <Users className="text-purple-500" size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Referrals <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">+5 XP</span></p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Each friend who joins with your referral link</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="mr-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    <Award className="text-green-500" size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Top 10 Position <span className="font-bold text-green-600 dark:text-green-400 text-sm">+20 XP</span></p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Maintain a top 10 position on the leaderboard</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
