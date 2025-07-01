/**
 * @file Waitlist landing page with referral system
 * @module app/waitlist/page
 * 
 * This page provides the waitlist referral system with badges and leaderboard.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Share2, Check, Trophy, Award, Users, Star, Lock, ArrowRight } from 'lucide-react';

type WaitlistUser = {
  id: string;
  email: string;
  name: string;
  referral_code: string;
  points: number;
  badges?: string[];
};

/**
 * Enhanced Waitlist page component wrapper
 */
export default function WaitlistPageWrapper() {
  const searchParams = useSearchParams();
  const referralCode = searchParams?.get('ref');
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Registration state
  const [user, setUser] = useState<WaitlistUser | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  // Check for existing registration on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('waitlist_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRegistrationComplete(true);
        // Redirect to dashboard if already registered
        window.location.href = '/waitlist-dashboard';
      } catch (e) {
        console.error('Failed to parse saved user data:', e);
      }
    }
  }, []);
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Animated header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 mb-4">
            Join the JobMate Waitlist
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mx-auto max-w-3xl">
            Be among the <span className="font-bold text-blue-600 dark:text-blue-400">exclusive first members</span> to access our revolutionary AI-powered marketplace connecting skilled professionals with premium opportunities.
          </p>
        </motion.div>

        {/* Animated form card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-10 animate-pulse">
            <span className="text-2xl">👑</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-bounce">
            <span className="text-xl">✨</span>
          </div>
          
          {/* Main card */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl shadow-2xl p-1.5">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
                  <span className="text-3xl mr-3">🔒</span>
                  {referralCode ? 'You\'ve Been Invited!' : 'Secure Your Lifetime Access'}
                </h2>
                <p className="mt-3 text-center text-gray-600 dark:text-gray-300 font-medium">
                  Join our exclusive waitlist today and be among the first to experience JobMate
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                {referralCode && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      You were referred with code: <span className="font-semibold ml-1">{referralCode}</span>
                    </p>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Securing Access...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Secure Free Lifetime Access
                      <ArrowRight className="h-5 w-5 animate-pulse" />
                    </>
                  )}
                </button>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium">
                    <Trophy className="h-4 w-4 mr-1.5" />
                    <span className="font-semibold">Limited spots available</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Join now before it's too late • <span className="text-emerald-600 dark:text-emerald-400">Early adopters get exclusive rewards</span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
