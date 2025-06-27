"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, ExternalLink, Copy } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useToast } from '@/components/ui/use-toast';

interface ListingLocationProps {
  address: string;
  lat?: number;
  lng?: number;
  title?: string;
}

// Default Google Maps API key for demo purposes
// In production, always use environment variables instead of hardcoded values
const DEFAULT_API_KEY = 'AIzaSyAn3xgB_REOmDBofSgNJsDvTkHSUE3Vy1Y';

export function ListingLocation({ address, lat, lng, title }: ListingLocationProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || DEFAULT_API_KEY;
  const hasCoordinates = lat && lng;
  const { toast } = useToast();
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '350px',
    borderRadius: '0.5rem'
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
  
  // Handle map load
  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
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
        duration: 3000,
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
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            options={mapOptions}
            onLoad={handleMapLoad}
          >
            <Marker 
              position={center} 
              onClick={() => setIsInfoWindowOpen(!isInfoWindowOpen)}
            >
              {isInfoWindowOpen && (
                <InfoWindow 
                  position={center}
                  onCloseClick={() => setIsInfoWindowOpen(false)}
                >
                  <div className="p-1">
                    <p className="font-medium text-sm">{title || 'Listing Location'}</p>
                    <p className="text-xs text-gray-600">{address}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          </GoogleMap>
        </LoadScript>
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
          className="flex items-center justify-center gap-2"
          onClick={handleOpenInGoogleMaps}
        >
          <ExternalLink className="h-4 w-4" />
          View in Maps
        </Button>
      </div>
    </Card>
  );
}
