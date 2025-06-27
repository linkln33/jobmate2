"use client";

import { v4 as uuidv4 } from 'uuid';

// Define types for marketplace listings
export type ListingType = 'service' | 'product' | 'equipment' | 'space';

export type ListingStatus = 'active' | 'pending' | 'rejected' | 'draft';

export type ListingMedia = {
  id: string;
  url: string;
  type: 'image' | 'video';
  isPrimary?: boolean;
};

export type ListingLocation = {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

export type ListingPricing = {
  price: number;
  currency: string;
  unit: 'hour' | 'day' | 'week' | 'month' | 'fixed' | 'walk';
  negotiable: boolean;
  discount?: number;
};

export type MarketplaceListing = {
  id: string;
  title: string;
  description: string;
  type: ListingType;
  category: string;
  subcategory?: string;
  tags: string[];
  pricing: ListingPricing;
  location: ListingLocation;
  media: ListingMedia[];
  features: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: ListingStatus;
  views: number;
  favorites: number;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  isFeatured?: boolean;
};

// In-memory storage for listings
let listings: MarketplaceListing[] = [
  // Professional Plumbing Services
  {
    id: 'listing-1',
    title: 'Professional Plumbing Services',
    description: 'Expert plumbing services for residential and commercial properties. Available for emergency repairs and installations.',
    type: 'service',
    category: 'Home Services',
    subcategory: 'Plumbing',
    tags: ['plumbing', 'repairs', 'installation', 'emergency'],
    pricing: {
      price: 75,
      currency: 'USD',
      unit: 'hour',
      negotiable: true,
    },
    location: {
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    media: [
      {
        id: 'media-1',
        url: '/images/marketplace/plumber.png',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Licensed and insured', '24/7 emergency service', '5+ years experience', 'Free estimates'],
    userId: 'user-1', // This matches the mock user ID in profileService
    createdAt: '2025-06-20T14:30:00Z',
    updatedAt: '2025-06-20T14:30:00Z',
    status: 'active',
    views: 42,
    favorites: 7,
    contactInfo: {
      phone: '+1 (555) 123-4567',
      email: 'john.doe@example.com',
    },
    isFeatured: true,
  },
  
  // Experienced Babysitter
  {
    id: 'listing-2',
    title: 'Experienced Babysitter',
    description: 'Certified babysitter with 5+ years of experience. CPR trained and excellent references available.',
    type: 'service',
    category: 'Childcare',
    subcategory: 'Babysitting',
    tags: ['childcare', 'babysitting', 'kids'],
    pricing: {
      price: 25,
      currency: 'USD',
      unit: 'hour',
      negotiable: true,
    },
    location: {
      address: '456 Oak Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      latitude: 41.8781,
      longitude: -87.6298,
    },
    media: [
      {
        id: 'media-3',
        url: '/images/marketplace/babysitter.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['CPR certified', 'First aid trained', 'References available', 'Flexible schedule'],
    userId: 'user-2',
    createdAt: '2025-06-21T10:15:00Z',
    updatedAt: '2025-06-21T10:15:00Z',
    status: 'active',
    views: 28,
    favorites: 5,
    contactInfo: {
      phone: '+1 (555) 234-5678',
      email: 'sarah.smith@example.com',
    },
    isFeatured: false,
  },
  
  // Professional Carpentry Services
  {
    id: 'listing-3',
    title: 'Professional Carpentry Services',
    description: 'Custom carpentry work including cabinets, furniture, and woodworking projects. Quality craftsmanship guaranteed.',
    type: 'service',
    category: 'Home Services',
    subcategory: 'Carpentry',
    tags: ['carpentry', 'woodworking', 'furniture', 'custom'],
    pricing: {
      price: 60,
      currency: 'USD',
      unit: 'hour',
      negotiable: true,
    },
    location: {
      address: '789 Pine St',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA',
      latitude: 45.5051,
      longitude: -122.6750,
    },
    media: [
      {
        id: 'media-4',
        url: '/images/marketplace/carpenter.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Custom designs', 'Quality materials', '10+ years experience', 'Free consultations'],
    userId: 'user-3',
    createdAt: '2025-06-22T09:45:00Z',
    updatedAt: '2025-06-22T09:45:00Z',
    status: 'active',
    views: 35,
    favorites: 9,
    contactInfo: {
      phone: '+1 (555) 345-6789',
      email: 'mike.johnson@example.com',
    },
    isFeatured: true,
  },
  
  // Handyman Services
  {
    id: 'listing-4',
    title: 'General Handyman Services',
    description: 'General handyman services for home repairs, furniture assembly, and minor home improvements.',
    type: 'service',
    category: 'Home Services',
    subcategory: 'Handyman',
    tags: ['handyman', 'repairs', 'assembly', 'home improvement'],
    pricing: {
      price: 45,
      currency: 'USD',
      unit: 'hour',
      negotiable: true,
    },
    location: {
      address: '101 Maple Dr',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
      latitude: 30.2672,
      longitude: -97.7431,
    },
    media: [
      {
        id: 'media-5',
        url: '/images/marketplace/handyman.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Versatile skills', 'Reliable service', 'Quick response', 'Affordable rates'],
    userId: 'user-4',
    createdAt: '2025-06-23T13:20:00Z',
    updatedAt: '2025-06-23T13:20:00Z',
    status: 'active',
    views: 22,
    favorites: 4,
    contactInfo: {
      phone: '+1 (555) 456-7890',
      email: 'david.brown@example.com',
    },
    isFeatured: false,
  },
  
  // Dog Walker
  {
    id: 'listing-5',
    title: 'Professional Dog Walker',
    description: 'Reliable dog walking services. Individual or group walks available. Pet sitting also offered.',
    type: 'service',
    category: 'Pet Services',
    subcategory: 'Dog Walking',
    tags: ['dog walker', 'pet care', 'dog sitting'],
    pricing: {
      price: 20,
      currency: 'USD',
      unit: 'walk',
      negotiable: true,
    },
    location: {
      address: '222 Birch Ln',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      latitude: 47.6062,
      longitude: -122.3321,
    },
    media: [
      {
        id: 'media-6',
        url: '/images/marketplace/dog-walker.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Insured', 'Pet first aid certified', 'Flexible schedule', 'GPS tracked walks'],
    userId: 'user-5',
    createdAt: '2025-06-24T11:10:00Z',
    updatedAt: '2025-06-24T11:10:00Z',
    status: 'active',
    views: 31,
    favorites: 8,
    contactInfo: {
      phone: '+1 (555) 567-8901',
      email: 'emily.wilson@example.com',
    },
    isFeatured: true,
  },
  
  // Professional Driver
  {
    id: 'listing-6',
    title: 'Professional Driver Services',
    description: 'Professional driver available for airport transfers, events, and personal transportation needs.',
    type: 'service',
    category: 'Transportation',
    subcategory: 'Driving',
    tags: ['driver', 'transportation', 'chauffeur'],
    pricing: {
      price: 35,
      currency: 'USD',
      unit: 'hour',
      negotiable: true,
    },
    location: {
      address: '333 Cedar St',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA',
      latitude: 25.7617,
      longitude: -80.1918,
    },
    media: [
      {
        id: 'media-7',
        url: '/images/marketplace/driver.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Clean driving record', 'Luxury vehicle available', 'Punctual', 'Professional attire'],
    userId: 'user-6',
    createdAt: '2025-06-25T15:30:00Z',
    updatedAt: '2025-06-25T15:30:00Z',
    status: 'active',
    views: 19,
    favorites: 3,
    contactInfo: {
      phone: '+1 (555) 678-9012',
      email: 'robert.garcia@example.com',
    },
    isFeatured: false,
  },
  
  // Wedding DJ
  {
    id: 'listing-7',
    title: 'Professional Wedding DJ',
    description: 'Experienced wedding DJ with state-of-the-art equipment. Creating memorable experiences for your special day.',
    type: 'service',
    category: 'Events',
    subcategory: 'DJ Services',
    tags: ['wedding', 'DJ', 'music', 'events'],
    pricing: {
      price: 150,
      currency: 'USD',
      unit: 'hour',
      negotiable: true,
    },
    location: {
      address: '444 Elm St',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      country: 'USA',
      latitude: 42.3314,
      longitude: -83.0458,
    },
    media: [
      {
        id: 'media-8',
        url: '/images/marketplace/Wedding-DJ-Michigan.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Professional equipment', 'Extensive music library', 'MC services', 'Lighting included'],
    userId: 'user-7',
    createdAt: '2025-06-26T12:45:00Z',
    updatedAt: '2025-06-26T12:45:00Z',
    status: 'active',
    views: 48,
    favorites: 12,
    contactInfo: {
      phone: '+1 (555) 789-0123',
      email: 'jason.miller@example.com',
    },
    isFeatured: true,
  },
  
  // Car Repair Services
  {
    id: 'listing-8',
    title: 'Mobile Car Repair Services',
    description: 'Mobile mechanic providing car repair services at your location. Diagnostics, repairs, and maintenance.',
    type: 'service',
    category: 'Automotive',
    subcategory: 'Car Repair',
    tags: ['car repair', 'mechanic', 'automotive'],
    pricing: {
      price: 65,
      currency: 'USD',
      unit: 'hour',
      negotiable: true,
    },
    location: {
      address: '555 Walnut Ave',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA',
      latitude: 33.4484,
      longitude: -112.0740,
    },
    media: [
      {
        id: 'media-9',
        url: '/images/marketplace/car-repair.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['ASE certified', 'Mobile service', 'All makes and models', 'Warranty on parts and labor'],
    userId: 'user-8',
    createdAt: '2025-06-27T09:30:00Z',
    updatedAt: '2025-06-27T09:30:00Z',
    status: 'active',
    views: 26,
    favorites: 6,
    contactInfo: {
      phone: '+1 (555) 890-1234',
      email: 'alex.rodriguez@example.com',
    },
    isFeatured: false,
  },
  
  // Professional Cook
  {
    id: 'listing-9',
    title: 'Professional Chef for Hire',
    description: 'Experienced chef available for private events, dinner parties, and special occasions. Customized menus for all dietary needs.',
    type: 'service',
    category: 'Food Services',
    subcategory: 'Cooking',
    tags: ['chef', 'cooking', 'catering', 'private chef'],
    pricing: {
      price: 120,
      currency: 'USD',
      unit: 'hour',
      negotiable: true,
    },
    location: {
      address: '666 Olive St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      latitude: 34.0522,
      longitude: -118.2437,
    },
    media: [
      {
        id: 'media-10',
        url: '/images/marketplace/professional-cook.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Culinary degree', 'International cuisine', 'Dietary accommodations', 'Brings own equipment'],
    userId: 'user-9',
    createdAt: '2025-06-25T08:15:00Z',
    updatedAt: '2025-06-25T08:15:00Z',
    status: 'active',
    views: 33,
    favorites: 10,
    contactInfo: {
      phone: '+1 (555) 901-2345',
      email: 'maria.chef@example.com',
    },
    isFeatured: true,
  },
  
  // Veterinary Services
  {
    id: 'listing-10',
    title: 'Mobile Veterinary Services',
    description: 'Mobile veterinary care for your pets in the comfort of your home. Routine checkups, vaccinations, and minor treatments.',
    type: 'service',
    category: 'Pet Services',
    subcategory: 'Veterinary',
    tags: ['veterinary', 'pet care', 'animal health', 'mobile vet'],
    pricing: {
      price: 95,
      currency: 'USD',
      unit: 'hour',
      negotiable: false,
    },
    location: {
      address: '777 Birch Rd',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA',
      latitude: 39.7392,
      longitude: -104.9903,
    },
    media: [
      {
        id: 'media-11',
        url: '/images/marketplace/veterinary.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Licensed veterinarian', 'Pet-friendly approach', 'Emergency services', 'Weekend availability'],
    userId: 'user-10',
    createdAt: '2025-06-26T14:20:00Z',
    updatedAt: '2025-06-26T14:20:00Z',
    status: 'active',
    views: 29,
    favorites: 7,
    contactInfo: {
      phone: '+1 (555) 012-3456',
      email: 'dr.pet@example.com',
    },
    isFeatured: false,
  },
  
  // Wedding Planner
  {
    id: 'listing-11',
    title: 'Professional Wedding Planner',
    description: 'Full-service wedding planning from engagement to reception. Creating unforgettable wedding experiences tailored to your vision.',
    type: 'service',
    category: 'Events',
    subcategory: 'Wedding Planning',
    tags: ['wedding', 'planner', 'events', 'coordination'],
    pricing: {
      price: 2500,
      currency: 'USD',
      unit: 'fixed',
      negotiable: true,
    },
    location: {
      address: '888 Rose Ln',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37201',
      country: 'USA',
      latitude: 36.1627,
      longitude: -86.7816,
    },
    media: [
      {
        id: 'media-12',
        url: '/images/marketplace/wedding-planner.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Full service planning', 'Vendor coordination', 'Day-of coordination', 'Budget management'],
    userId: 'user-11',
    createdAt: '2025-06-24T16:40:00Z',
    updatedAt: '2025-06-24T16:40:00Z',
    status: 'active',
    views: 52,
    favorites: 15,
    contactInfo: {
      phone: '+1 (555) 123-4567',
      email: 'weddings@example.com',
    },
    isFeatured: true,
  },
  
  // Wedding Tent Rental
  {
    id: 'listing-12',
    title: 'Wedding Tent & Equipment Rental',
    description: 'High-quality tent rentals for weddings and special events. Various sizes available with setup and takedown included.',
    type: 'equipment',
    category: 'Events',
    subcategory: 'Equipment Rental',
    tags: ['tent', 'wedding', 'rental', 'event equipment'],
    pricing: {
      price: 500,
      currency: 'USD',
      unit: 'day',
      negotiable: true,
    },
    location: {
      address: '999 Willow Dr',
      city: 'Charleston',
      state: 'SC',
      zipCode: '29401',
      country: 'USA',
      latitude: 32.7765,
      longitude: -79.9311,
    },
    media: [
      {
        id: 'media-13',
        url: '/images/marketplace/wedding-tent.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Various sizes', 'Setup included', 'Lighting options', 'Tables and chairs available'],
    userId: 'user-12',
    createdAt: '2025-06-23T10:30:00Z',
    updatedAt: '2025-06-23T10:30:00Z',
    status: 'active',
    views: 38,
    favorites: 9,
    contactInfo: {
      phone: '+1 (555) 234-5678',
      email: 'eventrentals@example.com',
    },
    isFeatured: false,
  },
  
  // Freelance Writer
  {
    id: 'listing-13',
    title: 'Experienced Freelance Writer',
    description: 'Professional writer offering content creation, copywriting, and editing services. SEO-optimized content for websites, blogs, and marketing materials.',
    type: 'service',
    category: 'Writing & Content',
    subcategory: 'Freelance Writing',
    tags: ['writer', 'content', 'copywriting', 'editing'],
    pricing: {
      price: 40,
      currency: 'USD',
      unit: 'hour',
      negotiable: true,
    },
    location: {
      address: '123 Oak St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: 'USA',
      latitude: 42.3601,
      longitude: -71.0589,
    },
    media: [
      {
        id: 'media-14',
        url: '/images/marketplace/writer.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['SEO expertise', 'Fast turnaround', 'Multiple niches', 'Editing services'],
    userId: 'user-13',
    createdAt: '2025-06-22T13:15:00Z',
    updatedAt: '2025-06-22T13:15:00Z',
    status: 'active',
    views: 27,
    favorites: 6,
    contactInfo: {
      phone: '+1 (555) 345-6789',
      email: 'writer@example.com',
    },
    isFeatured: false,
  },
  
  // Heavy Lifting Services
  {
    id: 'listing-14',
    title: 'Heavy Lifting & Moving Services',
    description: 'Strong, reliable help for moving heavy items, furniture assembly, and loading/unloading. Available on short notice.',
    type: 'service',
    category: 'Moving & Labor',
    subcategory: 'Heavy Lifting',
    tags: ['moving', 'lifting', 'labor', 'furniture'],
    pricing: {
      price: 30,
      currency: 'USD',
      unit: 'hour',
      negotiable: true,
    },
    location: {
      address: '456 Pine Ave',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301',
      country: 'USA',
      latitude: 33.7490,
      longitude: -84.3880,
    },
    media: [
      {
        id: 'media-15',
        url: '/images/marketplace/heavy-lifting.jpg',
        type: 'image',
        isPrimary: true,
      },
    ],
    features: ['Strong and reliable', 'Own transportation', 'Moving equipment', 'Furniture assembly'],
    userId: 'user-14',
    createdAt: '2025-06-21T08:45:00Z',
    updatedAt: '2025-06-21T08:45:00Z',
    status: 'active',
    views: 23,
    favorites: 5,
    contactInfo: {
      phone: '+1 (555) 456-7890',
      email: 'stronghelp@example.com',
    },
    isFeatured: false,
  },
];

// Helper function to persist listings to localStorage (when in browser environment)
const persistListings = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('marketplace_listings', JSON.stringify(listings));
  }
};

// Helper function to load listings from localStorage (when in browser environment)
const loadListings = () => {
  if (typeof window !== 'undefined') {
    const storedListings = localStorage.getItem('marketplace_listings');
    if (storedListings) {
      listings = JSON.parse(storedListings);
    }
  }
};

// Initialize by loading any stored listings
loadListings();

/**
 * Service for handling marketplace listings
 */
export const marketplaceService = {
  /**
   * Get all marketplace listings
   * @returns Promise with all listings
   */
  async getAllListings(): Promise<MarketplaceListing[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...listings];
  },

  /**
   * Get listings by user ID
   * @param userId User ID to filter listings by
   * @returns Promise with user's listings
   */
  async getUserListings(userId: string): Promise<MarketplaceListing[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return listings.filter(listing => listing.userId === userId);
  },

  /**
   * Get a specific listing by ID
   * @param listingId Listing ID to fetch
   * @returns Promise with the listing or null if not found
   */
  async getListingById(listingId: string): Promise<MarketplaceListing | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const listing = listings.find(l => l.id === listingId);
    return listing || null;
  },

  /**
   * Create a new listing
   * @param listingData Listing data without ID and timestamps
   * @param userId User ID of the listing creator
   * @returns Promise with the created listing
   */
  async createListing(
    listingData: Omit<MarketplaceListing, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'views' | 'favorites'>,
    userId: string
  ): Promise<MarketplaceListing> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date().toISOString();
    const newListing: MarketplaceListing = {
      ...listingData,
      id: `listing-${uuidv4()}`,
      userId,
      createdAt: now,
      updatedAt: now,
      status: 'active', // For demo purposes, set to active immediately
      views: 0,
      favorites: 0,
    };
    
    listings.push(newListing);
    persistListings();
    
    return newListing;
  },

  /**
   * Update an existing listing
   * @param listingId ID of the listing to update
   * @param listingData Updated listing data
   * @returns Promise with the updated listing or null if not found
   */
  async updateListing(
    listingId: string,
    listingData: Partial<MarketplaceListing>
  ): Promise<MarketplaceListing | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = listings.findIndex(l => l.id === listingId);
    if (index === -1) return null;
    
    const updatedListing = {
      ...listings[index],
      ...listingData,
      updatedAt: new Date().toISOString(),
    };
    
    listings[index] = updatedListing;
    persistListings();
    
    return updatedListing;
  },

  /**
   * Delete a listing
   * @param listingId ID of the listing to delete
   * @returns Promise with success status
   */
  async deleteListing(listingId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const initialLength = listings.length;
    listings = listings.filter(l => l.id !== listingId);
    
    if (listings.length < initialLength) {
      persistListings();
      return true;
    }
    
    return false;
  },

  /**
   * Search listings by query
   * @param query Search query
   * @returns Promise with matching listings
   */
  async searchListings(query: string): Promise<MarketplaceListing[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const lowerQuery = query.toLowerCase();
    return listings.filter(listing => 
      listing.title.toLowerCase().includes(lowerQuery) ||
      listing.description.toLowerCase().includes(lowerQuery) ||
      listing.category.toLowerCase().includes(lowerQuery) ||
      (listing.subcategory && listing.subcategory.toLowerCase().includes(lowerQuery)) ||
      listing.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  /**
   * Filter listings by criteria
   * @param filters Filter criteria
   * @returns Promise with filtered listings
   */
  async filterListings(filters: {
    type?: ListingType;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    status?: ListingStatus;
  }): Promise<MarketplaceListing[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return listings.filter(listing => {
      if (filters.type && listing.type !== filters.type) return false;
      if (filters.category && listing.category !== filters.category) return false;
      if (filters.minPrice && listing.pricing.price < filters.minPrice) return false;
      if (filters.maxPrice && listing.pricing.price > filters.maxPrice) return false;
      if (filters.location && !listing.location.city.toLowerCase().includes(filters.location.toLowerCase()) && 
          !listing.location.state.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.status && listing.status !== filters.status) return false;
      
      return true;
    });
  },
};

export default marketplaceService;
