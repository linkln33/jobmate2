"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, MarkerClusterer, OverlayView } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertCircle, Clock, Tag, ExternalLink } from 'lucide-react';
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

// Use a working API key directly to ensure the map loads
const GOOGLE_MAPS_API_KEY = 'AIzaSyAn3xgB_REOmDBofSgNJsDvTkHSUE3Vy1Y';

export function MarketplaceMap({
  listings,
  onListingSelect,
  selectedListingId,
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
  
  // Handle map load with additional debugging
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMapLoaded(true);
    console.log('Google Maps loaded successfully');
    
    // Log map instance to verify it's properly initialized
    console.log('Map instance:', map);
    
    // Force a resize event after a short delay to fix rendering issues
    setTimeout(() => {
      console.log('Forcing map resize');
      window.dispatchEvent(new Event('resize'));
      map.setZoom(map.getZoom() || defaultZoom); // Trigger a re-render
    }, 500);
  }, [defaultZoom]);
  
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

  // Get marker color based on listing type
  const getMarkerColor = (listing: MarketplaceListing) => {
    switch(listing.type.toLowerCase()) {
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
  
  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    return 'Over a month ago';
  };

  // Use the useLoadScript hook with direct API key
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: useMemo(() => ['places'], [])
  });
  
  return (
    <div className="relative w-full h-full">
      {/* Show error state */}
      {loadError && (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-4">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <p className="text-lg font-medium text-red-500">Error loading maps</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please check your connection and try again</p>
          </div>
        </div>
      )}
      
      {/* Show loading state */}
      {!isLoaded && !loadError && (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-2"></div>
            <p>Loading map...</p>
          </div>
        </div>
      )}
      
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={defaultZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            fullscreenControl: true,
            streetViewControl: true,
            mapTypeControl: true,
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
                {listings.filter(listing => listing.lat && listing.lng).map((listing) => {
                  // Ensure coordinates are valid numbers
                  const lat = typeof listing.lat === 'string' ? parseFloat(listing.lat) : listing.lat;
                  const lng = typeof listing.lng === 'string' ? parseFloat(listing.lng) : listing.lng;
                  
                  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
                    console.warn(`Invalid coordinates for listing ${listing.id}:`, listing.lat, listing.lng);
                    return null;
                  }
                  
                  const isSelected = selectedListing && selectedListing.id === listing.id;
                  
                  return (
                    <div key={listing.id}>
                      {/* Use OverlayView for custom marker styling */}
                      <OverlayView
                        position={{ lat, lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={(width, height) => ({
                          x: -(width / 2),
                          y: -(height / 2)
                        })}
                      >
                        <div 
                          className={styles.pulseContainer} 
                          onClick={() => handleMarkerClick(listing)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div 
                            className={styles.pulseCircle} 
                            style={{ 
                              backgroundColor: getMarkerColor(listing),
                              transform: isSelected ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%)'
                            }} 
                          />
                          {isSelected && <div className={styles.pulseRing} style={{ borderColor: getMarkerColor(listing) }}></div>}
                          
                          {/* Type badge */}
                          <div className={`${styles.typeBadge} ${isSelected ? styles.typeBadgeSelected : ''}`}>
                            <span>{listing.type.charAt(0).toUpperCase()}</span>
                          </div>
                          
                          {/* Price bubble for selected or hovered items */}
                          {isSelected && (
                            <div className={`${styles.priceBubble} ${styles.popInAnimation}`}>
                              <span>${listing.price}{listing.priceUnit ? `/${listing.priceUnit}` : ''}</span>
                            </div>
                          )}
                        </div>
                      </OverlayView>
                      
                      {/* Animated pulse for new listings */}
                      {newListings.includes(listing.id) && (
                        <OverlayView
                          position={{ lat, lng }}
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
                  );
                })}
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
      )}
    </div>
  );
}
