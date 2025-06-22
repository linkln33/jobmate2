"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock, CheckCircle, MessageCircle, Star, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

export type NudgeType = 
  | 'response_needed' 
  | 'action_required' 
  | 'review_reminder' 
  | 'payment_pending'
  | 'job_completion'
  | 'new_message';

interface Nudge {
  id: string;
  type: NudgeType;
  title: string;
  message: string;
  createdAt: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
  relatedEntityId?: string;
  relatedEntityType?: 'job' | 'chat' | 'payment' | 'review';
  relatedUserName?: string;
  relatedUserImage?: string;
}

interface NudgeSystemProps {
  userId: string;
  userType: 'customer' | 'specialist';
  nudges: Nudge[];
  onDismissNudge: (nudgeId: string) => void;
  onActionClick: (nudge: Nudge) => void;
}

export function NudgeSystem({
  userId,
  userType,
  nudges,
  onDismissNudge,
  onActionClick,
}: NudgeSystemProps) {
  const [activeNudges, setActiveNudges] = useState<Nudge[]>([]);
  const [currentNudgeIndex, setCurrentNudgeIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Initialize and rotate through nudges
  useEffect(() => {
    if (nudges.length > 0) {
      setActiveNudges(nudges);
      setCurrentNudgeIndex(0);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setCurrentNudgeIndex(null);
    }
  }, [nudges]);

  // Auto-rotate nudges every 30 seconds if there are multiple
  useEffect(() => {
    if (activeNudges.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentNudgeIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % activeNudges.length;
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [activeNudges]);

  // Handle dismiss nudge
  const handleDismiss = (nudgeId: string) => {
    onDismissNudge(nudgeId);
    
    const updatedNudges = activeNudges.filter((nudge) => nudge.id !== nudgeId);
    setActiveNudges(updatedNudges);
    
    if (updatedNudges.length === 0) {
      setIsVisible(false);
      setCurrentNudgeIndex(null);
    } else {
      setCurrentNudgeIndex(0);
    }
  };

  // Get icon based on nudge type
  const getNudgeIcon = (type: NudgeType) => {
    switch (type) {
      case 'response_needed':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'action_required':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'review_reminder':
        return <Star className="h-5 w-5 text-purple-500" />;
      case 'payment_pending':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'job_completion':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'new_message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get background color based on priority
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-amber-50 border-amber-200';
      case 'low':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Get badge variant based on nudge type
  const getBadgeVariant = (type: NudgeType): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'action_required':
        return 'destructive';
      case 'response_needed':
      case 'payment_pending':
        return 'secondary';
      case 'review_reminder':
      case 'job_completion':
      case 'new_message':
      default:
        return 'outline';
    }
  };

  // Format nudge type for display
  const formatNudgeType = (type: NudgeType): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!isVisible || currentNudgeIndex === null || activeNudges.length === 0) {
    return null;
  }

  const currentNudge = activeNudges[currentNudgeIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <Card className={`shadow-lg border ${getPriorityColor(currentNudge.priority)}`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex space-x-3">
                <div className="mt-0.5">
                  {getNudgeIcon(currentNudge.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-sm">{currentNudge.title}</h4>
                    <Badge variant={getBadgeVariant(currentNudge.type)} className="text-xs">
                      {formatNudgeType(currentNudge.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{currentNudge.message}</p>
                  
                  {currentNudge.relatedUserName && (
                    <div className="flex items-center space-x-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={currentNudge.relatedUserImage} />
                        <AvatarFallback className="text-xs">
                          {getInitials(currentNudge.relatedUserName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{currentNudge.relatedUserName}</span>
                    </div>
                  )}
                  
                  {currentNudge.actionLabel && (
                    <Button 
                      size="sm" 
                      onClick={() => onActionClick(currentNudge)}
                      className="mt-1"
                    >
                      {currentNudge.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleDismiss(currentNudge.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {activeNudges.length > 1 && (
              <div className="flex justify-center mt-3 space-x-1">
                {activeNudges.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === currentNudgeIndex ? 'bg-brand-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
