"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Info, Star, MapPin, Clock, DollarSign, Award, Shield, Zap } from 'lucide-react';

interface MatchExplainerModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MatchExplainerModal({ trigger, open, onOpenChange }: MatchExplainerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Info className="h-4 w-4 mr-2" />
            How Matching Works
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            How Smart Job Matching Works
          </DialogTitle>
          <DialogDescription>
            Understanding how we match you with the perfect jobs
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium">Our Smart Matching Algorithm</h3>
            <p className="text-sm text-muted-foreground mt-2">
              JobMate's smart matching system uses multiple factors to connect you with the most suitable jobs. 
              Each job receives a match score from 0-100% based on how well it aligns with your profile and preferences.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-md font-medium">Key Matching Factors</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  <h5 className="font-medium">Skills Match (30%)</h5>
                </div>
                <p className="text-sm text-muted-foreground">
                  How closely your skills align with the job requirements. Add relevant skills to your profile to improve this score.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  <h5 className="font-medium">Location Proximity (20%)</h5>
                </div>
                <p className="text-sm text-muted-foreground">
                  How close you are to the job location. Jobs within your preferred service area receive higher scores.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-500" />
                  <h5 className="font-medium">Reputation Score (15%)</h5>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your ratings and completed jobs. Higher ratings and more completed jobs improve this score.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  <h5 className="font-medium">Price Match (15%)</h5>
                </div>
                <p className="text-sm text-muted-foreground">
                  How well your rates align with the job's budget. Setting competitive rates improves your matches.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  <h5 className="font-medium">Availability Match (10%)</h5>
                </div>
                <p className="text-sm text-muted-foreground">
                  Whether your schedule aligns with the job's timing. Keep your availability calendar updated.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-red-500" />
                  <h5 className="font-medium">Urgency Compatibility (10%)</h5>
                </div>
                <p className="text-sm text-muted-foreground">
                  For urgent jobs, specialists with faster response times receive higher scores.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-md font-medium">Tips to Improve Your Matches</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Keep your skills list updated with relevant and specific skills</li>
              <li>Set a competitive rate based on your experience and the local market</li>
              <li>Maintain a high rating by providing quality service</li>
              <li>Respond quickly to job inquiries, especially for urgent jobs</li>
              <li>Complete your verification steps to appear in more searches</li>
              <li>Update your availability calendar regularly</li>
            </ul>
          </div>
          
          <div className="bg-muted p-4 rounded-lg flex items-start">
            <Shield className="h-5 w-5 mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-sm">Privacy & Fairness</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Our matching algorithm is designed to be fair and transparent. Your personal data is only used to improve your job matches and is never shared with third parties without your consent.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
