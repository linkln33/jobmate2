export interface JobSubcategory {
  id: string;
  name: string;
  description?: string;
  icon?: string; // Lucide icon name
}

export interface JobCategory {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name
  description?: string;
  subcategories: JobSubcategory[];
}

export const JOB_CATEGORIES: JobCategory[] = [
  {
    id: 'home-services',
    name: 'Home Services',
    icon: '🏠',
    description: 'Services for home maintenance, cleaning, and repairs',
    subcategories: [
      { id: 'house-cleaning', name: 'House Cleaning' },
      { id: 'deep-cleaning', name: 'Deep Cleaning / Move-In-Out' },
      { id: 'carpet-cleaning', name: 'Carpet & Upholstery Cleaning' },
      { id: 'window-cleaning', name: 'Window Cleaning' },
      { id: 'pest-control', name: 'Pest Control' },
      { id: 'home-repairs', name: 'Home Repairs' },
      { id: 'handyman', name: 'Handyman Services' },
      { id: 'appliance-repair', name: 'Appliance Installation / Repair' },
      { id: 'plumbing', name: 'Plumbing' },
      { id: 'electrical', name: 'Electrical Services' },
      { id: 'hvac', name: 'HVAC Installation / Maintenance' },
      { id: 'furniture-assembly', name: 'Furniture Assembly' },
      { id: 'painting', name: 'Painting & Decorating' },
      { id: 'smart-home', name: 'Smart Home Installation' }
    ]
  },
  {
    id: 'skilled-trades',
    name: 'Skilled Trades',
    icon: '🛠️',
    description: 'Professional skilled trade services',
    subcategories: [
      { id: 'carpentry', name: 'Carpentry' },
      { id: 'masonry', name: 'Masonry / Concrete Work' },
      { id: 'roofing', name: 'Roofing' },
      { id: 'drywall', name: 'Drywall & Insulation' },
      { id: 'flooring', name: 'Tiling & Flooring' },
      { id: 'welding', name: 'Welding / Metal Work' },
      { id: 'locksmith', name: 'Locksmith Services' },
      { id: 'contracting', name: 'General Contracting' },
      { id: 'construction', name: 'Construction Labor' }
    ]
  },
  {
    id: 'outdoor-garden',
    name: 'Outdoor & Garden',
    icon: '🌿',
    description: 'Outdoor maintenance and landscaping services',
    subcategories: [
      { id: 'landscaping', name: 'Gardening / Landscaping' },
      { id: 'lawn-care', name: 'Lawn Mowing / Lawn Care' },
      { id: 'tree-service', name: 'Tree Trimming / Removal' },
      { id: 'snow-removal', name: 'Snow Removal' },
      { id: 'pool-maintenance', name: 'Pool Cleaning / Maintenance' },
      { id: 'fence-repair', name: 'Fence Installation / Repair' },
      { id: 'gutter-cleaning', name: 'Gutter Cleaning' }
    ]
  },
  {
    id: 'care-assistance',
    name: 'Care & Assistance',
    icon: '👶',
    description: 'Care services for children, elderly, and pets',
    subcategories: [
      { id: 'babysitting', name: 'Babysitting' },
      { id: 'nanny', name: 'Nanny Services' },
      { id: 'elder-care', name: 'Elder Care / Adult Care' },
      { id: 'disability-support', name: 'Disability Support Worker' },
      { id: 'pet-sitting', name: 'Pet Sitting' },
      { id: 'dog-walking', name: 'Dog Walking' },
      { id: 'pet-grooming', name: 'Pet Grooming' },
      { id: 'house-sitting', name: 'House Sitting' }
    ]
  },
  {
    id: 'transport',
    name: 'Transport & Driving',
    icon: '🚚',
    description: 'Transportation, delivery, and driving services',
    subcategories: [
      { id: 'chauffeur', name: 'Personal Driver / Chauffeur' },
      { id: 'ride-service', name: 'Ride Services (Uber-style)' },
      { id: 'moving', name: 'Moving & Hauling' },
      { id: 'furniture-delivery', name: 'Furniture Delivery' },
      { id: 'package-delivery', name: 'Courier / Package Delivery' },
      { id: 'bike-messenger', name: 'Bike Messenger' },
      { id: 'trucking', name: 'Trucking / Heavy Load Transport' },
      { id: 'towing', name: 'Towing Services' }
    ]
  },
  {
    id: 'business',
    name: 'Business Services',
    icon: '💼',
    description: 'Professional services for businesses',
    subcategories: [
      { id: 'virtual-assistant', name: 'Virtual Assistance' },
      { id: 'data-entry', name: 'Data Entry' },
      { id: 'reception', name: 'Reception & Scheduling' },
      { id: 'bookkeeping', name: 'Bookkeeping / Accounting' },
      { id: 'payroll', name: 'Payroll Processing' },
      { id: 'hr-support', name: 'HR / Recruiting Support' },
      { id: 'customer-support', name: 'Customer Support' },
      { id: 'market-research', name: 'Market Research' }
    ]
  },
  {
    id: 'digital',
    name: 'Digital & Creative',
    icon: '💻',
    description: 'Digital, creative, and tech services',
    subcategories: [
      { id: 'web-dev', name: 'Web Development' },
      { id: 'mobile-dev', name: 'Mobile App Development' },
      { id: 'ui-design', name: 'UI/UX Design' },
      { id: 'graphic-design', name: 'Graphic Design' },
      { id: 'seo', name: 'SEO & SEM' },
      { id: 'social-media', name: 'Social Media Management' },
      { id: 'content-writing', name: 'Content Writing / Copywriting' },
      { id: 'video-editing', name: 'Video Editing / Motion Graphics' },
      { id: 'voiceover', name: 'Voiceovers / Audio Editing' },
      { id: 'online-tutoring', name: 'Online Tutoring / Coaching' },
      { id: 'translation', name: 'Language Translation' },
      { id: 'email-marketing', name: 'Email Marketing' },
      { id: 'branding', name: 'Branding & Identity' },
      { id: 'crm-setup', name: 'CRM Setup & Automation' },
      { id: 'ecommerce', name: 'E-commerce Store Setup' }
    ]
  },
  {
    id: 'education',
    name: 'Education & Coaching',
    icon: '🎓',
    description: 'Educational and coaching services',
    subcategories: [
      { id: 'subject-tutoring', name: 'Subject Tutoring' },
      { id: 'test-prep', name: 'Test Prep' },
      { id: 'coding-mentorship', name: 'Coding Bootcamp / Tech Mentorship' },
      { id: 'language-lessons', name: 'Language Lessons' },
      { id: 'life-coaching', name: 'Life Coaching' },
      { id: 'career-coaching', name: 'Career Coaching' },
      { id: 'fitness-coaching', name: 'Fitness Coaching / Personal Training' },
      { id: 'meditation', name: 'Meditation & Mindfulness Sessions' }
    ]
  },
  {
    id: 'personal',
    name: 'Personal & Lifestyle',
    icon: '👗',
    description: 'Personal and lifestyle services',
    subcategories: [
      { id: 'personal-shopper', name: 'Personal Shopper' },
      { id: 'wardrobe-styling', name: 'Wardrobe Styling' },
      { id: 'hair-makeup', name: 'Hair & Makeup Artists' },
      { id: 'event-planning', name: 'Event Planning' },
      { id: 'photography', name: 'Photography' },
      { id: 'massage', name: 'Massage Therapy' },
      { id: 'beauty', name: 'Nail / Beauty Services' },
      { id: 'wellness', name: 'Wellness / Reiki / Energy Healing' }
    ]
  },
  {
    id: 'errands',
    name: 'Errands & Daily Help',
    icon: '🛒',
    description: 'Assistance with daily tasks and errands',
    subcategories: [
      { id: 'grocery', name: 'Grocery Shopping' },
      { id: 'package-pickup', name: 'Package Pick-up / Drop-off' },
      { id: 'prescription', name: 'Prescription Pickup' },
      { id: 'queuing', name: 'Queueing Services' },
      { id: 'laundry', name: 'Laundry & Dry Cleaning Delivery' },
      { id: 'meal-prep', name: 'Meal Prep Services' }
    ]
  },
  {
    id: 'niche',
    name: 'Niche Services',
    icon: '🧱',
    description: 'Specialized and niche services',
    subcategories: [
      { id: 'tattoo', name: 'Tattoo Artists' },
      { id: 'auto-mechanic', name: 'Auto Mechanic On-Demand' },
      { id: 'notary', name: 'Notary Public' },
      { id: 'tech-setup', name: 'Tech Setup' },
      { id: 'equipment-rental', name: 'Equipment Rentals' },
      { id: 'filmmaking', name: 'Filmmaking / Drone Videography' },
      { id: 'mystery-shopping', name: 'Mystery Shopping' },
      { id: 'bartending', name: 'Freelance Bartenders / Waitstaff' },
      { id: 'art-restoration', name: 'Art Restoration / Framing' },
      { id: 'disaster-cleanup', name: 'Disaster Cleanup / Biohazard Cleanup' }
    ]
  },
  {
    id: 'community',
    name: 'Community Services',
    icon: '💡',
    description: 'Community-focused and innovative services',
    subcategories: [
      { id: 'crowdfunded', name: 'Crowdfunded Public Benefit Jobs' },
      { id: 'non-profit', name: 'Verified Non-Profit Listings' },
      { id: 'urgent-help', name: 'Urgent Help Requests' },
      { id: 'multilingual', name: 'Multilingual Jobs / Immigrant Services' }
    ]
  }
];

// Helper function to get all subcategories flattened
export const getAllSubcategories = (): JobSubcategory[] => {
  return JOB_CATEGORIES.flatMap(category => 
    category.subcategories.map(subcategory => ({
      ...subcategory,
      parentCategory: category.id
    }))
  );
};

// Helper function to find a category by subcategory id
export const findCategoryBySubcategory = (subcategoryId: string): JobCategory | undefined => {
  return JOB_CATEGORIES.find(category => 
    category.subcategories.some(sub => sub.id === subcategoryId)
  );
};

// Helper function to get a subcategory by id
export const getSubcategoryById = (id: string): JobSubcategory | undefined => {
  for (const category of JOB_CATEGORIES) {
    const subcategory = category.subcategories.find(sub => sub.id === id);
    if (subcategory) return subcategory;
  }
  return undefined;
};
