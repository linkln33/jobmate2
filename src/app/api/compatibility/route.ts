import { NextRequest, NextResponse } from 'next/server';
import { 
  CompatibilityResult, 
  MainCategory, 
  UserPreferences 
} from '@/types/compatibility';

// Mock user preferences database
const userPreferencesDB: Record<string, UserPreferences> = {
  'user-1': {
    userId: 'user-1',
    generalPreferences: {
      location: 'San Francisco, CA',
      maxDistance: 50,
      priceRange: {
        min: 0,
        max: 10000
      },
      priceImportance: 5,
      locationImportance: 4,
      qualityImportance: 4
    },
    categoryPreferences: {
      jobs: {
        desiredSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
        minSalary: 100000,
        maxSalary: 200000,
        workArrangement: ['remote', 'hybrid'],
        experienceLevel: 'mid'
      },
      services: {
        serviceTypes: ['development', 'design', 'marketing'],
        maxPrice: 5000,
        minProviderRating: 4,
        preferredDistance: 20
      },
      rentals: {
        rentalTypes: ['apartments', 'houses', 'rooms'],
        maxPrice: 3500,
        location: 'San Francisco, CA',
        requiredAmenities: ['wifi', 'parking', 'laundry'],
        minDuration: 6,
        maxDuration: 12
      },
      marketplace: {
        categories: ['electronics', 'furniture', 'clothing'],
        maxPrice: 1000,
        minCondition: 'good',
        preferredDistance: 15,
        itemTypes: [],
        maxDistance: 20,
        preferredBrands: []
      },
      favors: {
        favorTypes: ['tech-help', 'errands', 'pet-sitting'],
        maxPrice: 50,
        preferredDistance: 5,
        maxTimeCommitment: 60,
        maxDistance: 10,
        reciprocityImportance: 3
      }
    },
    dailyPreferences: {
      mood: 'neutral',
      timeAvailability: 'moderate',
      intent: 'browsing',
      budget: 500,
      urgency: 3,
      location: 'San Francisco, CA'
    }
  }
};

// Mock compatibility calculation function
function calculateCompatibility(
  userPreferences: UserPreferences,
  listing: any,
  category: MainCategory
): CompatibilityResult {
  // In a real implementation, this would use the compatibility engine
  // For now, we'll return a mock result
  
  const dimensions = [
    {
      name: 'Price Match',
      score: Math.round(Math.random() * 40) + 60, // 60-100
      weight: 0.3,
      description: 'Based on your budget preferences'
    },
    {
      name: category === 'jobs' ? 'Skills Match' : 'Type Match',
      score: Math.round(Math.random() * 40) + 60, // 60-100
      weight: 0.4,
      description: category === 'jobs' 
        ? 'Based on your skill set and experience'
        : 'Based on your category preferences'
    },
    {
      name: 'Location Match',
      score: Math.round(Math.random() * 40) + 60, // 60-100
      weight: 0.2,
      description: 'Based on your location preferences'
    },
    {
      name: 'Overall Fit',
      score: Math.round(Math.random() * 40) + 60, // 60-100
      weight: 0.1,
      description: 'Based on your general preferences'
    }
  ];
  
  // Calculate overall score (weighted average)
  const totalWeight = dimensions.reduce((sum, dim) => sum + dim.weight, 0);
  const weightedSum = dimensions.reduce((sum, dim) => sum + (dim.score * dim.weight), 0);
  const overallScore = Math.round(weightedSum / totalWeight);
  
  return {
    overallScore,
    dimensions,
    category,
    subcategory: listing.subcategory || 'unknown',
    listingId: listing.id,
    userId: userPreferences.userId || '',
    timestamp: new Date(),
    primaryMatchReason: overallScore >= 80 
      ? 'High overall compatibility with your preferences'
      : 'Moderate match based on your preferences',
    improvementSuggestions: [
      'Update your preferences for more accurate matches',
      'Consider expanding your search criteria',
      'Try different search filters'
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, listingId, category, listingData } = body;
    
    // Validate required fields
    if (!userId || !listingId || !category || !listingData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get user preferences
    const userPreferences = userPreferencesDB[userId];
    if (!userPreferences) {
      return NextResponse.json(
        { error: 'User preferences not found' },
        { status: 404 }
      );
    }
    
    // Calculate compatibility
    const result = calculateCompatibility(userPreferences, listingData, category);
    
    // In a real implementation, we might store this result in a database
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating compatibility:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const listingId = searchParams.get('listingId');
    const category = searchParams.get('category') as MainCategory;
    
    // Validate required fields
    if (!userId || !listingId || !category) {
      return NextResponse.json(
        { error: 'Missing required query parameters' },
        { status: 400 }
      );
    }
    
    // Get user preferences
    const userPreferences = userPreferencesDB[userId];
    if (!userPreferences) {
      return NextResponse.json(
        { error: 'User preferences not found' },
        { status: 404 }
      );
    }
    
    // In a real implementation, we would fetch the listing data from a database
    // For now, we'll use a mock listing
    const mockListing = {
      id: listingId,
      title: 'Mock Listing',
      price: 1000,
      location: 'San Francisco, CA',
      subcategory: 'remote'
    };
    
    // Calculate compatibility
    const result = calculateCompatibility(userPreferences, mockListing, category);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating compatibility:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
