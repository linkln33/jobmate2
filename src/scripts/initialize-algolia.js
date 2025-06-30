// Script to initialize Algolia with sample data
// Run this script with: node src/scripts/initialize-algolia.js

// Load environment variables from .env file if present
require('dotenv').config();

// Import algoliasearch using CommonJS syntax
const algoliasearch = require('algoliasearch');

// Use environment variables or fallback to placeholders
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'placeholder';
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || 'placeholder';

console.log('Initializing Algolia with App ID:', ALGOLIA_APP_ID);

// Initialize the Algolia client
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);

// Create and configure indices
const listingsIndex = client.initIndex('jobmate_listings');
const specialistsIndex = client.initIndex('jobmate_specialists');

// Configure index settings
async function configureIndices() {
  try {
    // Configure listings index
    await listingsIndex.setSettings({
      searchableAttributes: [
        'title',
        'description',
        'tags',
        'category',
        'subcategory'
      ],
      attributesForFaceting: [
        'category',
        'subcategory',
        'jobType',
        'serviceType',
        'itemCondition',
        'rentalDuration',
        'searchable(tags)'
      ],
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom'
      ],
      customRanking: [
        'desc(updatedAt)',
        'desc(createdAt)'
      ]
    });
    console.log('Listings index configured successfully');

    // Configure specialists index
    await specialistsIndex.setSettings({
      searchableAttributes: [
        'title',
        'description',
        'tags',
        'category',
        'subcategory'
      ],
      attributesForFaceting: [
        'category',
        'subcategory',
        'tags',
        'searchable(skills)'
      ],
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom'
      ],
      customRanking: [
        'desc(rating)',
        'desc(reviews)',
        'desc(completedJobs)'
      ]
    });
    console.log('Specialists index configured successfully');

  } catch (error) {
    console.error('Error configuring indices:', error);
  }
}

// Sample data for listings
const sampleListings = [
  // Jobs
  {
    objectID: 'job-1',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to join our team. Must have 3+ years of experience with React and TypeScript.',
    category: 'jobs',
    subcategory: 'technology',
    jobType: 'full-time',
    price: 120000,
    location: { 
      lat: 37.7749, 
      lng: -122.4194,
      city: 'San Francisco',
      country: 'USA'
    },
    tags: ['react', 'typescript', 'frontend', 'remote'],
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 500000,
    userId: 'user-1',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    company: 'TechCorp Inc.'
  },
  {
    objectID: 'job-2',
    title: 'Part-time Graphic Designer',
    description: 'Looking for a creative graphic designer to help with branding and marketing materials. 20 hours per week, flexible schedule.',
    category: 'jobs',
    subcategory: 'design',
    jobType: 'part-time',
    price: 40000,
    location: { 
      lat: 40.7128, 
      lng: -74.0060,
      city: 'New York',
      country: 'USA'
    },
    tags: ['graphic design', 'branding', 'creative', 'adobe'],
    createdAt: Date.now() - 2000000,
    updatedAt: Date.now() - 1000000,
    userId: 'user-2',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766',
    company: 'Creative Solutions'
  },
  
  // Services
  {
    objectID: 'service-1',
    title: 'Professional House Cleaning',
    description: 'Thorough house cleaning service. We bring all supplies and equipment. Satisfaction guaranteed.',
    category: 'services',
    subcategory: 'home',
    serviceType: 'recurring',
    price: 120,
    location: { 
      lat: 34.0522, 
      lng: -118.2437,
      city: 'Los Angeles',
      country: 'USA'
    },
    tags: ['cleaning', 'house', 'home services'],
    createdAt: Date.now() - 3000000,
    updatedAt: Date.now() - 2000000,
    userId: 'user-3',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    company: 'CleanHome Services'
  },
  {
    objectID: 'service-2',
    title: 'Mobile Car Detailing',
    description: 'Professional car detailing at your location. Interior and exterior cleaning, waxing, and polishing.',
    category: 'services',
    subcategory: 'automotive',
    serviceType: 'one-time',
    price: 150,
    location: { 
      lat: 33.4484, 
      lng: -112.0740,
      city: 'Phoenix',
      country: 'USA'
    },
    tags: ['car', 'detailing', 'mobile', 'automotive'],
    createdAt: Date.now() - 4000000,
    updatedAt: Date.now() - 3000000,
    userId: 'user-4',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f',
    company: 'AutoSpa Mobile'
  },
  
  // Items
  {
    objectID: 'item-1',
    title: 'MacBook Pro 16" 2021',
    description: 'M1 Pro, 16GB RAM, 512GB SSD. In excellent condition, barely used. Comes with original box and charger.',
    category: 'items',
    subcategory: 'electronics',
    itemCondition: 'like-new',
    price: 1800,
    location: { 
      lat: 47.6062, 
      lng: -122.3321,
      city: 'Seattle',
      country: 'USA'
    },
    tags: ['apple', 'laptop', 'macbook', 'computer'],
    createdAt: Date.now() - 5000000,
    updatedAt: Date.now() - 4000000,
    userId: 'user-5',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    company: 'Private Seller'
  },
  {
    objectID: 'item-2',
    title: 'Vintage Mid-Century Modern Dining Table',
    description: 'Beautiful teak dining table from the 1960s. Some minor wear but in great condition overall. 72" x 36".',
    category: 'items',
    subcategory: 'furniture',
    itemCondition: 'good',
    price: 850,
    location: { 
      lat: 30.2672, 
      lng: -97.7431,
      city: 'Austin',
      country: 'USA'
    },
    tags: ['furniture', 'vintage', 'mid-century', 'dining'],
    createdAt: Date.now() - 6000000,
    updatedAt: Date.now() - 5000000,
    userId: 'user-6',
    imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7',
    company: 'Vintage Finds'
  },
  
  // Rentals
  {
    objectID: 'rental-1',
    title: 'Modern Downtown Loft',
    description: '1BR/1BA loft in the heart of downtown. Floor-to-ceiling windows, stainless steel appliances, in-unit laundry.',
    category: 'rentals',
    subcategory: 'apartment',
    rentalDuration: 'long-term',
    price: 2200,
    location: { 
      lat: 41.8781, 
      lng: -87.6298,
      city: 'Chicago',
      country: 'USA'
    },
    tags: ['apartment', 'downtown', 'loft', 'modern'],
    createdAt: Date.now() - 7000000,
    updatedAt: Date.now() - 6000000,
    userId: 'user-7',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    company: 'Urban Living Rentals'
  },
  {
    objectID: 'rental-2',
    title: 'Camera Equipment for Weekend Rental',
    description: 'Sony A7III with 24-70mm f/2.8 lens. Available for weekend rentals. Security deposit required.',
    category: 'rentals',
    subcategory: 'equipment',
    rentalDuration: 'short-term',
    price: 150,
    location: { 
      lat: 37.3382, 
      lng: -121.8863,
      city: 'San Jose',
      country: 'USA'
    },
    tags: ['camera', 'photography', 'equipment', 'sony'],
    createdAt: Date.now() - 8000000,
    updatedAt: Date.now() - 7000000,
    userId: 'user-8',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    company: 'Pro Equipment Rentals'
  }
];

// Sample data for specialists
const sampleSpecialists = [
  {
    objectID: 'specialist-1',
    title: 'John Doe',
    description: 'Full-stack developer with 8+ years of experience specializing in React and Node.js applications. I create responsive, user-friendly web applications with clean code and modern best practices.',
    category: 'specialists',
    subcategory: 'Senior Web Developer',
    price: 85, // hourly rate
    location: { 
      lat: 37.7749, 
      lng: -122.4194,
      city: 'New York',
      country: 'USA'
    },
    tags: ['React', 'Node.js', 'TypeScript', 'Next.js'],
    createdAt: Date.now() - 9000000,
    updatedAt: Date.now() - 8000000,
    userId: 'user-9',
    imageUrl: '',
    rating: 4.9,
    reviews: 124,
    completedJobs: 78
  },
  {
    objectID: 'specialist-2',
    title: 'Jane Smith',
    description: 'Creative UI/UX designer focused on creating beautiful, intuitive interfaces. I combine aesthetics with functionality to deliver exceptional user experiences.',
    category: 'specialists',
    subcategory: 'UI/UX Designer',
    price: 75, // hourly rate
    location: { 
      lat: 37.7749, 
      lng: -122.4194,
      city: 'San Francisco',
      country: 'USA'
    },
    tags: ['Figma', 'Adobe XD', 'Sketch', 'User Research'],
    createdAt: Date.now() - 10000000,
    updatedAt: Date.now() - 9000000,
    userId: 'user-10',
    imageUrl: '',
    rating: 4.8,
    reviews: 98,
    completedJobs: 65
  },
  {
    objectID: 'specialist-3',
    title: 'Michael Johnson',
    description: 'DevOps specialist with expertise in cloud infrastructure, containerization, and automation. I help teams build robust, scalable deployment pipelines.',
    category: 'specialists',
    subcategory: 'DevOps Engineer',
    price: 90, // hourly rate
    location: { 
      lat: 30.2672, 
      lng: -97.7431,
      city: 'Austin',
      country: 'USA'
    },
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    createdAt: Date.now() - 11000000,
    updatedAt: Date.now() - 10000000,
    userId: 'user-11',
    imageUrl: '',
    rating: 4.7,
    reviews: 87,
    completedJobs: 54
  },
  {
    objectID: 'specialist-4',
    title: 'Emily Chen',
    description: 'Mobile developer specializing in cross-platform applications. I build high-performance, native-feeling apps for both iOS and Android platforms.',
    category: 'specialists',
    subcategory: 'Mobile App Developer',
    price: 80, // hourly rate
    location: { 
      lat: 47.6062, 
      lng: -122.3321,
      city: 'Seattle',
      country: 'USA'
    },
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
    createdAt: Date.now() - 12000000,
    updatedAt: Date.now() - 11000000,
    userId: 'user-12',
    imageUrl: '',
    rating: 4.9,
    reviews: 112,
    completedJobs: 92
  }
];

// Add sample data to indices
async function addSampleData() {
  try {
    // Clear existing data
    await listingsIndex.clearObjects();
    await specialistsIndex.clearObjects();
    console.log('Cleared existing data from indices');

    // Add listings
    await listingsIndex.saveObjects(sampleListings);
    console.log(`Added ${sampleListings.length} listings to the index`);

    // Add specialists
    await specialistsIndex.saveObjects(sampleSpecialists);
    console.log(`Added ${sampleSpecialists.length} specialists to the index`);

  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

// Run the initialization
async function initialize() {
  console.log('Starting Algolia initialization...');
  
  try {
    await configureIndices();
    await addSampleData();
    
    console.log('Algolia initialization complete!');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

initialize();
