"use client";

import { useEffect, useState } from 'react';
import { GoogleMap } from '@/components/map/google-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Clock, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/main-layout';

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Plumbing Repair',
    status: 'PENDING',
    urgency: 'HIGH',
    address: '123 Main St, San Francisco, CA',
    price: '$120',
    scheduledTime: '2:00 PM Today',
    customer: 'John Doe',
    time: '2:00 PM Today',
    lat: 37.7749,
    lng: -122.4194
  },
  {
    id: '2',
    lat: 40.7282,
    lng: -73.9942,
    status: 'accepted' as const,
    title: 'Electrical wiring installation',
    address: '456 Park Ave, New York, NY',
    urgency: 'medium' as const,
    customer: 'Sarah Johnson',
    price: '$200',
    time: '10:00 AM Tomorrow'
  },
  {
    id: '3',
    lat: 40.7053,
    lng: -74.0140,
    status: 'completed' as const,
    title: 'HVAC maintenance',
    address: '789 Wall St, New York, NY',
    urgency: 'low' as const,
    customer: 'Robert Brown',
    price: '$150',
    time: 'Yesterday'
  },
  {
    id: 4,
    lat: 40.7225,
    lng: -73.9905,
    status: 'new' as const,
    title: 'Furniture assembly',
    address: '321 Lexington Ave, New York, NY',
    urgency: 'high' as const,
    customer: 'Emily Davis',
    price: '$85',
    time: '4:00 PM Today'
  },
  {
    id: '5',
    lat: 40.7195,
    lng: -74.0089,
    status: 'accepted' as const,
    title: 'Painting service',
    address: '654 Hudson St, New York, NY',
    urgency: 'medium' as const,
    customer: 'Michael Wilson',
    price: '$300',
    time: '11:30 AM Tomorrow'
  }
];

// Define job type based on mockJobs structure
type Job = typeof mockJobs[0];

export function MapViewPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [jobs, setJobs] = useState(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

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
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.address.toLowerCase().includes(query)
      );
      setFilteredJobs(filtered);
    }
  };

  // Filter jobs by search query and tab
  useEffect(() => {
    let filtered = [...jobs];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.address.toLowerCase().includes(query)
      );
    }
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(job => job.status.toLowerCase() === activeTab);
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchQuery, activeTab]);

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
      <div className="p-6 bg-gray-50 dark:bg-gray-900">
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
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Map and Job List */}
        <div className="flex h-[calc(100vh-220px)]">
          {/* Job List */}
          <div className="w-1/3 pr-4 overflow-y-auto">
            <div className="space-y-3">
              {filteredJobs.map(job => (
                <div 
                  key={job.id} 
                  className={`cursor-pointer transition-all ${selectedJob?.id === job.id ? 'ring-2 ring-brand-500' : ''}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="p-4 border border-gray-200 rounded-md hover:border-brand-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate">{job.title}</h3>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{job.address}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className={getUrgencyColor(job.urgency)}>
                        {job.urgency === 'high' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {job.urgency}
                      </Badge>
                      <span className="text-sm font-medium">{job.price}</span>
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
          
          {/* Map Area */}
          <div className="w-2/3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
            {mapLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner className="h-12 w-12 text-brand-500" />
              </div>
            ) : (
              <GoogleMap
                center={{ lat: 37.7749, lng: -122.4194 }} // San Francisco center
                zoom={12}
                markers={filteredJobs.map(job => ({
                  id: job.id.toString(),
                  position: { lat: job.lat, lng: job.lng },
                  title: job.title,
                  status: job.status,
                  urgency: job.urgency
                }))}
                onMarkerClick={(markerId) => {
                  const job = filteredJobs.find(j => j.id.toString() === markerId);
                  if (job) setSelectedJob(job);
                }}
                selectedMarkerId={selectedJob?.id.toString()}
              />
            )}
          </div>
        </div>
        
        {/* Selected Job Details - Right Sidebar */}
        {selectedJob && (
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto z-30 border-l border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Job Details</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)}>
                  <span className="sr-only">Close</span>
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium">{selectedJob.title}</h3>
                <div className="flex gap-2 mt-2">
                  <Badge className={getStatusColor(selectedJob.status)}>
                    {selectedJob.status}
                  </Badge>
                  <Badge className={getUrgencyColor(selectedJob.urgency)}>
                    {selectedJob.urgency}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="font-medium">{selectedJob.address}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Customer</p>
                  <p className="font-medium">{selectedJob.customer}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="font-medium text-green-600">{selectedJob.price}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Scheduled Time</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    <p className="font-medium">{selectedJob.time}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                
                <Button variant="outline" className="w-full">
                  Contact Customer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
