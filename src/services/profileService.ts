"use client";

// Define types directly in this file since the imports are missing

type UserRole = 'freelancer' | 'employer' | 'both';

type Certification = {
  name: string;
  issuer: string;
  year: string;
  expires?: string;
  certificateUrl?: string;
  certificateFile?: string;
};

type Experience = {
  id?: string;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  period?: string; // For backward compatibility
};

type Skill = {
  id?: string;
  name: string;
  level?: number;
};

type Category = {
  id?: string;
  name: string;
  skills: Skill[];
};

type ProfileBasicInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  jobTitle?: string;
  hourlyRate?: number;
};

type ProfileData = {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  name?: string;
  role?: UserRole;
  avatar?: string;
  coverImage?: string;
  title?: string;
  bio?: string;
  location?: string;
  website?: string;
  email: string;
  phone?: string;
  categories?: Category[];
  skills?: string[];
  experience?: Experience[];
  certifications?: Certification[];
  isVerified?: boolean;
  joinedDate?: string;
  completedJobs?: number;
  totalEarnings?: number;
  rating?: number;
  reviewCount?: number;
  jobTitle?: string;
  hourlyRate?: number;
  availability?: string;
  expertise?: string[];
  languages?: string[];
  education?: Array<{ degree: string; institution: string; year: string; }>;
  reviews?: Array<{ id: string; clientName: string; clientAvatar: string; rating: number; date: string; comment: string; }>;
  reviewStats?: { averageRating: number; totalReviews: number; ratingBreakdown: { '5': number; '4': number; '3': number; '2': number; '1': number; } };
  wallet?: { balance: number; pendingPayments: number; transactions: any[]; };
  verifications?: { identity: boolean; phone: boolean; email: boolean; background: boolean; };
  preferences?: { notifications?: { jobs: boolean; messages: boolean; }; privacy?: { showProfile: boolean; }; };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
    instagram?: string;
  };
  reputation?: {
    stats: {
      overallRating: number;
      totalReviews: number;
      completionRate: number;
      responseRate: number;
      avgResponseTime: string;
      memberSince: string;
      totalJobsCompleted: number;
      repeatCustomerRate: number;
      specialistLevel: string;
      nextLevelProgress: number;
      nextLevelRequirements: {
        jobsNeeded: number;
        ratingNeeded: number;
      };
    };
    achievements: any[];
    externalReviews: any[];
    feedbackSystem?: {
      positiveAttributes: Array<{ name: string; count: number; }>;
      negativeAttributes: any[];
      recentFeedback: any[];
    };
  };
  marketplaceListings?: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    media: string[];
    pricing: { price: number; unit: string };
    location: string;
    status: string;
    isFeatured: boolean;
    createdAt: string;
    views: number;
    saves: number;
  }>;
  marketplaceStats?: {
    activeListings: number;
    totalSales: number;
    featuredListings: number;
    totalRevenue: number;
  };
};
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.jobmate.example';

// Mock profile data for development
const mockProfileData: ProfileData = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  name: 'John Doe',
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
  categories: [
    {
      id: 'cat-1',
      name: 'Home Repair',
      skills: [
        { id: 'skill-1', name: 'Plumbing', level: 5 },
        { id: 'skill-2', name: 'Electrical', level: 4 }
      ]
    },
    {
      id: 'cat-2',
      name: 'Maintenance',
      skills: [
        { id: 'skill-3', name: 'Carpentry', level: 5 },
        { id: 'skill-4', name: 'Painting', level: 4 }
      ]
    },
    {
      id: 'cat-3',
      name: 'Renovation',
      skills: [
        { id: 'skill-5', name: 'Drywall Repair', level: 5 }
      ]
    }
  ],
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
    { 
      id: 'exp-1',
      title: 'Lead Handyman', 
      company: 'Home Services Inc.', 
      startDate: '2015-01-01',
      endDate: '2020-12-31',
      current: false,
      description: 'Managed a team of handymen for residential repairs.',
      period: '2015-2020' 
    }
  ],
  completedJobs: 6,
  reviews: [
    { id: 'rev-1', clientName: 'Jane Smith', clientAvatar: 'https://randomuser.me/api/portraits/women/12.jpg', rating: 5, date: '2023-06-15', comment: 'Excellent work, very professional and timely.' }
  ],
  reviewStats: { averageRating: 4.8, totalReviews: 42, ratingBreakdown: { '5': 35, '4': 5, '3': 2, '2': 0, '1': 0 } },
  wallet: { balance: 1250, pendingPayments: 350, transactions: [] },
  verifications: { identity: true, phone: true, email: true, background: true },
  preferences: { notifications: { jobs: true, messages: true }, privacy: { showProfile: true } },
  // Add marketplace listings
  marketplaceListings: [
    {
      id: 'listing-1',
      title: 'Professional Plumbing Services',
      description: 'Expert plumbing repairs and installations for residential homes. Fast, reliable service with 100% satisfaction guarantee.',
      category: 'Home Services',
      media: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      pricing: { price: 85, unit: 'hour' },
      location: 'San Francisco, CA',
      status: 'Active',
      isFeatured: true,
      createdAt: '2023-05-10',
      views: 245,
      saves: 18
    },
    {
      id: 'listing-2',
      title: 'Bathroom Renovation Specialist',
      description: 'Complete bathroom remodeling services. From design to installation, transform your bathroom with quality craftsmanship.',
      category: 'Renovation',
      media: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      pricing: { price: 2500, unit: 'project' },
      location: 'San Francisco, CA',
      status: 'Active',
      isFeatured: false,
      createdAt: '2023-06-15',
      views: 187,
      saves: 12
    },
    {
      id: 'listing-3',
      title: 'Deck Building and Repair',
      description: 'Custom deck design, building, and repair services. Weather-resistant materials with 5-year warranty on all work.',
      category: 'Outdoor',
      media: [
        'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      pricing: { price: 35, unit: 'sqft' },
      location: 'San Francisco, CA',
      status: 'Active',
      isFeatured: false,
      createdAt: '2023-04-22',
      views: 134,
      saves: 8
    }
  ],
  // Add marketplace stats
  marketplaceStats: {
    activeListings: 3,
    totalSales: 28,
    featuredListings: 1,
    totalRevenue: 4850
  },
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
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedProfile = {
          ...mockProfileData,
          preferences: {
            ...mockProfileData.preferences,
            ...preferences
          }
        };
        
        // Update mock data
        Object.assign(mockProfileData, updatedProfile);
        
        resolve(updatedProfile);
      }, 500);
    });
  },
  
  /**
   * Update profile data with any fields
   * @param userId User ID to update
   * @param data Any profile data fields to update
   * @returns Promise with updated profile data
   */
  async updateProfileData(userId: string, data: Partial<ProfileData>): Promise<ProfileData> {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedProfile = {
          ...mockProfileData,
          ...data
        };
        
        // Update mock data
        Object.assign(mockProfileData, updatedProfile);
        
        resolve(updatedProfile);
      }, 500);
    });
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
