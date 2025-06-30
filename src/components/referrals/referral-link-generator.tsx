'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';
import { QRCodeGenerator } from './qr-code-generator';

interface ReferralLinkGeneratorProps {
  listingId: string;
  listingType: string;
}

export function ReferralLinkGenerator({ listingId, listingType }: ReferralLinkGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [activeTab, setActiveTab] = useState('link');
  
  // Mock user ID - in a real app, this would come from authentication
  const mockUserId = 'user123';
  
  useEffect(() => {
    // Generate the referral link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jobmate.vercel.app';
    const generatedLink = `${baseUrl}/${listingType}/${listingId}?ref=${mockUserId}`;
    setReferralLink(generatedLink);
  }, [listingId, listingType]);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };
  
  return (
    <Card className="p-4 bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-2">Share this listing</h3>
      <p className="text-sm text-gray-500 mb-4">
        Share this listing with friends and earn rewards when they make a purchase.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="link">Link</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="link" className="mt-0">
          <div className="flex items-center gap-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="flex-1"
            />
            <Button 
              onClick={copyToClipboard} 
              variant="outline" 
              size="icon"
              className="shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="qr" className="mt-0">
          <QRCodeGenerator 
            url={referralLink} 
            size={180} 
            logoUrl="/logo.png"
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
