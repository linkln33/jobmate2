"use client";

import { useState, useEffect } from 'react';
import { InteractiveJobMap } from '@/components/map/interactive-job-map';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Clock, X, ChevronUp, ChevronDown } from 'lucide-react';
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

  // Handle job selection
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
    if (onJobSelect) onJobSelect(job);
  };

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
      {/* Full screen map */}
      <div className="h-full w-full">
        <InteractiveJobMap
          jobs={jobs}
          onJobSelect={handleJobSelect}
          selectedJobId={selectedJob?.id}
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
