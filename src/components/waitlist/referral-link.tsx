/**
 * @file Waitlist referral link component
 * @module components/waitlist/referral-link
 * 
 * This component displays a user's referral link with copy functionality.
 */

"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Copy, Share2 } from 'lucide-react';

/**
 * Props for the ReferralLink component
 */
interface ReferralLinkProps {
  /**
   * The user's referral code
   */
  referralCode: string;
  
  /**
   * Optional base URL for the referral link
   * @default window.location.origin + '/waitlist'
   */
  baseUrl?: string;
}

/**
 * Referral link component with copy functionality
 * 
 * @component
 * @example
 * ```tsx
 * <ReferralLink referralCode="user123" />
 * ```
 */
export function ReferralLink({ referralCode, baseUrl }: ReferralLinkProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate the full referral URL
  const fullUrl = typeof window !== 'undefined'
    ? `${baseUrl || window.location.origin + '/waitlist'}?ref=${referralCode}`
    : `https://jobmate.io/waitlist?ref=${referralCode}`;
  
  /**
   * Copy the referral link to clipboard
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  /**
   * Share the referral link using Web Share API if available
   */
  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on JobMate',
          text: 'I just joined the JobMate waitlist! Use my referral link to join and we both get rewards:',
          url: fullUrl
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy if Web Share API is not available
      copyToClipboard();
    }
  };
  
  return (
    <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Your Referral Link</h3>
        <p className="text-sm text-gray-600 mb-4">
          Share this link to invite friends and earn rewards!
        </p>
        
        <div className="flex space-x-2">
          <Input
            value={fullUrl}
            readOnly
            className="bg-white font-mono text-sm"
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="flex-shrink-0"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          
          {navigator.share && (
            <Button
              variant="outline"
              size="icon"
              onClick={shareLink}
              className="flex-shrink-0"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Your unique code: <span className="font-semibold">{referralCode}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
