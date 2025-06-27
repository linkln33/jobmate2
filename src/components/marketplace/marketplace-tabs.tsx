"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type MarketplaceTabType = 'all' | 'items' | 'services' | 'rentals' | 'jobs';

interface MarketplaceTabsProps {
  activeTab: MarketplaceTabType;
  onTabChange: (tab: MarketplaceTabType) => void;
  className?: string;
  children?: React.ReactNode;
}

export function MarketplaceTabs({
  activeTab,
  onTabChange,
  className,
  children
}: MarketplaceTabsProps) {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value) => onTabChange(value as MarketplaceTabType)}
      className={cn("w-full", className)}
    >
      <div className="border-b mb-6">
        <TabsList className="bg-transparent">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="items" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            Items
          </TabsTrigger>
          <TabsTrigger 
            value="services" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            Services
          </TabsTrigger>
          <TabsTrigger 
            value="rentals" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            Rentals
          </TabsTrigger>
          <TabsTrigger 
            value="jobs" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            Jobs
          </TabsTrigger>
        </TabsList>
      </div>
      
      {children}
    </Tabs>
  );
}
