"use client";

import { useState, useEffect } from 'react';
import { EnhancedJobMap } from '@/components/map/enhanced-job-map';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Filter, MapPin, Clock, X, ChevronUp, ChevronDown, 
  CheckCircle, Home, Flame, CheckCircle2, ThumbsUp, DollarSign, Tag as TagIcon 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Job } from '@/types/job';

interface MobileMapViewProps {
  jobs: Job[];
  onJobSelect?: (job: Job) => void;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

export function MobileMapView({ jobs, onJobSelect, onSearch, onFilter }: MobileMapViewProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Filter state
  const [showUrgent, setShowUrgent] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [showNeighbors, setShowNeighbors] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  
  // Additional filter states for vertical buttons
  const [showAccepted, setShowAccepted] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const [showHighestPay, setShowHighestPay] = useState(false);
  const [showNewest, setShowNewest] = useState(false);
  
  // Log when component mounts
  useEffect(() => {
    console.log('MobileMapView mounted with jobs:', jobs);
    setMapLoaded(true);
  }, [jobs]);

  // Handle job selection
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
    if (onJobSelect && typeof onJobSelect === 'function') {
      onJobSelect(job);
    }
  };
  
  // Handle filter changes
  useEffect(() => {
    console.log('Mobile filter state changed:', { 
      showUrgent, showVerified, showNeighbors, showCategories,
      showAccepted, showSuggested, showHighestPay, showNewest
    });
    
    // When filter state changes, notify parent component if needed
    if (onFilter && typeof onFilter === 'function') {
      onFilter();
    }
  }, [
    showUrgent, showVerified, showNeighbors, showCategories,
    showAccepted, showSuggested, showHighestPay, showNewest, onFilter
  ]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) onSearch(query);
  };

  // Get status color for badges
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-green-500 text-white';
      case 'accepted': return 'bg-blue-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Get urgency color for badges
  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Search and filter overlay */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4 flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search jobs or locations..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-white/90 backdrop-blur-sm shadow-md"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch && typeof onSearch === 'function') {
                onSearch(e.target.value);
              }
            }}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 bg-white/90 backdrop-blur-sm shadow-md"
          onClick={() => {
            if (onFilter && typeof onFilter === 'function') {
              onFilter();
            }
          }}
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Quick filter buttons */}
      <div className="absolute top-16 left-0 right-0 z-10 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          <Button 
            variant={showUrgent ? "default" : "outline"}
            size="sm"
            className={`whitespace-nowrap ${showUrgent ? 'bg-red-500 hover:bg-red-600' : 'bg-white/90 backdrop-blur-sm'}`}
            onClick={() => {
              setShowUrgent(!showUrgent);
              console.log('Toggle hot filter:', !showUrgent);
            }}
          >
            <Flame className="mr-1 h-4 w-4 text-red-500" />
            Hot
          </Button>
          <Button 
            variant={showVerified ? "default" : "outline"}
            size="sm"
            className={`whitespace-nowrap ${showVerified ? 'bg-green-500 hover:bg-green-600' : 'bg-white/90 backdrop-blur-sm'}`}
            onClick={() => {
              setShowVerified(!showVerified);
              console.log('Toggle verified filter:', !showVerified);
            }}
          >
            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
            Verified
          </Button>
          <Button 
            variant={showNeighbors ? "default" : "outline"}
            size="sm"
            className={`whitespace-nowrap ${showNeighbors ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/90 backdrop-blur-sm'}`}
            onClick={() => {
              setShowNeighbors(!showNeighbors);
              console.log('Toggle neighbors filter:', !showNeighbors);
            }}
          >
            <Home className="mr-1 h-4 w-4 text-orange-500" />
            Neighbors
          </Button>
          <Button 
            variant={showCategories ? "default" : "outline"}
            size="sm"
            className={`whitespace-nowrap ${showCategories ? 'bg-purple-500 hover:bg-purple-600' : 'bg-white/90 backdrop-blur-sm'}`}
            onClick={() => {
              setShowCategories(!showCategories);
              console.log('Toggle categories filter:', !showCategories);
            }}
          >
            <TagIcon className="mr-1 h-4 w-4 text-purple-800" />
            Categories
          </Button>
        </div>
      </div>
      
      {/* Vertical action buttons on the right side */}
      <div className="absolute top-1/4 right-4 z-10 flex flex-col gap-2" style={{ transform: 'translateX(6px)' }}>
        <button
          onClick={() => {
            setShowAccepted(!showAccepted);
            console.log('Toggle accepted jobs:', !showAccepted);
            // Notify parent component to apply filters
            if (onFilter && typeof onFilter === 'function') {
              setTimeout(() => onFilter(), 0);
            }
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
            setShowSuggested(!showSuggested);
            console.log('Toggle suggested jobs:', !showSuggested);
            // Notify parent component to apply filters
            if (onFilter && typeof onFilter === 'function') {
              setTimeout(() => onFilter(), 0);
            }
          }}
          style={{
            backgroundColor: showSuggested ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.7)',
            border: '1px solid rgba(59, 130, 246, 0.9)',
            borderRadius: '4px',
            padding: '5px',
            boxShadow: showSuggested ? '0 0 8px rgba(59, 130, 246, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            color: 'white',
            backdropFilter: 'blur(4px)'
          }}
          title="Suggested Jobs"
        >
          <ThumbsUp className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setShowHighestPay(!showHighestPay);
            console.log('Toggle highest pay jobs:', !showHighestPay);
            // Notify parent component to apply filters
            if (onFilter && typeof onFilter === 'function') {
              setTimeout(() => onFilter(), 0);
            }
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
            // Notify parent component to apply filters
            if (onFilter && typeof onFilter === 'function') {
              setTimeout(() => onFilter(), 0);
            }
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
      
      {/* Full screen map */}
      <div className="h-full w-full">
        <EnhancedJobMap
          initialJobs={jobs.map(job => ({
            id: job.id.toString(),
            title: job.title,
            description: job.title, // Use title as description since description might not exist
            status: job.status,
            lat: job.lat,
            lng: job.lng,
            city: job.address?.split(',')[0] || '',
            state: job.address?.split(',')[1] || '',
            zipCode: job.address?.split(',')[2] || '',
            budgetMin: typeof job.price === 'string' ? parseInt(job.price.replace(/[^0-9]/g, '') || '0') : 0,
            createdAt: new Date().toISOString(),
            urgencyLevel: job.urgency === 'urgent' ? 'high' : job.urgency,
            isVerifiedPayment: job.status === 'accepted',
            isNeighborPosted: Math.random() > 0.5, // Mock data for now
            serviceCategory: {
              id: job.category || '',
              name: job.category || ''
            },
            customer: {
              id: typeof job.customer === 'string' ? job.customer : '',
              firstName: 'Customer',
              lastName: 'Name'
            }
          }))}
          initialCenter={{ lat: 37.7749, lng: -122.4194 }} // San Francisco
          initialZoom={12}
          height="100%"
          onJobSelected={(jobId) => {
            const job = jobs.find(j => j.id === jobId);
            if (job) handleJobSelect(job);
          }}
          categories={[]}
          showFilters={false} // Hide filters in mobile view
          selectedJobId={selectedJob?.id?.toString() || null}
          // Pass filter state to the map
          filters={{
            showUrgent,
            showVerifiedPay: showVerified,
            showNeighbors,
            minPayRate: showHighestPay ? 50 : 0, // Set minimum pay rate if highest pay filter is active
            maxDistance: 50,
            categories: showCategories ? ['all'] : [], // Pass 'all' if categories filter is active
            // Additional custom filters
            showAccepted,
            showSuggested,
            showNewest
          }}
        />
      </div>

      {/* Search and filter overlay */}
      <div className="absolute top-4 left-0 right-0 px-4 z-10">
        <div className="flex gap-2">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-md shadow-lg">
            <div className="flex items-center px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs or locations..."
                className="border-0 focus-visible:ring-0"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <Button 
            variant="default" 
            size="icon" 
            className="bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter dropdown */}
        {showFilters && (
          <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Filter Jobs</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Status</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">All</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">New</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">In Progress</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Completed</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Urgency</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">All</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">High</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Medium</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Low</Badge>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom drawer for job details */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl shadow-lg transition-transform duration-300 transform z-20 ${drawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        {/* Drawer handle */}
        <div 
          className="h-6 w-full flex justify-center items-center cursor-pointer"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        {/* Selected job details */}
        {selectedJob && (
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold">{selectedJob.title}</h2>
              <Badge className={getStatusColor(selectedJob.status)}>
                {selectedJob.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm">{selectedJob.address}</p>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <p className="text-sm">{selectedJob.time}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline" className={getUrgencyColor(selectedJob.urgency)}>
                  {selectedJob.urgency}
                </Badge>
                <span className="font-bold">{selectedJob.price}</span>
              </div>
              
              <div className="pt-2">
                <Button className="w-full">View Job Details</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for closing the drawer */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}
