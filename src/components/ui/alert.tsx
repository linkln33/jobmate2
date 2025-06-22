"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500/50 text-green-700 dark:border-green-500 dark:text-green-400 [&>svg]:text-green-500",
        warning:
          "border-amber-500/50 text-amber-700 dark:border-amber-500 dark:text-amber-400 [&>svg]:text-amber-500",
        info:
          "border-brand-500/50 text-brand-700 dark:border-brand-500 dark:text-brand-400 [&>svg]:text-brand-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & {
    icon?: React.ReactNode;
  }
>(({ className, variant, icon, children, ...props }, ref) => {
  let IconComponent = null;
  
  if (!icon) {
    switch (variant) {
      case "destructive":
        IconComponent = <XCircle className="h-4 w-4" />;
        break;
      case "success":
        IconComponent = <CheckCircle2 className="h-4 w-4" />;
        break;
      case "warning":
        IconComponent = <AlertCircle className="h-4 w-4" />;
        break;
      case "info":
        IconComponent = <Info className="h-4 w-4" />;
        break;
      default:
        break;
    }
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon || IconComponent}
      {children}
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
