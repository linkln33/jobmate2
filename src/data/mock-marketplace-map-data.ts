import { Job } from '@/types/job';

// Mock marketplace job data for the interactive map
export const demoMarketplaceJobs: Job[] = [
  // San Francisco Area Jobs
  {
    id: '1',
    title: 'Website Redesign Project',
    status: 'new',
    urgency: 'high',
    address: '123 Market St, San Francisco, CA',
    price: '$500',
    time: 'Posted 2 hours ago',
    lat: 37.7749,
    lng: -122.4194,
    category: 'design',
    subcategory: 'web-design',
    description: 'Looking for an experienced designer to refresh our company website. Includes new landing pages and responsive design.',
    customer: {
      name: 'TechStart Inc.',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      rating: 4.8
    }
  },
  {
    id: '2',
    title: 'Mobile App Development',
    status: 'new',
    urgency: 'medium',
    address: '456 Market St, San Francisco, CA',
    price: '$2,500',
    time: 'Posted yesterday',
    lat: 37.7825,
    lng: -122.4151,
    category: 'programming',
    subcategory: 'mobile-development',
    description: 'Need a React Native developer to build a marketplace app with payment integration.',
    customer: {
      name: 'Mobile Solutions',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      rating: 4.9
    }
  },
  {
    id: '3',
    title: 'Logo Design for New Brand',
    status: 'accepted',
    urgency: 'low',
    address: '789 Mission St, San Francisco, CA',
    price: '$300',
    time: '3 days ago',
    lat: 37.7841,
    lng: -122.4076,
    category: 'design',
    subcategory: 'logo-design',
    description: 'Creative logo needed for a sustainable fashion brand. Must be modern and eco-friendly.',
    customer: {
      name: 'EcoFashion',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      rating: 4.5
    }
  },
  {
    id: '4',
    title: 'Content Writing for Blog',
    status: 'new',
    urgency: 'high',
    address: '321 Hayes St, San Francisco, CA',
    price: '$25/hour',
    time: 'Posted today',
    lat: 37.7764,
    lng: -122.4242,
    category: 'writing',
    subcategory: 'blogging',
    description: 'Looking for a writer to create tech-related blog posts. Knowledge of AI and ML preferred.',
    customer: {
      name: 'Tech Insights',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.7
    }
  },
  {
    id: '5',
    title: 'Virtual Assistant Needed',
    status: 'in_progress',
    urgency: 'medium',
    address: '555 California St, San Francisco, CA',
    price: '$20/hour',
    time: '1 week ago',
    lat: 37.7929,
    lng: -122.4089,
    category: 'virtual-assistant',
    subcategory: 'admin-support',
    description: 'Need assistance with email management, scheduling, and basic data entry. 10-15 hours weekly.',
    customer: {
      name: 'Executive Solutions',
      avatar: 'https://randomuser.me/api/portraits/women/15.jpg',
      rating: 4.9
    }
  },
  {
    id: '6',
    title: 'Social Media Management',
    status: 'new',
    urgency: 'low',
    address: '101 California St, San Francisco, CA',
    price: '$750/month',
    time: 'Posted 3 days ago',
    lat: 37.7937,
    lng: -122.3982,
    category: 'marketing',
    subcategory: 'social-media',
    description: 'Looking for an experienced social media manager for our wellness brand. Focus on Instagram and TikTok.',
    customer: {
      name: 'Wellness Connect',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      rating: 4.6
    }
  },
  {
    id: '7',
    title: 'Video Editing for YouTube',
    status: 'completed',
    urgency: 'medium',
    address: '1 Market St, San Francisco, CA',
    price: '$40/hour',
    time: '2 weeks ago',
    lat: 37.7941,
    lng: -122.3944,
    category: 'video',
    subcategory: 'video-editing',
    description: 'Need quick video editing for our company\'s YouTube channel. Weekly basis, 3-5 videos per week.',
    customer: {
      name: 'Media Productions',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      rating: 5.0
    }
  },
];
