"use client";

import React, { useState, useEffect, useRef } from 'react';
import { WaitlistPopup } from './waitlist-popup';

export function ScrollTriggeredWaitlist() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const initialRenderRef = useRef(true);
  const popupShownRef = useRef(false);
  const scrollListenerRef = useRef<null | (() => void)>(null);

  // Only run once on client side after hydration
  useEffect(() => {
    // Skip server-side rendering
    if (typeof window === 'undefined') return;
    
    // Check if user has already joined the waitlist
    try {
      const waitlistUser = localStorage.getItem('waitlistUser');
      if (waitlistUser) {
        // User already joined, don't show popup at all
        popupShownRef.current = true;
        return;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }

    // Setup scroll listener
    const handleScroll = () => {
      // Mark that user has actively scrolled
      if (!hasUserScrolled) {
        setHasUserScrolled(true);
      }
      
      // Don't proceed if popup already shown
      if (popupShownRef.current) return;
      
      // Calculate scroll percentage
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      // Only show popup when user has scrolled past 60% of the page
      if (scrollPercentage > 60) {
        // Prevent showing again
        popupShownRef.current = true;
        
        // Show popup
        setShowPopup(true);
        
        // Remove scroll listener since we don't need it anymore
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // Store reference to the handler for cleanup
    scrollListenerRef.current = handleScroll;
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function
    return () => {
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current);
      }
    };
  }, []); // Empty dependency array ensures this only runs once

  // Handle initial render flag
  useEffect(() => {
    // After first render, set initialRender to false
    initialRenderRef.current = false;
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  // Don't show popup if:
  // 1. showPopup state is false
  // 2. We're in the initial render
  // 3. User hasn't scrolled yet
  if (!showPopup || initialRenderRef.current || !hasUserScrolled) return null;

  return <WaitlistPopup onClose={handleClose} />;
}
