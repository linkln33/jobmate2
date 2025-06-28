"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompatibilityBadge } from '@/components/ui/compatibility-badge';
import { ListingWithCompatibility, compatibilityInsightService, CompatibilityInsight } from '@/services/compatibility-insight-service';
import { UserPreferences } from '@/types/compatibility';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Sparkles, Briefcase, ShoppingBag, Wrench } from 'lucide-react';
import Link from 'next/link';
import { TopMatchesWidget } from './top-matches-widget';

interface CompatibilityRecommendationsProps {
  userId: string;
  className?: string;
}

export function CompatibilityRecommendations({
  userId,
  className = ''
}: CompatibilityRecommendationsProps) {
  const [insights, setInsights] = useState<CompatibilityInsight[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('top-matches');

  // Mock function to fetch user preferences and listings - replace with actual API calls
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, fetch these from your API
      const mockUserPreferences = {
        userId,
        location: { lat: 40.7128, lng: -74.0060 },
        generalPreferences: {
          maxDistance: 10,
          priceRange: { min: 0, max: 1000 },
          availability: ['weekdays', 'weekends'],
          priceImportance: 0.7,
          locationImportance: 0.8,
          qualityImportance: 0.9
        },
        categoryPreferences: {
          jobs: { 
            preferredTypes: ['full-time', 'remote'],
            skills: ['programming', 'design', 'marketing'],
            desiredSkills: ['javascript', 'react', 'typescript'],
            minSalary: 50000,
            maxSalary: 120000,
            workArrangement: ['remote'],
            experienceLevel: 'mid-level'
          },
          services: {
            preferredCategories: ['web-development', 'design'],
            maxPrice: 1000,
            serviceTypes: ['consulting', 'development'],
            preferredDistance: 25,
            minProviderRating: 4.5
          },
          marketplace: {
            preferredCategories: ['electronics', 'books'],
            maxPrice: 500
          }
        }
      };
      
      const mockListings = [
        {
          id: '1',
          title: 'Frontend Developer Needed',
          description: 'Looking for a React developer for a 3-month project',
          category: 'jobs',
          subcategory: 'remote',
          owner: { id: '101', name: 'Tech Company Inc.' },
          createdAt: '2025-06-20T10:00:00Z',
          location: { lat: 40.7128, lng: -74.0060 }
        },
        {
          id: '2',
          title: 'Web Design Services',
          description: 'Professional web design for small businesses',
          category: 'services',
          subcategory: 'web-development',
          price: 800,
          owner: { id: '102', name: 'Design Studio' },
          createdAt: '2025-06-22T14:30:00Z',
          location: { lat: 40.7228, lng: -74.0160 }
        },
        {
          id: '3',
          title: 'MacBook Pro 2024',
          description: 'Selling my MacBook Pro, barely used',
          category: 'marketplace',
          subcategory: 'electronics',
          price: 1200,
          owner: { id: '103', name: 'John Doe' },
          createdAt: '2025-06-25T09:15:00Z',
          location: { lat: 40.7328, lng: -74.0260 }
        }
      ] as ListingWithCompatibility[];
      
      // Generate insights using our compatibility service
      // Use type assertion to bypass strict type checking for this demo
      const generatedInsights = await compatibilityInsightService.generateCompatibilityInsights(
        mockUserPreferences as unknown as UserPreferences,
        mockListings
      );
      
      setInsights(generatedInsights);
      
      // Mock compatibility results for demo
      const mockCompatibilityResults = mockListings.map(listing => ({
        userId: userId,
        listingId: listing.id,
        category: listing.category,
        subcategory: listing.subcategory,
        overallScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        dimensions: [
          { name: 'Location', score: Math.floor(Math.random() * 40) + 60, description: 'Based on proximity to your location' },
          { name: 'Price', score: Math.floor(Math.random() * 40) + 60, description: 'Based on your budget preferences' },
          { name: 'Requirements', score: Math.floor(Math.random() * 40) + 60, description: 'Based on your specified needs' },
        ],
        primaryMatchReason: 'High match on location and requirements',
        improvementSuggestions: [],
        timestamp: new Date().toISOString()
      }));
      
      const generatedAiInsights = await compatibilityInsightService.generateAIInsights(
        mockUserPreferences as unknown as UserPreferences,
        mockCompatibilityResults as any,
        mockListings
      );
      
      setAiInsights(generatedAiInsights);
      
    } catch (error) {
      console.error('Error fetching compatibility recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const renderListingCard = (listing: ListingWithCompatibility) => (
    <div key={listing.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted transition-colors">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
          {listing.category === 'jobs' && <Briefcase className="h-6 w-6 text-blue-500" />}
          {listing.category === 'services' && <Wrench className="h-6 w-6 text-green-500" />}
          {listing.category === 'marketplace' && <ShoppingBag className="h-6 w-6 text-purple-500" />}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">{listing.title}</h4>
        <p className="text-xs text-muted-foreground">{listing.category} • {listing.subcategory}</p>
      </div>
      <div className="flex-shrink-0">
        <CompatibilityBadge score={listing.compatibilityScore || 0} />
      </div>
    </div>
  );

  const convertToMatchListings = () => {
    if (!insights.length) return [];
    
    // Flatten all listings from all insights and take top 6
    return insights
      .flatMap(insight => 
        insight.listings.map(listing => ({
          id: listing.id,
          title: listing.title,
          category: listing.category,
          location: listing.location?.address?.split(',')[0] || 'Unknown',
          imageUrl: `/assets/${listing.category}/${listing.subcategory || 'default'}.jpg`,
          compatibilityScore: listing.compatibilityScore || 0,
          compatibilityReason: 'Good match for your preferences'
        }))
      )
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 6);
  };

  return (
    <div className={className}>
      <Tabs defaultValue="top-matches" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="top-matches">Top Matches</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="top-matches" className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full ml-auto" />
                </div>
              ))}
            </div>
          ) : insights.length > 0 ? (
            <TopMatchesWidget matches={convertToMatchListings()} />
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No compatibility matches found.</p>
              <p className="text-sm text-muted-foreground">Try updating your preferences to see more matches.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ai-insights" className="mt-0">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : aiInsights.length > 0 ? (
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-3 rounded-lg border bg-card">
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                No AI insights available yet
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
