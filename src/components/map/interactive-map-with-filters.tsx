"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleMap, LoadScript, OverlayView, useLoadScript } from '@react-google-maps/api';
import { Job } from '@/types/job';
import { MapSearchBar } from './map-search-bar';
import { MapFilterChips } from './map-filter-chips';
import { MapActionButtons } from './map-action-buttons';
import { ActivityAnimationOverlay } from './activity-animation-overlay';
import styles from './map-animations.module.css';

// Mock job data with diverse locations and job types
const mockJobs = [
  // San Francisco Area Jobs
  {
    id: '1',
    title: 'Plumbing Repair',
    status: 'new',
    urgency: 'high',
    address: '123 Main St, San Francisco, CA',
    price: '$120',
    scheduledTime: '2:00 PM Today',
    customer: 'John Doe',
    time: '2:00 PM Today',
    lat: 37.7749,
    lng: -122.4194,
    category: 'home-services',
    subcategory: 'plumbing'
  },
  {
    id: '2',
    title: 'Electrical wiring installation',
    status: 'accepted',
    urgency: 'medium',
    address: '456 Market St, San Francisco, CA',
    price: '$200',
    scheduledTime: '10:00 AM Tomorrow',
    customer: 'Sarah Johnson',
    time: '10:00 AM Tomorrow',
    lat: 37.7935,
    lng: -122.3964,
    category: 'home-services',
    subcategory: 'electrical'
  },
  {
    id: '3',
    title: 'HVAC maintenance',
    status: 'completed',
    urgency: 'low',
    address: '789 Mission St, San Francisco, CA',
    price: '$150',
    scheduledTime: 'Yesterday',
    customer: 'Robert Brown',
    time: 'Yesterday',
    lat: 37.7841,
    lng: -122.4076,
    category: 'home-services',
    subcategory: 'hvac'
  },
  {
    id: '4',
    title: 'Furniture assembly',
    status: 'new',
    urgency: 'high',
    address: '321 Hayes St, San Francisco, CA',
    price: '$85',
    scheduledTime: '4:00 PM Today',
    customer: 'Emily Davis',
    time: '4:00 PM Today',
    lat: 37.7764,
    lng: -122.4242,
    category: 'home-services',
    subcategory: 'furniture-assembly'
  },
  {
    id: '5',
    title: 'Painting service',
    status: 'accepted',
    urgency: 'medium',
    address: '654 Folsom St, San Francisco, CA',
    price: '$300',
    scheduledTime: '11:30 AM Tomorrow',
    customer: 'Michael Wilson',
    time: '11:30 AM Tomorrow',
    lat: 37.7851,
    lng: -122.3964,
    category: 'home-services',
    subcategory: 'painting'
  },
  // Additional San Francisco Jobs
  {
    id: '6',
    title: 'Lawn Mowing',
    status: 'new',
    urgency: 'low',
    address: '987 Divisadero St, San Francisco, CA',
    price: '$75',
    scheduledTime: 'Tomorrow',
    customer: 'David Miller',
    time: 'Tomorrow',
    lat: 37.7759,
    lng: -122.4392,
    category: 'outdoor-services',
    subcategory: 'lawn-care'
  },
  {
    id: '7',
    title: 'House Cleaning',
    status: 'new',
    urgency: 'medium',
    address: '543 Haight St, San Francisco, CA',
    price: '$120',
    scheduledTime: 'Friday 10:00 AM',
    customer: 'Jennifer White',
    time: 'Friday 10:00 AM',
    lat: 37.7712,
    lng: -122.4334,
    category: 'home-services',
    subcategory: 'cleaning'
  },
  {
    id: '8',
    title: 'Dog Walking',
    status: 'accepted',
    urgency: 'low',
    address: '222 Fillmore St, San Francisco, CA',
    price: '$30',
    scheduledTime: 'Today 5:00 PM',
    customer: 'Thomas Jones',
    time: 'Today 5:00 PM',
    lat: 37.7718,
    lng: -122.4308,
    category: 'pet-services',
    subcategory: 'dog-walking'
  },
  {
    id: '9',
    title: 'Computer Repair',
    status: 'new',
    urgency: 'high',
    address: '111 Powell St, San Francisco, CA',
    price: '$150',
    scheduledTime: 'ASAP',
    customer: 'Lisa Garcia',
    time: 'ASAP',
    lat: 37.7851,
    lng: -122.4094,
    category: 'tech-services',
    subcategory: 'computer-repair'
  },
  {
    id: '10',
    title: 'Moving Assistance',
    status: 'in_progress',
    urgency: 'high',
    address: '777 Valencia St, San Francisco, CA',
    price: '$250',
    scheduledTime: 'In Progress',
    customer: 'Kevin Martinez',
    time: 'In Progress',
    lat: 37.7614,
    lng: -122.4216,
    category: 'moving-services',
    subcategory: 'local-moving'
  },
  // East Bay Area Jobs
  {
    id: '11',
    title: 'Roof Repair',
    status: 'new',
    urgency: 'high',
    address: '123 Broadway, Oakland, CA',
    price: '$400',
    scheduledTime: 'Thursday',
    customer: 'Amanda Lee',
    time: 'Thursday',
    lat: 37.8044,
    lng: -122.2711,
    category: 'home-services',
    subcategory: 'roofing'
  },
  {
    id: '12',
    title: 'Gardening Service',
    status: 'accepted',
    urgency: 'low',
    address: '456 College Ave, Berkeley, CA',
    price: '$90',
    scheduledTime: 'Next Week',
    customer: 'Daniel Smith',
    time: 'Next Week',
    lat: 37.8538,
    lng: -122.2533,
    category: 'outdoor-services',
    subcategory: 'gardening'
  },
  {
    id: '13',
    title: 'Carpet Cleaning',
    status: 'completed',
    urgency: 'medium',
    address: '789 Park Blvd, Oakland, CA',
    price: '$180',
    scheduledTime: 'Last Week',
    customer: 'Sophia Rodriguez',
    time: 'Last Week',
    lat: 37.8043,
    lng: -122.2489,
    category: 'home-services',
    subcategory: 'carpet-cleaning'
  },
  {
    id: '14',
    title: 'Drywall Repair',
    status: 'in_progress',
    urgency: 'low',
    address: '321 Shattuck Ave, Berkeley, CA',
    price: '$120',
    scheduledTime: 'Today',
    customer: 'William Taylor',
    time: 'Today',
    lat: 37.8654,
    lng: -122.2679,
    category: 'home-services',
    subcategory: 'drywall'
  },
  {
    id: '15',
    title: 'Appliance Installation',
    status: 'new',
    urgency: 'medium',
    address: '654 Telegraph Ave, Oakland, CA',
    price: '$150',
    scheduledTime: 'Saturday',
    customer: 'Olivia Brown',
    time: 'Saturday',
    lat: 37.8116,
    lng: -122.2648,
    category: 'home-services',
    subcategory: 'appliance-installation'
  },
  {
    id: '16',
    title: 'Window Cleaning',
    status: 'new',
    urgency: 'low',
    address: '987 University Ave, Berkeley, CA',
    price: '$100',
    scheduledTime: 'Next Monday',
    customer: 'James Wilson',
    time: 'Next Monday',
    lat: 37.8721,
    lng: -122.2728,
    category: 'home-services',
    subcategory: 'window-cleaning'
  }
];

// Default Google Maps API key for demo purposes
// In production, always use environment variables instead of hardcoded values
const DEFAULT_API_KEY = 'AIzaSyAn3xgB_REOmDBofSgNJsDvTkHSUE3Vy1Y';

interface InteractiveMapWithFiltersProps {
  height?: string;
  onJobSelect?: (job: Job) => void;
  selectedJobId?: string | null;
  filterChipStyle?: {
    chipWidth?: string;
    useFullName?: boolean;
    paddingLeft?: string;
    paddingRight?: string;
  };
  mapOptions?: {
    zoomControl?: boolean;
    scrollwheel?: boolean;
    [key: string]: any;
  };
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  showLegend?: boolean;
  showStaticMarkers?: boolean;
  showSearchBar?: boolean;
  showActivityDotsOnMap?: boolean;
}

export function InteractiveMapWithFilters({
  height = '400px',
  onJobSelect,
  selectedJobId,
  showLegend = false,
  showStaticMarkers = false,
  filterChipStyle,
  showSearchBar = true,
  showActivityDotsOnMap = false,
  mapOptions = {},
  initialCenter,
  initialZoom
}: InteractiveMapWithFiltersProps & { 
  showLegend?: boolean; 
  showStaticMarkers?: boolean;
  showSearchBar?: boolean;
  showActivityDotsOnMap?: boolean;
}) {
  const [jobs] = useState<Job[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Action button states
  const [showAccepted, setShowAccepted] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const [showHighestPay, setShowHighestPay] = useState(false);
  const [showNewest, setShowNewest] = useState(false);
  
  // Map settings
  const [center] = useState(initialCenter || { lat: 37.7749, lng: -122.4194 }); // Default to San Francisco or use provided center
  const [zoom] = useState(initialZoom || 12);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [showActivityDots, setShowActivityDots] = useState<boolean>(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Update selected job when selectedJobId changes
  useEffect(() => {
    if (selectedJobId) {
      const job = jobs.find(j => j.id === selectedJobId);
      if (job) {
        setSelectedJob(job);
      }
    }
  }, [selectedJobId, jobs]);
  
  // Handle job selection
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    if (onJobSelect) {
      onJobSelect(job);
    }
  };
  
  // Get marker color based on job status and urgency
  const getMarkerColor = (job: Job) => {
    // Determine color based on status and urgency
    let fillColor = '#9333ea'; // default purple
    
    switch(job.status.toLowerCase()) {
      case 'completed': 
        fillColor = '#4ade80'; // green
        break; 
      case 'in_progress': 
        fillColor = '#3b82f6'; // blue
        break; 
      case 'accepted': 
        fillColor = '#f59e0b'; // amber
        break;
      case 'new': 
        // For new jobs, check urgency
        if (job.urgency && job.urgency === 'high') {
          fillColor = '#ef4444'; // red for high urgency
        } else if (job.urgency && job.urgency === 'medium') {
          fillColor = '#f97316'; // orange for medium urgency
        } else {
          fillColor = '#9333ea'; // purple for low/default urgency
        }
        break;
      default:
        fillColor = '#9333ea'; // purple
    }
    
    return fillColor;
  };
  
  // Custom component for pulsing marker
  const PulsingMarker = ({ job, onClick }: { job: Job, onClick: () => void }) => {
    const isSelected = selectedJob && selectedJob.id === job.id;
    const color = getMarkerColor(job);
    
    return (
      <OverlayView
        position={{ lat: job.lat, lng: job.lng }}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={(width, height) => ({
          x: -(width / 2),
          y: -(height / 2)
        })}
      >
        <div 
          className={styles['pulse-container']} 
          onClick={onClick}
          style={{ cursor: 'pointer' }}
        >
          <div 
            className={styles['pulse-circle']} 
            style={{ 
              backgroundColor: color,
              transform: isSelected ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%)'
            }} 
          />
          <div 
            className={styles['pulse-ring']} 
            style={{ borderColor: color }} 
          />
        </div>
      </OverlayView>
    );
  };

  // Use the useLoadScript hook instead of LoadScript component to prevent reloads
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || DEFAULT_API_KEY,
    // This prevents the script from being loaded multiple times
    // which is a common cause of full page reloads
    libraries: ['places'],
  });
  
  // Memoize the map component to prevent unnecessary re-renders
  // IMPORTANT: Always define useMemo before any conditional returns to avoid React hooks errors
  const mapComponent = useMemo(() => {
    if (!isLoaded) return null;
    
    return (
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onLoad={(map: google.maps.Map) => {
          // Store map reference and set initial bounds
          mapRef.current = map;
          setMapBounds(map.getBounds() || null);
        }}
        onBoundsChanged={() => {
          // Get the map instance from the ref and update bounds
          const mapInstance = mapRef.current;
          if (mapInstance) {
            setMapBounds(mapInstance.getBounds() || null);
          }
        }}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: mapOptions.zoomControl !== undefined ? mapOptions.zoomControl : true,
          scrollwheel: mapOptions.scrollwheel !== undefined ? mapOptions.scrollwheel : true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          ...mapOptions
        }}
      >
        {/* Render pulsing markers for each job (optional) */}
        {showStaticMarkers && jobs
          .filter(job => selectedCategories.length === 0 || selectedCategories.includes(job.category))
          .map((job) => (
            <PulsingMarker
              key={job.id}
              job={job}
              onClick={() => handleJobSelect(job)}
            />
          ))
        }
        {/* Activity animation overlay with popping dots */}
        {showActivityDots && mapBounds && (
          <ActivityAnimationOverlay 
            mapBounds={mapBounds} 
            enabled={showActivityDots} 
            showLegend={showLegend}
            selectedCategories={selectedCategories}
          />
        )}
      </GoogleMap>
    );
  }, [center, zoom, jobs, handleJobSelect, mapBounds, showActivityDots]);
  
  // Handle loading and error states after all hooks are defined
  return (
    <div className="relative w-full" style={{ height }}>
      {/* Show error state */}
      {loadError && (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-red-500">Error loading maps. Please check your connection.</p>
          </div>
        </div>
      )}
      
      {/* Show loading state */}
      {!isLoaded && !loadError && (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Main map component */}
      {mapComponent}
      
      {/* Search bar */}
      <MapSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategories={selectedCategories}
        onCategorySelect={(categoryId) => {
          setSelectedCategories(prev => 
            prev.includes(categoryId) 
              ? prev.filter(id => id !== categoryId) 
              : [...prev, categoryId]
          );
        }}
      />
      
      {/* Filter chips */}
      <MapFilterChips
        selectedCategories={selectedCategories}
        onToggleCategory={(categoryId) => {
          setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
              return prev.filter(id => id !== categoryId);
            } else {
              return [...prev, categoryId];
            }
          });
        }}
        setSelectedCategories={setSelectedCategories}
        chipStyle={filterChipStyle}
      />
      
      {/* Action buttons */}
      <MapActionButtons
        showAccepted={showAccepted}
        showSuggested={showSuggested}
        showHighestPay={showHighestPay}
        showNewest={showNewest}
        onToggleAccepted={() => setShowAccepted(!showAccepted)}
        onToggleSuggested={() => setShowSuggested(!showSuggested)}
        onToggleHighestPay={() => setShowHighestPay(!showHighestPay)}
        onToggleNewest={() => setShowNewest(!showNewest)}
      />
    </div>
  );
}
