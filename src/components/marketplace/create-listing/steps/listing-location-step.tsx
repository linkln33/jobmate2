"use client";

import { useState, useCallback, useMemo } from "react";
import { MarketplaceListing } from "@/types/marketplace";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { GoogleMap, useLoadScript, Marker, OverlayView } from "@react-google-maps/api";
import styles from "@/components/map/map-animations.module.css";

interface ListingLocationStepProps {
  data: Partial<MarketplaceListing>;
  updateData: (data: Partial<MarketplaceListing>) => void;
  errors: Record<string, string>;
}

// Use a working API key directly to ensure the map loads
const GOOGLE_MAPS_API_KEY = 'AIzaSyAn3xgB_REOmDBofSgNJsDvTkHSUE3Vy1Y';

export function ListingLocationStep({ data, updateData, errors }: ListingLocationStepProps) {
  const [address, setAddress] = useState(data.address || "");
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Use the useLoadScript hook with direct API key
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: useMemo(() => ['places'], [])
  });
  
  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
  };
  
  // Center map on listing location or default to San Francisco
  const center = data.lat && data.lng 
    ? { lat: data.lat, lng: data.lng } 
    : { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  
  // Map options for styling
  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
  };
  
  // Handle map load
  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Location map loaded successfully');
    setMapLoaded(true);
    
    // Force a resize event after a short delay to fix rendering issues
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      map.setZoom(map.getZoom() || 14); // Trigger a re-render
    }, 500);
  }, []);
  
  // Handle map click to set marker position
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      // Get address from coordinates (reverse geocoding)
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const newAddress = results[0].formatted_address;
          setAddress(newAddress);
          updateData({ 
            lat, 
            lng, 
            address: newAddress 
          });
        } else {
          console.error("Geocoder failed due to: " + status);
          updateData({ 
            lat, 
            lng, 
            address: address || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}` 
          });
        }
      });
    }
  }, [address, updateData]);
  
  // Handle address search
  const handleAddressSearch = () => {
    if (!address.trim()) return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        updateData({ 
          lat: lat(), 
          lng: lng(), 
          address 
        });
      } else {
        console.error("Geocoder failed due to: " + status);
        alert("Could not find this address. Please try again or click on the map.");
      }
    });
  };
  
  // Get marker color based on listing type
  const getMarkerColor = () => {
    switch(data.type?.toLowerCase()) {
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
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Location Information</h2>
        <p className="text-muted-foreground mb-6">
          Specify where your {data.type || "listing"} is located
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="address">Address</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="Enter address, city, or postal code"
                className={`pl-9 ${errors.address ? "border-red-500" : ""}`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddressSearch();
                  }
                }}
              />
            </div>
            <Button 
              type="button" 
              variant="secondary"
              onClick={handleAddressSearch}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Enter an address or click directly on the map to set your location
          </p>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          {/* Show error state */}
          {loadError && (
            <div className="h-[400px] w-full flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-sm font-medium text-red-500">Error loading map. Please check your connection.</p>
              </div>
            </div>
          )}
          
          {/* Show loading state */}
          {!isLoaded && !loadError && (
            <div className="h-[400px] w-full flex items-center justify-center">
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
              zoom={14}
              options={mapOptions}
              onLoad={onLoad}
              onClick={handleMapClick}
            >
              {data.lat && data.lng && (
                <OverlayView
                  position={{ lat: data.lat, lng: data.lng }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  getPixelPositionOffset={(width, height) => ({
                    x: -(width / 2),
                    y: -(height / 2)
                  })}
                >
                  <div className={styles.pulseContainer}>
                    <div 
                      className={styles.pulseCircle} 
                      style={{ backgroundColor: getMarkerColor() }} 
                    />
                    <div 
                      className={styles.pulseRing} 
                      style={{ borderColor: getMarkerColor() }}
                    />
                    
                    {/* Type badge */}
                    <div className={styles.typeBadge}>
                      <span>{data.type?.charAt(0).toUpperCase() || 'I'}</span>
                    </div>
                  </div>
                </OverlayView>
              )}
            </GoogleMap>
          )}
        </div>
        
        {errors.location && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.location}</p>
        )}
        
        {/* Coordinates display */}
        {data.lat && data.lng && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Latitude: {data.lat.toFixed(6)}</span>
            <span>Longitude: {data.lng.toFixed(6)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
