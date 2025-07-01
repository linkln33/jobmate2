"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Sparkles, ArrowRight, Trophy, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

type WaitlistPopupProps = {
  onClose: () => void;
};

export function WaitlistPopup({ onClose }: WaitlistPopupProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [errorType, setErrorType] = useState<'validation' | 'duplicate' | 'server' | null>(null);

  // Get referral code from URL if present
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Get referral code from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferralCode(ref);
    }

    // Add no-scroll class to body when popup is shown
    document.body.classList.add('overflow-hidden');

    // Remove no-scroll class when component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');
      setErrorType(null);

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
        // Handle specific error types
        if (response.status === 409) {
          setErrorType('duplicate');
          throw new Error('This email is already registered. Please use a different email.');
        } else if (response.status === 400) {
          setErrorType('validation');
          throw new Error(data.error || 'Please check your information and try again.');
        } else {
          setErrorType('server');
          throw new Error(data.error || 'Failed to join waitlist. Please try again later.');
        }
      }
      
      // Store user data in localStorage to indicate registration is complete
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        referralCode: data.user.referralCode || data.user.referral_code,
        registrationComplete: true
      };
      
      localStorage.setItem('waitlistUser', JSON.stringify(userData));
      
      // Set success state and user data
      setSuccess(true);
      setUser(userData);
      
      // Don't redirect immediately, show success state with dashboard link instead
    } catch (err: any) {
      setError(err.message);
      console.error('Waitlist registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div 
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      ></div>
      
      <motion.div 
        className="relative bg-white/20 backdrop-filter backdrop-blur-xl 
                  shadow-2xl rounded-2xl 
                  w-full max-w-xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Gradient border that matches rounded corners */}
        <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-blue-50/90 rounded-2xl"></div>
        </div>
      
        {/* Glassmorphism decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-400 rounded-full blur-3xl opacity-10"></div>
        
        {/* VIP ribbon in corner */}
        <div className="absolute top-5 -right-11 w-40 h-10 bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg z-10 rotate-45 flex items-center justify-center">
          <span className="text-white font-bold text-sm">VIP ACCESS</span>
        </div>
        
        <div className="absolute top-4 left-4 z-20">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-white/30 flex items-center justify-center"
            aria-label="Close popup"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 relative z-10">
          {success ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center mb-3 bg-green-100/30 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                You're on the list!
              </h2>
              <p className="text-gray-700 mt-2 mb-6">
                Thank you for joining our waitlist. We'll notify you when we launch!
              </p>
              
              {user?.referralCode && (
                <div className="mb-6">
                  <p className="mb-2 text-gray-700">Share your referral link to earn points:</p>
                  <div className="flex">
                    <input
                      type="text"
                      value={`${window.location.origin}/waitlist?ref=${user.referralCode}`}
                      readOnly
                      className="flex-1 p-2 border rounded-l text-sm bg-gray-50"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/waitlist?ref=${user.referralCode}`
                        );
                        alert('Referral link copied!');
                      }}
                      className="bg-blue-500 text-white px-3 py-2 rounded-r"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <a 
                  href="/waitlist-dashboard" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  View Your Dashboard
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="flex flex-col items-center justify-center mb-3">
                  <div className="text-5xl mb-2">👑</div>
                </div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 mb-2">
                  Secure Free Lifetime Access
                </h2>
                <p className="text-gray-700 mt-2">
                  Join our exclusive waitlist today and get <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">priority access</span>, premium perks, and up to <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">70% off</span> when we launch!
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="popup-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="popup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/70 border border-white/30 rounded-lg 
                              focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="popup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="popup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/70 border border-white/30 rounded-lg 
                              focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
            
                {referralCode && (
                  <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-100/50">
                    <p className="text-sm text-blue-800">
                      You were referred with code: <span className="font-semibold">{referralCode}</span>
                    </p>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50/70 p-3 rounded-lg border border-red-100/50">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600
                            text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Securing Access...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🔒</span>
                      <span>Secure Free Lifetime Access</span>
                      <ArrowRight className="h-5 w-5 animate-pulse" />
                    </>
                  )}
                </button>
                
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium">
                    <Trophy className="h-4 w-4 mr-1.5" />
                    <span className="font-semibold">ONLY 1000 spots available</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 pt-3">
                    <div className="flex -space-x-2">
                      {/* User avatars */}
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-7 h-7 rounded-full border-2 border-white" />
                      <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="User" className="w-7 h-7 rounded-full border-2 border-white" />
                      <img src="https://randomuser.me/api/portraits/women/63.jpg" alt="User" className="w-7 h-7 rounded-full border-2 border-white" />
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">247 people</span> joined already!
                    </p>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-emerald-600 dark:text-emerald-400">Early adopters get exclusive rewards</span> • Join now before it's too late
                  </p>
                </div>
                
                <p className="text-xs text-center text-gray-600 mt-4">
                  By joining, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
