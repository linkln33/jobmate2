"use client";

import { useEffect, useRef, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

// Add this to fix TypeScript errors with window.google
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title?: string;
    status?: string;
    urgency?: string;
  }>;
  onMarkerClick?: (markerId: string) => void;
  selectedMarkerId?: string;
}

export function GoogleMap({
  center = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  zoom = 12,
  markers = [],
  onMarkerClick,
  selectedMarkerId
}: GoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markerElements = useRef<Map<string, HTMLElement>>(new Map());
  const mapElement = useRef<HTMLElement | null>(null);
  
  // Function to handle marker click
  const handleMarkerClick = (markerId: string) => {
    // Reset all markers
    markerElements.current.forEach((marker, id) => {
      if (id === markerId) {
        // Highlight the selected marker
        marker.style.zIndex = '100';
        marker.style.transform = 'scale(1.2)';
        marker.classList.add('selected-marker');
        marker.classList.add('pulse-animation');
      } else {
        // Reset other markers
        marker.style.zIndex = '1';
        marker.style.transform = 'scale(1)';
        marker.classList.remove('selected-marker');
        marker.classList.remove('pulse-animation');
      }
    });
    
    // Call the onMarkerClick callback if provided
    if (onMarkerClick && markerId) {
      onMarkerClick(markerId);
    }
  };
  
  // Function to get marker color based on status and urgency
  const getMarkerColor = (status: string, urgency: string): string => {
    // Status-based colors
    if (status === 'COMPLETED') return '#4ade80'; // green
    if (status === 'IN_PROGRESS') return '#3b82f6'; // blue
    if (urgency === 'HIGH') return '#ef4444'; // red
    if (urgency === 'MEDIUM') return '#f97316'; // orange
    
    // Default color
    return '#a855f7'; // purple
  };

  // Initialize the map using web components
  const initializeMap = () => {
    if (!mapContainerRef.current) {
      console.error("Map container not found");
      return;
    }

    try {
      // Clear any existing map elements
      while (mapContainerRef.current.firstChild) {
        mapContainerRef.current.removeChild(mapContainerRef.current.firstChild);
      }

      // Create the map element
      const mapEl = document.createElement('gmp-map');
      mapEl.setAttribute('center', `${center.lat},${center.lng}`);
      mapEl.setAttribute('zoom', zoom.toString());
      mapEl.setAttribute('map-id', 'DEMO_MAP_ID');
      mapEl.style.width = '100%';
      mapEl.style.height = '100%';
      
      // Store reference to map element
      mapElement.current = mapEl;
      
      // Add markers to the map
      markers.forEach(marker => {
        if (marker.id) {
          const markerEl = document.createElement('gmp-advanced-marker');
          markerEl.setAttribute('position', `${marker.position.lat},${marker.position.lng}`);
          markerEl.setAttribute('title', marker.title || 'Job');
          
          // Style the marker based on status and urgency
          const markerColor = getMarkerColor(marker.status || '', marker.urgency || '');
          markerEl.style.cursor = 'pointer';
          
          // Create a custom marker content
          const dotElement = document.createElement('div');
          dotElement.style.width = '20px';
          dotElement.style.height = '20px';
          dotElement.style.borderRadius = '50%';
          dotElement.style.backgroundColor = markerColor;
          dotElement.style.border = '2px solid white';
          dotElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          
          // Add the dot to the marker
          markerEl.appendChild(dotElement);
          
          // Add click handler
          markerEl.addEventListener('click', () => {
            if (marker.id) {
              handleMarkerClick(marker.id);
            }
          });
          
          // Store reference to marker element
          markerElements.current.set(marker.id, markerEl);
          
          // Add the marker to the map
          mapEl.appendChild(markerEl);
          
          // Highlight if this is the selected marker
          if (marker.id === selectedMarkerId) {
            handleMarkerClick(marker.id);
          }
        }
      });
      
      // Add the map to the container
      mapContainerRef.current.appendChild(mapEl);
      setLoading(false);
      
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize Google Maps. Please refresh the page.');
      setLoading(false);
    }
  };
  
  // Update markers when they change
  useEffect(() => {
    if (!mapElement.current) return;
    initializeMap();
  }, [markers, selectedMarkerId]);
  
  // Update map center and zoom when they change
  useEffect(() => {
    if (!mapElement.current) return;
    
    try {
      mapElement.current.setAttribute('center', `${center.lat},${center.lng}`);
      mapElement.current.setAttribute('zoom', zoom.toString());
    } catch (err) {
      console.error("Error updating map center/zoom:", err);
    }
  }, [center, zoom]);

  // Add CSS for marker animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .pulse-animation {
        animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      .selected-marker {
        z-index: 100;
        filter: drop-shadow(0 0 5px blue);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Load Google Maps script and initialize the map
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        console.log('Google Maps script already exists');
        initializeMap();
        return;
      }

      // Use the new API key provided by the user
      const apiKey = 'AIzaSyAn3xgB_REOmDBofSgNJsDvTkHSUE3Vy1Y';
      console.log('Loading Google Maps with API key');
      
      // Create script element with correct libraries
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=console.debug&libraries=maps,marker&v=beta`;
      script.async = true;
      script.defer = true;
      
      script.onerror = (e) => {
        console.error('Google Maps script failed to load:', e);
        setError("Failed to load Google Maps API. Please check your internet connection.");
        setLoading(false);
      };
      
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        // Initialize map immediately without delay
        initializeMap();
      };
      
      // Add the script to the document
      document.head.appendChild(script);
      console.log('Google Maps script added to head');
    };
    
    // Load the script
    loadGoogleMapsScript();

    // Clean up function
    return () => {
      // Clean up any resources
      mapElement.current = null;
      
      // Clear marker references
      markerElements.current.clear();
    };
  }, []);

  // Error state is handled in the main return statement
  return (
    <div className="h-full w-full relative rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 z-10">
          <Spinner />
          <span className="ml-2 text-sm font-medium">Loading map...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
          <div className="text-red-500 mb-2">⚠️ {error}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
            Failed to load Google Maps. Please check your internet connection and API key.
          </div>
        </div>
      )}
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}
