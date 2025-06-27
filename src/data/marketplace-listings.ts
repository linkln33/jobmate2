import { MarketplaceListingCardProps } from '@/components/marketplace/marketplace-listing-card';
import { MarketplaceListing } from '@/types/marketplace';

// Define the type for marketplace listings
export type MarketplaceListingType = 'item' | 'service' | 'rental' | 'job';

// Mock data for marketplace listings
export const marketplaceListings: MarketplaceListing[] = [
  {
    id: '1',
    title: 'Professional Plumbing Services',
    description: 'Expert plumbing services for residential and commercial properties. Available for emergency repairs and installations.',
    price: 75.00,
    priceUnit: 'hr',
    imageUrl: '/images/marketplace/plumber.png',
    tags: ['plumbing', 'repairs', 'installation'],
    isFeatured: true,
    isVerified: true,
    isVip: true,
    type: 'service',
    category: 'Home Services',
    pricingType: 'hourly',
    address: '123 Main St, San Francisco, CA 94105',
    lat: 37.7897,
    lng: -122.3972,
    sellerName: 'Mike Johnson',
    sellerImage: '/images/avatars/avatar-1.png',
    sellerRating: 4.9,
    sellerResponseTime: 'Usually responds within 1 hour',
    contactPhone: '+1 (415) 555-1234',
    status: 'active',
    user: {
      name: 'Mike Johnson',
      avatar: ''
    },
    stats: {
      views: 125,
      likes: 18
    },
    createdAt: '2025-06-20T10:30:00Z'
  },
  {
    id: '2',
    title: 'Handyman Services',
    description: 'General handyman services for home repairs, furniture assembly, and minor renovations. No job too small!',
    price: '45.00',
    priceUnit: 'hr',
    imageUrl: '/images/marketplace/handyman.jpg',
    tags: ['handyman', 'repairs', 'home improvement'],
    isVerified: true,
    type: 'service',
    category: 'Home Services',
    address: '456 Market St, San Francisco, CA 94105',
    lat: 37.7905,
    lng: -122.3991,
    user: {
      name: 'Robert Smith',
      avatar: ''
    },
    stats: {
      views: 98,
      likes: 24
    },
    createdAt: '2025-06-22T14:15:00Z'
  },
  {
    id: '3',
    title: 'Experienced Babysitter',
    description: 'Certified babysitter with 5+ years of experience. CPR trained and excellent references available.',
    price: '25.00',
    priceUnit: 'hr',
    imageUrl: '/images/marketplace/babysitter.jpg',
    tags: ['childcare', 'babysitting', 'kids'],
    isVerified: true,
    type: 'service',
    category: 'Childcare',
    address: '789 Mission St, San Francisco, CA 94105',
    lat: 37.7884,
    lng: -122.3990,
    user: {
      name: 'Sarah Williams',
      avatar: ''
    },
    stats: {
      views: 156,
      likes: 42
    },
    createdAt: '2025-06-21T09:45:00Z'
  },
  {
    id: '4',
    title: 'Wedding Tent Rental',
    description: 'Large wedding tent available for rent. Perfect for outdoor ceremonies and receptions. Setup and takedown included.',
    price: '750.00',
    priceUnit: 'day',
    imageUrl: '/images/marketplace/wedding-tent.jpg',
    tags: ['wedding', 'rental', 'event'],
    isVip: true,
    type: 'rental',
    category: 'Event Services',
    address: '901 Market St, San Francisco, CA 94105',
    lat: 37.7905,
    lng: -122.3991,
    user: {
      name: 'Event Solutions Inc.',
      avatar: ''
    },
    stats: {
      views: 87,
      likes: 15
    },
    createdAt: '2025-06-23T11:20:00Z'
  },
  {
    id: '5',
    title: 'Professional Carpentry Services',
    description: 'Custom carpentry work including cabinets, furniture, and woodworking. Quality craftsmanship with attention to detail.',
    price: '60.00',
    priceUnit: 'hr',
    imageUrl: '/images/marketplace/carpenter.jpg',
    tags: ['carpentry', 'woodworking', 'custom furniture'],
    isFeatured: true,
    isVerified: true,
    type: 'service',
    category: 'Home Services',
    address: '234 Main St, San Francisco, CA 94105',
    lat: 37.7897,
    lng: -122.3972,
    user: {
      name: 'James Carpenter',
      avatar: ''
    },
    stats: {
      views: 105,
      likes: 31
    },
    createdAt: '2025-06-19T08:45:00Z'
  },
  {
    id: '6',
    title: 'Professional Driver Services',
    description: 'Experienced driver available for airport transfers, events, or personal chauffeur services. Clean driving record and professional demeanor.',
    price: '35.00',
    priceUnit: 'hr',
    imageUrl: '/images/marketplace/driver.jpg',
    tags: ['driver', 'transportation', 'chauffeur'],
    isVip: true,
    type: 'service',
    category: 'Transportation',
    address: '567 Mission St, San Francisco, CA 94105',
    lat: 37.7884,
    lng: -122.3990,
    user: {
      name: 'Daniel Richards',
      avatar: ''
    },
    stats: {
      views: 89,
      likes: 22
    },
    createdAt: '2025-06-18T16:30:00Z'
  },
  {
    id: '7',
    title: 'Heavy Lifting & Moving Help',
    description: 'Strong, reliable help for moving furniture, appliances, or other heavy items. Available for residential or commercial moves.',
    price: '40.00',
    priceUnit: 'hr',
    imageUrl: '/images/marketplace/heavy-lifting.jpg',
    tags: ['moving', 'heavy lifting', 'furniture'],
    isVerified: true,
    isVip: true,
    type: 'service',
    category: 'Moving Services',
    address: '890 Market St, San Francisco, CA 94105',
    lat: 37.7905,
    lng: -122.3991,
    user: {
      name: 'Marcus Strong',
      avatar: ''
    },
    stats: {
      views: 76,
      likes: 18
    },
    createdAt: '2025-06-17T13:20:00Z'
  },
  {
    id: '8',
    title: 'Wedding DJ Services',
    description: 'Professional DJ with extensive wedding experience. High-quality sound system, lighting options, and a vast music library for your special day.',
    price: '800.00',
    priceUnit: 'event',
    imageUrl: '/images/marketplace/Wedding-DJ-Michigan.jpg',
    tags: ['wedding', 'DJ', 'music', 'entertainment'],
    isFeatured: true,
    isVerified: true,
    isVip: false,
    type: 'service',
    category: 'Event Services',
    address: '345 Market St, San Francisco, CA 94105',
    lat: 37.7905,
    lng: -122.3991,
    user: {
      name: 'Alex Beats',
      avatar: ''
    },
    stats: {
      views: 134,
      likes: 47
    },
    createdAt: '2025-06-16T15:10:00Z'
  },
  {
    id: '9',
    title: 'Wedding Planning Services',
    description: 'Full-service wedding planning from engagement to the big day. Vendor coordination, timeline management, and day-of coordination included.',
    price: '2,500.00',
    priceUnit: 'package',
    imageUrl: '/images/marketplace/wedding-planner.jpg',
    tags: ['wedding', 'planning', 'event coordination'],
    isFeatured: true,
    isVerified: true,
    isVip: true,
    type: 'service',
    category: 'Event Services',
    address: '678 Mission St, San Francisco, CA 94105',
    lat: 37.7884,
    lng: -122.3990,
    user: {
      name: 'Elegant Events by Emma',
      avatar: ''
    },
    stats: {
      views: 212,
      likes: 58
    },
    createdAt: '2025-06-15T09:30:00Z'
  },
  {
    id: '10',
    title: 'Plumbing Repair Job',
    description: 'Need a professional plumber to fix a leaking shower and replace bathroom sink. Experienced with residential plumbing required.',
    price: '300.00',
    imageUrl: '/images/marketplace/plumber.png',
    tags: ['plumbing', 'bathroom', 'repair'],
    isVip: true,
    type: 'job',
    category: 'Home Services',
    address: '901 Market St, San Francisco, CA 94105',
    lat: 37.7905,
    lng: -122.3991,
    user: {
      name: 'David Cooper',
      avatar: ''
    },
    stats: {
      views: 65,
      likes: 12
    },
    createdAt: '2025-06-24T10:30:00Z'
  },
  {
    id: '11',
    title: 'Home Renovation Specialist',
    description: 'Looking for an experienced contractor for a complete home renovation project. Must have portfolio and references.',
    price: '10,000.00',
    imageUrl: '/images/marketplace/handyman.jpg',
    tags: ['renovation', 'construction', 'contractor'],
    isFeatured: true,
    type: 'job',
    category: 'Home Improvement',
    address: '234 Main St, San Francisco, CA 94105',
    lat: 37.7897,
    lng: -122.3972,
    user: {
      name: 'Jennifer Adams',
      avatar: ''
    },
    stats: {
      views: 112,
      likes: 28
    },
    createdAt: '2025-06-25T15:45:00Z'
  },
  {
    id: '12',
    title: 'Weekend Childcare Needed',
    description: 'Looking for a reliable babysitter for weekend evenings. Two children ages 5 and 7. References required.',
    price: '20.00',
    priceUnit: 'hr',
    imageUrl: '/images/marketplace/babysitter.jpg',
    tags: ['childcare', 'weekend', 'babysitting'],
    type: 'job',
    category: 'Childcare',
    address: '567 Mission St, San Francisco, CA 94105',
    lat: 37.7884,
    lng: -122.3990,
    user: {
      name: 'Thomas Wilson',
      avatar: ''
    },
    stats: {
      views: 78,
      likes: 19
    },
    createdAt: '2025-06-26T09:15:00Z'
  },
  {
    id: '13',
    title: 'Event Space for Corporate Retreat',
    description: 'Seeking event space rental for a corporate retreat. Need capacity for 50 people with outdoor area and AV equipment.',
    price: '1,200.00',
    priceUnit: 'day',
    imageUrl: '/images/marketplace/wedding-tent.jpg',
    tags: ['corporate', 'event', 'rental'],
    type: 'job',
    category: 'Event Services',
    user: {
      name: 'Tech Innovations LLC',
      avatar: ''
    },
    stats: {
      views: 92,
      likes: 23
    },
    createdAt: '2025-06-27T11:00:00Z'
  },
  {
    id: '14',
    title: 'Custom Cabinetry Project',
    description: 'Looking for a skilled carpenter to build custom kitchen cabinets and a built-in bookshelf. Must have experience with high-end finishes.',
    price: '5,000.00',
    imageUrl: '/images/marketplace/carpenter.jpg',
    tags: ['carpentry', 'cabinetry', 'custom work'],
    isFeatured: true,
    isVip: true,
    type: 'job',
    category: 'Home Improvement',
    user: {
      name: 'Michelle Parker',
      avatar: ''
    },
    stats: {
      views: 83,
      likes: 17
    },
    createdAt: '2025-06-22T08:15:00Z'
  },
  {
    id: '15',
    title: 'Airport Transportation Needed',
    description: 'Need a reliable driver for airport pickup and drop-off. Regular weekly trips, must be punctual and professional.',
    price: '60.00',
    priceUnit: 'trip',
    imageUrl: '/images/marketplace/driver.jpg',
    tags: ['transportation', 'airport', 'driver'],
    type: 'job',
    category: 'Transportation',
    user: {
      name: 'Business Travels Inc.',
      avatar: ''
    },
    stats: {
      views: 67,
      likes: 14
    },
    createdAt: '2025-06-21T16:45:00Z'
  },
  {
    id: '16',
    title: 'Moving Help This Weekend',
    description: 'Need 2 strong individuals to help with a local apartment move. Must be able to lift heavy furniture and appliances.',
    price: '25.00',
    priceUnit: 'hr',
    imageUrl: '/images/marketplace/heavy-lifting.jpg',
    tags: ['moving', 'lifting', 'labor'],
    type: 'job',
    category: 'Moving Services',
    user: {
      name: 'Alex Thompson',
      avatar: ''
    },
    stats: {
      views: 95,
      likes: 21
    },
    createdAt: '2025-06-24T14:30:00Z'
  },
  {
    id: '17',
    title: 'DJ Needed for Wedding Reception',
    description: 'Looking for an experienced DJ for our wedding reception on August 15th. Must have own equipment and a diverse music selection.',
    price: '600.00',
    imageUrl: '/images/marketplace/Wedding-DJ-Michigan.jpg',
    tags: ['wedding', 'DJ', 'music'],
    isFeatured: true,
    isVerified: true,
    type: 'job',
    category: 'Event Services',
    user: {
      name: 'Jessica & Mark',
      avatar: ''
    },
    stats: {
      views: 108,
      likes: 32
    },
    createdAt: '2025-06-23T18:20:00Z'
  },
  {
    id: '18',
    title: 'Wedding Planner for Destination Wedding',
    description: 'Seeking an experienced wedding planner for our destination wedding in Hawaii. Need help with vendor coordination and guest logistics.',
    price: '3,500.00',
    imageUrl: '/images/marketplace/wedding-planner.jpg',
    tags: ['wedding', 'destination', 'planning'],
    isVerified: true,
    isVip: true,
    type: 'job',
    category: 'Event Services',
    user: {
      name: 'Sophia Chen',
      avatar: ''
    },
    stats: {
      views: 124,
      likes: 36
    },
    createdAt: '2025-06-20T11:45:00Z'
  }
];
