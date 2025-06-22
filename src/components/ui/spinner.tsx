"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary" | "brand" | "light";
}

export function Spinner({ className, size = "md", variant = "default" }: SpinnerProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const variantClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    brand: "text-brand-500",
    light: "text-white",
  };

  return (
    <div
      className={cn(
        "animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="w-full h-full"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
