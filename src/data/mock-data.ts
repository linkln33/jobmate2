import React from 'react';

// Type definitions for Achievement categories and levels
export type Category = 'service' | 'community' | 'reliability' | 'skill';
export type Level = 'bronze' | 'silver' | 'gold' | 'platinum';

// Achievement data structure
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode; // For component use
  iconName: string; // For mapping to icon component
  dateEarned: string;
  category: Category;
  level: Level;
}

// Review data structure
export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  tags: string[];
  verified: boolean;
  type: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewerLocation: string;
  reviewerJobsCompleted: number;
  detailedRatings: {
    completionRate: number;
    timing: number;
    satisfaction: number;
    cost: number;
    overallExperience: number;
  };
  response?: string;
}

// Mock achievements data
export const mockAchievements: Achievement[] = [
  // Service category achievements
  {
    id: 'service-1',
    name: 'First Service Completed',
    description: 'Successfully completed your first service request',
    iconName: 'Star',
    dateEarned: '2025-01-15',
    category: 'service',
    level: 'bronze'
  },
  {
    id: 'service-2',
    name: 'Service Pro',
    description: 'Completed 10 service requests with an average rating of 4.5+',
    iconName: 'Star',
    dateEarned: '2025-02-20',
    category: 'service',
    level: 'silver'
  },
  {
    id: 'service-3',
    name: 'Service Expert',
    description: 'Completed 50 service requests with an average rating of 4.8+',
    iconName: 'Star',
    dateEarned: '2025-03-10',
    category: 'service',
    level: 'gold'
  },
  
  // Community category achievements
  {
    id: 'community-1',
    name: 'Community Contributor',
    description: 'Helped answer 5 community questions',
    iconName: 'Heart',
    dateEarned: '2025-01-25',
    category: 'community',
    level: 'bronze'
  },
  {
    id: 'community-2',
    name: 'Community Guide',
    description: 'Helped answer 25 community questions with high ratings',
    iconName: 'Heart',
    dateEarned: '2025-03-15',
    category: 'community',
    level: 'silver'
  },
  {
    id: 'community-3',
    name: 'Community Leader',
    description: 'Among the top 1% of community contributors',
    iconName: 'Users',
    dateEarned: '2025-04-05',
    category: 'community',
    level: 'gold'
  },
  
  // Reliability category achievements
  {
    id: 'reliability-1',
    name: 'Punctual Provider',
    description: 'Completed 10 jobs on time',
    iconName: 'Clock',
    dateEarned: '2025-02-05',
    category: 'reliability',
    level: 'bronze'
  },
  {
    id: 'reliability-2',
    name: 'Dependable Expert',
    description: 'Maintained a 98% on-time completion rate for 30+ jobs',
    iconName: 'Shield',
    dateEarned: '2025-03-25',
    category: 'reliability',
    level: 'silver'
  },
  {
    id: 'reliability-3',
    name: 'Reliability Champion',
    description: 'Maintained a perfect on-time record for 50+ jobs',
    iconName: 'Trophy',
    dateEarned: '2025-05-10',
    category: 'reliability',
    level: 'gold'
  },
  
  // Skill category achievements
  {
    id: 'skill-1',
    name: 'Skill Verified',
    description: 'Passed skill assessment with high marks',
    iconName: 'Zap',
    dateEarned: '2025-01-30',
    category: 'skill',
    level: 'bronze'
  },
  {
    id: 'skill-2',
    name: 'Skill Master',
    description: 'Received 20+ compliments on skill quality',
    iconName: 'Wrench',
    dateEarned: '2025-03-20',
    category: 'skill',
    level: 'silver'
  },
  {
    id: 'skill-3',
    name: 'Skill Virtuoso',
    description: 'Recognized as a top 5% provider in your skill category',
    iconName: 'Target',
    dateEarned: '2025-04-15',
    category: 'skill',
    level: 'gold'
  },
  
  // Additional achievements
  {
    id: 'milestone-1',
    name: 'Quick Starter',
    description: 'Completed 5 jobs in your first month',
    iconName: 'Zap',
    dateEarned: '2025-01-28',
    category: 'service',
    level: 'bronze'
  },
  {
    id: 'milestone-2',
    name: 'Revenue Milestone: $1,000',
    description: 'Earned your first $1,000 on the platform',
    iconName: 'Wallet',
    dateEarned: '2025-02-15',
    category: 'service',
    level: 'silver'
  },
  {
    id: 'milestone-3',
    name: 'Revenue Milestone: $10,000',
    description: 'Earned $10,000 on the platform',
    iconName: 'Wallet',
    dateEarned: '2025-04-20',
    category: 'service',
    level: 'gold'
  }
];

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: '1',
    rating: 5,
    title: 'Excellent service, highly recommended!',
    comment: 'John was incredibly professional and completed the job ahead of schedule. The quality of work exceeded my expectations. Will definitely hire again!',
    date: '2025-06-15',
    tags: ['Professional', 'Fast', 'High Quality'],
    verified: true,
    type: 'service',
    reviewerName: 'Sarah Johnson',
    reviewerAvatar: '/images/avatars/avatar-1.jpg',
    reviewerLocation: 'San Francisco, CA',
    reviewerJobsCompleted: 12,
    detailedRatings: {
      completionRate: 5,
      timing: 5,
      satisfaction: 5,
      cost: 4,
      overallExperience: 5
    }
  },
  {
    id: '2',
    rating: 5,
    title: 'Great communication and work quality',
    comment: 'Very responsive and kept me updated throughout the project. The final result was exactly what I needed. Great attention to detail!',
    date: '2025-06-10',
    tags: ['Communicative', 'Detail-oriented', 'On time'],
    verified: true,
    type: 'service',
    reviewerName: 'Michael Chen',
    reviewerAvatar: '/images/avatars/avatar-2.jpg',
    reviewerLocation: 'Seattle, WA',
    reviewerJobsCompleted: 8,
    detailedRatings: {
      completionRate: 5,
      timing: 5,
      satisfaction: 5,
      cost: 5,
      overallExperience: 5
    }
  },
  {
    id: '3',
    rating: 4,
    title: 'Good work, minor delays',
    comment: 'The quality of work was good, but there were some minor delays in completion. Communication was excellent throughout, which made up for the slight delay.',
    date: '2025-06-05',
    tags: ['Quality work', 'Good communication', 'Slight delay'],
    verified: true,
    type: 'service',
    reviewerName: 'Emily Rodriguez',
    reviewerAvatar: '/images/avatars/avatar-3.jpg',
    reviewerLocation: 'Austin, TX',
    reviewerJobsCompleted: 15,
    detailedRatings: {
      completionRate: 4,
      timing: 3,
      satisfaction: 4,
      cost: 4,
      overallExperience: 4
    }
  },
  {
    id: '4',
    rating: 5,
    title: 'Went above and beyond!',
    comment: "Not only completed the requested job perfectly, but also provided valuable suggestions for improvements I hadn't considered. A true professional!",
    date: '2025-05-28',
    tags: ['Above and beyond', 'Professional', 'Value added'],
    verified: true,
    type: 'service',
    reviewerName: 'David Wilson',
    reviewerAvatar: '/images/avatars/avatar-4.jpg',
    reviewerLocation: 'Chicago, IL',
    reviewerJobsCompleted: 7,
    detailedRatings: {
      completionRate: 5,
      timing: 5,
      satisfaction: 5,
      cost: 5,
      overallExperience: 5
    }
  },
  {
    id: '5',
    rating: 3,
    title: 'Decent work but expensive',
    comment: 'The work was completed satisfactorily, but I felt the price was a bit high for what was delivered. Communication could have been better.',
    date: '2025-05-20',
    tags: ['Expensive', 'Average communication'],
    verified: true,
    type: 'service',
    reviewerName: 'Jessica Lee',
    reviewerAvatar: '/images/avatars/avatar-5.jpg',
    reviewerLocation: 'Denver, CO',
    reviewerJobsCompleted: 3,
    detailedRatings: {
      completionRate: 3,
      timing: 4,
      satisfaction: 3,
      cost: 2,
      overallExperience: 3
    }
  },
  {
    id: '6',
    rating: 5,
    title: 'Exceptional attention to detail',
    comment: 'I was impressed by the level of detail and care put into this job. Everything was done exactly as requested and the results were perfect.',
    date: '2025-05-15',
    tags: ['Detail-oriented', 'Perfect execution', 'Professional'],
    verified: true,
    type: 'service',
    reviewerName: 'Robert Taylor',
    reviewerAvatar: '/images/avatars/avatar-6.jpg',
    reviewerLocation: 'Boston, MA',
    reviewerJobsCompleted: 9,
    detailedRatings: {
      completionRate: 5,
      timing: 5,
      satisfaction: 5,
      cost: 4,
      overallExperience: 5
    }
  },
  {
    id: '7',
    rating: 4,
    title: 'Solid work and reliable',
    comment: 'Completed the job as expected with good quality. Was very reliable and stuck to the agreed timeline. Would hire again.',
    date: '2025-05-08',
    tags: ['Reliable', 'On schedule', 'Good quality'],
    verified: true,
    type: 'service',
    reviewerName: 'Amanda Garcia',
    reviewerAvatar: '/images/avatars/avatar-7.jpg',
    reviewerLocation: 'Miami, FL',
    reviewerJobsCompleted: 5,
    detailedRatings: {
      completionRate: 4,
      timing: 5,
      satisfaction: 4,
      cost: 4,
      overallExperience: 4
    }
  },
  {
    id: '8',
    rating: 5,
    title: 'Fantastic experience from start to finish',
    comment: "One of the best service providers I've worked with. Excellent communication, top-notch work quality, and finished ahead of schedule.",
    date: '2025-05-01',
    tags: ['Excellent', 'Fast turnaround', 'Great communication'],
    verified: true,
    type: 'service',
    reviewerName: 'Thomas Brown',
    reviewerAvatar: '/images/avatars/avatar-8.jpg',
    reviewerLocation: 'Portland, OR',
    reviewerJobsCompleted: 11,
    detailedRatings: {
      completionRate: 5,
      timing: 5,
      satisfaction: 5,
      cost: 5,
      overallExperience: 5
    }
  },
  {
    id: '9',
    rating: 2,
    title: 'Disappointing experience',
    comment: 'The work was completed late and not to the standard I expected. Had to request several revisions which further delayed the project.',
    date: '2025-04-25',
    tags: ['Late', 'Below expectations', 'Multiple revisions'],
    verified: true,
    type: 'service',
    reviewerName: 'Nicole White',
    reviewerAvatar: '/images/avatars/avatar-9.jpg',
    reviewerLocation: 'Nashville, TN',
    reviewerJobsCompleted: 4,
    detailedRatings: {
      completionRate: 2,
      timing: 1,
      satisfaction: 2,
      cost: 3,
      overallExperience: 2
    },
    response: 'I apologize for the delays and issues with this project. We experienced some unexpected technical difficulties, but I should have communicated this better. I have learned from this experience and will do better in the future.'
  },
  {
    id: '10',
    rating: 5,
    title: 'Absolutely outstanding service',
    comment: "I couldn't be happier with the service provided. Everything was handled professionally, efficiently, and with great care. The results exceeded my expectations.",
    date: '2025-04-18',
    tags: ['Outstanding', 'Professional', 'Exceeded expectations'],
    verified: true,
    type: 'service',
    reviewerName: 'Kevin Martin',
    reviewerAvatar: '/images/avatars/avatar-10.jpg',
    reviewerLocation: 'Philadelphia, PA',
    reviewerJobsCompleted: 14,
    detailedRatings: {
      completionRate: 5,
      timing: 5,
      satisfaction: 5,
      cost: 5,
      overallExperience: 5
    }
  },
  {
    id: '11',
    rating: 4,
    title: 'Very good work with minor issues',
    comment: 'Overall the work was very good and completed on time. There were a couple of small issues that needed fixing, but they were addressed promptly.',
    date: '2025-04-10',
    tags: ['Good quality', 'Prompt fixes', 'On time'],
    verified: true,
    type: 'service',
    reviewerName: 'Laura Thompson',
    reviewerAvatar: '/images/avatars/avatar-11.jpg',
    reviewerLocation: 'Atlanta, GA',
    reviewerJobsCompleted: 6,
    detailedRatings: {
      completionRate: 4,
      timing: 4,
      satisfaction: 4,
      cost: 4,
      overallExperience: 4
    }
  },
  {
    id: '12',
    rating: 5,
    title: 'Extremely knowledgeable and helpful',
    comment: 'Not only completed the job perfectly, but also took the time to explain things and answer all my questions. A true expert in their field!',
    date: '2025-04-03',
    tags: ['Expert', 'Educational', 'Helpful'],
    verified: true,
    type: 'service',
    reviewerName: 'Daniel Kim',
    reviewerAvatar: '/images/avatars/avatar-12.jpg',
    reviewerLocation: 'Los Angeles, CA',
    reviewerJobsCompleted: 10,
    detailedRatings: {
      completionRate: 5,
      timing: 5,
      satisfaction: 5,
      cost: 4,
      overallExperience: 5
    }
  },
  {
    id: '13',
    rating: 5,
    title: 'Reliable and consistent excellence',
    comment: "This is the third time I've hired this provider, and they consistently deliver excellent results. Always on time, always professional, always high quality.",
    date: '2025-03-28',
    tags: ['Consistent', 'Reliable', 'Repeat client'],
    verified: true,
    type: 'service',
    reviewerName: 'Rachel Green',
    reviewerAvatar: '/images/avatars/avatar-13.jpg',
    reviewerLocation: 'New York, NY',
    reviewerJobsCompleted: 18,
    detailedRatings: {
      completionRate: 5,
      timing: 5,
      satisfaction: 5,
      cost: 5,
      overallExperience: 5
    }
  },
  {
    id: '14',
    rating: 3,
    title: 'Average service, room for improvement',
    comment: 'The work was completed adequately but nothing special. Communication was sporadic and I often had to follow up to get updates on progress.',
    date: '2025-03-20',
    tags: ['Average', 'Poor communication', 'Adequate'],
    verified: true,
    type: 'service',
    reviewerName: 'Steven Clark',
    reviewerAvatar: '/images/avatars/avatar-14.jpg',
    reviewerLocation: 'Dallas, TX',
    reviewerJobsCompleted: 7,
    detailedRatings: {
      completionRate: 3,
      timing: 3,
      satisfaction: 3,
      cost: 3,
      overallExperience: 3
    }
  },
  {
    id: '15',
    rating: 5,
    title: 'Saved the day with last-minute help',
    comment: 'I needed urgent assistance and they responded immediately, completing the job perfectly despite the tight deadline. True professionals who go above and beyond!',
    date: '2025-03-15',
    tags: ['Urgent', 'Responsive', 'Lifesaver'],
    verified: true,
    type: 'service',
    reviewerName: 'Jennifer Adams',
    reviewerAvatar: '/images/avatars/avatar-15.jpg',
    reviewerLocation: 'Washington, DC',
    reviewerJobsCompleted: 9,
    detailedRatings: {
      completionRate: 5,
      timing: 5,
      satisfaction: 5,
      cost: 4,
      overallExperience: 5
    }
  }
];
