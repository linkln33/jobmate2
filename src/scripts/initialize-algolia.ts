import { AlgoliaIndexer } from '../utils/algolia-indexer';
import { listingsIndex } from '../utils/algolia';

// Sample marketplace listings data for testing
const sampleListings = [
  // Jobs
  {
    id: 'job-1',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to join our team. Must have 3+ years of experience with React and TypeScript.',
    category: 'jobs',
    subcategory: 'technology',
    jobType: 'full-time',
    price: 120000,
    location: { lat: 37.7749, lng: -122.4194 },
    tags: ['react', 'typescript', 'frontend', 'remote'],
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 500000,
    userId: 'user-1',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
  },
  {
    id: 'job-2',
    title: 'Part-time Graphic Designer',
    description: 'Looking for a creative graphic designer to help with branding and marketing materials. 20 hours per week, flexible schedule.',
    category: 'jobs',
    subcategory: 'design',
    jobType: 'part-time',
    price: 40000,
    location: { lat: 40.7128, lng: -74.0060 },
    tags: ['graphic design', 'branding', 'creative', 'adobe'],
    createdAt: Date.now() - 2000000,
    updatedAt: Date.now() - 1000000,
    userId: 'user-2',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766'
  },
  
  // Services
  {
    id: 'service-1',
    title: 'Professional House Cleaning',
    description: 'Thorough house cleaning service. We bring all supplies and equipment. Satisfaction guaranteed.',
    category: 'services',
    subcategory: 'home',
    serviceType: 'recurring',
    price: 120,
    location: { lat: 34.0522, lng: -118.2437 },
    tags: ['cleaning', 'house', 'home services'],
    createdAt: Date.now() - 3000000,
    updatedAt: Date.now() - 2000000,
    userId: 'user-3',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952'
  },
  {
    id: 'service-2',
    title: 'Mobile Car Detailing',
    description: 'Professional car detailing at your location. Interior and exterior cleaning, waxing, and polishing.',
    category: 'services',
    subcategory: 'automotive',
    serviceType: 'one-time',
    price: 150,
    location: { lat: 33.4484, lng: -112.0740 },
    tags: ['car', 'detailing', 'mobile', 'automotive'],
    createdAt: Date.now() - 4000000,
    updatedAt: Date.now() - 3000000,
    userId: 'user-4',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f'
  },
  
  // Items
  {
    id: 'item-1',
    title: 'MacBook Pro 16" 2021',
    description: 'M1 Pro, 16GB RAM, 512GB SSD. In excellent condition, barely used. Comes with original box and charger.',
    category: 'items',
    subcategory: 'electronics',
    itemCondition: 'like-new',
    price: 1800,
    location: { lat: 47.6062, lng: -122.3321 },
    tags: ['apple', 'laptop', 'macbook', 'computer'],
    createdAt: Date.now() - 5000000,
    updatedAt: Date.now() - 4000000,
    userId: 'user-5',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'
  },
  {
    id: 'item-2',
    title: 'Vintage Mid-Century Modern Dining Table',
    description: 'Beautiful teak dining table from the 1960s. Some minor wear but in great condition overall. 72" x 36".',
    category: 'items',
    subcategory: 'furniture',
    itemCondition: 'good',
    price: 850,
    location: { lat: 30.2672, lng: -97.7431 },
    tags: ['furniture', 'vintage', 'mid-century', 'dining'],
    createdAt: Date.now() - 6000000,
    updatedAt: Date.now() - 5000000,
    userId: 'user-6',
    imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7'
  },
  
  // Rentals
  {
    id: 'rental-1',
    title: 'Modern Downtown Loft',
    description: '1BR/1BA loft in the heart of downtown. Floor-to-ceiling windows, stainless steel appliances, in-unit laundry.',
    category: 'rentals',
    subcategory: 'apartment',
    rentalDuration: 'long-term',
    price: 2200,
    location: { lat: 41.8781, lng: -87.6298 },
    tags: ['apartment', 'downtown', 'loft', 'modern'],
    createdAt: Date.now() - 7000000,
    updatedAt: Date.now() - 6000000,
    userId: 'user-7',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
  },
  {
    id: 'rental-2',
    title: 'Camera Equipment for Weekend Rental',
    description: 'Sony A7III with 24-70mm f/2.8 lens. Available for weekend rentals. Security deposit required.',
    category: 'rentals',
    subcategory: 'equipment',
    rentalDuration: 'short-term',
    price: 150,
    location: { lat: 37.3382, lng: -121.8863 },
    tags: ['camera', 'photography', 'equipment', 'sony'],
    createdAt: Date.now() - 8000000,
    updatedAt: Date.now() - 7000000,
    userId: 'user-8',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
  }
];

/**
 * Initialize Algolia index and populate with sample data
 */
async function initializeAlgolia() {
  console.log('Starting Algolia initialization...');
  
  try {
    // First, configure the index settings
    console.log('Configuring index settings...');
    await AlgoliaIndexer.initializeIndex();
    
    // Check if index already has data
    const { nbHits } = await listingsIndex.search('');
    
    if (nbHits > 0) {
      console.log(`Index already contains ${nbHits} records. Clearing index...`);
      await listingsIndex.clearObjects();
    }
    
    // Add sample listings
    console.log('Adding sample listings...');
    await AlgoliaIndexer.batchIndexListings(sampleListings);
    
    console.log('Algolia initialization complete!');
    console.log(`Added ${sampleListings.length} sample listings to the index.`);
    
  } catch (error) {
    console.error('Error initializing Algolia:', error);
  }
}

// Execute the initialization
initializeAlgolia();
