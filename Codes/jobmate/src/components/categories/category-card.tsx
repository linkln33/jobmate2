"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description?: string | null;
    iconUrl?: string | null;
    jobCount?: number;
  };
  variant?: "default" | "compact" | "featured";
}

export function CategoryCard({ category, variant = "default" }: CategoryCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";
  
  // Default icon if none provided
  const iconUrl = category.iconUrl || `/icons/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}.svg`;
  
  // Fallback icon for categories without specific icons
  const fallbackIcon = "/icons/categories/default.svg";

  return (
    <Card 
      className={`
        overflow-hidden transition-all hover:shadow-md group
        ${isFeatured ? 'border-brand-200 bg-gradient-to-br from-brand-50 to-white' : ''}
      `}
    >
      <CardContent className={`
        ${isCompact ? 'p-4' : 'p-6'} 
        ${isFeatured ? 'pt-8' : ''}
      `}>
        <div className="flex items-center space-x-4">
          <div className={`
            relative flex-shrink-0 rounded-full bg-brand-100 p-2
            ${isCompact ? 'h-12 w-12' : 'h-16 w-16'}
            ${isFeatured ? 'bg-brand-100 ring-4 ring-brand-50' : ''}
          `}>
            <Image
              src={iconUrl}
              alt={category.name}
              width={isFeatured ? 48 : isCompact ? 32 : 40}
              height={isFeatured ? 48 : isCompact ? 32 : 40}
              className="h-full w-full object-contain"
              onError={(e) => {
                // Fallback to default icon if the specific one fails to load
                (e.target as HTMLImageElement).src = fallbackIcon;
              }}
            />
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold ${isCompact ? 'text-lg' : 'text-xl'}`}>
              {category.name}
            </h3>
            
            {category.jobCount !== undefined && (
              <p className="text-sm text-muted-foreground mt-1">
                {category.jobCount} {category.jobCount === 1 ? 'job' : 'jobs'} available
              </p>
            )}
            
            {!isCompact && category.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={`${isCompact ? 'px-4 pb-4 pt-0' : 'px-6 pb-6 pt-0'}`}>
        <Button 
          variant={isFeatured ? "brand" : "outline"} 
          size={isCompact ? "sm" : "default"} 
          className="w-full group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-colors"
          asChild
        >
          <Link href={`/categories/${category.id}`}>
            <span className="mr-1">Browse {category.name}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
