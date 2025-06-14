"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertCircle, Clock } from 'lucide-react';

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

// Default Google Maps API key for demo purposes
// In production, always use environment variables instead of hardcoded values
const DEFAULT_API_KEY = 'AIzaSyAn3xgB_REOmDBofSgNJsDvTkHSUE3Vy1Y';

export function InteractiveJobMap({
  jobs,
  onJobSelect,
  selectedJobId,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || DEFAULT_API_KEY,
  defaultCenter = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  defaultZoom = 12
}: InteractiveJobMapProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  
  // Reference to track if component is mounted
  const isMounted = useRef(true);
  
  // Update selected job when selectedJobId changes
  useEffect(() => {
    if (selectedJobId) {
      const job = jobs.find(j => j.id.toString() === selectedJobId.toString());
      if (job) {
        setSelectedJob(job);
        // Center map on selected job
        setCenter({ lat: job.lat, lng: job.lng });
      }
    }
  }, [selectedJobId, jobs]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle map load
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Handle map unmount
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle marker click
  const handleMarkerClick = (job: Job) => {
    setSelectedJob(job);
    setCenter({ lat: job.lat, lng: job.lng });
    
    if (onJobSelect) {
      onJobSelect(job);
    }
  };

  // Get marker icon based on job status and urgency
  const getMarkerIcon = (job: Job) => {
    // Base SVG path for marker
    const getMarkerSvg = (fillColor: string, scale = 1.5) => {
      return {
        path: 'M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z',
        fillColor,
        fillOpacity: 1,
        strokeWeight: 1.5,
        strokeColor: '#ffffff',
        scale,
        anchor: new google.maps.Point(12, 22),
      };
    };

    // Determine color and size based on status and urgency
    let fillColor = '#9333ea'; // Default purple
    let scale = 1.5;
    
    // Status-based coloring
    switch(job.status.toLowerCase()) {
      case 'completed':
        fillColor = '#4ade80'; // Green for completed
        break;
      case 'in_progress':
        fillColor = '#3b82f6'; // Blue for in progress
        break;
      case 'accepted':
        fillColor = '#60a5fa'; // Light blue for accepted
        break;
      case 'new':
        // For new jobs, color is determined by urgency
        switch(job.urgency.toLowerCase()) {
          case 'high':
            fillColor = '#ef4444'; // Red for high urgency
            scale = 1.8; // Slightly larger for high urgency
            break;
          case 'medium':
            fillColor = '#f97316'; // Orange for medium urgency
            break;
          case 'low':
            fillColor = '#10b981'; // Teal for low urgency
            break;
          default:
            fillColor = '#9333ea'; // Default purple
        }
        break;
      default:
        fillColor = '#9333ea'; // Default purple
    }
    
    return getMarkerSvg(fillColor, scale);
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
    <LoadScript 
      googleMapsApiKey={apiKey} 
      loadingElement={
        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500 mb-4"></div>
            <p className="text-lg font-medium">Loading Google Maps...</p>
          </div>
        </div>
      }
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
                  animation={selectedJob?.id === job.id ? google.maps.Animation.BOUNCE : undefined}
                  clusterer={clusterer}
                />
              ))}
            </div>
          )}
        </MarkerClusterer>

        {/* Show info window for selected job */}
        {selectedJob && (
          <InfoWindow
            position={{ lat: selectedJob.lat, lng: selectedJob.lng }}
            onCloseClick={() => setSelectedJob(null)}
            options={{ pixelOffset: new google.maps.Size(0, -40) }}
          >
            <div className="p-2 max-w-xs">
              <h4 className="font-semibold text-lg mb-1">{selectedJob.title}</h4>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{selectedJob.address}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <Badge className={getStatusColor(selectedJob.status)}>
                  {selectedJob.status}
                </Badge>
                <Badge variant="outline" className={getUrgencyColor(selectedJob.urgency)}>
                  {selectedJob.urgency === 'high' && <AlertCircle className="h-3 w-3 mr-1" />}
                  {selectedJob.urgency}
                </Badge>
              </div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedJob.time}
                </div>
                <span className="font-medium">{selectedJob.price}</span>
              </div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onJobSelect) onJobSelect(selectedJob);
                }}
              >
                View Details
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
