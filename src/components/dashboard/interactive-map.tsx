"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertCircle } from 'lucide-react';
import { GoogleMap } from '@/components/map/google-map';

interface Job {
  id: number;
  lat: number;
  lng: number;
  status: 'new' | 'accepted' | 'completed';
  title: string;
  urgency: 'low' | 'medium' | 'high';
}

interface InteractiveMapProps {
  jobs: Job[];
}

export function InteractiveMap({ jobs = [] }: InteractiveMapProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Convert jobs to Google Maps markers
  const mapMarkers = jobs.map(job => ({
    id: job.id.toString(),
    position: { lat: job.lat, lng: job.lng },
    title: job.title,
    status: job.status,
    urgency: job.urgency
  }));
  
  // Handle marker click
  const handleMarkerClick = (markerId: string) => {
    const job = jobs.find(job => job.id.toString() === markerId) || null;
    setSelectedJob(job);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-500';
      case 'accepted': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <CardContent className="p-0 relative h-full">
        {/* Real Google Map */}
        <GoogleMap 
          center={{ lat: 37.7749, lng: -122.4194 }} // Default center (San Francisco)
          zoom={12}
          markers={mapMarkers}
          onMarkerClick={handleMarkerClick}
          selectedMarkerId={selectedJob?.id.toString()}
        />
        
        {/* Selected Job Info */}
        {selectedJob && (
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-3 shadow-md z-20">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-sm">{selectedJob.title}</h4>
                <div className="flex gap-2 mt-1">
                  <Badge className={getStatusColor(selectedJob.status)}>
                    {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                  </Badge>
                  <Badge className={getUrgencyColor(selectedJob.urgency)}>
                    {selectedJob.urgency === 'high' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {selectedJob.urgency.charAt(0).toUpperCase() + selectedJob.urgency.slice(1)}
                  </Badge>
                </div>
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setSelectedJob(null)}
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 bg-white rounded-md shadow-md z-20">
          <div className="p-2 border-b cursor-pointer hover:bg-gray-100">+</div>
          <div className="p-2 cursor-pointer hover:bg-gray-100">-</div>
        </div>
        
        {/* Map legend */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 p-2 rounded-md shadow-md z-20 flex items-center gap-4">
          <div className="text-xs font-medium">Legend:</div>
          <div className="flex items-center text-xs">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            <span>New</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
            <span>Accepted</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-1"></span>
            <span>Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
