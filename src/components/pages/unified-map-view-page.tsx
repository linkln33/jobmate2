"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent, GlassCardFooter } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Job } from '@/types/job';
import { InteractiveMapWithFilters } from '@/components/map/interactive-map-with-filters';
import { MobileMapView } from '@/components/map/mobile-map-view';
// JobDetailsPanel removed as requested
import { MapFilters } from '@/components/map/map-filters';
import {
  Search,
  MapPin,
  Filter,
  Briefcase,
  Home,
  ChevronDown,
  Layers,
  User,
  Star,
  Clock,
  X,
  Plus,
  DollarSign,
  Calendar
} from 'lucide-react';

export function UnifiedMapViewPage() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Initialize map loading state - only run once on component mount
  useEffect(() => {
    // Only set loading state if map isn't already loaded
    if (!mapLoaded) {
      // No artificial delay needed - just mark as loaded when component mounts
      setMapLoaded(true);
    }
  }, []);
  
  // Check if the screen is mobile size using window resize event
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
      console.log('Mobile view:', window.innerWidth < 768, 'Width:', window.innerWidth);
    };
    
    // Set initial value
    checkMobileView();
    
    // Add event listener
    window.addEventListener('resize', checkMobileView);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);
  const [mapFilter, setMapFilter] = useState('all');
  const [distance, setDistance] = useState([10]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock job categories
  const jobCategories = [
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'gardening', name: 'Gardening' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'electrical', name: 'Electrical' },
    { id: 'carpentry', name: 'Carpentry' },
    { id: 'painting', name: 'Painting' },
  ];

  // Mock data for jobs
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Home Cleaning Service',
      description: 'Need help cleaning a 3-bedroom house, including kitchen and bathrooms.',
      status: 'active',
      lat: 40.7128,
      lng: -74.006,
      city: 'New York',
      zipCode: '10001',
      budgetMin: 80,
      budgetMax: 120,
      createdAt: '2025-06-15',
      urgencyLevel: 'high',
      isVerifiedPayment: true,
      isNeighborPosted: true,
      serviceCategory: {
        id: 'cleaning',
        name: 'Cleaning'
      },
      customer: {
        id: 'c1',
        firstName: 'John',
        lastName: 'Doe'
      }
    },
    {
      id: '2',
      title: 'Garden Maintenance',
      description: 'Looking for someone to help with lawn mowing, weeding, and general garden maintenance.',
      status: 'active',
      lat: 40.7328,
      lng: -73.9956,
      city: 'New York',
      zipCode: '10002',
      budgetMin: 60,
      budgetMax: 100,
      createdAt: '2025-06-14',
      urgencyLevel: 'medium',
      isVerifiedPayment: true,
      isNeighborPosted: false,
      serviceCategory: {
        id: 'gardening',
        name: 'Gardening'
      },
      customer: {
        id: 'c2',
        firstName: 'Jane',
        lastName: 'Smith'
      }
    },
    {
      id: '3',
      title: 'Plumbing Repair',
      description: 'Need a plumber to fix a leaking sink and replace bathroom faucet.',
      status: 'active',
      lat: 40.7508,
      lng: -73.9856,
      city: 'New York',
      zipCode: '10003',
      budgetMin: 120,
      budgetMax: 200,
      createdAt: '2025-06-16',
      urgencyLevel: 'high',
      isVerifiedPayment: false,
      isNeighborPosted: true,
      serviceCategory: {
        id: 'plumbing',
        name: 'Plumbing'
      },
      customer: {
        id: 'c3',
        firstName: 'Robert',
        lastName: 'Johnson'
      }
    },
    {
      id: '4',
      title: 'Electrical Work',
      description: 'Need an electrician to install new lighting fixtures and check wiring.',
      status: 'active',
      lat: 40.7228,
      lng: -73.9856,
      city: 'New York',
      zipCode: '10004',
      budgetMin: 150,
      budgetMax: 250,
      createdAt: '2025-06-13',
      urgencyLevel: 'medium',
      isVerifiedPayment: true,
      isNeighborPosted: false,
      serviceCategory: {
        id: 'electrical',
        name: 'Electrical'
      },
      customer: {
        id: 'c4',
        firstName: 'Sarah',
        lastName: 'Williams'
      }
    },
  ];
  
  // Filter state for the map
  const [mapFilterState, setMapFilterState] = useState<{
    showUrgent: boolean;
    showVerifiedPay: boolean;
    showNeighbors: boolean;
    minPayRate: number;
    maxDistance: number;
    categories: string[];
    showAccepted: boolean;
    showSuggested: boolean;
    showNewest: boolean;
  }>({
    showUrgent: false,
    showVerifiedPay: false,
    showNeighbors: false,
    minPayRate: 0,
    maxDistance: distance[0],
    categories: [],
    showAccepted: false,
    showSuggested: true,
    showNewest: true
  });

  // Handle job selection
  const handleJobSelected = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  // Filter jobs based on search query and other filters
  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      // Apply search filter if query exists
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Add other filters as needed
      return true;
    });
  }, [mockJobs, searchQuery]);

  // Find the selected job from mockJobs when selectedJobId changes
  useEffect(() => {
    if (selectedJobId) {
      const job = mockJobs.find(job => job.id.toString() === selectedJobId);
      setSelectedJob(job || null);
    } else {
      setSelectedJob(null);
    }
  }, [selectedJobId, mockJobs]);
  
  // Update map filters when distance changes
  useEffect(() => {
    setMapFilterState(prev => ({
      ...prev,
      maxDistance: distance[0]
    }));
  }, [distance]);
  
  // Apply category filter
  const handleCategoryFilter = (categoryId: string) => {
    setMapFilterState(prev => {
      const updatedCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      return { 
        ...prev, 
        categories: updatedCategories 
      };
    });
  };
  
  // Handle filter toggle
  const handleFilterToggle = (filterName: keyof typeof mapFilterState) => {
    setMapFilterState(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setMapFilterState({
      showUrgent: false,
      showVerifiedPay: false,
      showNeighbors: false,
      minPayRate: 0,
      maxDistance: 10,
      categories: [] as string[],
      showAccepted: false,
      showSuggested: true,
      showNewest: true
    });
    setDistance([10]);
  };
  

  // Create the map component to pass to the layout
  const mapComponent = (
    <div className="h-full w-full relative">
      {isMobileView ? (
        /* Mobile View - Use the original MobileMapView component */
        <MobileMapView
          jobs={filteredJobs}
          onJobSelect={(job) => {
            console.log('Selected job in mobile view:', job);
            setSelectedJob(job);
            setSelectedJobId(job.id ? job.id.toString() : null);
          }}
          onSearch={(query) => {
            console.log('Search in mobile view:', query);
            setSearchQuery(query);
          }}
          onFilter={() => {
            console.log('Filter in mobile view');
            setShowFilters(!showFilters);
          }}
        />
      ) : (
        /* Desktop View */
        <>
          {mapLoaded ? (
            <InteractiveMapWithFilters
              key={`map-view-page-map-${mapLoaded}`}
              height="calc(100vh - 120px)"
              onJobSelect={(job) => handleJobSelected(job.id.toString())}
              selectedJobId={selectedJobId || ''}
            />
          ) : (
            <div className="h-[calc(100vh-120px)] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {/* Bottom drawer for job details - matches original mobile implementation */}
          <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl shadow-lg transition-transform duration-300 transform z-20 ${selectedJob ? 'translate-y-0' : 'translate-y-full'}`}>
            {/* Drawer handle */}
            <div 
              className="h-6 w-full flex justify-center items-center cursor-pointer"
              onClick={() => setSelectedJob(null)}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Selected job details */}
            {selectedJob && (
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                  <Badge className={selectedJob.status === 'new' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                    {selectedJob.status || 'New'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{selectedJob.address || `${selectedJob.city || ''}, ${selectedJob.zipCode || ''}`}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <p className="text-sm">{selectedJob.time || selectedJob.scheduledTime || selectedJob.createdAt || 'Flexible'}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={selectedJob.urgency === 'high' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}>
                      {selectedJob.urgency || 'Normal'}
                    </Badge>
                    <span className="font-bold">{selectedJob.price || `$${selectedJob.budgetMin || 0} - $${selectedJob.budgetMax || 0}`}</span>
                  </div>
                  
                  <div className="pt-2 flex space-x-2">
                    <Button className="flex-1">Contact</Button>
                    <Button className="flex-1" variant="outline">Apply</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Backdrop for closing the drawer */}
          {selectedJob && (
            <div 
              className="fixed inset-0 bg-black/20 z-10"
              onClick={() => setSelectedJob(null)}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <UnifiedDashboardLayout 
      title="Map View" 
      showMap={true}
      mapComponent={mapComponent}
    >
      <div className="p-6">
        {/* Map Controls - Top */}
        <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row gap-4">
          <GlassCard className="flex-1" intensity="medium">
            <GlassCardContent className="p-3">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search location or service..." 
                    className="pl-10 bg-white/20 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2 bg-white/20 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2 bg-white/20 dark:bg-gray-800/20 border-white/10 dark:border-gray-700/30"
                >
                  <Layers className="h-4 w-4" />
                </Button>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Filters Panel (conditionally shown) */}
        {showFilters && (
          <div className="max-w-7xl mx-auto mb-6">
            <GlassCard intensity="medium">
              <GlassCardHeader className="flex flex-row items-center justify-between">
                <GlassCardTitle>Filters</GlassCardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <div className="space-x-2">
                      <Badge 
                        variant={mapFilter === 'all' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setMapFilter('all')}
                      >
                        All
                      </Badge>
                      <Badge 
                        variant={mapFilter === 'jobs' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setMapFilter('jobs')}
                      >
                        Jobs
                      </Badge>
                      <Badge 
                        variant={mapFilter === 'specialists' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setMapFilter('specialists')}
                      >
                        Specialists
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Distance ({distance}km)</label>
                    <Slider
                      defaultValue={[10]}
                      max={50}
                      min={1}
                      step={1}
                      onValueChange={(value) => setDistance(value)}
                      className="py-4"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="h-5 w-5 text-yellow-500 cursor-pointer" 
                          fill={star <= 4 ? "currentColor" : "none"} 
                        />
                      ))}
                      <span className="text-sm ml-2">& Up</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="mr-2">Reset</Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        )}

        {/* Map Content Area */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar - Map results */}
          <div className="md:col-span-1 h-[calc(100vh-280px)] overflow-y-auto">
            <GlassCard className="h-full" intensity="medium">
              <GlassCardHeader>
                <GlassCardTitle>Map Results</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3">
                  {mockJobs.map(job => (
                    <div 
                      key={job.id} 
                      className={`p-3 rounded-lg bg-white/10 dark:bg-gray-800/20 cursor-pointer hover:bg-white/20 dark:hover:bg-gray-800/30 transition-colors ${selectedJobId === job.id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => handleJobSelected(job.id)}
                    >
                      <div className="flex items-start">
                        <div className="p-2 rounded-full mr-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{job.title}</h4>
                            <div className="flex items-center">
                              {job.urgency === 'high' && (
                                <Badge variant="destructive" className="ml-2 text-xs">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{job.city}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span>${job.budgetMin} - ${job.budgetMax}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>

          {/* Right sidebar - Map takes full width now */}
          <div className="md:col-span-2 h-[calc(100vh-280px)]">
            <GlassCard className="h-full" intensity="medium">
              <GlassCardContent className="p-0 h-full">
                {/* Map will expand to fill this space */}
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="max-w-7xl mx-auto mt-6">
          <GlassCard intensity="low">
            <GlassCardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{mockJobs.length}</span> results found
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    <Clock className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Job Here
                  </Button>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
