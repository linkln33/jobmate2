"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface MarketplaceHeaderProps {
  onCreateListing?: () => void;
  className?: string;
}

export function MarketplaceHeader({
  onCreateListing,
  className = ''
}: MarketplaceHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold mb-2">Marketplace</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Discover items, services, rentals, and job opportunities from our community
        </p>
      </div>
      
      <Button 
        onClick={onCreateListing} 
        className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Listing
      </Button>
    </div>
  );
}
