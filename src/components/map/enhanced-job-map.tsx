"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleMap, useLoadScript, InfoWindow, Marker, OverlayView } from '@react-google-maps/api';
import styles from './map-animations.module.css';
import { MapFilters } from './map-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Flame, CheckCircle2, Users, MapPin, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';

// Define job type
export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  lat: number;
  lng: number;
  city: string;
  state?: string;
  zipCode: string;
  budgetMin?: number;
  budgetMax?: number;
  createdAt: string;
  urgencyLevel?: string;
  isVerifiedPayment: boolean;
  isNeighborPosted: boolean;
  serviceCategory: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Define the internal filter state type
interface FilterState {
  showUrgent: boolean;
  showVerifiedPay: boolean;
  showNeighbors: boolean;
  minPayRate: number;
  maxDistance: number;
  categories: string[];
  // Additional custom filters
  showAccepted?: boolean;
  showSuggested?: boolean;
  showNewest?: boolean;
}

interface EnhancedJobMapProps {
  initialJobs: Job[];
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  height?: string;
  onJobSelected?: (jobId: string) => void;
  categories: Array<{ id: string; name: string }>;
  showFilters?: boolean;
  selectedJobId?: string | null;
  filters?: FilterState;
}

// Define libraries as a constant to prevent reloading
const libraries: any[] = ['places'];

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
const defaultZoom = 12;

// Default map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

export function EnhancedJobMap({
  initialJobs = [],
  initialCenter = defaultCenter,
  initialZoom = defaultZoom,
  height = '600px',
  onJobSelected,
  categories = [],
  showFilters = true,
  selectedJobId = null,
  filters: externalFilters
}: EnhancedJobMapProps) {
  // Load Google Maps with environment variable or fallback to a temporary key
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAn3xgB_REOmDBofSgNJsDvTkHSUE3Vy1Y', // Use the key from .env.local
    libraries,
  });
  
  // Debug log for API key
  useEffect(() => {
    console.log('Google Maps API Key available:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  }, []);

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      console.log('EnhancedJobMap - Mobile check:', window.innerWidth < 768, 'Width:', window.innerWidth);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // State
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [filters, setFilters] = useState<FilterState>({
    showUrgent: false,
    showVerifiedPay: false,
    showNeighbors: false,
    minPayRate: 0,
    maxDistance: 50,
    categories: [] as string[],
    showAccepted: false,
    showSuggested: false,
    showNewest: false
  });
  
  // Use external filters if provided
  useEffect(() => {
    if (externalFilters) {
      console.log('Using external filters:', externalFilters);
      setFilters(externalFilters);
    }
  }, [externalFilters]);

  // Map reference
  const mapRef = useRef<google.maps.Map | null>(null);

  // Update jobs when initialJobs change
  useEffect(() => {
    setJobs(initialJobs);
    console.log('Initial jobs updated:', initialJobs.length);
  }, [initialJobs]);

  // Debug log for filters
  useEffect(() => {
    console.log('Current filters:', filters);
  }, [filters]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);
  
  // This function has been moved to the main onMapLoad function below

  // Filter jobs based on selected filters
  const filteredJobs = useMemo(() => {
    console.log('Jobs before filtering:', jobs.length, jobs);
    
    // Check if any filters are active
    const anyFilterActive = filters.showUrgent || 
                           filters.showVerifiedPay || 
                           filters.showNeighbors || 
                           filters.minPayRate > 0 || 
                           (filters.maxDistance < 100 && userLocation) || 
                           filters.categories.length > 0 ||
                           (filters.showAccepted === true || 
                            filters.showSuggested === true || 
                            filters.showNewest === true);
    
    if (!anyFilterActive) {
      console.log('No filters active, returning all jobs');
      return jobs;
    }
    
    // Apply filters to include matching jobs
    let filtered = jobs;
    
    // Apply urgent filter
    if (filters.showUrgent) {
      filtered = filtered.filter(job => 
        job.urgencyLevel === 'high' || job.urgencyLevel === 'urgent' || job.urgencyLevel === 'emergency'
      );
    }

    // Apply verified payment filter
    if (filters.showVerifiedPay) {
      filtered = filtered.filter(job => job.isVerifiedPayment);
    }
    
    // Apply neighbors filter
    if (filters.showNeighbors) {
      filtered = filtered.filter(job => job.isNeighborPosted);
    }
    
    // Apply minimum pay rate filter
    if (filters.minPayRate > 0) {
      filtered = filtered.filter(job => job.budgetMin && job.budgetMin >= filters.minPayRate);
    }
    
    // Apply distance filter if user location is available
    if (filters.maxDistance < 100 && userLocation) {
      filtered = filtered.filter(job => {
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          job.lat, 
          job.lng
        );
        return distance <= filters.maxDistance;
      });
    }
    
    // Apply category filter
    if (filters.categories.length > 0 && !filters.categories.includes('all')) {
      filtered = filtered.filter(job => filters.categories.includes(job.serviceCategory.id));
    }
    
    // Apply additional custom filters if they exist
    if (filters.showAccepted) {
      filtered = filtered.filter(job => job.status === 'accepted');
    }
    
    if (filters.showSuggested) {
      // Mock implementation for suggested jobs
      filtered = filtered.filter(job => job.isNeighborPosted && job.budgetMin && job.budgetMin > 30);
    }
    
    if (filters.showNewest) {
      // Sort by creation date (newest first)
      filtered = [...filtered].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      // Take only the newest 5 jobs
      filtered = filtered.slice(0, 5);
    }
    
    console.log('Jobs after filtering:', filtered.length);
    return filtered.length > 0 ? filtered : jobs; // Fallback to all jobs if filters exclude everything
  }, [jobs, filters, userLocation]);

  // Calculate distance between two points using Haversine formula
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // Handle map load
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapInitialized(true);
    console.log('Map loaded successfully', map);

    // Only center on jobs if we have jobs and map isn't already initialized
    if (jobs.length > 0 && !mapInitialized) {
      try {
        const bounds = new google.maps.LatLngBounds();
        
        // Add all job positions to bounds
        jobs.forEach(job => {
          bounds.extend(new google.maps.LatLng(job.lat, job.lng));
        });
        
        // Fit the map to the bounds
        map.fitBounds(bounds);
        
        // If bounds are too small, set a reasonable zoom level
        if (map.getZoom() && map.getZoom()! > 15) {
          map.setZoom(13);
        }
        
        setMapInitialized(true);
      } catch (error) {
        console.error('Error setting map bounds:', error);
        // Fallback to default center
        setCenter(initialCenter);
      }
    }
  };

  // Handle marker click
  const handleMarkerClick = (job: Job) => {
    setIsLoading(true);
    setSelectedJob(job);
    if (onJobSelected) onJobSelected(job.id);
    if (mapRef.current) {
      setCenter({ lat: job.lat, lng: job.lng });
      setZoom(15);
      
      // Scroll the map into view if needed
      const map = document.getElementById('map');
      if (map) {
        map.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      
      // Hide loading indicator after animation completes
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  // Handle external job selection (from sidebar)
  useEffect(() => {
    // If a job is selected via selectedJobId prop, find and center on it
    if (selectedJobId) {
      const job = jobs.find(j => j.id === selectedJobId);
      if (job && mapRef.current) {
        setIsLoading(true);
        setCenter({ lat: job.lat, lng: job.lng });
        setZoom(15);
        // Also update the selected job state
        setSelectedJob(job);
        
        // Hide loading indicator after a short delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    }
  }, [selectedJobId, jobs]);
  
  // Handle internal job selection (from map markers)
  useEffect(() => {
    // If a job is selected and it's in our job list, center on it
    if (selectedJob) {
      const job = jobs.find(j => j.id === selectedJob.id);
      if (job && mapRef.current) {
        setIsLoading(true);
        setCenter({ lat: job.lat, lng: job.lng });
        setZoom(15);
        
        // Hide loading indicator after a short delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    }
  }, [selectedJob, jobs]);

  // Handle info window close
  const handleInfoWindowClose = () => {
    setSelectedJob(null);
  };

  // Get marker icon based on job properties
  const getMarkerIcon = (job: Job) => {
    // Default marker settings
    const settings = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#4F46E5', // Default color
      fillOpacity: 1,
      scale: 10,
      strokeColor: '#ffffff',
      strokeWeight: 2,
    };
    
    // Change color based on job status
    if (job.status === 'completed') {
      settings.fillColor = '#10B981'; // Green for completed
    } else if (job.status === 'in_progress') {
      settings.fillColor = '#F59E0B'; // Yellow for in progress
    } else if (job.status === 'cancelled') {
      settings.fillColor = '#EF4444'; // Red for cancelled
    } else if (job.urgencyLevel === 'high') {
      settings.fillColor = '#DC2626'; // Red for high urgency
      settings.scale = 12; // Larger for high urgency
    }
    
    // Make selected job marker larger and with a different stroke
    if (selectedJobId === job.id) {
      settings.scale = 14;
      settings.strokeColor = '#000000';
      settings.strokeWeight = 3;
    }
    
    return settings;
  };
  
  // Determine which animation to use for a job marker
  const getMarkerAnimation = (job: Job): google.maps.Animation | undefined => {
    if (selectedJobId === job.id) {
      return google.maps.Animation.BOUNCE;
    }
    return undefined;
  };
  
  // Custom component for pulsing marker
  const PulsingMarker = ({ position, color }: { position: google.maps.LatLng | google.maps.LatLngLiteral, color: string }) => {
    console.log('Rendering PulsingMarker at position:', position, 'with color:', color);
    
    // Add inline styles as a fallback with proper TypeScript types
    const pulseContainerStyle: React.CSSProperties = {
      position: 'relative' as const,
      width: '30px',
      height: '30px',
      zIndex: 999
    };
    
    const pulseCircleStyle: React.CSSProperties = {
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1001,
      backgroundColor: color,
      boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
    };
    
    const pulseRingStyle: React.CSSProperties = {
      position: 'absolute' as const,
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: `3px solid ${color}`,
      opacity: 1,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      animation: 'pulseAnimation 1.5s infinite',
      zIndex: 1000
    };
    
    return (
      <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={(width, height) => ({
          x: -(width / 2),
          y: -(height / 2)
        })}
      >
        <div style={pulseContainerStyle}>
          <div style={pulseCircleStyle} />
          <div style={pulseRingStyle} />
          <style jsx>{`
            @keyframes pulseAnimation {
              0% {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 1;
              }
              70% {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
              }
              100% {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      </OverlayView>
    );
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: typeof filters) => {
    // Reset filters if they would result in no visible jobs
    const wouldFilterAllJobs = jobs.every(job => {
      if (newFilters.showUrgent && job.urgencyLevel !== 'high' && job.urgencyLevel !== 'emergency') return true;
      if (newFilters.showVerifiedPay && !job.isVerifiedPayment) return true;
      if (newFilters.showNeighbors && !job.isNeighborPosted) return true;
      return false;
    });
    
    if (wouldFilterAllJobs) {
      console.log('Preventing all jobs from being filtered out');
      // Only apply non-destructive filters
      setFilters({
        ...newFilters,
        showUrgent: false,
        showVerifiedPay: false,
        showNeighbors: false
      });
    } else {
      setFilters(newFilters);
    }
    
    // Re-center map on filtered jobs after filter changes
    if (mapRef.current) {
      setTimeout(() => {
        if (filteredJobs.length > 0) {
          centerOnAllJobs();
        }
      }, 100);
    }
  };

  // Center map on user location
  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      setIsLoading(true);
      mapRef.current.panTo(userLocation);
      setZoom(14);
      
      // Hide loading indicator after a short delay
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };
  
  // Center map on all jobs
  const centerOnAllJobs = () => {
    if (mapRef.current && jobs.length > 0) {
      setIsLoading(true);
      
      try {
        const bounds = new google.maps.LatLngBounds();
        
        // Add all job positions to bounds
        jobs.forEach(job => {
          bounds.extend(new google.maps.LatLng(job.lat, job.lng));
        });
        
        // Fit the map to the bounds
        mapRef.current.fitBounds(bounds);
        
        // If bounds are too small, set a reasonable zoom level
        if (mapRef.current.getZoom() && mapRef.current.getZoom()! > 15) {
          mapRef.current.setZoom(13);
        }
        
        // Hide loading indicator after a short delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error setting map bounds:', error);
        // Fallback to default center
        setCenter(initialCenter);
        setIsLoading(false);
      }
    }
  };

  // Render loading state
  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className={`w-full`} style={{ height }} />
      </div>
    );
  }

  // Render error state
  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <div style={{ position: 'relative', height }}>
      <div style={{ height: '100%', position: 'relative' }}>
        {/* Loading Indicator */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              border: '3px solid rgba(0, 0, 0, 0.1)',
              borderTop: '3px solid #4F46E5',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
        {/* Map Control Buttons */}
        <div style={{ 
          position: 'absolute', 
          bottom: '120px', 
          right: '10px', 
          zIndex: 10, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px'
        }}>
          {/* Center on all jobs */}
          <button 
            onClick={centerOnAllJobs}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
            title="Center on all jobs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </button>
          
          {/* Center on my location */}
          <button 
            onClick={centerOnUser}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
            title="Center on my location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <circle cx="12" cy="12" r="8"></circle>
            </svg>
          </button>
          
          {/* Map/Satellite toggle */}
          <button 
            onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
            title={mapType === 'roadmap' ? 'Switch to Satellite View' : 'Switch to Map View'}
          >
            {mapType === 'roadmap' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
              </svg>
            )}
          </button>
          
          {/* Street View control removed - using Google's default draggable pegman */}
        </div>
        

        
        <GoogleMap
          mapContainerStyle={{ ...mapContainerStyle, height }}
          center={center}
          zoom={zoom}
          onLoad={onMapLoad}
          options={{ 
            disableDefaultUI: true,
            streetViewControl: true, 
            mapTypeControl: false, 
            fullscreenControl: false,
            zoomControl: false,
            mapTypeId: mapType,
            streetViewControlOptions: {
              position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
          }}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: '#4F46E5',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
            />
          )}

          {/* Job markers */}
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job: Job) => (
              <React.Fragment key={job.id}>
                {/* Regular marker */}
                <Marker
                  position={{ lat: job.lat, lng: job.lng }}
                  onClick={() => handleMarkerClick(job)}
                  icon={getMarkerIcon(job)}
                  animation={getMarkerAnimation(job)}
                />
                
                {/* Pulsing overlay for urgent jobs */}
                {(job.urgencyLevel === 'high' || job.urgencyLevel === 'urgent') && selectedJobId !== job.id && (
                  <PulsingMarker 
                    position={{ lat: job.lat, lng: job.lng }}
                    color="#DC2626" // Red color for urgent jobs
                  />
                )}
                {/* Log marker rendering */}
                {(() => { console.log('Rendered marker for job:', job.id, job.title, job.urgencyLevel); return null; })()}
              </React.Fragment>
            ))
          ) : (
            <div>
              {(() => { console.log('No jobs to display on map'); return null; })()}
              No jobs available
            </div>
          )}

          {/* Info window for selected job */}
          {selectedJob && (
            <InfoWindow
              position={{ lat: selectedJob.lat, lng: selectedJob.lng }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-3 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  {selectedJob.urgencyLevel === 'high' && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Hot</span>
                  )}
                  {selectedJob.isVerifiedPayment && (
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Verified</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{selectedJob.title}</h3>
                <p className="text-gray-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {selectedJob.city}, {selectedJob.state}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-600 font-medium">${selectedJob.budgetMin}</span>
                  <span className="text-gray-500 text-sm">{selectedJob.serviceCategory.name}</span>
                </div>
                <p className="text-gray-700 text-sm mb-3">{selectedJob.description}</p>
                <div className="flex gap-2">
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex-1 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://maps.google.com/maps?q=${selectedJob.lat},${selectedJob.lng}`, '_blank');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Directions
                  </button>
                  <button 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm flex-1 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      // This would be connected to the contact customer functionality
                      alert(`Contact ${selectedJob.customer.firstName} about this job`);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Contact
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Center on user button removed - now using the custom button in the left panel */}

        {/* Job count */}
        <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200 text-sm font-medium">
          {filteredJobs.length} jobs found
        </div>
      </div>
    </div>
  );
}
