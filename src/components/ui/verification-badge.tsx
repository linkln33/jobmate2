"use client";

import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface VerificationBadgeProps {
  verified: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  showTooltip?: boolean;
}

export function VerificationBadge({
  verified,
  size = "md",
  className,
  showTooltip = true
}: VerificationBadgeProps) {
  if (!verified) return null;
  
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  const badge = (
    <CheckCircle 
      className={cn(
        "text-blue-500 fill-white", 
        sizeClasses[size],
        className
      )} 
    />
  );
  
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{badge}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Verified Account</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return badge;
}
