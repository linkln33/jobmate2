"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer, OverlayView } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertCircle, Clock } from 'lucide-react';
import { getJobIconName } from '@/utils/category-icons';

import { Job } from '@/types/job';

interface InteractiveJobMapProps {
  jobs: Job[];
  onJobSelect?: (job: Job) => void;
  selectedJobId?: string | number | null;
  apiKey?: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

// Default map styles
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// In production, always use environment variables instead of hardcoded values
// This is a placeholder API key that will be replaced during deployment
const DEFAULT_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export function InteractiveJobMap({
  jobs,
  onJobSelect,
  selectedJobId,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || DEFAULT_API_KEY,
  defaultCenter = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  defaultZoom = 12
}: InteractiveJobMapProps) {
  // Check if API key is available
  const hasValidApiKey = apiKey && apiKey.length > 0;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Reference to track if component is mounted
  const isMounted = useRef(true);
  
  // Update selected job when selectedJobId changes
  useEffect(() => {
    if (selectedJobId) {
      const job = jobs.find(j => j.id.toString() === selectedJobId.toString());
      if (job) {
        setSelectedJob(job);
        setCenter({ lat: job.lat, lng: job.lng });
      }
    }
  }, [selectedJobId, jobs]);
  
  // Clean up on unmount
  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
      // Clean up Google Maps instances
      if (map && typeof google !== 'undefined') {
        // Remove event listeners and clean up
        google.maps.event.clearInstanceListeners(map);
      }
    };
  }, [map]);

  // Handle map load
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMapLoaded(true);
    console.log('Google Maps loaded successfully');
  }, []);

  // Handle map unmount
  const onUnmount = useCallback(() => {
    if (map && typeof google !== 'undefined') {
      google.maps.event.clearInstanceListeners(map);
    }
    setMap(null);
    setMapLoaded(false);
    console.log('Google Maps unmounted');
  }, [map]);

  // Handle marker click
  const handleMarkerClick = (job: Job) => {
    setSelectedJob(job);
    if (onJobSelect) onJobSelect(job);
  };

  // Get marker icon based on job status, urgency, and category
  const getMarkerIcon = (job: Job) => {
    // Determine color based on status and urgency
    let fillColor = '#9333ea'; // default purple
    let scale = 1.5;
    
    // If job is selected, make it slightly larger
    if (selectedJob && selectedJob.id === job.id) {
      scale = 1.8;
    }
    
    switch(job.status.toLowerCase()) {
      case 'completed': 
        fillColor = '#4ade80'; // green
        break; 
      case 'in_progress': 
        fillColor = '#3b82f6'; // blue
        break; 
      case 'accepted': 
        fillColor = '#60a5fa'; // light blue
        break; 
      case 'new':
        switch(job.urgency.toLowerCase()) {
          case 'high': 
            fillColor = '#ef4444'; // red
            break;
          case 'medium': 
            fillColor = '#f97316'; // orange
            break;
          case 'low': 
            fillColor = '#10b981'; // teal
            break;
          default: 
            fillColor = '#9333ea'; // purple default
        }
        break;
      default: 
        fillColor = '#9333ea'; // Default purple
    }
    
    // Create a simple colored SVG for the marker
    const encodedSvg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
        <path fill="${fillColor}" stroke="white" stroke-width="1" d="M12,0C7.6,0,3,3.4,3,9c0,5.3,8,13.4,8.3,13.7c0.6,0.6,1.7,0.6,2.3,0c0.4-0.4,8.3-8.4,8.3-13.7C22,3.4,16.4,0,12,0z M12,12 c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S13.7,12,12,12z"/>
      </svg>
    `);
    
    return `data:image/svg+xml;charset=UTF-8,${encodedSvg}`;
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

  if (!hasValidApiKey) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h3 className="text-xl font-semibold mb-2">Map Unavailable</h3>
          <p className="text-gray-600 mb-4">
            The map cannot be displayed because a valid Google Maps API key is not configured.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              For development or production use, please add your Google Maps API key to the environment variables:
            </p>
            <div className="bg-gray-100 p-2 rounded text-sm font-mono text-left">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
            </div>
          </div>
          
          {jobs.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-2 text-left">Available Jobs ({jobs.length})</h4>
              <div className="max-h-96 overflow-y-auto">
                {jobs.map(job => (
                  <div 
                    key={job.id} 
                    className={`p-3 mb-2 rounded-md cursor-pointer ${job.id === selectedJobId ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                    onClick={() => onJobSelect && onJobSelect(job)}
                  >
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-gray-600">{job.address}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{job.status}</span>
                      <span className="text-sm font-medium">{job.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <LoadScript 
        googleMapsApiKey={apiKey} 
        loadingElement={<div className="h-full w-full" />}
        onLoad={() => console.log('Script loaded successfully')}
        onError={(error) => console.error('Error loading Google Maps script:', error)}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={defaultZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          }}
        >
          {/* Cluster markers when they are close together */}
          <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
            {(clusterer) => (
              <div>
                {jobs.map((job) => (
                  <Marker
                    key={job.id}
                    position={{ lat: job.lat, lng: job.lng }}
                    onClick={() => handleMarkerClick(job)}
                    icon={getMarkerIcon(job)}
                    clusterer={clusterer}
                  />
                ))}
              </div>
            )}
          </MarkerClusterer>

          {/* Custom semi-transparent overlay for selected job positioned at job coordinates */}
          {selectedJob && map && (
            <OverlayView
              position={{ lat: selectedJob.lat, lng: selectedJob.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(width: number, height: number) => ({
                x: -(width / 2),
                y: -(height + 30) // Position above the marker
              })}
            >
              <div className="w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-10 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium text-sm">{selectedJob.title}</h3>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedJob(null)}>
                    <span className="sr-only">Close</span>
                    ✕
                  </Button>
                </div>
                
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedJob.status)}>
                      {selectedJob.status}
                    </Badge>
                    <Badge className={getUrgencyColor(selectedJob.urgency)}>
                      {selectedJob.urgency === 'high' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {selectedJob.urgency}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <MapPin className="h-3 w-3 text-blue-500 mr-1" />
                      <span className="text-xs">{selectedJob.address}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      {selectedJob.category && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {selectedJob.category.replace(/-/g, ' ')}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-green-600">{selectedJob.price}</span>
                  </div>
                  
                  <div className="flex items-center text-xs">
                    <Clock className="h-3 w-3 text-blue-500 mr-1" />
                    <span>{selectedJob.time}</span>
                  </div>
                  
                  <div className="pt-2 flex gap-2">
                    <Button size="sm" className="w-full text-xs h-8">
                      <MapPin className="h-3 w-3 mr-1" />
                      Get Directions
                    </Button>
                    
                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                      Contact Customer
                    </Button>
                  </div>
                </div>
              </div>
            </OverlayView>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
