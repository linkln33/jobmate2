/**
 * Price Calculator Service
 * 
 * Provides simulated price estimation for various job types and project scopes.
 * In a production environment, this would use real market data and ML models.
 */

import { AssistantMode } from '@/contexts/AssistantContext/types';

// Job categories with base rates (hourly)
export interface JobCategory {
  name: string;
  baseRateMin: number;
  baseRateMax: number;
  description: string;
}

// Project complexity multipliers
export interface ComplexityLevel {
  name: string;
  multiplier: number;
  description: string;
}

// Experience level adjustments
export interface ExperienceLevel {
  name: string;
  adjustment: number;
  description: string;
}

// Location factor (cost of living adjustment)
export interface LocationFactor {
  region: string;
  factor: number;
  description: string;
}

// Project duration impact
export interface DurationImpact {
  duration: string;
  impact: number;
  description: string;
}

// Job categories with base rates
export const jobCategories: JobCategory[] = [
  {
    name: 'Web Development',
    baseRateMin: 35,
    baseRateMax: 150,
    description: 'Website creation, web applications, e-commerce sites'
  },
  {
    name: 'Mobile Development',
    baseRateMin: 40,
    baseRateMax: 160,
    description: 'iOS, Android, cross-platform mobile applications'
  },
  {
    name: 'UI/UX Design',
    baseRateMin: 30,
    baseRateMax: 120,
    description: 'User interface design, user experience, wireframing'
  },
  {
    name: 'Graphic Design',
    baseRateMin: 25,
    baseRateMax: 100,
    description: 'Logos, branding, marketing materials, illustrations'
  },
  {
    name: 'Content Writing',
    baseRateMin: 20,
    baseRateMax: 80,
    description: 'Blog posts, articles, website copy, technical writing'
  },
  {
    name: 'Digital Marketing',
    baseRateMin: 30,
    baseRateMax: 120,
    description: 'SEO, SEM, social media marketing, email campaigns'
  },
  {
    name: 'Data Analysis',
    baseRateMin: 40,
    baseRateMax: 150,
    description: 'Data processing, visualization, insights, reporting'
  },
  {
    name: 'Video Production',
    baseRateMin: 45,
    baseRateMax: 180,
    description: 'Video editing, animation, motion graphics'
  }
];

// Project complexity levels
export const complexityLevels: ComplexityLevel[] = [
  {
    name: 'Basic',
    multiplier: 0.8,
    description: 'Simple functionality, minimal features, standard design'
  },
  {
    name: 'Standard',
    multiplier: 1.0,
    description: 'Average complexity, common features, custom design'
  },
  {
    name: 'Complex',
    multiplier: 1.3,
    description: 'Advanced functionality, multiple integrations, unique features'
  },
  {
    name: 'Enterprise',
    multiplier: 1.8,
    description: 'High complexity, scalability requirements, security features, custom architecture'
  }
];

// Experience levels
export const experienceLevels: ExperienceLevel[] = [
  {
    name: 'Entry Level',
    adjustment: -0.2,
    description: '0-2 years of experience'
  },
  {
    name: 'Intermediate',
    adjustment: 0,
    description: '2-5 years of experience'
  },
  {
    name: 'Senior',
    adjustment: 0.3,
    description: '5-8 years of experience'
  },
  {
    name: 'Expert',
    adjustment: 0.6,
    description: '8+ years of experience, industry recognition'
  }
];

// Location factors
export const locationFactors: LocationFactor[] = [
  {
    region: 'North America',
    factor: 1.2,
    description: 'USA, Canada'
  },
  {
    region: 'Western Europe',
    factor: 1.1,
    description: 'UK, Germany, France, etc.'
  },
  {
    region: 'Eastern Europe',
    factor: 0.7,
    description: 'Poland, Ukraine, Romania, etc.'
  },
  {
    region: 'Asia',
    factor: 0.6,
    description: 'India, Philippines, etc.'
  },
  {
    region: 'Latin America',
    factor: 0.65,
    description: 'Brazil, Mexico, Argentina, etc.'
  },
  {
    region: 'Australia/NZ',
    factor: 1.15,
    description: 'Australia, New Zealand'
  }
];

// Project duration impact
export const durationImpacts: DurationImpact[] = [
  {
    duration: 'Short-term (< 1 week)',
    impact: 0.15,
    description: 'Quick turnaround premium'
  },
  {
    duration: 'Medium-term (1-4 weeks)',
    impact: 0,
    description: 'Standard timeline'
  },
  {
    duration: 'Long-term (1-3 months)',
    impact: -0.05,
    description: 'Slight discount for longer engagement'
  },
  {
    duration: 'Extended (3+ months)',
    impact: -0.1,
    description: 'Discount for stable long-term work'
  }
];

/**
 * Calculate estimated price range for a project
 */
export const calculatePriceEstimate = (
  jobCategoryName: string,
  complexityName: string = 'Standard',
  experienceName: string = 'Intermediate',
  regionName: string = 'North America',
  durationName: string = 'Medium-term (1-4 weeks)',
  hoursRequired: number = 40
): {
  hourlyMin: number;
  hourlyMax: number;
  totalMin: number;
  totalMax: number;
  explanation: string;
} => {
  // Find the job category
  const category = jobCategories.find(cat => cat.name === jobCategoryName) || jobCategories[0];
  
  // Find complexity multiplier
  const complexity = complexityLevels.find(comp => comp.name === complexityName) || complexityLevels[1];
  
  // Find experience adjustment
  const experience = experienceLevels.find(exp => exp.name === experienceName) || experienceLevels[1];
  
  // Find location factor
  const location = locationFactors.find(loc => loc.region === regionName) || locationFactors[0];
  
  // Find duration impact
  const duration = durationImpacts.find(dur => dur.duration === durationName) || durationImpacts[1];
  
  // Calculate base hourly rate with adjustments
  const hourlyMin = Math.round(
    category.baseRateMin * 
    complexity.multiplier * 
    (1 + experience.adjustment) * 
    location.factor *
    (1 + duration.impact)
  );
  
  const hourlyMax = Math.round(
    category.baseRateMax * 
    complexity.multiplier * 
    (1 + experience.adjustment) * 
    location.factor *
    (1 + duration.impact)
  );
  
  // Calculate total project cost
  const totalMin = hourlyMin * hoursRequired;
  const totalMax = hourlyMax * hoursRequired;
  
  // Generate explanation
  const explanation = `
This estimate is based on:
- ${category.name} (${category.description})
- ${complexity.name} complexity (${complexity.description})
- ${experience.name} specialist (${experience.description})
- ${location.region} rates (${location.description})
- ${duration.duration} project (${duration.description})
- Estimated ${hoursRequired} hours of work

For similar projects on JobMate, specialists typically charge between $${hourlyMin}-${hourlyMax}/hour.
The total project cost typically ranges from $${totalMin}-${totalMax}.

Note: Actual prices may vary based on specific requirements, specialist availability, and market conditions.
  `.trim();
  
  return {
    hourlyMin,
    hourlyMax,
    totalMin,
    totalMax,
    explanation
  };
};

/**
 * Get price estimate based on user query and current mode
 */
export const getPriceEstimateFromQuery = (
  query: string,
  mode: AssistantMode
): string => {
  const queryLower = query.toLowerCase();
  
  // Default values
  let jobCategory = 'Web Development';
  let complexity = 'Standard';
  let experience = 'Intermediate';
  let region = 'North America';
  let duration = 'Medium-term (1-4 weeks)';
  let hours = 40;
  
  // Extract job category from query or mode
  if (queryLower.includes('web') || queryLower.includes('website')) {
    jobCategory = 'Web Development';
  } else if (queryLower.includes('mobile') || queryLower.includes('app')) {
    jobCategory = 'Mobile Development';
  } else if (queryLower.includes('design') && (queryLower.includes('ui') || queryLower.includes('ux'))) {
    jobCategory = 'UI/UX Design';
  } else if (queryLower.includes('graphic') || queryLower.includes('logo')) {
    jobCategory = 'Graphic Design';
  } else if (queryLower.includes('content') || queryLower.includes('writ')) {
    jobCategory = 'Content Writing';
  } else if (queryLower.includes('market')) {
    jobCategory = 'Digital Marketing';
  } else if (queryLower.includes('data') || queryLower.includes('analy')) {
    jobCategory = 'Data Analysis';
  } else if (queryLower.includes('video')) {
    jobCategory = 'Video Production';
  }
  
  // Extract complexity from query
  if (queryLower.includes('simple') || queryLower.includes('basic')) {
    complexity = 'Basic';
  } else if (queryLower.includes('complex') || queryLower.includes('advanced')) {
    complexity = 'Complex';
  } else if (queryLower.includes('enterprise') || queryLower.includes('large scale')) {
    complexity = 'Enterprise';
  }
  
  // Extract experience level from query
  if (queryLower.includes('entry') || queryLower.includes('junior') || queryLower.includes('beginner')) {
    experience = 'Entry Level';
  } else if (queryLower.includes('senior') || queryLower.includes('experienced')) {
    experience = 'Senior';
  } else if (queryLower.includes('expert') || queryLower.includes('specialist')) {
    experience = 'Expert';
  }
  
  // Extract region from query
  if (queryLower.includes('europe')) {
    if (queryLower.includes('east')) {
      region = 'Eastern Europe';
    } else {
      region = 'Western Europe';
    }
  } else if (queryLower.includes('asia') || queryLower.includes('india') || queryLower.includes('philippines')) {
    region = 'Asia';
  } else if (queryLower.includes('latin') || queryLower.includes('south america') || queryLower.includes('brazil') || queryLower.includes('mexico')) {
    region = 'Latin America';
  } else if (queryLower.includes('australia') || queryLower.includes('zealand')) {
    region = 'Australia/NZ';
  }
  
  // Extract duration from query
  if (queryLower.includes('quick') || queryLower.includes('fast') || queryLower.includes('urgent') || queryLower.includes('week')) {
    duration = 'Short-term (< 1 week)';
  } else if (queryLower.includes('month')) {
    if (queryLower.includes('3') || queryLower.includes('three') || queryLower.includes('several')) {
      duration = 'Extended (3+ months)';
    } else {
      duration = 'Long-term (1-3 months)';
    }
  }
  
  // Extract hours from query
  const hourMatches = queryLower.match(/(\d+)\s*hours?/);
  if (hourMatches && hourMatches[1]) {
    hours = parseInt(hourMatches[1], 10);
  } else if (queryLower.includes('day')) {
    const dayMatches = queryLower.match(/(\d+)\s*days?/);
    if (dayMatches && dayMatches[1]) {
      hours = parseInt(dayMatches[1], 10) * 8; // Assuming 8 hours per day
    }
  } else if (queryLower.includes('week')) {
    const weekMatches = queryLower.match(/(\d+)\s*weeks?/);
    if (weekMatches && weekMatches[1]) {
      hours = parseInt(weekMatches[1], 10) * 40; // Assuming 40 hours per week
    }
  }
  
  // Calculate the estimate
  const estimate = calculatePriceEstimate(
    jobCategory,
    complexity,
    experience,
    region,
    duration,
    hours
  );
  
  return estimate.explanation;
};

export default {
  calculatePriceEstimate,
  getPriceEstimateFromQuery,
  jobCategories,
  complexityLevels,
  experienceLevels,
  locationFactors,
  durationImpacts
};
