import { ServiceType } from '../components/shared/service-type-selector';

// Interface for category-specific service types
export interface CategoryServiceTypes {
  intentId: string;
  categoryId: string;
  serviceTypes: ServiceType[];
}

// Main data structure for suggested service types
export const SERVICE_TYPES_DATA: CategoryServiceTypes[] = [
  // Find Help + Pet Care
  {
    intentId: 'find-help',
    categoryId: 'pet-care',
    serviceTypes: [
      // Dog Walking
      { id: 'regular-walks', name: 'Regular Walks', category: 'Dog Walking' },
      { id: 'group-walks', name: 'Group Walks', category: 'Dog Walking' },
      { id: 'puppy-walks', name: 'Puppy Walks', category: 'Dog Walking' },
      { id: 'senior-dog-walks', name: 'Senior Dog Walks', category: 'Dog Walking' },
      
      // Pet Sitting
      { id: 'in-home-sitting', name: 'In-home Pet Sitting', category: 'Pet Sitting' },
      { id: 'overnight-care', name: 'Overnight Care', category: 'Pet Sitting' },
      { id: 'vacation-care', name: 'Vacation Care', category: 'Pet Sitting' },
      { id: 'check-in-visits', name: 'Check-in Visits', category: 'Pet Sitting' },
      
      // Pet Transportation
      { id: 'vet-visits', name: 'Vet Visits', category: 'Pet Transportation' },
      { id: 'grooming-appointments', name: 'Grooming Appointments', category: 'Pet Transportation' },
      { id: 'pet-taxi', name: 'Pet Taxi Services', category: 'Pet Transportation' },
      
      // Pet Grooming
      { id: 'bathing', name: 'Bathing', category: 'Pet Grooming' },
      { id: 'haircuts', name: 'Haircuts', category: 'Pet Grooming' },
      { id: 'nail-trimming', name: 'Nail Trimming', category: 'Pet Grooming' },
      { id: 'ear-cleaning', name: 'Ear Cleaning', category: 'Pet Grooming' },
      { id: 'teeth-brushing', name: 'Teeth Brushing', category: 'Pet Grooming' },
      
      // Pet Training
      { id: 'basic-obedience', name: 'Basic Obedience', category: 'Pet Training' },
      { id: 'behavior-modification', name: 'Behavior Modification', category: 'Pet Training' },
      { id: 'puppy-training', name: 'Puppy Training', category: 'Pet Training' },
      { id: 'specialized-training', name: 'Specialized Training', category: 'Pet Training' },
      
      // Specialty Care
      { id: 'medication-admin', name: 'Medication Administration', category: 'Specialty Care' },
      { id: 'special-needs-care', name: 'Special Needs Care', category: 'Specialty Care' },
      { id: 'senior-pet-care', name: 'Senior Pet Care', category: 'Specialty Care' }
    ]
  },
  
  // Find Help + Childcare
  {
    intentId: 'find-help',
    categoryId: 'childcare',
    serviceTypes: [
      // Babysitting
      { id: 'regular-babysitting', name: 'Regular Babysitting', category: 'Babysitting' },
      { id: 'date-night-care', name: 'Date Night Care', category: 'Babysitting' },
      { id: 'after-school-care', name: 'After-school Care', category: 'Babysitting' },
      { id: 'weekend-care', name: 'Weekend Care', category: 'Babysitting' },
      
      // Nanny Services
      { id: 'full-time-nanny', name: 'Full-time Nanny', category: 'Nanny Services' },
      { id: 'part-time-nanny', name: 'Part-time Nanny', category: 'Nanny Services' },
      { id: 'shared-nanny', name: 'Shared Nanny', category: 'Nanny Services' },
      { id: 'temporary-nanny', name: 'Temporary Nanny', category: 'Nanny Services' },
      
      // Tutoring
      { id: 'homework-help', name: 'Homework Help', category: 'Tutoring' },
      { id: 'subject-tutoring', name: 'Subject-specific Tutoring', category: 'Tutoring' },
      { id: 'test-preparation', name: 'Test Preparation', category: 'Tutoring' },
      { id: 'language-learning', name: 'Language Learning', category: 'Tutoring' },
      
      // Activities
      { id: 'sports-coaching', name: 'Sports Coaching', category: 'Activities' },
      { id: 'arts-crafts', name: 'Arts & Crafts', category: 'Activities' },
      { id: 'music-lessons', name: 'Music Lessons', category: 'Activities' },
      { id: 'educational-activities', name: 'Educational Activities', category: 'Activities' },
      
      // Transportation
      { id: 'school-transport', name: 'School Pick-up/Drop-off', category: 'Transportation' },
      { id: 'activity-transport', name: 'Activity Transportation', category: 'Transportation' },
      { id: 'airport-transport', name: 'Airport Transportation', category: 'Transportation' },
      
      // Special Needs
      { id: 'special-needs-care', name: 'Special Needs Care', category: 'Special Needs' },
      { id: 'therapy-support', name: 'Therapy Support', category: 'Special Needs' },
      { id: 'medical-care', name: 'Medical Care Assistance', category: 'Special Needs' }
    ]
  },
  
  // Hire Someone + Home Services
  {
    intentId: 'hire-someone',
    categoryId: 'home-help',
    serviceTypes: [
      // Cleaning
      { id: 'regular-cleaning', name: 'Regular Cleaning', category: 'Cleaning' },
      { id: 'deep-cleaning', name: 'Deep Cleaning', category: 'Cleaning' },
      { id: 'move-in-out-cleaning', name: 'Move-in/Move-out Cleaning', category: 'Cleaning' },
      { id: 'window-cleaning', name: 'Window Cleaning', category: 'Cleaning' },
      
      // Maintenance
      { id: 'handyman', name: 'Handyman Services', category: 'Maintenance' },
      { id: 'plumbing', name: 'Plumbing', category: 'Maintenance' },
      { id: 'electrical', name: 'Electrical', category: 'Maintenance' },
      { id: 'hvac', name: 'HVAC', category: 'Maintenance' },
      { id: 'appliance-repair', name: 'Appliance Repair', category: 'Maintenance' },
      
      // Renovation
      { id: 'painting', name: 'Painting', category: 'Renovation' },
      { id: 'carpentry', name: 'Carpentry', category: 'Renovation' },
      { id: 'flooring', name: 'Flooring', category: 'Renovation' },
      { id: 'kitchen-remodel', name: 'Kitchen Remodeling', category: 'Renovation' },
      { id: 'bathroom-remodel', name: 'Bathroom Remodeling', category: 'Renovation' },
      
      // Outdoor
      { id: 'landscaping', name: 'Landscaping', category: 'Outdoor' },
      { id: 'lawn-care', name: 'Lawn Care', category: 'Outdoor' },
      { id: 'garden-maintenance', name: 'Garden Maintenance', category: 'Outdoor' },
      { id: 'pest-control', name: 'Pest Control', category: 'Outdoor' },
      
      // Specialty
      { id: 'smart-home', name: 'Smart Home Installation', category: 'Specialty' },
      { id: 'home-security', name: 'Home Security', category: 'Specialty' },
      { id: 'home-staging', name: 'Home Staging', category: 'Specialty' },
      { id: 'interior-design', name: 'Interior Design', category: 'Specialty' }
    ]
  },
  
  // Rent Something + Equipment Rental
  {
    intentId: 'rent-something',
    categoryId: 'equipment-rental',
    serviceTypes: [
      // Tools
      { id: 'power-tools', name: 'Power Tools', category: 'Tools' },
      { id: 'hand-tools', name: 'Hand Tools', category: 'Tools' },
      { id: 'construction-equipment', name: 'Construction Equipment', category: 'Tools' },
      { id: 'gardening-tools', name: 'Gardening Tools', category: 'Tools' },
      
      // Event Equipment
      { id: 'tables-chairs', name: 'Tables & Chairs', category: 'Event Equipment' },
      { id: 'tents', name: 'Tents', category: 'Event Equipment' },
      { id: 'audio-equipment', name: 'Audio Equipment', category: 'Event Equipment' },
      { id: 'lighting', name: 'Lighting', category: 'Event Equipment' },
      { id: 'decorations', name: 'Decorations', category: 'Event Equipment' },
      
      // Photography
      { id: 'cameras', name: 'Cameras', category: 'Photography' },
      { id: 'lenses', name: 'Lenses', category: 'Photography' },
      { id: 'lighting-equipment', name: 'Lighting Equipment', category: 'Photography' },
      { id: 'tripods', name: 'Tripods', category: 'Photography' },
      { id: 'drones', name: 'Drones', category: 'Photography' },
      
      // Sports
      { id: 'bicycles', name: 'Bicycles', category: 'Sports' },
      { id: 'camping-gear', name: 'Camping Gear', category: 'Sports' },
      { id: 'water-sports', name: 'Water Sports Equipment', category: 'Sports' },
      { id: 'winter-sports', name: 'Winter Sports Equipment', category: 'Sports' },
      
      // Electronics
      { id: 'projectors', name: 'Projectors', category: 'Electronics' },
      { id: 'speakers', name: 'Speakers', category: 'Electronics' },
      { id: 'gaming-consoles', name: 'Gaming Consoles', category: 'Electronics' },
      { id: 'vr-equipment', name: 'VR Equipment', category: 'Electronics' }
    ]
  },
  
  // Earn Money + Digital & Creative
  {
    intentId: 'earn-money',
    categoryId: 'digital',
    serviceTypes: [
      // Web Development
      { id: 'website-creation', name: 'Website Creation', category: 'Web Development' },
      { id: 'website-maintenance', name: 'Website Maintenance', category: 'Web Development' },
      { id: 'e-commerce-development', name: 'E-commerce Development', category: 'Web Development' },
      { id: 'web-app-development', name: 'Web App Development', category: 'Web Development' },
      
      // Design
      { id: 'ui-ux-design', name: 'UI/UX Design', category: 'Design' },
      { id: 'graphic-design', name: 'Graphic Design', category: 'Design' },
      { id: 'logo-design', name: 'Logo Design', category: 'Design' },
      { id: 'illustration', name: 'Illustration', category: 'Design' },
      { id: 'branding', name: 'Branding', category: 'Design' },
      
      // Content
      { id: 'blog-writing', name: 'Blog Writing', category: 'Content' },
      { id: 'copywriting', name: 'Copywriting', category: 'Content' },
      { id: 'technical-writing', name: 'Technical Writing', category: 'Content' },
      { id: 'editing', name: 'Editing', category: 'Content' },
      { id: 'proofreading', name: 'Proofreading', category: 'Content' },
      
      // Marketing
      { id: 'social-media', name: 'Social Media Marketing', category: 'Marketing' },
      { id: 'seo', name: 'SEO', category: 'Marketing' },
      { id: 'email-marketing', name: 'Email Marketing', category: 'Marketing' },
      { id: 'content-marketing', name: 'Content Marketing', category: 'Marketing' },
      { id: 'ppc', name: 'PPC Campaigns', category: 'Marketing' },
      
      // Video & Audio
      { id: 'video-editing', name: 'Video Editing', category: 'Video & Audio' },
      { id: 'animation', name: 'Animation', category: 'Video & Audio' },
      { id: 'voice-over', name: 'Voice Over', category: 'Video & Audio' },
      { id: 'audio-editing', name: 'Audio Editing', category: 'Video & Audio' },
      { id: 'podcast-production', name: 'Podcast Production', category: 'Video & Audio' }
    ]
  },
  
  // Just Browsing + Trending
  {
    intentId: 'just-browsing',
    categoryId: 'trending',
    serviceTypes: [
      // Popular Services
      { id: 'remote-work', name: 'Remote Work', category: 'Popular Services' },
      { id: 'freelance-writing', name: 'Freelance Writing', category: 'Popular Services' },
      { id: 'web-design', name: 'Web Design', category: 'Popular Services' },
      { id: 'social-media-management', name: 'Social Media Management', category: 'Popular Services' },
      { id: 'home-renovation', name: 'Home Renovation', category: 'Popular Services' },
      
      // Trending Skills
      { id: 'ai-ml', name: 'AI & Machine Learning', category: 'Trending Skills' },
      { id: 'blockchain', name: 'Blockchain Development', category: 'Trending Skills' },
      { id: 'data-science', name: 'Data Science', category: 'Trending Skills' },
      { id: 'digital-marketing', name: 'Digital Marketing', category: 'Trending Skills' },
      { id: 'ux-ui', name: 'UX/UI Design', category: 'Trending Skills' },
      
      // Seasonal Opportunities
      { id: 'holiday-services', name: 'Holiday Services', category: 'Seasonal Opportunities' },
      { id: 'summer-jobs', name: 'Summer Jobs', category: 'Seasonal Opportunities' },
      { id: 'event-planning', name: 'Event Planning', category: 'Seasonal Opportunities' },
      
      // Local Highlights
      { id: 'local-services', name: 'Local Services', category: 'Local Highlights' },
      { id: 'community-events', name: 'Community Events', category: 'Local Highlights' },
      { id: 'neighborhood-specialists', name: 'Neighborhood Specialists', category: 'Local Highlights' }
    ]
  }
];

// Helper functions

// Get service types for a specific intent and category
export function getServiceTypesForCategory(intentId: string, categoryId: string): ServiceType[] {
  const categoryData = SERVICE_TYPES_DATA.find(
    data => data.intentId === intentId && data.categoryId === categoryId
  );
  return categoryData?.serviceTypes || [];
}

// Get service types by category for a specific intent and category
export function getServiceTypesByCategory(intentId: string, categoryId: string): Record<string, ServiceType[]> {
  const serviceTypes = getServiceTypesForCategory(intentId, categoryId);
  return serviceTypes.reduce((acc, serviceType) => {
    const category = serviceType.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(serviceType);
    return acc;
  }, {} as Record<string, ServiceType[]>);
}
