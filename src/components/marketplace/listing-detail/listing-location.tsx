"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, ExternalLink, Copy, AlertCircle } from 'lucide-react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, OverlayView } from '@react-google-maps/api';
import { useToast } from '@/components/ui/use-toast';
import styles from '@/components/map/map-animations.module.css';

interface ListingLocationProps {
  address: string;
  lat?: number;
  lng?: number;
  title?: string;
  type?: string;
  price?: number;
  priceUnit?: string;
}

// Use a working API key directly to ensure the map loads
const GOOGLE_MAPS_API_KEY = 'AIzaSyAn3xgB_REOmDBofSgNJsDvTkHSUE3Vy1Y';

export function ListingLocation({ address, lat, lng, title, type = 'item', price, priceUnit }: ListingLocationProps) {
  const hasCoordinates = lat && lng;
  const { toast } = useToast();
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Use the useLoadScript hook with direct API key
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: useMemo(() => ['places'], [])
  });
  
  // Debug log for API key
  useEffect(() => {
    console.log('Google Maps API Key available:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    console.log('Map loading status:', isLoaded ? 'Loaded' : 'Loading...');
  }, [isLoaded]);
  
  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '350px',
    borderRadius: '0.5rem'
  };
  
  // Get marker color based on listing type
  const getMarkerColor = () => {
    switch(type?.toLowerCase()) {
      case 'job': 
        return '#3b82f6'; // blue
      case 'service': 
        return '#8b5cf6'; // purple
      case 'item': 
        return '#10b981'; // green
      case 'rental':
        return '#f59e0b'; // amber
      default: 
        return '#9333ea'; // Default purple
    }
  };
  
  // Center map on listing location or default to San Francisco
  const center = hasCoordinates 
    ? { lat, lng } 
    : { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  
  // Map options for styling
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };
  
  // Handle map load and unload with additional debugging
  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Listing location map loaded successfully');
    setMapLoaded(true);
    
    // Log map instance to verify it's properly initialized
    console.log('Listing location map instance:', map);
    
    // Force a resize event after a short delay to fix rendering issues
    setTimeout(() => {
      console.log('Forcing listing location map resize');
      window.dispatchEvent(new Event('resize'));
      map.setZoom(map.getZoom() || 15); // Trigger a re-render
    }, 500);
  }, []);
  
  const onUnmount = useCallback(() => {
    console.log('Map unmounted');
    setMapLoaded(false);
  }, []);
  
  // Open directions in Google Maps
  const handleGetDirections = () => {
    if (hasCoordinates) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
    }
  };
  
  // Open in Google Maps
  const handleOpenInGoogleMaps = () => {
    if (hasCoordinates) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps?q=${encodeURIComponent(address)}`, '_blank');
    }
  };
  
  // Copy address to clipboard
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address).then(() => {
      toast({
        title: "Address copied",
        description: "The address has been copied to your clipboard.",
        duration: 3000
      });
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Location</h2>
      
      <div className="flex items-start mb-4">
        <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-gray-700 dark:text-gray-300">{address}</p>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              onClick={handleCopyAddress}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-4 overflow-hidden rounded-lg border shadow-sm">
        {/* Show error state */}
        {loadError && (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-sm font-medium text-red-500">Error loading map. Please check your connection.</p>
            </div>
          </div>
        )}
        
        {/* Show loading state */}
        {!isLoaded && !loadError && (
          <div className="h-full w-full flex items-center justify-center" style={mapContainerStyle}>
            <div className="text-center">
              <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm">Loading map...</p>
            </div>
          </div>
        )}
        
        {/* Main map component */}
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            options={{
              ...mapOptions,
              // Ensure these options are explicitly set
              zoomControl: true,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true
            }}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Custom styled marker with bubble */}
            <OverlayView
              position={center}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(width, height) => ({
                x: -(width / 2),
                y: -(height / 2)
              })}
            >
              <div 
                className={styles.pulseContainer} 
                onClick={() => setIsInfoWindowOpen(!isInfoWindowOpen)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className={styles.pulseCircle} 
                  style={{ 
                    backgroundColor: getMarkerColor(),
                  }} 
                />
                <div className={styles.pulseRing} style={{ borderColor: getMarkerColor() }}></div>
                
                {/* Type badge */}
                <div className={styles.typeBadge}>
                  <span>{type?.charAt(0).toUpperCase() || 'I'}</span>
                </div>
                
                {/* Price bubble */}
                {price && (
                  <div className={`${styles.priceBubble} ${styles.popInAnimation}`}>
                    <span>${price}{priceUnit ? `/${priceUnit}` : ''}</span>
                  </div>
                )}
              </div>
            </OverlayView>
            
            {/* Info window */}
            {isInfoWindowOpen && (
              <InfoWindow 
                position={center}
                onCloseClick={() => setIsInfoWindowOpen(false)}
              >
                <div className="p-2">
                  <p className="font-medium text-sm">{title || 'Listing Location'}</p>
                  <p className="text-xs text-gray-600">{address}</p>
                  {price && (
                    <p className="text-xs font-medium text-green-600 mt-1">
                      ${price}{priceUnit ? `/${priceUnit}` : ''}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="default" 
          className="flex-1 flex items-center justify-center gap-2"
          onClick={handleGetDirections}
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 flex items-center justify-center gap-2"
          onClick={handleOpenInGoogleMaps}
        >
          <ExternalLink className="h-4 w-4" />
          View in Maps
        </Button>
      </div>
    </Card>
  );
}
