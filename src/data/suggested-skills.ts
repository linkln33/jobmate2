import { MainCategory } from '../types/compatibility';

// Interface for skill suggestion
export interface SkillSuggestion {
  name: string;
  category?: string;
}

// Interface for industry suggestion
export interface IndustrySuggestion {
  name: string;
}

// Interface for category-specific skills and industries
export interface CategorySkillsData {
  intentId: string;
  categoryId: string;
  skills: SkillSuggestion[];
  industries: IndustrySuggestion[];
}

// Main data structure for suggested skills and industries
export const SUGGESTED_SKILLS_DATA: CategorySkillsData[] = [
  // Earn Money + Digital & Creative
  {
    intentId: 'earn-money',
    categoryId: 'digital',
    skills: [
      // Web Development
      { name: 'JavaScript', category: 'Web Development' },
      { name: 'React', category: 'Web Development' },
      { name: 'Angular', category: 'Web Development' },
      { name: 'Vue.js', category: 'Web Development' },
      { name: 'Node.js', category: 'Web Development' },
      { name: 'PHP', category: 'Web Development' },
      { name: 'Ruby on Rails', category: 'Web Development' },
      { name: 'HTML5', category: 'Web Development' },
      { name: 'CSS3', category: 'Web Development' },
      { name: 'TypeScript', category: 'Web Development' },
      
      // Design
      { name: 'UI/UX Design', category: 'Design' },
      { name: 'Graphic Design', category: 'Design' },
      { name: 'Logo Design', category: 'Design' },
      { name: 'Illustration', category: 'Design' },
      { name: 'Animation', category: 'Design' },
      { name: 'Adobe Photoshop', category: 'Design' },
      { name: 'Adobe Illustrator', category: 'Design' },
      { name: 'Figma', category: 'Design' },
      { name: 'Adobe InDesign', category: 'Design' },
      
      // Content
      { name: 'Content Writing', category: 'Content' },
      { name: 'Copywriting', category: 'Content' },
      { name: 'Blog Writing', category: 'Content' },
      { name: 'Technical Writing', category: 'Content' },
      { name: 'SEO Writing', category: 'Content' },
      { name: 'Editing', category: 'Content' },
      { name: 'Proofreading', category: 'Content' },
      
      // Marketing
      { name: 'Social Media Marketing', category: 'Marketing' },
      { name: 'Email Marketing', category: 'Marketing' },
      { name: 'Content Marketing', category: 'Marketing' },
      { name: 'SEO', category: 'Marketing' },
      { name: 'SEM', category: 'Marketing' },
      { name: 'Google Analytics', category: 'Marketing' },
      
      // Video
      { name: 'Video Editing', category: 'Video' },
      { name: 'Motion Graphics', category: 'Video' },
      { name: 'Animation', category: 'Video' },
      { name: 'Adobe After Effects', category: 'Video' },
      { name: 'Adobe Premiere Pro', category: 'Video' },
      { name: 'Videography', category: 'Video' },
      
      // Development
      { name: 'Mobile App Development', category: 'Development' },
      { name: 'iOS Development', category: 'Development' },
      { name: 'Android Development', category: 'Development' },
      { name: 'Flutter', category: 'Development' },
      { name: 'React Native', category: 'Development' },
      
      // Other
      { name: '3D Modeling', category: 'Other' },
      { name: 'Game Development', category: 'Other' },
      { name: 'AR/VR Development', category: 'Other' },
      { name: 'Voice Over', category: 'Other' },
      { name: 'Audio Editing', category: 'Other' }
    ],
    industries: [
      { name: 'Technology' },
      { name: 'E-commerce' },
      { name: 'Marketing & Advertising' },
      { name: 'Media & Entertainment' },
      { name: 'Education' },
      { name: 'Healthcare' },
      { name: 'Finance' },
      { name: 'Real Estate' },
      { name: 'Travel & Hospitality' },
      { name: 'Non-profit' }
    ]
  },
  
  // Earn Money + Business Services
  {
    intentId: 'earn-money',
    categoryId: 'business',
    skills: [
      // Administrative
      { name: 'Virtual Assistance', category: 'Administrative' },
      { name: 'Data Entry', category: 'Administrative' },
      { name: 'Transcription', category: 'Administrative' },
      { name: 'Customer Service', category: 'Administrative' },
      { name: 'Email Management', category: 'Administrative' },
      
      // Financial
      { name: 'Bookkeeping', category: 'Financial' },
      { name: 'Accounting', category: 'Financial' },
      { name: 'Financial Analysis', category: 'Financial' },
      { name: 'Tax Preparation', category: 'Financial' },
      { name: 'Payroll Processing', category: 'Financial' },
      
      // Business
      { name: 'Business Analysis', category: 'Business' },
      { name: 'Project Management', category: 'Business' },
      { name: 'Operations Management', category: 'Business' },
      { name: 'Strategic Planning', category: 'Business' },
      
      // HR
      { name: 'Recruiting', category: 'HR' },
      { name: 'HR Management', category: 'HR' },
      { name: 'Training & Development', category: 'HR' },
      { name: 'Employee Relations', category: 'HR' },
      
      // Sales
      { name: 'Lead Generation', category: 'Sales' },
      { name: 'Sales Support', category: 'Sales' },
      { name: 'CRM Management', category: 'Sales' },
      { name: 'Sales Strategy', category: 'Sales' },
      
      // Legal
      { name: 'Legal Research', category: 'Legal' },
      { name: 'Contract Review', category: 'Legal' },
      { name: 'Paralegal Services', category: 'Legal' },
      { name: 'Compliance', category: 'Legal' }
    ],
    industries: [
      { name: 'Professional Services' },
      { name: 'Financial Services' },
      { name: 'Legal Services' },
      { name: 'Healthcare Administration' },
      { name: 'Real Estate' },
      { name: 'Insurance' },
      { name: 'Retail' },
      { name: 'Manufacturing' }
    ]
  },
  
  // Hire Someone + Tech Talent
  {
    intentId: 'hire-someone',
    categoryId: 'tech-talent',
    skills: [
      // Programming Languages
      { name: 'JavaScript', category: 'Programming Languages' },
      { name: 'Python', category: 'Programming Languages' },
      { name: 'Java', category: 'Programming Languages' },
      { name: 'C#', category: 'Programming Languages' },
      { name: 'Ruby', category: 'Programming Languages' },
      { name: 'PHP', category: 'Programming Languages' },
      { name: 'Swift', category: 'Programming Languages' },
      { name: 'Kotlin', category: 'Programming Languages' },
      { name: 'Go', category: 'Programming Languages' },
      { name: 'Rust', category: 'Programming Languages' },
      
      // Frameworks
      { name: 'React', category: 'Frameworks' },
      { name: 'Angular', category: 'Frameworks' },
      { name: 'Vue', category: 'Frameworks' },
      { name: 'Node.js', category: 'Frameworks' },
      { name: 'Django', category: 'Frameworks' },
      { name: 'Flask', category: 'Frameworks' },
      { name: 'Spring', category: 'Frameworks' },
      { name: '.NET', category: 'Frameworks' },
      { name: 'Laravel', category: 'Frameworks' },
      { name: 'Express.js', category: 'Frameworks' },
      
      // Database
      { name: 'SQL', category: 'Database' },
      { name: 'MongoDB', category: 'Database' },
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'MySQL', category: 'Database' },
      { name: 'Redis', category: 'Database' },
      { name: 'Elasticsearch', category: 'Database' },
      { name: 'Firebase', category: 'Database' },
      
      // DevOps
      { name: 'AWS', category: 'DevOps' },
      { name: 'Azure', category: 'DevOps' },
      { name: 'GCP', category: 'DevOps' },
      { name: 'Docker', category: 'DevOps' },
      { name: 'Kubernetes', category: 'DevOps' },
      { name: 'CI/CD', category: 'DevOps' },
      { name: 'Jenkins', category: 'DevOps' },
      { name: 'Terraform', category: 'DevOps' }
    ],
    industries: [
      { name: 'Software Development' },
      { name: 'FinTech' },
      { name: 'HealthTech' },
      { name: 'EdTech' },
      { name: 'E-commerce' },
      { name: 'Media & Entertainment' },
      { name: 'Cybersecurity' }
    ]
  },
  
  // Find Help + Pet Care
  {
    intentId: 'find-help',
    categoryId: 'pet-care',
    skills: [
      { name: 'Dog Walking', category: 'Dog Walking' },
      { name: 'Pet Sitting', category: 'Pet Sitting' },
      { name: 'Pet Transportation', category: 'Pet Transportation' },
      { name: 'Pet Grooming', category: 'Pet Grooming' },
      { name: 'Pet Training', category: 'Pet Training' },
      { name: 'Medication Administration', category: 'Specialty Care' },
      { name: 'Special Needs Pet Care', category: 'Specialty Care' },
      { name: 'Senior Pet Care', category: 'Specialty Care' },
      { name: 'Pet Photography', category: 'Other' },
      { name: 'Pet Birthday Parties', category: 'Other' },
      { name: 'Pet Massage', category: 'Other' },
      { name: 'Pet Nutrition Consulting', category: 'Other' }
    ],
    industries: [
      { name: 'Pet Services' },
      { name: 'Animal Care' },
      { name: 'Veterinary' },
      { name: 'Pet Retail' }
    ]
  },
  
  // Just Browsing + Trending
  {
    intentId: 'just-browsing',
    categoryId: 'trending',
    skills: [
      { name: 'Remote Work', category: 'Popular Services' },
      { name: 'Freelance Writing', category: 'Popular Services' },
      { name: 'Web Design', category: 'Popular Services' },
      { name: 'Social Media Management', category: 'Popular Services' },
      { name: 'Home Renovation', category: 'Popular Services' },
      
      { name: 'AI & Machine Learning', category: 'Trending Skills' },
      { name: 'Blockchain Development', category: 'Trending Skills' },
      { name: 'Data Science', category: 'Trending Skills' },
      { name: 'Digital Marketing', category: 'Trending Skills' },
      { name: 'UX/UI Design', category: 'Trending Skills' }
    ],
    industries: [
      { name: 'Technology' },
      { name: 'Remote Work' },
      { name: 'Gig Economy' },
      { name: 'Creative Services' },
      { name: 'Home Services' }
    ]
  }
];

// Helper functions

// Get skills for a specific intent and category
export function getSkillsForCategory(intentId: string, categoryId: string): SkillSuggestion[] {
  const categoryData = SUGGESTED_SKILLS_DATA.find(
    data => data.intentId === intentId && data.categoryId === categoryId
  );
  return categoryData?.skills || [];
}

// Get industries for a specific intent and category
export function getIndustriesForCategory(intentId: string, categoryId: string): IndustrySuggestion[] {
  const categoryData = SUGGESTED_SKILLS_DATA.find(
    data => data.intentId === intentId && data.categoryId === categoryId
  );
  return categoryData?.industries || [];
}

// Get skills by category for a specific intent and category
export function getSkillsByCategory(intentId: string, categoryId: string): Record<string, SkillSuggestion[]> {
  const skills = getSkillsForCategory(intentId, categoryId);
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, SkillSuggestion[]>);
}
