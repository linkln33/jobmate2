"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high"; // Controls the glass effect intensity
  variant?: "default" | "elevated" | "bordered" | "flat";
  colorTint?: "none" | "blue" | "purple" | "green" | "amber";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = "medium", variant = "default", colorTint = "none", ...props }, ref) => {
    // Define blur intensity based on the prop
    const blurIntensity = {
      low: "backdrop-blur-sm",
      medium: "backdrop-blur-md",
      high: "backdrop-blur-lg",
    };
    
    // Define background opacity based on the variant
    const backgroundOpacity = {
      default: "bg-white/20 dark:bg-gray-900/30",
      elevated: "bg-white/25 dark:bg-gray-900/40",
      bordered: "bg-white/15 dark:bg-gray-900/25",
      flat: "bg-white/10 dark:bg-gray-900/20",
    };
    
    // Define border styles based on the variant
    const borderStyle = {
      default: "border-white/20 dark:border-gray-800/30",
      elevated: "border-white/30 dark:border-gray-800/40",
      bordered: "border-white/40 dark:border-gray-800/50",
      flat: "border-transparent",
    };
    
    // Define shadow based on the variant
    const shadowStyle = {
      default: "shadow-sm",
      elevated: "shadow-md",
      bordered: "shadow-sm",
      flat: "shadow-none",
    };
    
    // Define color tint
    const colorTintStyle = {
      none: "",
      blue: "bg-blue-500/10",
      purple: "bg-purple-500/10",
      green: "bg-green-500/10",
      amber: "bg-amber-500/10",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border",
          backgroundOpacity[variant],
          borderStyle[variant],
          shadowStyle[variant],
          blurIntensity[intensity],
          colorTintStyle[colorTint],
          "transition-all duration-300 ease-in-out",
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
GlassCardHeader.displayName = "GlassCardHeader";

const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100",
      className
    )}
    {...props}
  />
));
GlassCardTitle.displayName = "GlassCardTitle";

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-300", className)}
    {...props}
  />
));
GlassCardDescription.displayName = "GlassCardDescription";

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
GlassCardContent.displayName = "GlassCardContent";

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
GlassCardFooter.displayName = "GlassCardFooter";

export { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardFooter, 
  GlassCardTitle, 
  GlassCardDescription, 
  GlassCardContent 
};
