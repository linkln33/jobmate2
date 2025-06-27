"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceListings } from '@/data/marketplace-listings';
import { Button } from '@/components/ui/button';
import { Grid, Loader2 } from 'lucide-react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { MarketplaceSearch } from '@/components/marketplace/marketplace-search';
import { Job } from '@/types/job';
import { MarketplaceListing } from '@/types/marketplace';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

// Default Google Maps API key for demo purposes
const DEFAULT_API_KEY = 'AIzaSyAn3xgB_REOmDBofSgNJsDvTkHSUE3Vy1Y';

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Map options
const mapOptions = {
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
};

export default function MarketplaceMapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  // Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || DEFAULT_API_KEY,
    libraries: ['places']
  });

  // Filter listings based on search query and selected categories
  const filteredListings = useMemo(() => {
    return marketplaceListings.filter(listing => {
      // Filter by search query
      const matchesQuery = !searchQuery || 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by selected categories
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(listing.category);
      
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategories]);

  // Convert marketplace listings to job format for the interactive map
  const marketplaceListingsAsJobs = useMemo(() => {
    return filteredListings.map(listing => {
      // Convert marketplace listing to job format
      return {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        category: listing.category,
        lat: listing.lat || 0,
        lng: listing.lng || 0,
        status: 'new',
        urgency: 'medium',
        address: listing.address || '',
        time: '',
        customer: listing.sellerName || listing.user?.name || 'Unknown Seller'
      } as Job;
    });
  }, [filteredListings]);

  // Calculate map center based on listings
  const mapCenter = useMemo(() => {
    if (filteredListings.length === 0) {
      return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
    }
    
    // If a listing is selected, center on it
    if (selectedListing) {
      return { lat: selectedListing.lat || 0, lng: selectedListing.lng || 0 };
    }
    
    // Otherwise, calculate the average center of all listings
    const validListings = filteredListings.filter(listing => listing.lat && listing.lng);
    if (validListings.length === 0) {
      return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
    }
    
    const sumLat = validListings.reduce((sum, listing) => sum + (listing.lat || 0), 0);
    const sumLng = validListings.reduce((sum, listing) => sum + (listing.lng || 0), 0);
    
    return {
      lat: sumLat / validListings.length,
      lng: sumLng / validListings.length
    };
  }, [filteredListings, selectedListing]);

  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle marker click
  const handleMarkerClick = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setSelectedListingId(listing.id.toString());
  };

  // Handle info window close
  const handleInfoWindowClose = () => {
    setSelectedListing(null);
  };

  // Handle view listing details
  const handleViewListingDetails = (listingId: string) => {
    router.push(`/marketplace/listing/${listingId}`);
  };

  // Handle view grid button click
  const handleViewGrid = () => {
    router.push('/marketplace');
  };
  
  // Handle map load
  const onMapLoad = (map: google.maps.Map) => {
    console.log('Map loaded successfully');
    setMap(map);
  };
  
  // Handle map unmount
  const onMapUnmount = () => {
    console.log('Map unmounted');
    setMap(null);
  };
  
  // Render loading state
  if (!isLoaded) {
    return (
      <UnifiedDashboardLayout title="Marketplace Map" showMap={false}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Marketplace Map</h1>
            <Button
              variant="default"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={handleViewGrid}
            >
              <Grid className="h-4 w-4" />
              Grid View
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Loading map...</p>
            </div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }
  
  // Render error state
  if (loadError) {
    return (
      <UnifiedDashboardLayout title="Marketplace Map" showMap={false}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Marketplace Map</h1>
            <Button
              variant="default"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={handleViewGrid}
            >
              <Grid className="h-4 w-4" />
              Grid View
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-red-500">Error loading map. Please try again later.</p>
              <p className="text-sm text-gray-500 mt-2">{loadError.message}</p>
            </div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }
  
  return (
    <UnifiedDashboardLayout title="Marketplace Map" showMap={false}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Marketplace Map</h1>
          <Button
            variant="default"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={handleViewGrid}
          >
            <Grid className="h-4 w-4" />
            Grid View
          </Button>
        </div>
        
        <div className="mb-4">
          <MarketplaceSearch 
            onSearch={handleSearch} 
            selectedCategories={selectedCategories}
            onCategorySelect={handleCategorySelect}
          />
        </div>
        
        <div 
          className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden" 
          style={{ height: 'calc(100vh - 200px)', minHeight: '500px', width: '100%' }}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={12}
            options={mapOptions}
            onLoad={onMapLoad}
            onUnmount={onMapUnmount}
          >
            {filteredListings.map(listing => (
              <Marker
                key={listing.id}
                position={{ lat: listing.lat || 0, lng: listing.lng || 0 }}
                onClick={() => handleMarkerClick(listing)}
              />
            ))}
            
            {selectedListing && (
              <InfoWindow
                position={{ lat: selectedListing.lat || 0, lng: selectedListing.lng || 0 }}
                onCloseClick={handleInfoWindowClose}
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-medium text-base mb-1">{selectedListing.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedListing.price}</p>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{selectedListing.description}</p>
                  <Button 
                    size="sm" 
                    className="w-full text-xs" 
                    onClick={() => handleViewListingDetails(selectedListing.id)}
                  >
                    View Details
                  </Button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
