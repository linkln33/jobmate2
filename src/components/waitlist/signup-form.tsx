/**
 * @file Waitlist signup form component
 * @module components/waitlist/signup-form
 * 
 * This component renders a form for users to join the waitlist.
 */

"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MARKETPLACE_CATEGORIES } from '@/data/marketplace-categories';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

/**
 * Props for the SignupForm component
 */
interface SignupFormProps {
  /**
   * Optional referral code from URL
   */
  referralCode?: string;
  
  /**
   * Callback function when signup is successful
   * @param userData The registered user data
   */
  onSuccess?: (userData: any) => void;
}

/**
 * Waitlist signup form component
 * 
 * @component
 * @example
 * ```tsx
 * <SignupForm referralCode="user123" onSuccess={(user) => console.log(user)} />
 * ```
 */
export function SignupForm({ referralCode, onSuccess }: SignupFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    interestType: ''
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          location: formData.location || undefined,
          interests: formData.interestType ? [formData.interestType] : undefined,
          referredBy: referralCode
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Update form data when inputs change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-xl border border-gray-100">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location (Optional)
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="interestType" className="text-sm font-medium">
              I'm interested in (Optional)
            </label>
            <Select
              value={formData.interestType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, interestType: value }))}
            >
              <SelectTrigger id="interestType">
                <SelectValue placeholder="Select your interest" />
              </SelectTrigger>
              <SelectContent>
                {MARKETPLACE_CATEGORIES.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.emoji} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              'Join Waitlist'
            )}
          </Button>
          
          {referralCode && (
            <p className="text-xs text-center text-gray-500 mt-2">
              Referred by: {referralCode}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
