"use client";

import { useEffect, useState, useRef } from 'react';
import { getCategoryNameById, getSubcategoryNameById } from '@/utils/category-icons';
import { InteractiveJobMap } from '@/components/map/interactive-job-map';
import { MapFilters } from '@/components/map/map-filters';
import { MapFilterOverlay } from '@/components/map/map-filter-overlay';
import { MobileMapView } from '@/components/map/mobile-map-view';
import { Job } from '@/types/job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Clock, Calendar, AlertCircle, CheckCircle2, Layers, Flame, Users, Tag as TagIcon, ThumbsUp, DollarSign } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/main-layout';

// Mock job data with diverse locations and job types
const mockJobs = [
  // San Francisco Area Jobs
  {
    id: '1',
    title: 'Plumbing Repair',
    status: 'new',
    urgency: 'high',
    address: '123 Main St, San Francisco, CA',
    price: '$120',
    scheduledTime: '2:00 PM Today',
    customer: 'John Doe',
    time: '2:00 PM Today',
    lat: 37.7749,
    lng: -122.4194,
    category: 'home-services',
    subcategory: 'plumbing'
  },
  {
    id: '2',
    title: 'Electrical wiring installation',
    status: 'accepted',
    urgency: 'medium',
    address: '456 Market St, San Francisco, CA',
    price: '$200',
    scheduledTime: '10:00 AM Tomorrow',
    customer: 'Sarah Johnson',
    time: '10:00 AM Tomorrow',
    lat: 37.7935,
    lng: -122.3964,
    category: 'home-services',
    subcategory: 'electrical'
  },
  {
    id: '3',
    title: 'HVAC maintenance',
    status: 'completed',
    urgency: 'low',
    address: '789 Mission St, San Francisco, CA',
    price: '$150',
    scheduledTime: 'Yesterday',
    customer: 'Robert Brown',
    time: 'Yesterday',
    lat: 37.7841,
    lng: -122.4076,
    category: 'home-services',
    subcategory: 'hvac'
  },
  {
    id: '4',
    title: 'Furniture assembly',
    status: 'new',
    urgency: 'high',
    address: '321 Hayes St, San Francisco, CA',
    price: '$85',
    scheduledTime: '4:00 PM Today',
    customer: 'Emily Davis',
    time: '4:00 PM Today',
    lat: 37.7764,
    lng: -122.4242,
    category: 'home-services',
    subcategory: 'furniture-assembly'
  },
  {
    id: '5',
    title: 'Painting service',
    status: 'accepted',
    urgency: 'medium',
    address: '654 Folsom St, San Francisco, CA',
    price: '$300',
    scheduledTime: '11:30 AM Tomorrow',
    customer: 'Michael Wilson',
    time: '11:30 AM Tomorrow',
    lat: 37.7851,
    lng: -122.3964,
    category: 'home-services',
    subcategory: 'painting'
  },
  // Additional San Francisco Jobs
  {
    id: '6',
    title: 'Roof Repair',
    status: 'new',
    urgency: 'high',
    address: '987 Harrison St, San Francisco, CA',
    price: '$450',
    scheduledTime: '9:00 AM Tomorrow',
    customer: 'Jessica Miller',
    time: '9:00 AM Tomorrow',
    lat: 37.7797,
    lng: -122.4001,
    category: 'skilled-trades',
    subcategory: 'roofing'
  },
  {
    id: '7',
    title: 'Window Installation',
    status: 'accepted',
    urgency: 'medium',
    address: '555 Bryant St, San Francisco, CA',
    price: '$275',
    scheduledTime: '1:00 PM Tomorrow',
    customer: 'David Thompson',
    time: '1:00 PM Tomorrow',
    lat: 37.7816,
    lng: -122.3991,
    category: 'skilled-trades',
    subcategory: 'carpentry'
  },
  {
    id: '8',
    title: 'Landscaping',
    status: 'completed',
    urgency: 'low',
    address: '222 Dolores St, San Francisco, CA',
    price: '$180',
    scheduledTime: '2 Days Ago',
    customer: 'Amanda Garcia',
    time: '2 Days Ago',
    lat: 37.7598,
    lng: -122.4260,
    category: 'outdoor-garden',
    subcategory: 'landscaping'
  },
  {
    id: '9',
    title: 'Bathroom Remodel',
    status: 'in_progress',
    urgency: 'medium',
    address: '333 Valencia St, San Francisco, CA',
    price: '$3,500',
    scheduledTime: 'In Progress',
    customer: 'Thomas Rodriguez',
    time: 'In Progress',
    lat: 37.7683,
    lng: -122.4216,
    category: 'skilled-trades',
    subcategory: 'contracting'
  },
  {
    id: '10',
    title: 'Appliance Repair',
    status: 'new',
    urgency: 'high',
    address: '444 Geary St, San Francisco, CA',
    price: '$95',
    scheduledTime: '3:30 PM Today',
    customer: 'Olivia Martinez',
    time: '3:30 PM Today',
    lat: 37.7867,
    lng: -122.4103,
    category: 'home-services',
    subcategory: 'appliance-repair'
  },
  {
    id: '11',
    title: 'Carpet Cleaning',
    status: 'new',
    urgency: 'low',
    address: '777 Sutter St, San Francisco, CA',
    price: '$120',
    scheduledTime: '10:00 AM Day After Tomorrow',
    customer: 'William Johnson',
    time: '10:00 AM Day After Tomorrow',
    lat: 37.7885,
    lng: -122.4117,
    category: 'home-services',
    subcategory: 'carpet-cleaning'
  },
  {
    id: '12',
    title: 'Garage Door Repair',
    status: 'accepted',
    urgency: 'high',
    address: '888 Pine St, San Francisco, CA',
    price: '$150',
    scheduledTime: '8:00 AM Tomorrow',
    customer: 'Sophia Lee',
    time: '8:00 AM Tomorrow',
    lat: 37.7929,
    lng: -122.4089,
    category: 'home-services',
    subcategory: 'home-repairs'
  },
  {
    id: '13',
    title: 'Pest Control',
    status: 'completed',
    urgency: 'medium',
    address: '999 Bush St, San Francisco, CA',
    price: '$110',
    scheduledTime: 'Last Week',
    customer: 'Daniel Clark',
    time: 'Last Week',
    lat: 37.7905,
    lng: -122.4092,
    category: 'home-services',
    subcategory: 'pest-control'
  },
  {
    id: '14',
    title: 'Drywall Repair',
    status: 'in_progress',
    urgency: 'low',
    address: '123 Fillmore St, San Francisco, CA',
    price: '$200',
    scheduledTime: 'In Progress',
    customer: 'Ava Wilson',
    time: 'In Progress',
    lat: 37.7719,
    lng: -122.4316,
    category: 'skilled-trades',
    subcategory: 'drywall'
  },
  {
    id: '15',
    title: 'Flooring Installation',
    status: 'new',
    urgency: 'medium',
    address: '456 Divisadero St, San Francisco, CA',
    price: '$1,200',
    scheduledTime: 'Next Week',
    customer: 'Ethan Brown',
    time: 'Next Week',
    lat: 37.7750,
    lng: -122.4377,
    category: 'skilled-trades',
    subcategory: 'flooring'
  }
];
const typedMockJobs: Job[] = mockJobs;

export function MapViewPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(typedMockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  
  // ... (rest of the code remains the same)
  // Filter states
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterNeighbors, setFilterNeighbors] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Additional filter states for vertical buttons
  const [showAccepted, setShowAccepted] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);
  const [showHighestPay, setShowHighestPay] = useState(false);
  const [showNewest, setShowNewest] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState<{
    categories: string[];
    subcategories: string[];
    searchQuery: string;
  }>({ categories: [], subcategories: [], searchQuery: '' });
  const filterOverlayRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  
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

  // Simulate map loading with a shorter timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Force map reload when switching between mobile and desktop views
  useEffect(() => {
    setMapLoading(true);
    const timer = setTimeout(() => {
      setMapLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [isMobileView]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Handle unauthenticated state
  if (!isAuthenticated) {
    // In a real app, we would redirect to login
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view the map</h1>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </div>
      </div>
    );
  }

  // Convert jobs to map markers
  const mapMarkers = filteredJobs.map(job => ({
    id: job.id.toString(),
    position: { lat: job.lat, lng: job.lng },
    title: job.title,
    status: job.status,
    urgency: job.urgency
  }));

  // Handle marker click
  const handleMarkerClick = (markerId: string) => {
    setSelectedJobId(markerId);
    const job = jobs.find(job => job.id.toString() === markerId);
    if (job) {
      setSelectedJob(job);
    }
  };

  // Filter jobs based on search query
  // Handle clicks outside the filter overlay to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterOverlayRef.current && !filterOverlayRef.current.contains(event.target as Node)) {
        setShowFilterOverlay(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply filters when category filters change
  useEffect(() => {
    applyAllFilters();
  }, [categoryFilters, searchQuery, activeTab]);

  // Apply all filters: search, categories, tabs, and filter buttons
  const applyAllFilters = () => {
    console.log('Applying filters:', { 
      searchQuery, 
      filterUrgent, 
      filterVerified, 
      filterNeighbors,
      categoryFilters,
      activeTab,
      showAccepted,
      showRecommended,
      showHighestPay,
      showNewest
    });
    
    let filtered = [...jobs];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.address.toLowerCase().includes(query)
      );
    }
    
    // Apply filter buttons
    if (filterUrgent) {
      filtered = filtered.filter(job => job.urgency === 'high' || job.urgency === 'urgent');
    }
    
    if (filterVerified) {
      filtered = filtered.filter(job => job.status === 'accepted');
    }
    
    if (filterNeighbors) {
      // In a real app, this would filter based on actual neighbor data
      // For now, we'll use a deterministic approach based on job ID
      filtered = filtered.filter(job => parseInt(job.id.toString()) % 3 === 0);
    }
    
    // Apply vertical action button filters
    if (showAccepted) {
      filtered = filtered.filter(job => job.status === 'accepted');
    }
    
    if (showRecommended) {
      // In a real app, this would filter based on actual recommendation algorithm
      // For now, we'll use a deterministic approach based on job ID
      filtered = filtered.filter(job => parseInt(job.id.toString()) % 2 === 0);
    }
    
    if (showHighestPay) {
      // Sort by price (highest first)
      filtered.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, '') || '0');
        const priceB = parseInt(b.price.replace(/[^0-9]/g, '') || '0');
        return priceB - priceA;
      });
    }
    
    if (showNewest) {
      // In a real app, this would sort by actual creation date
      // For now, we'll sort by ID (assuming higher ID = newer)
      filtered.sort((a, b) => parseInt(b.id.toString()) - parseInt(a.id.toString()));
    }
    
    // Apply category filters
    if (categoryFilters.categories.length > 0 || categoryFilters.subcategories.length > 0) {
      filtered = filtered.filter(job => {
        // If subcategories are selected, check if job matches any of them
        if (categoryFilters.subcategories.length > 0) {
          if (job.subcategory && categoryFilters.subcategories.includes(job.subcategory)) {
            return true;
          }
        }
        
        // If categories are selected, check if job matches any of them
        if (categoryFilters.categories.length > 0) {
          if (job.category && categoryFilters.categories.includes(job.category)) {
            return true;
          }
        }
        
        // If both category and subcategory filters are active but job doesn't match any, exclude it
        return categoryFilters.categories.length === 0 && categoryFilters.subcategories.length === 0;
      });
    }
    
    // Apply tab filter (status)
    if (activeTab !== 'all') {
      filtered = filtered.filter(job => job.status === activeTab);
    }
    
    console.log(`Filtered jobs: ${filtered.length} out of ${jobs.length}`);
    
    // If all jobs are filtered out, show all jobs
    if (filtered.length === 0) {
      console.log('All jobs filtered out, showing all jobs instead');
      filtered = [...jobs];
    }
    
    setFilteredJobs(filtered);
  };
  
  // Handle filter overlay toggle
  const toggleFilterOverlay = () => {
    setShowFilterOverlay(prev => !prev);
  };
  
  // Handle filter changes from the overlay
  const handleFilterChange = (filters: { categories: string[], subcategories: string[], searchQuery: string }) => {
    setCategoryFilters(filters);
    if (filters.searchQuery !== searchQuery) {
      setSearchQuery(filters.searchQuery);
      // Update search query in category filters as well
      setCategoryFilters(prev => ({ ...prev, searchQuery: filters.searchQuery }));
    }
  };

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };
  
  // Update filters when filter buttons change
  useEffect(() => {
    applyAllFilters();
  }, [filterUrgent, filterVerified, filterNeighbors, activeTab, searchQuery]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-500 text-white';
      case 'accepted': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <MainLayout>
      <div className="p-6 bg-gray-50 dark:bg-gray-900 h-full">
        {/* Conditional rendering based on screen size */}
        {isMobileView ? (
          /* Mobile View */
          <div className="h-[calc(100vh-120px)]">
            {mapLoading ? (
              <div className="h-full flex items-center justify-center">
                <Spinner className="h-12 w-12 text-brand-500" />
              </div>
            ) : (
              <MobileMapView
                jobs={filteredJobs}
                onJobSelect={(job) => {
                  console.log('Selected job in mobile view:', job);
                  setSelectedJob(job as any);
                  setSelectedJobId(job.id.toString());
                }}
                onSearch={(query) => {
                  console.log('Search in mobile view:', query);
                  setSearchQuery(query);
                  applyAllFilters();
                }}
                onFilter={() => {
                  console.log('Filter in mobile view');
                  setShowFilterOverlay(true);
                }}
              />
            )}
          </div>
        ) : (
          /* Desktop View */
          <>
            {/* Map Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Map View
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  View and manage jobs on the map
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  placeholder="Search locations or jobs..."
                  className="w-64"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <Button variant="outline" size="icon" type="submit">
                  <Search className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleFilterOverlay}
                  className={showFilterOverlay ? 'bg-primary/10' : ''}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Map and Job List */}
            {/* Filter Overlay */}
            {showFilterOverlay && (
              <div 
                className="absolute z-20 right-4 top-24 w-80"
                ref={filterOverlayRef}
              >
                <MapFilterOverlay 
                  onFilterChange={handleFilterChange}
                  onClose={() => setShowFilterOverlay(false)}
                />
              </div>
            )}
            
            <div className="flex h-[calc(100vh-220px)]">
              {/* Job List - Smaller width */}
              <div className="w-1/4 pr-4 overflow-y-auto">
                <div className="space-y-2">
                  {filteredJobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedJobId(job.id.toString());
                        // Find the job and set it as selected
                        const selectedJob = jobs.find(j => j.id === job.id);
                        if (selectedJob) {
                          setSelectedJob(selectedJob);
                        }
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <h3 className={`font-medium text-sm ${selectedJobId === job.id ? 'text-primary' : ''}`}>{job.title}</h3>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-2 w-2 mr-1 flex-shrink-0" />
                          <span className="truncate">{job.address}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          {job.category && (
                            <div className="text-xs text-gray-500 truncate max-w-[100px]">
                              {getCategoryNameById(job.category)}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className={getUrgencyColor(job.urgency)}>
                              {job.urgency === 'high' && <AlertCircle className="h-2 w-2 mr-1" />}
                              <span className="text-xs">{job.urgency}</span>
                            </Badge>
                            <span className="text-xs font-medium">{job.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredJobs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No jobs match your search
                    </div>
                  )}
                </div>
              </div>
              
              {/* Map Area - Larger width */}
              <div className="w-3/4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative" style={{ height: 'calc(100vh - 200px)' }}>
                {/* Map Controls */}
                <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-md shadow-md">
                  <Button variant="ghost" size="icon" className="rounded-md" title="Toggle Layers">
                    <Layers className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Map Filters - Overlay at the top */}
                {/* Vertical action buttons on the right side */}
                <div className="absolute top-1/4 right-4 z-10 flex flex-col gap-2" style={{ transform: 'translateX(6px)' }}>
                  <button
                    onClick={() => {
                      setShowAccepted(!showAccepted);
                      console.log('Toggle accepted jobs:', !showAccepted);
                      // Apply filters immediately
                      setTimeout(() => applyAllFilters(), 0);
                    }}
                    style={{
                      backgroundColor: showAccepted ? 'rgba(34, 197, 94, 0.9)' : 'rgba(34, 197, 94, 0.7)',
                      border: '1px solid rgba(34, 197, 94, 0.9)',
                      borderRadius: '4px',
                      padding: '5px',
                      boxShadow: showAccepted ? '0 0 8px rgba(34, 197, 94, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      backdropFilter: 'blur(4px)'
                    }}
                    title="Accepted Jobs"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setShowRecommended(!showRecommended);
                      console.log('Toggle recommended jobs:', !showRecommended);
                      // Apply filters immediately
                      setTimeout(() => applyAllFilters(), 0);
                    }}
                    style={{
                      backgroundColor: showRecommended ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.7)',
                      border: '1px solid rgba(59, 130, 246, 0.9)',
                      borderRadius: '4px',
                      padding: '5px',
                      boxShadow: showRecommended ? '0 0 8px rgba(59, 130, 246, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      backdropFilter: 'blur(4px)'
                    }}
                    title="Recommended Jobs"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setShowHighestPay(!showHighestPay);
                      console.log('Toggle highest pay jobs:', !showHighestPay);
                      // Apply filters immediately
                      setTimeout(() => applyAllFilters(), 0);
                    }}
                    style={{
                      backgroundColor: showHighestPay ? 'rgba(234, 179, 8, 0.9)' : 'rgba(234, 179, 8, 0.7)',
                      border: '1px solid rgba(234, 179, 8, 0.9)',
                      borderRadius: '4px',
                      padding: '5px',
                      boxShadow: showHighestPay ? '0 0 8px rgba(234, 179, 8, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      backdropFilter: 'blur(4px)'
                    }}
                    title="Highest Pay"
                  >
                    <DollarSign className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setShowNewest(!showNewest);
                      console.log('Toggle newest jobs:', !showNewest);
                      // Apply filters immediately
                      setTimeout(() => applyAllFilters(), 0);
                    }}
                    style={{
                      backgroundColor: showNewest ? 'rgba(168, 85, 247, 0.9)' : 'rgba(168, 85, 247, 0.7)',
                      border: '1px solid rgba(168, 85, 247, 0.9)',
                      borderRadius: '4px',
                      padding: '5px',
                      boxShadow: showNewest ? '0 0 8px rgba(168, 85, 247, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      backdropFilter: 'blur(4px)'
                    }}
                    title="Newest Jobs"
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md px-1 py-1 backdrop-blur-sm">
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant={filterUrgent ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setFilterUrgent(!filterUrgent)}>
                        <Flame className="h-3 w-3 mr-1 text-red-500" /> Hot
                      </Button>
                      <Button size="sm" variant={filterVerified ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setFilterVerified(!filterVerified)}>
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> Verified
                      </Button>
                      <Button size="sm" variant={filterNeighbors ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setFilterNeighbors(!filterNeighbors)}>
                        <Users className="h-3 w-3 mr-1 text-orange-500" /> Neighbors
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs px-2">
                        <TagIcon className="h-3 w-3 mr-1 text-purple-800" /> Categories
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs px-2">
                        <span className="flex items-center">
                          Filters
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {mapLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner className="h-12 w-12 text-brand-500" />
                  </div>
                ) : (
                  <div className="h-full w-full">
                    <InteractiveJobMap
                      jobs={filteredJobs}
                      defaultCenter={{ lat: 37.7749, lng: -122.4194 }} // Default to San Francisco
                      defaultZoom={12}
                      onJobSelect={(job) => {
                        setSelectedJobId(job.id.toString());
                        setSelectedJob(job);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* The right sidebar job details panel has been replaced with the semi-transparent popup on the map */}
      </div>
    </MainLayout>
  );
}
