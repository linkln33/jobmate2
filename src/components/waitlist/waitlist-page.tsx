"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Share2, Check, Trophy, Award, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

type WaitlistUser = {
  id: string;
  email: string;
  name: string;
  referral_code: string;
  points: number;
  badges?: string[];
};

type LeaderboardEntry = {
  name: string;
  points: number;
  referral_count: number;
  position: number;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
};

export function WaitlistPage() {
  const searchParams = useSearchParams();
  const referralCode = searchParams?.get('ref');
  const registered = searchParams?.get('registered');
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  // Registration state
  const [user, setUser] = useState<WaitlistUser | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  
  // Check for existing registration on mount
  useEffect(() => {
    // Check if user came from popup registration
    if (registered === 'true') {
      const savedUser = localStorage.getItem('waitlistUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setRegistrationComplete(true);
        } catch (e) {
          console.error('Failed to parse saved user data:', e);
        }
      }
    }
  }, [registered]);
  
  // Badges state
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 'early_adopter',
      name: 'Early Adopter',
      description: 'Joined during our beta phase',
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      unlocked: true
    },
    {
      id: 'first_referral',
      name: 'First Referral',
      description: 'Successfully referred your first user',
      icon: <Users className="h-6 w-6 text-blue-500" />,
      unlocked: false
    },
    {
      id: 'influencer',
      name: 'Influencer',
      description: 'Referred 5+ users to the waitlist',
      icon: <Award className="h-6 w-6 text-purple-500" />,
      unlocked: false
    },
  ]);
  
  // Load user data if registration is complete
  useEffect(() => {
    if (registrationComplete && user) {
      fetchLeaderboard();
      fetchUserBadges();
    }
  }, [registrationComplete, user]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          referredBy: referralCode 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }
      
      setUser(data.user);
      // Store user data in localStorage for dashboard access
      localStorage.setItem('waitlist_user', JSON.stringify(data.user));
      setRegistrationComplete(true);
      
      // Redirect to dashboard after successful registration
      window.location.href = '/waitlist-dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoadingState('loading');
      const response = await fetch('/api/waitlist/leaderboard');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch leaderboard');
      }
      
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
        setLoadingState('success');
      }
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      setErrorMessage(error.message || 'Failed to load leaderboard data');
      setLoadingState('error');
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };
  
  // Fetch user badges
  const fetchUserBadges = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/waitlist/user/${user.id}/badges`);
      const data = await response.json();
      
      if (response.ok && data.badges) {
        // Update badges with unlocked status
        setBadges(prev => prev.map(badge => ({
          ...badge,
          unlocked: data.badges.includes(badge.id)
        })));
      }
    } catch (error) {
      console.error('Failed to fetch user badges:', error);
    }
  };
  
  // Handle copy referral link
  const copyReferralLink = () => {
    if (user) {
      const link = `${window.location.origin}/waitlist?ref=${user.referral_code}`;
      navigator.clipboard.writeText(link);
      alert('Referral link copied to clipboard!');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join the JobMate Waitlist
          </h1>
          <p className="text-xl text-gray-600 mx-auto max-w-2xl">
            Be among the first to access our revolutionary marketplace connecting skilled professionals with exciting opportunities.
          </p>
        </div>
        
        {!registrationComplete ? (
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {referralCode ? 'You\'ve been invited!' : 'Sign up for early access'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              {referralCode && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    You were referred with code: <span className="font-semibold">{referralCode}</span>
                  </p>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Success Message and Referral Section */}
            <div className="md:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-8 mb-8"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    You're on the list!
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    Thanks for joining the JobMate waitlist. We'll notify you when we launch!
                  </p>
                  <div className="flex justify-center">
                    <a 
                      href="/waitlist-dashboard" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                      View Your Dashboard
                    </a>
                  </div>
                </div>
                
                {user && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-3">Share with friends</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Invite friends to join and earn points to unlock exclusive rewards
                    </p>
                    
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <code className="text-sm text-gray-800 truncate flex-1">
                        {`${window.location.origin}/waitlist?ref=${user.referral_code}`}
                      </code>
                      <Button 
                        onClick={copyReferralLink} 
                        size="sm" 
                        variant="outline"
                        className="ml-2 flex-shrink-0"
                      >
                        <Share2 className="h-4 w-4 mr-1" /> Copy
                      </Button>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                        <Trophy className="h-5 w-5 mr-2" /> Your Referral Stats
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <p className="text-sm text-gray-500">Points</p>
                          <p className="text-2xl font-bold">{user.points || 0}</p>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <p className="text-sm text-gray-500">Referrals</p>
                          <p className="text-2xl font-bold">{Math.floor((user.points - 10) / 50)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
              
              {/* Badges Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-8"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" /> Your Badges
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div 
                      key={badge.id}
                      className={`p-4 rounded-lg border ${badge.unlocked ? 'bg-white' : 'bg-gray-100'} transition-all`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`p-2 rounded-full ${badge.unlocked ? 'bg-blue-100' : 'bg-gray-200'} mr-3`}>
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{badge.name}</h4>
                          <p className="text-xs text-gray-500">{badge.description}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${badge.unlocked ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                          {badge.unlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Leaderboard Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6 h-fit"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2" /> Leaderboard
              </h3>
              
              {isLoadingLeaderboard ? (
                <div className="text-center py-8">
                  <p>Loading leaderboard...</p>
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div 
                      key={index}
                      className={`flex items-center p-3 rounded-md ${index === 0 ? 'bg-yellow-50' : index === 1 ? 'bg-gray-50' : index === 2 ? 'bg-amber-50' : 'bg-white border-b'}`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-bold ${index === 0 ? 'bg-yellow-200 text-yellow-800' : index === 1 ? 'bg-gray-200 text-gray-800' : index === 2 ? 'bg-amber-200 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                        {entry.position}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-xs text-gray-500">{entry.referral_count} referrals</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{entry.points}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No entries yet. Be the first!</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium mb-2">How to earn points</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span> Join waitlist: 10 points
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span> Each referral: 50 points
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span> Unlock badges: 25-100 points
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WaitlistPage;
