"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Award, 
  Star, 
  MapPin, 
  Clock, 
  Zap, 
  Shield, 
  Crown, 
  Sparkles,
  ThumbsUp
} from 'lucide-react';

export type BadgeType = 
  | 'skill-expert' 
  | 'location-perfect' 
  | 'top-rated' 
  | 'quick-responder' 
  | 'urgent-match' 
  | 'verified' 
  | 'premium' 
  | 'perfect-match'
  | 'client-favorite';

interface MatchBadgeProps {
  type: BadgeType;
  className?: string;
}

export function MatchBadge({ type, className }: MatchBadgeProps) {
  // Badge configuration
  const badgeConfig: Record<BadgeType, {
    label: string;
    icon: React.ReactNode;
    variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'premium' | 'success' | 'warning';
  }> = {
    'skill-expert': {
      label: 'Skill Expert',
      icon: <Star className="h-3 w-3 mr-1" />,
      variant: 'default'
    },
    'location-perfect': {
      label: 'Perfect Location',
      icon: <MapPin className="h-3 w-3 mr-1" />,
      variant: 'secondary'
    },
    'top-rated': {
      label: 'Top Rated',
      icon: <Award className="h-3 w-3 mr-1" />,
      variant: 'success'
    },
    'quick-responder': {
      label: 'Quick Responder',
      icon: <Clock className="h-3 w-3 mr-1" />,
      variant: 'warning'
    },
    'urgent-match': {
      label: 'Urgent Match',
      icon: <Zap className="h-3 w-3 mr-1" />,
      variant: 'destructive'
    },
    'verified': {
      label: 'Verified',
      icon: <Shield className="h-3 w-3 mr-1" />,
      variant: 'outline'
    },
    'premium': {
      label: 'Premium',
      icon: <Crown className="h-3 w-3 mr-1" />,
      variant: 'premium'
    },
    'perfect-match': {
      label: 'Perfect Match',
      icon: <Sparkles className="h-3 w-3 mr-1" />,
      variant: 'premium'
    },
    'client-favorite': {
      label: 'Client Favorite',
      icon: <ThumbsUp className="h-3 w-3 mr-1" />,
      variant: 'success'
    }
  };

  const config = badgeConfig[type];
  
  // Custom styles based on variant
  const variantStyles: Record<string, string> = {
    'premium': 'bg-gradient-to-r from-amber-500 to-yellow-300 text-black border-0',
    'success': 'bg-green-600 hover:bg-green-700 text-white border-0',
    'warning': 'bg-amber-500 hover:bg-amber-600 text-black border-0',
  };
  
  // Custom variant handling for premium badge
  const badgeVariant = config.variant === 'premium' ? 'default' : config.variant;
  
  return (
    <Badge 
      variant={badgeVariant as "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "pending" | "completed" | "cancelled" | "draft"}
      className={cn(
        "flex items-center text-xs font-medium py-0.5 px-2",
        variantStyles[config.variant],
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
}

// Helper function to determine which badges to show based on match result
export function getMatchBadges(matchScore: number, factors: {
  skillMatch: number;
  locationProximity: number;
  reputationScore: number;
  responseTime?: number;
  urgencyLevel?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  clientRating?: number;
}): BadgeType[] {
  const badges: BadgeType[] = [];
  
  // Perfect match badge (95%+ overall score)
  if (matchScore >= 95) {
    badges.push('perfect-match');
  }
  
  // Skill expert badge (90%+ skill match)
  if (factors.skillMatch >= 0.9) {
    badges.push('skill-expert');
  }
  
  // Location perfect badge (95%+ location proximity)
  if (factors.locationProximity >= 0.95) {
    badges.push('location-perfect');
  }
  
  // Top rated badge (90%+ reputation score)
  if (factors.reputationScore >= 0.9) {
    badges.push('top-rated');
  }
  
  // Quick responder badge (response time < 15 minutes)
  if (factors.responseTime !== undefined && factors.responseTime < 15) {
    badges.push('quick-responder');
  }
  
  // Urgent match badge
  if (factors.urgencyLevel === 'high' || factors.urgencyLevel === 'urgent') {
    badges.push('urgent-match');
  }
  
  // Verified badge
  if (factors.isVerified) {
    badges.push('verified');
  }
  
  // Premium badge
  if (factors.isPremium) {
    badges.push('premium');
  }
  
  // Client favorite badge (client rating 4.8+)
  if (factors.clientRating !== undefined && factors.clientRating >= 4.8) {
    badges.push('client-favorite');
  }
  
  return badges;
}
