"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartMatchNavLinkProps {
  className?: string;
}

export function SmartMatchNavLink({ className }: SmartMatchNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === '/matches';
  
  return (
    <Link
      href="/matches"
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        className
      )}
    >
      <Sparkles className="mr-2 h-4 w-4" />
      <span>Smart Matches</span>
      <span className="ml-auto bg-primary-foreground text-primary text-xs rounded-full px-2 py-0.5">
        New
      </span>
    </Link>
  );
}
