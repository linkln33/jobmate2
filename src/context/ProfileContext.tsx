"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as profileService from '@/services/profileService';

// Define types
export type UserRole = 'freelancer' | 'employer' | 'both';

type ProfileContextType = {
  profileData: any | null;
  isLoading: boolean;
  isEditing: boolean;
  activeRole: UserRole;
  error: string | null;
  setActiveRole: (role: UserRole) => void;
  toggleEditing: () => void;
  saveProfile: (data: any) => Promise<void>;
};

// Create context with default values
const ProfileContext = createContext<ProfileContextType>({
  profileData: null,
  isLoading: true,
  isEditing: false,
  activeRole: 'freelancer',
  error: null,
  setActiveRole: () => {},
  toggleEditing: () => {},
  saveProfile: async () => {},
});

// Create provider component
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileData, setProfileData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRole>('freelancer');
  const [error, setError] = useState<string | null>(null);

  // Load profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const data = await profileService.getCurrentUserProfile();
        setProfileData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Function to toggle editing mode
  const toggleEditing = () => setIsEditing(prev => !prev);

  // Function to save profile changes
  const saveProfile = async (data: any) => {
    try {
      setIsLoading(true);
      // Update profile data via service
      await profileService.updateProfile(data);
      // Update local state
      setProfileData(prev => ({ ...prev, ...data }));
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    profileData,
    isLoading,
    isEditing,
    activeRole,
    error,
    setActiveRole,
    toggleEditing,
    saveProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the profile context
export const useProfile = () => useContext(ProfileContext);
