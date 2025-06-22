"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  starClassName?: string;
}

export function Rating({
  value,
  max = 5,
  onChange,
  readOnly = false,
  size = "md",
  className,
  starClassName,
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
  };

  const handleClick = (index: number) => {
    if (readOnly) return;
    onChange?.(index);
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "lg":
        return "h-8 w-8";
      case "md":
      default:
        return "h-6 w-6";
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isActive = (hoverValue !== null ? hoverValue : value) >= starValue;
        
        return (
          <Star
            key={index}
            className={cn(
              getSizeClass(),
              "cursor-pointer transition-all",
              isActive ? "fill-amber-400 text-amber-400" : "fill-none text-gray-300",
              !readOnly && "hover:text-amber-400",
              starClassName
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            role={readOnly ? "presentation" : "button"}
            tabIndex={readOnly ? -1 : 0}
            aria-label={`Rate ${starValue} out of ${max}`}
          />
        );
      })}
    </div>
  );
}
