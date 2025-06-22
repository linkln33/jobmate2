"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface SpecialistCardProps {
  specialist: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profileImageUrl?: string | null;
    };
    businessName?: string | null;
    averageRating: number;
    completedJobsCount: number;
    city: string;
    state?: string | null;
    zipCode: string;
    hourlyRate?: number | null;
    services: Array<{
      id: string;
      serviceCategory: {
        id: string;
        name: string;
      };
      isPrimary: boolean;
    }>;
    yearsOfExperience?: number | null;
    availabilityStatus?: string;
    distance?: number;
  };
  variant?: "default" | "compact";
}

export function SpecialistCard({ specialist, variant = "default" }: SpecialistCardProps) {
  const isCompact = variant === "compact";
  const fullName = `${specialist.user.firstName} ${specialist.user.lastName}`;
  const displayName = specialist.businessName || fullName;
  
  // Get primary service or first service
  const primaryService = specialist.services.find(service => service.isPrimary) || specialist.services[0];
  
  // Format rating display
  const ratingStars = [];
  const rating = specialist.averageRating;
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      ratingStars.push(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
    } else if (i - 0.5 <= rating) {
      ratingStars.push(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
    } else {
      ratingStars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className={`${isCompact ? 'py-3 px-4' : 'pb-2'}`}>
        <div className="flex items-center space-x-4">
          <Avatar className={isCompact ? "h-10 w-10" : "h-12 w-12"}>
            <AvatarImage src={specialist.user.profileImageUrl || ""} alt={fullName} />
            <AvatarFallback className="bg-brand-100 text-brand-800">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <h3 className={`font-semibold ${isCompact ? 'text-base' : 'text-lg'}`}>
              {displayName}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {ratingStars}
              </div>
              <span className="text-sm text-muted-foreground">
                ({specialist.averageRating.toFixed(1)})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`${isCompact ? 'py-2 px-4' : 'pt-2'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>
              {specialist.city}
              {specialist.state ? `, ${specialist.state}` : ''} 
              {specialist.distance !== undefined && 
                ` (${specialist.distance.toFixed(1)} km)`
              }
            </span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Briefcase className="h-4 w-4 mr-2" />
            <span>{specialist.completedJobsCount} jobs completed</span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {specialist.services.slice(0, isCompact ? 2 : 4).map(service => (
            <Badge 
              key={service.id} 
              variant={service.isPrimary ? "default" : "secondary"}
            >
              {service.serviceCategory.name}
            </Badge>
          ))}
          {specialist.services.length > (isCompact ? 2 : 4) && (
            <Badge variant="outline">+{specialist.services.length - (isCompact ? 2 : 4)} more</Badge>
          )}
        </div>
        
        {specialist.availabilityStatus && (
          <div className="mt-3">
            <Badge 
              variant={specialist.availabilityStatus === "online" ? "success" : "outline"}
              className={specialist.availabilityStatus === "online" ? "" : "bg-gray-100"}
            >
              {specialist.availabilityStatus === "online" ? "Available Now" : "Currently Offline"}
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter className={`${isCompact ? 'py-3 px-4' : ''} flex justify-between items-center`}>
        {specialist.hourlyRate && (
          <div className="text-brand-600 font-semibold">
            ${specialist.hourlyRate}/hr
          </div>
        )}
        
        <Button variant="brand" size={isCompact ? "sm" : "default"} asChild>
          <Link href={`/specialists/${specialist.user.id}`}>
            <span className="mr-1">View Profile</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
