"use client";

import React, { useState, useEffect } from 'react';
import { SmartJobMatches } from '@/components/match/smart-job-matches';
import { InteractiveMapWithFilters } from '@/components/map/interactive-map-with-filters';
import { Job } from '@/services/match-service';
import { Specialist } from '@/types/job-match-types';
import { matchService } from '@/services/match-service';
import { fetchJobMatches } from '@/utils/api/match-api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, List, Settings, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MatchAIAssistant } from '@/components/match/match-ai-assistant';
import { useToast } from '@/components/ui/use-toast';

// Mock data for the current specialist
const mockSpecialist: Specialist = {
  id: 'spec-1',
  firstName: 'Alex',
  lastName: 'Johnson',
  skills: ['Cleaning', 'Gardening', 'Painting', 'Handyman'],
  location: {
    lat: 40.7128,
    lng: -74.006,
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    radius: 10
  },
  rating: 4.8,
  completedJobs: 27,
  hourlyRate: 35,
  ratePreferences: {
    min: 25,
    max: 50,
    preferred: 35
  },
  availability: {
    schedule: {
      'Monday': ['9-17'],
      'Tuesday': ['9-17'],
      'Wednesday': ['9-17'],
      'Thursday': ['9-17'],
      'Friday': ['9-17']
    },
    preferredHours: [9, 10, 11, 14, 15, 16]
  },
  responseTime: 15, // 15 minutes average response time
  specialistSince: new Date('2023-01-15'),
  verificationLevel: 2
};

// Sample categories for the map filters
const sampleCategories = [
  { id: 'cat1', name: 'Cleaning' },
  { id: 'cat2', name: 'Gardening' },
  { id: 'cat3', name: 'Handyman' },
  { id: 'cat4', name: 'Painting' },
  { id: 'cat5', name: 'Moving' },
  { id: 'cat6', name: 'Electrical' },
  { id: 'cat7', name: 'Plumbing' }
];

// Function to generate mock jobs
const generateMockJobs = (specialist: Specialist) => {
  // Default location if specialist location is undefined
  const defaultLat = 40.7128; // New York
  const defaultLng = -74.006;
  const defaultCity = 'New York';
  const defaultState = 'NY';
  
  // Generate a job near the specialist's location
  const createMockJob = (index: number): Job => {
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    // Random category
    const randomCategoryIndex = Math.floor(Math.random() * sampleCategories.length);
    const category = sampleCategories[randomCategoryIndex];
    
    // Random budget
    const baseRate = 25 + Math.floor(Math.random() * 50);
    const budgetMin = Math.random() > 0.3 ? baseRate : undefined;
    const budgetMax = budgetMin ? budgetMin + 10 + Math.floor(Math.random() * 40) : baseRate + 30;
    
    // Random urgency
    const urgencyOptions = ['low', 'medium', 'high'];
    const urgencyIndex = Math.floor(Math.random() * 3);
    
    return {
      id: `job-${index + 1}`,
      title: `${category.name} Job ${index + 1}`,
      description: `This is a sample ${category.name.toLowerCase()} job that needs to be done in the ${['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)]} area.`,
      status: Math.random() > 0.7 ? 'completed' : 'open',
      lat: specialist.location ? specialist.location.lat + latOffset : defaultLat + latOffset,
      lng: specialist.location ? specialist.location.lng + lngOffset : defaultLng + lngOffset,
      city: specialist.location ? specialist.location.city : defaultCity,
      state: specialist.location ? specialist.location.state : defaultState,
      zipCode: '10001',
      budgetMin,
      budgetMax: Math.random() > 0.2 ? budgetMax : undefined,
      createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 10 days
      urgencyLevel: urgencyOptions[urgencyIndex],
      isVerifiedPayment: Math.random() > 0.6,
      isNeighborPosted: Math.random() > 0.7,
      serviceCategory: category,
      customer: {
        id: `cust-${index + 1}`,
        firstName: ['John', 'Jane', 'Mike', 'Sarah', 'David'][Math.floor(Math.random() * 5)],
        lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]
      }
    };
  };
  
  // Create an array of 20 mock jobs
  const mockJobs: Job[] = Array(20).fill(null).map((_, index) => createMockJob(index));
  
  return mockJobs;
};

export function SmartMatchesPage() {
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobMatches, setJobMatches] = useState<Array<{ job: Job; matchResult: any }>>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [filters, setFilters] = useState({});
  const [preferences, setPreferences] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  
  // Fetch job matches from API
  useEffect(() => {
    const loadJobMatches = async () => {
      setIsLoading(true);
      
      try {
        // Try to fetch from API
        const response = await fetchJobMatches(
          mockSpecialist.id, 
          filters,
          preferences,
          page
        );
        
        if (response) {
          // API call succeeded
          setJobMatches(response.matches);
          setJobs(response.matches.map(match => match.job));
          setTotalPages(response.pagination.totalPages);
        } else {
          // API call failed, fall back to mock data
          const mockJobs = generateMockJobs(mockSpecialist);
          setJobs(mockJobs);
          toast({
            title: "Using mock data",
            description: "Could not connect to matching API. Using generated data instead.",
            variant: "destructive"
          });
        }
      } catch (error) {
        // Error handling
        console.error("Error loading job matches:", error);
        const mockJobs = generateMockJobs(mockSpecialist);
        setJobs(mockJobs);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJobMatches();
  }, [filters, preferences, page, toast]);
  
  // Handle job selection
  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    
    // Find the selected job
    const selectedJob = jobs.find(job => job.id === jobId);
    
    // If in list view, switch to map view to show the selected job
    if (activeView === 'list' && selectedJob) {
      setActiveView('map');
    }
  };
  
  // Calculate match results for selected job
  const [selectedJobMatchResults, setSelectedJobMatchResults] = useState<Array<{
    job: Job;
    matchResult: any;
  }>>([]);

  // Update match results when jobs or selected job changes
  useEffect(() => {
    if (jobs.length > 0) {
      const results = jobs.map(job => ({
        job,
        matchResult: matchService.calculateMatchScore(job, mockSpecialist)
      }));
      setSelectedJobMatchResults(results);
    }
  }, [jobs]);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Smart Job Matches</h1>
          <p className="text-gray-500 mt-1">
            Personalized job recommendations based on your skills and preferences
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Match Settings
          </Button>
          <Button variant="outline" size="sm">
            <Info className="h-4 w-4 mr-2" />
            How Matching Works
          </Button>
        </div>
      </div>
      
      {/* AI Assistant - shown at the top for visibility */}
      <div className="mb-6">
        <MatchAIAssistant
          specialist={mockSpecialist}
          selectedJob={jobs.find(job => job.id === selectedJobId)}
          matchResults={selectedJobMatchResults}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="list" value={activeView} onValueChange={(v) => setActiveView(v as 'list' | 'map')}>
                <div className="border-b px-4 py-2">
                  <TabsList>
                    <TabsTrigger value="list" className="flex items-center">
                      <List className="h-4 w-4 mr-2" />
                      List View
                    </TabsTrigger>
                    <TabsTrigger value="map" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Map View
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="list" className="p-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-48 w-full" />
                      ))}
                    </div>
                  ) : (
                    <SmartJobMatches 
                      jobs={jobs} 
                      specialist={mockSpecialist}
                      onSelectJob={handleSelectJob}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="map" className="p-0">
                  <div className="h-[700px]">
                    {isLoading ? (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <InteractiveMapWithFilters 
                        initialCenter={{
                          lat: mockSpecialist.location?.lat || 40.7128,
                          lng: mockSpecialist.location?.lng || -74.006
                        }}
                        initialZoom={12}
                        height="700px"
                        onJobSelect={(job) => setSelectedJobId(job.id)}
                        selectedJobId={selectedJobId}
                        showSearchBar={true}
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Your Match Profile</h3>
                  <p className="text-sm text-gray-500">
                    Jobs are matched based on your profile information
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium">Skills</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mockSpecialist.skills?.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Location</h4>
                    <p className="text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {mockSpecialist.location?.city || 'New York'}, {mockSpecialist.location?.state || 'NY'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Rate Preferences</h4>
                    <p className="text-sm">
                      ${mockSpecialist.ratePreferences?.min} - ${mockSpecialist.ratePreferences?.max}/hr
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Reputation</h4>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {Array(5).fill(null).map((_, i) => (
                          <svg 
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(mockSpecialist.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm ml-1">{mockSpecialist.rating}/5</span>
                      <span className="text-xs text-gray-500 ml-2">({mockSpecialist.completedJobs} jobs)</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Update Match Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">Match Insights</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Jobs matched this week</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>High match rate jobs</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Applied to matches</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-1">Top matching categories</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Cleaning</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gardening</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Handyman</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
