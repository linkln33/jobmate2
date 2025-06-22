/**
 * Type declarations for tooltip component
 */

declare module '@/components/ui/tooltip' {
  import * as React from 'react';

  export interface TooltipProps {
    children?: React.ReactNode;
    content?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    delayDuration?: number;
    skipDelayDuration?: number;
    disableHoverableContent?: boolean;
    [key: string]: any;
  }

  export const Tooltip: React.FC<TooltipProps>;
  
  export interface TooltipProviderProps {
    children?: React.ReactNode;
    delayDuration?: number;
    skipDelayDuration?: number;
    disableHoverableContent?: boolean;
    [key: string]: any;
  }
  
  export const TooltipProvider: React.FC<TooltipProviderProps>;
  
  export interface TooltipTriggerProps {
    children?: React.ReactNode;
    asChild?: boolean;
    [key: string]: any;
  }
  
  export const TooltipTrigger: React.FC<TooltipTriggerProps>;
  
  export interface TooltipContentProps {
    children?: React.ReactNode;
    className?: string;
    sideOffset?: number;
    alignOffset?: number;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    [key: string]: any;
  }
  
  export const TooltipContent: React.FC<TooltipContentProps>;
}
