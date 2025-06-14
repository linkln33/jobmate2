"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Calendar, DollarSign, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    status: string;
    city: string;
    state?: string;
    zipCode: string;
    scheduledStartTime?: Date | string | null;
    budgetMin?: number | null;
    budgetMax?: number | null;
    createdAt: Date | string;
    urgencyLevel?: string | null;
    isRemote: boolean;
    serviceCategory: {
      id: string;
      name: string;
    };
  };
  variant?: "default" | "compact";
}

export function JobCard({ job, variant = "default" }: JobCardProps) {
  const statusVariant = getStatusVariant(job.status);
  const isCompact = variant === "compact";

  function getStatusVariant(status: string) {
    switch (status.toUpperCase()) {
      case "DRAFT": return "draft";
      case "OPEN": return "info";
      case "IN_PROGRESS": return "warning";
      case "COMPLETED": return "success";
      case "CANCELLED": return "destructive";
      default: return "default";
    }
  }

  function getUrgencyBadge(urgency?: string | null) {
    if (!urgency) return null;
    
    switch (urgency.toLowerCase()) {
      case "low":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Low Urgency</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium Urgency</Badge>;
      case "high":
        return <Badge variant="warning">High Urgency</Badge>;
      case "emergency":
        return <Badge variant="destructive">Emergency</Badge>;
      default:
        return null;
    }
  }

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isCompact ? 'border-l-4 border-l-brand-500' : ''}`}>
      <CardHeader className={`${isCompact ? 'py-3 px-4' : ''}`}>
        <div className="flex justify-between items-start">
          <CardTitle className={`${isCompact ? 'text-lg' : 'text-xl'} line-clamp-1`}>
            {job.title}
          </CardTitle>
          <Badge variant={statusVariant} className="ml-2">
            {job.status.replace(/_/g, ' ')}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary">{job.serviceCategory.name}</Badge>
          {job.urgencyLevel && getUrgencyBadge(job.urgencyLevel)}
          {job.isRemote && <Badge variant="outline">Remote</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className={`${isCompact ? 'py-2 px-4' : ''}`}>
        {!isCompact && (
          <p className="text-muted-foreground line-clamp-2 mb-4">
            {job.description}
          </p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{job.city}{job.state ? `, ${job.state}` : ''} {job.zipCode}</span>
          </div>
          
          {job.scheduledStartTime && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(job.scheduledStartTime)}</span>
            </div>
          )}
          
          {(job.budgetMin || job.budgetMax) && (
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>
                {job.budgetMin && job.budgetMax 
                  ? `${formatCurrency(Number(job.budgetMin))} - ${formatCurrency(Number(job.budgetMax))}`
                  : job.budgetMin 
                    ? `From ${formatCurrency(Number(job.budgetMin))}`
                    : `Up to ${formatCurrency(Number(job.budgetMax))}`
                }
              </span>
            </div>
          )}
          
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={`${isCompact ? 'py-3 px-4' : ''} flex justify-end`}>
        <Button variant="brand" size={isCompact ? "sm" : "default"} asChild>
          <Link href={`/jobs/${job.id}`}>
            <span className="mr-1">View Details</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
