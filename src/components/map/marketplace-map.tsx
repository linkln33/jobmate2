"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer, OverlayView } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertCircle, Clock, Tag } from 'lucide-react';
import { MarketplaceListing } from '@/types/marketplace';
import { useRouter } from 'next/navigation';
import styles from './map-animations.module.css';

interface MarketplaceMapProps {
  listings: MarketplaceListing[];
  onListingSelect?: (listing: MarketplaceListing) => void;
  selectedListingId?: string | null;
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
const DEFAULT_API_KEY = 'AIzaSyAn3xgB_REOmDBofSgNJsDvTkHSUE3Vy1Y'; // This is a demo key that should work for development

export function MarketplaceMap({
  listings,
  onListingSelect,
  selectedListingId,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || DEFAULT_API_KEY,
  defaultCenter = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  defaultZoom = 12
}: MarketplaceMapProps) {
  const router = useRouter();
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [newListings, setNewListings] = useState<string[]>([]);
  const previousListingsRef = useRef<string[]>([]);
  
  // Detect new listings by comparing current listings with previous listings
  useEffect(() => {
    const currentListingIds = listings.map(listing => listing.id);
    const previousListingIds = previousListingsRef.current;
    
    // Find new listings (present in current but not in previous)
    const newlyAddedListings = currentListingIds.filter(id => !previousListingIds.includes(id));
    
    if (newlyAddedListings.length > 0) {
      setNewListings(newlyAddedListings);
      
      // Clear new listings after animation duration
      const timer = setTimeout(() => {
        setNewListings([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    // Update reference for next comparison
    previousListingsRef.current = currentListingIds;
  }, [listings]);
  
  // Update selected listing when selectedListingId changes
  useEffect(() => {
    if (selectedListingId) {
      const listing = listings.find(l => l.id === selectedListingId);
      if (listing && listing.lat && listing.lng) {
        setSelectedListing(listing);
        setCenter({ lat: listing.lat, lng: listing.lng });
      }
    }
  }, [selectedListingId, listings]);
  
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
  const handleMarkerClick = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    if (onListingSelect) onListingSelect(listing);
  };

  // Get marker icon based on listing type
  const getMarkerIcon = (listing: MarketplaceListing) => {
    // Determine color based on listing type
    let fillColor = '#9333ea'; // default purple
    let scale = 1.5;
    
    // If listing is selected, make it slightly larger
    if (selectedListing && selectedListing.id === listing.id) {
      scale = 1.8;
    }
    
    switch(listing.type) {
      case 'job': 
        fillColor = '#3b82f6'; // blue
        break; 
      case 'service': 
        fillColor = '#8b5cf6'; // purple
        break; 
      case 'item': 
        fillColor = '#10b981'; // green
        break; 
      case 'rental':
        fillColor = '#f59e0b'; // amber
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

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'job':
        return 'bg-blue-500 text-white';
      case 'service':
        return 'bg-purple-500 text-white';
      case 'item':
        return 'bg-green-500 text-white';
      case 'rental':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Format price with currency
  const formatPrice = (price: number, priceUnit?: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
    
    return priceUnit ? `${formattedPrice}/${priceUnit}` : formattedPrice;
  };

  // Handle view details click
  const handleViewDetails = (listing: MarketplaceListing) => {
    router.push(`/marketplace/listing/${listing.id}`);
  };

  return (
    <div className="relative w-full h-full">
      <LoadScript 
        googleMapsApiKey={apiKey} 
        loadingElement={<div className="h-full w-full flex items-center justify-center"><p>Loading map...</p></div>}
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
                {listings.filter(listing => listing.lat && listing.lng).map((listing) => (
                  <div key={listing.id}>
                    <Marker
                      position={{ lat: listing.lat!, lng: listing.lng! }}
                      onClick={() => handleMarkerClick(listing)}
                      icon={getMarkerIcon(listing)}
                      clusterer={clusterer}
                    />
                    
                    {/* Animated pulse for new listings */}
                    {newListings.includes(listing.id) && (
                      <OverlayView
                        position={{ lat: listing.lat!, lng: listing.lng! }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={(width, height) => ({
                          x: -(width / 2),
                          y: -(height / 2)
                        })}
                      >
                        <div className={styles.pulseContainer}>
                          <div className={styles.pulseRing}></div>
                          <div className={styles.pulseCircle}></div>
                          <div className={`${styles.newListingBadge} ${styles.popInAnimation}`}>
                            <span>New Listing!</span>
                          </div>
                        </div>
                      </OverlayView>
                    )}
                  </div>
                ))}
              </div>
            )}
          </MarkerClusterer>

          {/* Custom semi-transparent overlay for selected listing positioned at listing coordinates */}
          {selectedListing && selectedListing.lat && selectedListing.lng && map && (
            <OverlayView
              position={{ lat: selectedListing.lat, lng: selectedListing.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(width: number, height: number) => ({
                x: -(width / 2),
                y: -(height + 30) // Position above the marker
              })}
            >
              <div className="w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-10 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium text-sm">{selectedListing.title}</h3>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedListing(null)}>
                    <span className="sr-only">Close</span>
                    ✕
                  </Button>
                </div>
                
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex gap-2">
                    <Badge className={getTypeBadgeColor(selectedListing.type)}>
                      {selectedListing.type.charAt(0).toUpperCase() + selectedListing.type.slice(1)}
                    </Badge>
                    {selectedListing.isVerified && (
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  {selectedListing.address && (
                    <div>
                      <div className="flex items-center mb-1">
                        <MapPin className="h-3 w-3 text-blue-500 mr-1" />
                        <span className="text-xs">{selectedListing.address}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      {selectedListing.category && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {selectedListing.category}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-green-600">
                      {formatPrice(selectedListing.price, selectedListing.priceUnit)}
                    </span>
                  </div>
                  
                  {selectedListing.tags && selectedListing.tags.length > 0 && (
                    <div className="flex items-center text-xs gap-1 flex-wrap">
                      <Tag className="h-3 w-3 text-blue-500" />
                      {selectedListing.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="pt-2 flex gap-2">
                    <Button 
                      size="sm" 
                      className="w-full text-xs h-8"
                      onClick={() => handleViewDetails(selectedListing)}
                    >
                      View Details
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs h-8"
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedListing.lat},${selectedListing.lng}`, '_blank')}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Directions
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
