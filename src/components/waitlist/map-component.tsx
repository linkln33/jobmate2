/**
 * @file Map component for interactive location display
 * @module components/waitlist/map-component
 * 
 * This component renders an interactive map using Leaflet with markers for listings.
 */

"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2 } from 'lucide-react';

// Fix Leaflet marker icon issue in Next.js
const fixLeafletIcon = () => {
  // Only run on client side
  if (typeof window === 'undefined') return;

  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/map/marker-icon-2x.png',
    iconUrl: '/images/map/marker-icon.png',
    shadowUrl: '/images/map/marker-shadow.png',
  });
};

/**
 * Props for the MapComponent
 */
interface MapComponentProps {
  /**
   * Array of listings to display on the map
   */
  listings: Array<{
    id: string;
    title: string;
    coordinates: [number, number]; // [lat, lng]
    type: string;
  }>;
  
  /**
   * Currently selected listing
   */
  selectedListing: any | null;
  
  /**
   * Callback when a listing is selected
   */
  onSelectListing: (listing: any) => void;
  
  /**
   * Callback when the map is loaded
   */
  onMapLoaded?: () => void;
}

/**
 * Interactive map component using Leaflet
 */
export default function MapComponent({ 
  listings, 
  selectedListing, 
  onSelectListing,
  onMapLoaded
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{[key: string]: L.Marker}>({});
  
  // Initialize map on component mount
  useEffect(() => {
    fixLeafletIcon();
    
    // Create map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [37.7749, -122.4194], // Default center (San Francisco)
        zoom: 2,
        zoomControl: true,
        attributionControl: true
      });
      
      // Add tile layer (map style)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      // Notify when map is ready
      if (onMapLoaded) {
        onMapLoaded();
      }
    }
    
    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onMapLoaded]);
  
  // Add markers for listings
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    markersRef.current = {};
    
    // Add new markers
    listings.forEach(listing => {
      // Create marker with custom icon based on listing type
      const marker = L.marker(listing.coordinates, {
        icon: getMarkerIcon(listing.type),
        title: listing.title
      }).addTo(mapRef.current!);
      
      // Add click handler
      marker.on('click', () => {
        onSelectListing(listing);
      });
      
      // Store reference to marker
      markersRef.current[listing.id] = marker;
    });
    
    // Fit bounds to show all markers if we have listings
    if (listings.length > 0) {
      const bounds = L.latLngBounds(listings.map(l => L.latLng(l.coordinates)));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [listings, onSelectListing]);
  
  // Update selected marker
  useEffect(() => {
    // Reset all markers to default style
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const listing = listings.find(l => l.id === id);
      if (listing) {
        marker.setIcon(getMarkerIcon(listing.type));
      }
    });
    
    // Highlight selected marker
    if (selectedListing && markersRef.current[selectedListing.id]) {
      markersRef.current[selectedListing.id].setIcon(
        getMarkerIcon(selectedListing.type, true)
      );
      
      // Pan to selected marker
      mapRef.current?.panTo(selectedListing.coordinates);
    }
  }, [selectedListing, listings]);
  
  /**
   * Get marker icon based on listing type
   */
  const getMarkerIcon = (type: string, selected = false) => {
    // Define colors for different listing types
    const colors: {[key: string]: string} = {
      job: '#4f46e5', // indigo
      gig: '#0ea5e9', // sky
      project: '#10b981', // emerald
      default: '#6366f1' // indigo
    };
    
    const color = colors[type] || colors.default;
    const size = selected ? 30 : 25;
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        ">
          ${type.charAt(0).toUpperCase()}
        </div>
      `,
      className: '',
      iconSize: [size, size],
      iconAnchor: [size/2, size],
    });
  };
  
  return (
    <div id="map" style={{ width: '100%', height: '100%' }}>
      {!mapRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      )}
    </div>
  );
}
