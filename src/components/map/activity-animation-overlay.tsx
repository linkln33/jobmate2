"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { OverlayView } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './map-animations.module.css';

// Define marketplace categories
type MarketplaceCategory = {
  id: string;
  name: string;
  color: string;
};

// Create a color scheme for each main category
const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  { id: 'handy-man', name: 'Handy Man', color: '#4CAF50' },  // Green
  { id: 'skilled-jobs', name: 'Skilled Jobs', color: '#2196F3' }, // Blue
  { id: 'digital-plus', name: 'Digital +', color: '#9C27B0' }, // Purple
  { id: 'healthcare', name: 'Healthcare', color: '#F44336' }, // Red
  { id: 'transport', name: 'Transport', color: '#A1887F' }, // Light Brown
  { id: 'other', name: 'Other', color: '#FF9800' }, // Orange
];

// Sample offer details for the activities
const sampleOffers = [
  { title: 'Plumbing Repair', price: '$120', address: '123 Main St, San Francisco', time: '2:00 PM Today', status: 'new', urgency: 'high' },
  { title: 'Electrical Work', price: '$180', address: '456 Market St, San Francisco', time: 'Tomorrow', status: 'new', urgency: 'medium' },
  { title: 'House Cleaning', price: '$90', address: '789 Mission St, San Francisco', time: '10:00 AM Tomorrow', status: 'new', urgency: 'low' },
  { title: 'Furniture Assembly', price: '$75', address: '321 Hayes St, San Francisco', time: '3:30 PM Today', status: 'new', urgency: 'medium' },
  { title: 'Moving Help', price: '$200', address: '654 Folsom St, San Francisco', time: 'Friday 2:00 PM', status: 'new', urgency: 'high' },
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

interface ActivityAnimationOverlayProps {
  mapBounds: google.maps.LatLngBounds | null;
  enabled?: boolean;
  showLegend?: boolean;
  selectedCategories?: string[];
}

export const ActivityAnimationOverlay: React.FC<ActivityAnimationOverlayProps> = ({ 
  mapBounds,
  enabled = true,
  showLegend = true,
  selectedCategories = []
}) => {
  const [activities, setActivities] = useState<ActivityLocation[]>([]);
  const [dotsWithoutBubbles, setDotsWithoutBubbles] = useState<Set<string>>(new Set());
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dotRemovalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxActivities = 10; // Maximum number of dots on the map at once

  // Helper function to check if a coordinate is on land (not in the sea)
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

  // Generate a random location within the current map bounds
  const generateRandomLocation = useCallback((): ActivityLocation | null => {
    if (!mapBounds) return null;
    
    const ne = mapBounds.getNorthEast();
    const sw = mapBounds.getSouthWest();
    
    for (let i = 0; i < 10; i++) {
      const lat = sw.lat() + (Math.random() * (ne.lat() - sw.lat()));
      const lng = sw.lng() + (Math.random() * (ne.lng() - sw.lng()));
      
      if (!isOnLand(lat, lng)) continue;
      
      const categoryId = getRandomCategory();
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
    
    return null;
  }, [mapBounds, selectedCategories]);

  // Get a random category ID, filtered by selected categories if any
  const getRandomCategory = useCallback(() => {
    // Filter categories based on selectedCategories if any are selected
    const availableCategories = selectedCategories.length > 0
      ? MARKETPLACE_CATEGORIES.filter(cat => selectedCategories.includes(cat.id))
      : MARKETPLACE_CATEGORIES;
    
    // If no categories are available after filtering, return a random one from all categories
    if (availableCategories.length === 0) {
      const allCategoryIds = MARKETPLACE_CATEGORIES.map(cat => cat.id);
      const randomIndex = Math.floor(Math.random() * allCategoryIds.length);
      return allCategoryIds[randomIndex];
    }
    
    // Otherwise, return a random one from the filtered categories
    const categoryIds = availableCategories.map(cat => cat.id);
    const randomIndex = Math.floor(Math.random() * categoryIds.length);
    return categoryIds[randomIndex];
  }, [selectedCategories]);

  // Add a new activity to the map
  const addActivity = useCallback(() => {
    if (!enabled) return;
    
    // Only add if we're below the maximum
    if (activities.length >= maxActivities) return;
    
    // Generate a random location within the current map bounds
    const location = generateRandomLocation();
    
    // Skip if we couldn't generate a valid location
    if (!location) return;
    
    console.log(`Adding dot with category: ${location.categoryId}`);
    
    // Add the new activity
    setActivities(prev => [...prev, location]);
  }, [activities.length, generateRandomLocation, maxActivities, enabled]);

  // Remove an activity after animation completes
  const removeActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
    setDotsWithoutBubbles(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);
  
  // Handle bubble timeout - add to dots without bubbles set
  const handleBubbleTimeout = useCallback((id: string) => {
    setDotsWithoutBubbles(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    
    // Schedule removal of the dot after 15 more seconds
    const timer = setTimeout(() => {
      removeActivity(id);
    }, 15000);
    
    // Store the timer reference so we can clear it if needed
    return () => clearTimeout(timer);
  }, [removeActivity]);

  // Filter activities based on selected categories
  useEffect(() => {
    if (selectedCategories.length > 0) {
      setActivities(prev => prev.filter(activity => 
        selectedCategories.includes(activity.categoryId)
      ));
    }
  }, [selectedCategories]);
  
  // Set up a fixed interval to add new activities exactly every 10 seconds
  useEffect(() => {
    if (!enabled || !mapBounds) return;
    
    // Clear any existing interval
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
      
      // Schedule the next activity in exactly 20 seconds (total cycle time)
      activityTimerRef.current = setTimeout(addNextActivity, 20000);
    };
    
    // Start the first activity after a short delay
    console.log('Starting first activity in 1 second');
    activityTimerRef.current = setTimeout(() => {
      addActivity();
      
      // Schedule the next one in 20 seconds (total cycle time)
      activityTimerRef.current = setTimeout(addNextActivity, 20000);
    }, 1000);
    
    return () => {
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    };
  }, [mapBounds, activities.length, addActivity, maxActivities, enabled]); // Re-run when map bounds change or enabled changes

  return (
    <>
      {showLegend && <CategoryLegend />}
      {activities.map((activity) => (
        <ActivityDot
          key={activity.id}
          activity={activity}
          onAnimationComplete={() => removeActivity(activity.id)}
          onBubbleTimeout={() => handleBubbleTimeout(activity.id)}
        />
      ))}
    </>
  );
};

interface ActivityDotProps {
  activity: ActivityLocation;
  onAnimationComplete: () => void;
  onBubbleTimeout?: () => void;
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

const ActivityDot: React.FC<ActivityDotProps> = ({ activity, onAnimationComplete, onBubbleTimeout }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [clicked, setClicked] = useState<boolean>(false);
  
  // Set a timeout to hide the bubble after 5 seconds
  useEffect(() => {
    const bubbleTimer = setTimeout(() => {
      if (!clicked) {
        setShowBubble(false);
        if (onBubbleTimeout) onBubbleTimeout();
      }
    }, 5000);
    
    return () => clearTimeout(bubbleTimer);
  }, [clicked, onBubbleTimeout]);
  
  // Get color and label based on category
  const color = useMemo(() => {
    const category = MARKETPLACE_CATEGORIES.find(cat => cat.id === activity.categoryId);
    return category?.color || '#9C27B0'; // Default to purple if category not found
  }, [activity.categoryId]);
  
  const label = useMemo(() => {
    const category = MARKETPLACE_CATEGORIES.find(cat => cat.id === activity.categoryId);
    return category?.name || 'Service';
  }, [activity.categoryId]);
  
  // Handle mouse enter - show details
  const handleMouseEnter = useCallback(() => {
    console.log('Mouse entered dot, showing details');
    setShowDetails(true);
  }, []);
  
  // Handle mouse leave - hide details if not clicked
  const handleMouseLeave = useCallback(() => {
    if (!clicked) {
      console.log('Mouse left dot, hiding details');
      setShowDetails(false);
    }
  }, [clicked]);
  
  // Handle dot click - toggle details and set clicked state
  const handleDotClick = useCallback(() => {
    console.log('Dot clicked, toggling details and locking state');
    setShowDetails(prev => !prev);
    setClicked(prev => !prev);
  }, []);
  
  // Handle close button click
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    console.log('Close button clicked, removing dot');
    onAnimationComplete(); // Remove the dot
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
      <div 
        className={styles['activity-container']} 
        onClick={handleDotClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
        
        {/* Activity label bubble - visible for 5 seconds or until clicked */}
        <AnimatePresence>
          {showBubble && !showDetails && (
            <motion.div 
              className={styles['activity-bubble']} 
              style={{ 
                backgroundColor: color,
                color: 'white',
                borderLeft: `3px solid ${color}`,
                borderRadius: '4px',
                padding: '2px 8px',
                fontWeight: 'bold',
                fontSize: '12px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                position: 'absolute',
                left: '15px',
                top: '-5px',
                minWidth: '80px',
                textAlign: 'left',
                whiteSpace: 'nowrap'
              }}
              initial={{ opacity: 0, scale: 0.5, x: -5 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Activity details popup - shown when clicked */}
        <AnimatePresence>
          {showDetails && (
            <motion.div 
              className={styles['job-details-bubble']}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles['job-details-content']}>
                <div 
                  className={styles['job-details-header']} 
                  style={{ backgroundColor: color }}
                >
                  <h3>{activity.title || 'New Job'}</h3>
                  <span className={styles['job-price']}>{activity.price || '$0'}</span>
                </div>
                <div className={styles['job-details-body']}>
                  <div className={styles['job-detail-row']}>
                    <div className={styles['job-detail-label']}>Address:</div>
                    <div className={styles['job-detail-value']}>{activity.address || 'Unknown'}</div>
                  </div>
                  <div className={styles['job-detail-row']}>
                    <div className={styles['job-detail-label']}>Time:</div>
                    <div className={styles['job-detail-value']}>{activity.time || 'Flexible'}</div>
                  </div>
                  <div className={styles['job-detail-row']}>
                    <div className={styles['job-detail-label']}>Status:</div>
                    <div className={styles['job-detail-value']}>
                      <span 
                        className={styles['status-indicator']} 
                        style={{ backgroundColor: 
                          activity.status === 'new' ? '#10B981' : 
                          activity.status === 'accepted' ? '#F59E0B' : 
                          '#6366F1' 
                        }}
                      />
                      {activity.status === 'new' ? 'New' : 
                       activity.status === 'accepted' ? 'Accepted' : 
                       'In Progress'}
                    </div>
                  </div>
                  <div className={styles['job-details-actions']}>
                    <button 
                      className={styles['job-action-button']} 
                      style={{ backgroundColor: color }}
                    >
                      View Details
                    </button>
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
