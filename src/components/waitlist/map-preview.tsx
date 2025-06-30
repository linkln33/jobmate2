/**
 * @file Interactive map preview component for waitlist
 * @module components/waitlist/map-preview
 * 
 * This component displays an interactive map with sample marketplace listings.
 */

"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Layers } from 'lucide-react';
import { MarketplacePreviewCard } from '@/components/ui/marketplace-preview-card';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('@/components/waitlist/map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse flex items-center justify-center">
      <Layers className="h-10 w-10 text-gray-300" />
    </div>
  )
});

/**
 * Sample marketplace listing data
 */
const SAMPLE_LISTINGS = [
  {
    id: 'listing-1',
    title: 'Web Development Project',
    type: 'project',
    category: 'development',
    description: 'Looking for a React developer to build a responsive website',
    budget: '$2,000 - $3,500',
    location: 'Remote',
    coordinates: [40.7128, -74.006], // New York
    user: {
      name: 'Sarah Johnson',
      avatar: '/avatars/avatar-1.png',
      rating: 4.8
    }
  },
  {
    id: 'listing-2',
    title: 'Logo Design Needed',
    type: 'gig',
    category: 'design',
    description: 'Modern logo design for tech startup',
    budget: '$250 - $500',
    location: 'Remote',
    coordinates: [34.0522, -118.2437], // Los Angeles
    user: {
      name: 'Michael Chen',
      avatar: '/avatars/avatar-2.png',
      rating: 4.9
    }
  },
  {
    id: 'listing-3',
    title: 'Content Marketing Specialist',
    type: 'job',
    category: 'marketing',
    description: 'Part-time content marketing role for SaaS company',
    budget: '$35/hr',
    location: 'Remote / London',
    coordinates: [51.5074, -0.1278], // London
    user: {
      name: 'Emma Wilson',
      avatar: '/avatars/avatar-3.png',
      rating: 4.7
    }
  },
  {
    id: 'listing-4',
    title: 'Mobile App Development',
    type: 'project',
    category: 'development',
    description: 'iOS and Android app for fitness tracking',
    budget: '$5,000 - $8,000',
    location: 'Remote',
    coordinates: [37.7749, -122.4194], // San Francisco
    user: {
      name: 'David Park',
      avatar: '/avatars/avatar-4.png',
      rating: 4.9
    }
  },
  {
    id: 'listing-5',
    title: 'Social Media Management',
    type: 'gig',
    category: 'marketing',
    description: 'Monthly social media management for e-commerce brand',
    budget: '$800/month',
    location: 'Remote',
    coordinates: [41.8781, -87.6298], // Chicago
    user: {
      name: 'Jessica Miller',
      avatar: '/avatars/avatar-5.png',
      rating: 4.6
    }
  }
];

/**
 * Props for the MapPreview component
 */
interface MapPreviewProps {
  /**
   * Optional title for the map card
   * @default "Explore the Marketplace"
   */
  title?: string;
  
  /**
   * Optional height for the map container
   * @default "400px"
   */
  height?: string;
}

/**
 * Interactive map preview component showing sample marketplace listings
 * 
 * @component
 * @example
 * ```tsx
 * <MapPreview title="Discover Opportunities" height="500px" />
 * ```
 */
export function MapPreview({ 
  title = "Explore the Marketplace", 
  height = "400px" 
}: MapPreviewProps) {
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Auto-cycle through listings for preview effect
  useEffect(() => {
    if (!mapLoaded) return;
    
    const interval = setInterval(() => {
      setSelectedListing(prev => {
        const currentIndex = prev ? SAMPLE_LISTINGS.findIndex(l => l.id === prev.id) : -1;
        const nextIndex = (currentIndex + 1) % SAMPLE_LISTINGS.length;
        return SAMPLE_LISTINGS[nextIndex];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [mapLoaded]);
  
  return (
    <Card className="w-full bg-white shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div style={{ height }}>
            <MapWithNoSSR 
              listings={SAMPLE_LISTINGS} 
              selectedListing={selectedListing}
              onSelectListing={setSelectedListing}
              onMapLoaded={() => setMapLoaded(true)}
            />
          </div>
          
          {selectedListing && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <MarketplacePreviewCard
                title={selectedListing.title}
                description={selectedListing.description}
                type={selectedListing.type}
                category={selectedListing.category}
                budget={selectedListing.budget}
                location={selectedListing.location}
                userName={selectedListing.user.name}
                userAvatar={selectedListing.user.avatar}
                userRating={selectedListing.user.rating}
                className="shadow-lg"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
