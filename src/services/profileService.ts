"use client";

import { ProfileData, ProfileBasicInfo } from '@/types/profile';
import { Certification } from '@/components/profile/editable-certifications';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.jobmate.example';

// Mock profile data for development
const mockProfileData: ProfileData = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  bio: 'Experienced handyman with over 10 years of experience in home repairs and maintenance.',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=350&q=80',
  jobTitle: 'Professional Handyman',
  hourlyRate: 45,
  availability: 'Weekdays 9AM-5PM',
  skills: ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Drywall Repair'],
  categories: ['Home Repair', 'Maintenance', 'Renovation'],
  expertise: ['Kitchen Remodeling', 'Bathroom Renovation', 'Deck Building'],
  languages: ['English', 'Spanish'],
  education: [
    { degree: 'Certificate in Building Maintenance', institution: 'City College', year: '2010' }
  ],
  certifications: [
    { 
      name: 'Licensed Contractor', 
      issuer: 'State Board', 
      year: '2012', 
      expires: '2025',
      certificateUrl: 'https://example.com/certificate/12345',
      certificateFile: 'contractor-license.pdf'
    }
  ],
  experience: [
    { title: 'Lead Handyman', company: 'Home Services Inc.', period: '2015-2020', description: 'Managed a team of handymen for residential repairs.' }
  ],
  completedJobs: 6,
  reviews: [
    { id: 'rev-1', clientName: 'Jane Smith', clientAvatar: 'https://randomuser.me/api/portraits/women/12.jpg', rating: 5, date: '2023-06-15', comment: 'Excellent work, very professional and timely.' }
  ],
  reviewStats: { averageRating: 4.8, totalReviews: 42, ratingBreakdown: { '5': 35, '4': 5, '3': 2, '2': 0, '1': 0 } },
  wallet: { balance: 1250, pendingPayments: 350, transactions: [] },
  verifications: { identity: true, phone: true, email: true, background: true },
  preferences: { notifications: { jobs: true, messages: true }, privacy: { showProfile: true } },
  reputation: {
    stats: {
      overallRating: 4.8,
      totalReviews: 42,
      completionRate: 98,
      responseRate: 95,
      avgResponseTime: '2 hours',
      memberSince: '2020-03-15',
      totalJobsCompleted: 650, // Using dollar amount instead of jobs completed
      repeatCustomerRate: 65,
      specialistLevel: 'Top Rated',
      nextLevelProgress: 85,
      nextLevelRequirements: {
        jobsNeeded: 15,
        ratingNeeded: 4.9
      }
    },
    achievements: [],
    externalReviews: [],
    feedbackSystem: {
      positiveAttributes: [{ name: 'Punctual', count: 38 }, { name: 'Quality Work', count: 40 }],
      negativeAttributes: [],
      recentFeedback: []
    }
  }
};

/**
 * Service for handling profile-related API calls
 * Using mock data for development
 */
export const profileService = {
  /**
   * Fetch profile data for the current user
   * @returns Promise with profile data
   */
  async getCurrentUserProfile(): Promise<ProfileData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProfileData;
  },

  /**
   * Fetch profile data for a specific user
   * @param userId User ID to fetch profile for
   * @returns Promise with profile data
   */
  async getUserProfile(userId: string): Promise<ProfileData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // For demo purposes, just return the mock data
    return mockProfileData;
  },

  /**
   * Update basic profile information
   * @param profileData Updated profile data
   * @returns Promise with updated profile data
   */
  async updateProfile(profileData: Partial<ProfileBasicInfo>): Promise<ProfileData> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Update mock data
      Object.assign(mockProfileData, profileData);
      return mockProfileData;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Generic method to upload profile images
   * @param file Image file to upload
   * @param type Type of image ('avatar' or 'cover')
   * @returns Promise with URL of uploaded image
   */
  async uploadImage(file: File, type: 'avatar' | 'cover'): Promise<string> {
    try {
      // In a real app, we would upload to a server
      // For now, create a local URL for the image
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Update the mock data based on type
          if (type === 'avatar') {
            mockProfileData.avatar = reader.result as string;
          } else if (type === 'cover') {
            mockProfileData.coverImage = reader.result as string;
          }
          // Return the URL
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      throw error;
    }
  },
  
  /**
   * Upload profile avatar
   * @param file Image file to upload
   * @returns Promise with URL of uploaded image
   */
  async uploadAvatar(file: File): Promise<string> {
    return this.uploadImage(file, 'avatar');
  },

  /**
   * Upload profile cover image
   * @param file Image file to upload
   * @returns Promise with URL of uploaded image
   */
  async uploadCoverImage(file: File): Promise<string> {
    return this.uploadImage(file, 'cover');
  },

  /**
   * Update skills
   * @param skills Updated skills array
   * @returns Promise with updated profile data
   */
  async updateSkills(skills: string[]): Promise<ProfileData> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Update mock data
      mockProfileData.skills = skills;
      return mockProfileData;
    } catch (error) {
      console.error('Error updating skills:', error);
      throw error;
    }
  },

  /**
   * Update education
   * @param education Updated education array
   * @returns Promise with updated profile data
   */
  async updateEducation(education: ProfileData['education']): Promise<ProfileData> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Update mock data
      mockProfileData.education = education;
      return mockProfileData;
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  },

  /**
   * Update certifications
   * @param certifications Updated certifications array
   * @returns Promise with updated profile data
   */
  async updateCertifications(certifications: ProfileData['certifications']): Promise<ProfileData> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Update mock data
      mockProfileData.certifications = certifications;
      return mockProfileData;
    } catch (error) {
      console.error('Error updating certifications:', error);
      throw error;
    }
  },

  /**
   * Update experience
   * @param experience Updated experience array
   * @returns Promise with updated profile data
   */
  async updateExperience(experience: ProfileData['experience']): Promise<ProfileData> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Update mock data
      mockProfileData.experience = experience;
      return mockProfileData;
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  },

  /**
   * Update preferences
   * @param preferences Updated preferences object
   * @returns Promise with updated profile data
   */
  async updatePreferences(preferences: ProfileData['preferences']): Promise<ProfileData> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Update mock data
      mockProfileData.preferences = preferences;
      return mockProfileData;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  /**
   * Get profile reviews
   * @param userId User ID to fetch reviews for
   * @param page Page number for pagination
   * @param limit Number of reviews per page
   * @returns Promise with reviews data
   */
  async getProfileReviews(userId: string, page = 1, limit = 10): Promise<{ reviews: any[]; total: number; page: number; limit: number }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/${userId}/reviews`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for user ${userId}:`, error);
      throw error;
    }
  }
};
