"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Upload, 
  Camera, 
  Phone, 
  Mail, 
  FileText, 
  MapPin,
  CreditCard,
  AlertCircle,
  Video
} from 'lucide-react';
import { BasicVerification } from './basic-verification';
import { AdvancedVerification } from './advanced-verification';

export function VerificationTabs() {
  const [activeTab, setActiveTab] = useState('basic');
  const { toast } = useToast();
  
  // Mock user verification status
  const [verificationStatus, setVerificationStatus] = useState({
    basic: {
      email: true,
      phone: false,
      termsAccepted: true,
      profileComplete: false,
      progress: 50
    },
    advanced: {
      idVerified: false,
      selfieMatch: false,
      licensesUploaded: false,
      videoIntro: false,
      serviceArea: false,
      paymentSetup: false,
      progress: 0
    }
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="relative">
            Basic Verification
            <Badge variant={verificationStatus.basic.progress === 100 ? "success" : "outline"} className="ml-2">
              {verificationStatus.basic.progress}%
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="relative">
            Advanced Verification
            <Badge variant={verificationStatus.advanced.progress === 100 ? "success" : "outline"} className="ml-2">
              {verificationStatus.advanced.progress}%
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" /> Basic Verification
              </CardTitle>
              <CardDescription>
                Complete these steps to browse jobs, post jobs, and interact as a customer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BasicVerification 
                verificationStatus={verificationStatus.basic} 
                setVerificationStatus={(status) => {
                  setVerificationStatus(prev => ({
                    ...prev,
                    basic: {
                      ...status,
                      progress: calculateProgress(status)
                    }
                  }));
                }}
              />
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Verification Progress</span>
                  <span className="text-sm font-medium">{verificationStatus.basic.progress}%</span>
                </div>
                <Progress value={verificationStatus.basic.progress} className="h-2" />
                <div className="flex flex-col space-y-2">
                  <h4 className="text-sm font-medium">Unlocks:</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Posting jobs (with limits or deposits)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Chatting with specialists
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Booking services (once payment info is added)
                    </li>
                  </ul>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" /> Advanced Verification
              </CardTitle>
              <CardDescription>
                Complete these steps to apply for jobs, get paid, and build your reputation as a specialist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedVerification 
                verificationStatus={verificationStatus.advanced}
                setVerificationStatus={(status) => {
                  setVerificationStatus(prev => ({
                    ...prev,
                    advanced: {
                      ...status,
                      progress: calculateProgress(status)
                    }
                  }));
                }}
              />
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Verification Progress</span>
                  <span className="text-sm font-medium">{verificationStatus.advanced.progress}%</span>
                </div>
                <Progress value={verificationStatus.advanced.progress} className="h-2" />
                <div className="flex flex-col space-y-2">
                  <h4 className="text-sm font-medium">Unlocks:</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Appearing on the map for live jobs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Applying to open jobs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Accepting bookings
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Building public profile with ratings/reviews
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Being shown in search + public marketplace
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Getting paid through the platform
                    </li>
                  </ul>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to calculate progress percentage
function calculateProgress(status: Record<string, boolean | number>): number {
  const totalFields = Object.keys(status).filter(key => key !== 'progress').length;
  const completedFields = Object.entries(status)
    .filter(([key, value]) => key !== 'progress' && value === true)
    .length;
  
  return Math.round((completedFields / totalFields) * 100);
}
