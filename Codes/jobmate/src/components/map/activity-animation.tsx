import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { OverlayView } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './map-animations.module.css';
import { JOB_CATEGORIES } from '@/data/job-categories';

// Define marketplace categories based on JobMate's job categories
type MarketplaceCategory = {
  id: string;
  name: string;
  color: string;
};

// Create a color scheme for each main category
const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  { id: 'home-services', name: 'Home Services', color: '#4CAF50' },  // Green
  { id: 'skilled-trades', name: 'Skilled Trades', color: '#2196F3' }, // Blue
  { id: 'outdoor-garden', name: 'Outdoor & Garden', color: '#8BC34A' }, // Light Green
  { id: 'care-assistance', name: 'Care & Assistance', color: '#FF5722' }, // Deep Orange
  { id: 'transport', name: 'Transport & Driving', color: '#FFC107' }, // Amber
  { id: 'design', name: 'Design & Creative', color: '#9C27B0' }, // Purple
  { id: 'programming', name: 'Programming & Tech', color: '#3F51B5' }, // Indigo
  { id: 'writing', name: 'Writing & Translation', color: '#00BCD4' }, // Cyan
  { id: 'business', name: 'Business Services', color: '#607D8B' }, // Blue Grey
  { id: 'events', name: 'Events & Entertainment', color: '#E91E63' }, // Pink
  { id: 'education', name: 'Education & Tutoring', color: '#009688' }, // Teal
  { id: 'legal', name: 'Legal Services', color: '#795548' }, // Brown
];

interface ActivityLocation {
  id: string;
  lat: number;
  lng: number;
  categoryId: string;
  timestamp: number;
  title?: string;
  price?: string;
  address?: string;
  time?: string;
  status?: string;
  urgency?: string;
}

interface ActivityAnimationProps {
  mapBounds: google.maps.LatLngBounds | null;
}

export const ActivityAnimation: React.FC<ActivityAnimationProps> = ({ mapBounds }) => {
  const [activities, setActivities] = useState<ActivityLocation[]>([]);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxActivities = 15; // Maximum number of dots on the map at once
  const debugRef = useRef<boolean>(false); // For debugging
  
  // Sample offer details for the activities
  const sampleOffers = [
    { title: 'Plumbing Repair', price: '$120', address: '123 Main St, San Francisco', time: '2:00 PM Today', status: 'new', urgency: 'high' },
    { title: 'Electrical Work', price: '$180', address: '456 Market St, San Francisco', time: 'Tomorrow', status: 'new', urgency: 'medium' },
    { title: 'House Cleaning', price: '$90', address: '789 Mission St, San Francisco', time: '10:00 AM Tomorrow', status: 'new', urgency: 'low' },
    { title: 'Furniture Assembly', price: '$75', address: '321 Hayes St, San Francisco', time: '3:30 PM Today', status: 'new', urgency: 'medium' },
    { title: 'Moving Help', price: '$200', address: '654 Folsom St, San Francisco', time: 'Friday 2:00 PM', status: 'new', urgency: 'high' },
  ]
  
  // Generate random coordinates within the current map bounds
  const generateRandomLocation = (): ActivityLocation | null => {
    if (!mapBounds) return null;
    
    const ne = mapBounds.getNorthEast();
    const sw = mapBounds.getSouthWest();
    
    // Try up to 10 times to find a location on land
    for (let i = 0; i < 10; i++) {
      const lat = sw.lat() + (Math.random() * (ne.lat() - sw.lat()));
      const lng = sw.lng() + (Math.random() * (ne.lng() - sw.lng()));
      
      // Skip if the location is in the sea
      if (!isOnLand(lat, lng)) continue;
      
      // Generate random marketplace category
      const categoryId = MARKETPLACE_CATEGORIES[Math.floor(Math.random() * MARKETPLACE_CATEGORIES.length)].id;
      
      // Get random offer details
      const offerDetails = sampleOffers[Math.floor(Math.random() * sampleOffers.length)];
      
      return {
        id: `activity-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        lat,
        lng,
        categoryId,
        timestamp: Date.now(),
        ...offerDetails
      };
    }
    
    return null; // Failed to find a location on land after 10 attempts
  };
  
  // Add a new activity animation
  const addActivity = useCallback(() => {
    if (activities.length >= maxActivities) return;
    
    // Generate a random location within the current map bounds
    const location = generateRandomLocation();
    
    // Skip if we couldn't generate a valid location
    if (!location) return;
    
    console.log(`Adding dot with category: ${location.categoryId}, color should be visible`);
    
    // Add the new activity
    setActivities(prev => [...prev, location]);
  }, [activities.length, mapBounds]);
  
  // Remove an activity after animation completes
  const removeActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };
  
  // Set up a fixed interval to add new activities exactly every 5 seconds
  useEffect(() => {
    if (!mapBounds) return;
    
    // Clear any existing timers
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }
    
    // Function to add a new activity and schedule the next one
    const addNextActivity = () => {
      // Only add if we're below the maximum
      if (activities.length < maxActivities) {
        console.log('Adding new activity dot');
        addActivity();
      } else {
        console.log('Maximum activities reached, not adding more');
      }
      
      // Schedule the next activity in exactly 5 seconds
      activityTimerRef.current = setTimeout(addNextActivity, 5000);
    };
    
    // Start the first activity after a short delay
    console.log('Starting first activity in 1 second');
    activityTimerRef.current = setTimeout(() => {
      addActivity();
      
      // Schedule the next one in 5 seconds
      activityTimerRef.current = setTimeout(addNextActivity, 5000);
    }, 1000);
    
    return () => {
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    };
  }, [mapBounds]); // Only re-run when map bounds change, not when activities change
  
  // Helper function to get activity color based on category
  const getActivityColor = (categoryId: string) => {
    const category = MARKETPLACE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.color || '#9C27B0'; // Default to purple if category not found
  };

  // Helper function to get activity label based on category
  const getActivityLabel = (categoryId: string) => {
    const category = MARKETPLACE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.name || 'New Activity';
  };

  // Helper function to check if a coordinate is on land (not in the sea)
  // This is a simplified check that only excludes obvious ocean areas
  const isOnLand = (lat: number, lng: number): boolean => {
    // Only filter out the most obvious ocean areas
    // Deep Pacific Ocean
    if (lng < -140 && lng > -180 && lat < 50 && lat > -50) return false;
    // Deep Atlantic Ocean
    if (lng > -60 && lng < -20 && lat < 50 && lat > -40) return false;
    // Arctic Ocean - far north
    if (lat > 80) return false;
    // Antarctic - far south
    if (lat < -75) return false;
    
    // Allow most coordinates to be considered land
    return true;
  };

  return (
    <>
      <CategoryLegend />
      {activities.map((activity) => (
        <ActivityDot
          key={activity.id}
          activity={activity}
          onAnimationComplete={() => removeActivity(activity.id)}
        />
      ))}
    </>
  );
};

interface ActivityDotProps {
  activity: ActivityLocation;
  onAnimationComplete: () => void;
}

// Legend component to show category colors
const CategoryLegend: React.FC = () => {
  return (
    <div className={styles['category-legend']}>
      <div className={styles['legend-title']}>Marketplace Categories</div>
      <div className={styles['legend-items']}>
        {MARKETPLACE_CATEGORIES.slice(0, 6).map((category) => (
          <div key={category.id} className={styles['legend-item']}>
            <div 
              className={styles['legend-color']} 
              style={{ backgroundColor: category.color }}
            />
            <div className={styles['legend-name']}>{category.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivityDot: React.FC<ActivityDotProps> = ({ activity, onAnimationComplete }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);
  
  // Get color and label based on category
  const color = useMemo(() => {
    const category = MARKETPLACE_CATEGORIES.find(cat => cat.id === activity.categoryId);
    return category?.color || '#9C27B0'; // Default to purple if category not found
  }, [activity.categoryId]);
  
  const label = useMemo(() => {
    const category = MARKETPLACE_CATEGORIES.find(cat => cat.id === activity.categoryId);
    return category?.name || 'Service';
  }, [activity.categoryId]);
  
  // Handle dot click - toggle details
  const handleDotClick = useCallback(() => {
    console.log('Dot clicked, toggling details');
    setShowDetails(prev => !prev);
    setClicked(true);
  }, []);
  
  // Handle close button click
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    console.log('Close button clicked, removing dot');
    onAnimationComplete(); // Fixed: removed the argument to match the interface
    // The parent component will handle removing the dot by its ID
  }, [onAnimationComplete]);

  // Pixel offset for positioning
  const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -(height / 2)
  });
  
  return (
    <OverlayView
      position={{ lat: activity.lat, lng: activity.lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={getPixelPositionOffset}
    >
      <div className={styles['activity-container']} onClick={handleDotClick}>
        {/* Pulsing ring effect */}
        <div 
          className={styles['pulse-ring']}
          style={{ borderColor: color }}
        />
        
        {/* The main dot - explicitly set size and color */}
        <div 
          className={styles['activity-dot']} 
          style={{
            backgroundColor: color,
            width: '12px',
            height: '12px',
            position: 'absolute',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1001,
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
          }}
        />
        
        {/* Activity label bubble - always visible until clicked */}
        <AnimatePresence>
          {!showDetails && (
            <motion.div 
              className={styles['activity-bubble']} 
              style={{ borderColor: color }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles['activity-label']} style={{ borderColor: color }}>
                {label}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Job details popup when clicked */}
        <AnimatePresence>
          {showDetails && (
            <motion.div 
              className={styles['job-details-bubble']}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles['job-details-content']}>
                <div className={styles['job-details-header']} style={{ backgroundColor: color }}>
                  <h3>{activity.title || label}</h3>
                  <span className={styles['job-price']}>{activity.price || '$120'}</span>
                  <button 
                    className={styles['close-button']} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(false);
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className={styles['job-details-body']}>
                  <div className={styles['job-detail-row']}>
                    <span className={styles['job-detail-label']}>Location:</span>
                    <span className={styles['job-detail-value']}>{activity.address || 'San Francisco, CA'}</span>
                  </div>
                  <div className={styles['job-detail-row']}>
                    <span className={styles['job-detail-label']}>Time:</span>
                    <span className={styles['job-detail-value']}>{activity.time || 'Today'}</span>
                  </div>
                  <div className={styles['job-detail-row']}>
                    <span className={styles['job-detail-label']}>Status:</span>
                    <span className={styles['job-detail-value']}>
                      <span className={styles['status-indicator']} style={{ backgroundColor: color }}></span>
                      {activity.status || 'New'} {activity.urgency === 'high' && '(Urgent)'}
                    </span>
                  </div>
                  <div className={styles['job-details-actions']}>
                    <button className={styles['job-action-button']} style={{ backgroundColor: color }}>View Details</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </OverlayView>
  );
};
