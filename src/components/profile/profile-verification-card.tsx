"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Shield, Mail, Phone, CreditCard, FileCheck } from 'lucide-react';

interface ProfileVerificationCardProps {
  profile: any;
  className?: string;
}

export function ProfileVerificationCard({ profile, className }: ProfileVerificationCardProps) {
  // Define verification items with null checks
  const verificationItems = [
    { 
      name: 'Email', 
      verified: !!profile?.emailVerified, 
      icon: <Mail className="h-4 w-4" />,
      action: 'Verify Email'
    },
    { 
      name: 'Phone', 
      verified: !!profile?.phoneVerified, 
      icon: <Phone className="h-4 w-4" />,
      action: 'Verify Phone'
    },
    { 
      name: 'ID Verification', 
      verified: !!profile?.idVerified, 
      icon: <FileCheck className="h-4 w-4" />,
      action: 'Verify ID'
    },
    { 
      name: 'Payment Method', 
      verified: !!profile?.paymentVerified, 
      icon: <CreditCard className="h-4 w-4" />,
      action: 'Add Payment'
    }
  ];
  
  // Calculate verification score
  const verificationScore = verificationItems.filter(item => item.verified).length;
  const totalItems = verificationItems.length;
  const verificationPercentage = Math.round((verificationScore / totalItems) * 100);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Trust Score</div>
            <div className="text-2xl font-bold">{verificationPercentage}%</div>
          </div>
          <Badge variant={verificationScore > 2 ? "success" : "secondary"} className="px-2 py-1">
            {verificationScore > 2 ? 'Verified' : 'Incomplete'}
          </Badge>
        </div>
        
        <ul className="space-y-3">
          {verificationItems.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="mr-2">{item.icon}</span>
                <span>{item.name}</span>
              </div>
              {item.verified ? (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                </Badge>
              ) : (
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  {item.action}
                </Button>
              )}
            </li>
          ))}
        </ul>
        
        <div className="text-xs text-muted-foreground">
          Increase your trust score by verifying your account details. Higher verification leads to more job opportunities.
        </div>
      </CardContent>
    </Card>
  );
}
