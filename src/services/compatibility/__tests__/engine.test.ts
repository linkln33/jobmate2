import { CompatibilityEngine } from '../engine';
import { compatibilityCache } from '../cache';
import { CompatibilityResult, MainCategory, UserPreferences } from '@/types/compatibility';

// Mock the cache module
jest.mock('../cache', () => {
  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn(),
    invalidate: jest.fn(),
    invalidateForUser: jest.fn(),
    invalidateForListing: jest.fn(),
    clear: jest.fn(),
    size: jest.fn(),
    cleanup: jest.fn()
  };
  return { compatibilityCache: mockCache };
});

// Mock the scorer classes with proper spy functions that can be checked in tests
const mockJobScorerCalculateScore = jest.fn().mockReturnValue({
  overallScore: 85,
  dimensions: [
    { name: 'Skills Match', score: 90, weight: 0.5, description: 'Match between skills' },
    { name: 'Salary Match', score: 80, weight: 0.3, description: 'Match between salary expectations' }
  ],
  category: 'jobs',
  subcategory: 'full-time',
  listingId: 'listing123',
  userId: 'user123',
  timestamp: new Date(),
  primaryMatchReason: 'Strong skills match',
  improvementSuggestions: ['Add more experience details']
});

const mockJobScorer = {
  calculateScore: mockJobScorerCalculateScore
};

jest.mock('../scorers/JobScorer', () => ({
  JobScorer: jest.fn().mockImplementation(() => mockJobScorer)
}));

// Mock other scorers with simplified implementations
jest.mock('../scorers/ServiceScorer', () => ({
  ServiceScorer: jest.fn().mockImplementation(() => ({
    calculateScore: jest.fn().mockReturnValue({
      overallScore: 75,
      dimensions: [
        { name: 'Overall Match', score: 75, weight: 1, description: 'General compatibility score' }
      ],
      category: 'services',
      subcategory: 'handyman',
      listingId: 'listing123',
      userId: 'user123',
      timestamp: new Date(),
      primaryMatchReason: 'Good match',
      improvementSuggestions: []
    })
  }))
}));

jest.mock('../scorers/RentalScorer', () => ({
  RentalScorer: jest.fn().mockImplementation(() => ({
    calculateScore: jest.fn().mockReturnValue({
      overallScore: 75,
      dimensions: [
        { name: 'Overall Match', score: 75, weight: 1, description: 'General compatibility score' }
      ],
      category: 'rentals',
      subcategory: 'apartments',
      listingId: 'listing123',
      userId: 'user123',
      timestamp: new Date(),
      primaryMatchReason: 'Good match',
      improvementSuggestions: []
    })
  }))
}));

jest.mock('../scorers/MarketplaceScorer', () => ({
  MarketplaceScorer: jest.fn().mockImplementation(() => ({
    calculateScore: jest.fn().mockReturnValue({
      overallScore: 75,
      dimensions: [
        { name: 'Overall Match', score: 75, weight: 1, description: 'General compatibility score' }
      ],
      category: 'marketplace',
      subcategory: 'electronics',
      listingId: 'listing123',
      userId: 'user123',
      timestamp: new Date(),
      primaryMatchReason: 'Good match',
      improvementSuggestions: []
    })
  }))
}));

jest.mock('../scorers/FavorScorer', () => ({
  FavorScorer: jest.fn().mockImplementation(() => ({
    calculateScore: jest.fn().mockReturnValue({
      overallScore: 75,
      dimensions: [
        { name: 'Overall Match', score: 75, weight: 1, description: 'General compatibility score' }
      ],
      category: 'favors',
      subcategory: 'errands',
      listingId: 'listing123',
      userId: 'user123',
      timestamp: new Date(),
      primaryMatchReason: 'Good match',
      improvementSuggestions: []
    })
  }))
}));

jest.mock('../scorers/HolidayScorer', () => ({
  HolidayScorer: jest.fn().mockImplementation(() => ({
    calculateScore: jest.fn().mockReturnValue({
      overallScore: 75,
      dimensions: [
        { name: 'Overall Match', score: 75, weight: 1, description: 'General compatibility score' }
      ],
      category: 'holiday',
      subcategory: 'vacation',
      listingId: 'listing123',
      userId: 'user123',
      timestamp: new Date(),
      primaryMatchReason: 'Good match',
      improvementSuggestions: []
    })
  }))
}));

jest.mock('../scorers/ArtScorer', () => ({
  ArtScorer: jest.fn().mockImplementation(() => ({
    calculateScore: jest.fn().mockReturnValue({
      overallScore: 75,
      dimensions: [
        { name: 'Overall Match', score: 75, weight: 1, description: 'General compatibility score' }
      ],
      category: 'art',
      subcategory: 'painting',
      listingId: 'listing123',
      userId: 'user123',
      timestamp: new Date(),
      primaryMatchReason: 'Good match',
      improvementSuggestions: []
    })
  }))
}));

jest.mock('../scorers/GiveawayScorer', () => ({
  GiveawayScorer: jest.fn().mockImplementation(() => ({
    calculateScore: jest.fn().mockReturnValue({
      overallScore: 75,
      dimensions: [
        { name: 'Overall Match', score: 75, weight: 1, description: 'General compatibility score' }
      ],
      category: 'giveaways',
      subcategory: 'furniture',
      listingId: 'listing123',
      userId: 'user123',
      timestamp: new Date(),
      primaryMatchReason: 'Good match',
      improvementSuggestions: []
    })
  }))
}));

jest.mock('../scorers/LearningScorer', () => ({
  LearningScorer: jest.fn().mockImplementation(() => ({
    calculateScore: jest.fn().mockReturnValue({
      overallScore: 75,
      dimensions: [
        { name: 'Overall Match', score: 75, weight: 1, description: 'General compatibility score' }
      ],
      category: 'learning',
      subcategory: 'course',
      listingId: 'listing123',
      userId: 'user123',
      timestamp: new Date(),
      primaryMatchReason: 'Good match',
      improvementSuggestions: []
    })
  }))
}));

jest.mock('../scorers/CommunityScorer', () => ({
  CommunityScorer: jest.fn().mockImplementation(() => ({
    calculateScore: jest.fn().mockReturnValue({
      overallScore: 75,
      dimensions: [
        { name: 'Overall Match', score: 75, weight: 1, description: 'General compatibility score' }
      ],
      category: 'community',
      subcategory: 'event',
      listingId: 'listing123',
      userId: 'user123',
      timestamp: new Date(),
      primaryMatchReason: 'Good match',
      improvementSuggestions: []
    })
  }))
}));

describe('CompatibilityEngine', () => {
  let engine: CompatibilityEngine;
  
  // Common test data
  const userId = 'user123';
  const listingId = 'listing123';
  const category: MainCategory = 'jobs';
  
  const userPreferences: UserPreferences = {
    userId,
    generalPreferences: {
      priceImportance: 0.3,
      locationImportance: 0.2,
      qualityImportance: 0.5
    },
    categoryPreferences: {
      jobs: {
        desiredSkills: ['JavaScript', 'React', 'TypeScript'],
        minSalary: 80000,
        maxSalary: 120000,
        workArrangement: ['remote', 'hybrid'],
        experienceLevel: 'mid-level'
      }
    },
    weightPreferences: {
      skills: 0.5,
      location: 0.2,
      availability: 0.1,
      price: 0.3,
      userPreferences: 0.4,
      previousInteractions: 0.1,
      reputation: 0.2,
      aiTrend: 0.1
    }
  };
  
  const listingData = {
    id: listingId,
    title: 'Senior Frontend Developer',
    skills: ['JavaScript', 'React', 'TypeScript', 'CSS'],
    salary: { min: 90000, max: 130000 },
    location: 'New York',
    subcategory: 'tech'
  };

  // Sample cached result
  const cachedResult: CompatibilityResult = {
    overallScore: 85,
    dimensions: [
      { name: 'Skills Match', score: 90, weight: 0.5, description: 'Match between skills' },
      { name: 'Salary Match', score: 80, weight: 0.3, description: 'Match between salary expectations' }
    ],
    category: 'jobs',
    subcategory: 'full-time',
    listingId,
    userId,
    timestamp: new Date(),
    primaryMatchReason: 'Strong skills match',
    improvementSuggestions: ['Add more experience details']
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a new engine instance for each test
    engine = new CompatibilityEngine();
  });

  test('should check cache before calculating compatibility', async () => {
    // Setup cache miss
    (compatibilityCache.get as jest.Mock).mockReturnValue(null);
    
    // Call the method
    await engine.calculateCompatibility({
      listingId,
      category,
      listingData,
      userPreferences
    });
    
    // Verify cache was checked
    expect(compatibilityCache.get).toHaveBeenCalledWith(userId, listingId, category);
  });

  test('should return cached result when available', async () => {
    // Setup cache hit
    (compatibilityCache.get as jest.Mock).mockReturnValue(cachedResult);
    
    // Call the method
    const result = await engine.calculateCompatibility({
      listingId,
      category,
      listingData,
      userPreferences
    });
    
    // Verify result is from cache
    expect(result).toBe(cachedResult);
    
    // Verify scorer was not called
    expect(mockJobScorerCalculateScore).not.toHaveBeenCalled();
  });

  test('should calculate and cache new result when not in cache', async () => {
    // Setup cache miss
    (compatibilityCache.get as jest.Mock).mockReturnValue(null);
    
    // Call the method
    await engine.calculateCompatibility({
      listingId,
      category,
      listingData,
      userPreferences
    });
    
    // Verify scorer was called
    expect(mockJobScorerCalculateScore).toHaveBeenCalledWith(
      userPreferences,
      listingData,
      undefined
    );
    
    // Verify result was cached
    expect(compatibilityCache.set).toHaveBeenCalled();
  });

  test('should bypass cache when useCache is false', async () => {
    // Setup cache hit (which should be ignored)
    (compatibilityCache.get as jest.Mock).mockReturnValue(cachedResult);
    
    // Call the method with useCache: false
    await engine.calculateCompatibility({
      listingId,
      category,
      listingData,
      userPreferences,
      useCache: false
    });
    
    // Verify cache was not checked
    expect(compatibilityCache.get).not.toHaveBeenCalled();
    
    // Verify scorer was called
    expect(mockJobScorerCalculateScore).toHaveBeenCalled();
  });

  test('should route to the correct scorer based on category', async () => {
    // Test that the jobs category routes to the correct scorer
    // Reset mock call counts
    jest.clearAllMocks();
    
    // Test with jobs category
    const userPreferences = { 
      userId: 'user123', 
      preferences: {}, 
      generalPreferences: { 
        priceImportance: 5, 
        locationImportance: 3, 
        qualityImportance: 4 
      } 
    };
    const listingData = { id: 'listing123', category: 'jobs' };
    
    await engine.calculateCompatibility({
      listingId: 'listing123',
      category: 'jobs',
      userPreferences,
      listingData,
      useCache: false
    });
    
    // Verify the job scorer was called
    expect(mockJobScorerCalculateScore).toHaveBeenCalled();
  });

  test('should include improvement suggestions in detailed compatibility', async () => {
    // Setup cache miss
    (compatibilityCache.get as jest.Mock).mockReturnValue(null);
    
    // Mock the generateImprovementSuggestions method
    const spyOnGenerateImprovementSuggestions = jest.spyOn(
      engine as any, 
      'generateImprovementSuggestions'
    ).mockReturnValue(['Suggestion 1', 'Suggestion 2']);
    
    // Call the detailed method
    const result = await engine.calculateDetailedCompatibility({
      listingId,
      category,
      listingData,
      userPreferences,
      includeImprovementSuggestions: true
    });
    
    // Verify suggestions were generated
    expect(spyOnGenerateImprovementSuggestions).toHaveBeenCalled();
    expect(result.improvementSuggestions).toEqual(['Suggestion 1', 'Suggestion 2']);
    
    // Cleanup
    spyOnGenerateImprovementSuggestions.mockRestore();
  });

  test('should not generate suggestions when not requested', async () => {
    // Setup cache miss
    (compatibilityCache.get as jest.Mock).mockReturnValue(null);
    
    // Mock the generateImprovementSuggestions method
    const spyOnGenerateImprovementSuggestions = jest.spyOn(
      engine as any, 
      'generateImprovementSuggestions'
    );
    
    // Call the detailed method with includeImprovementSuggestions: false
    await engine.calculateDetailedCompatibility({
      listingId,
      category,
      listingData,
      userPreferences,
      includeImprovementSuggestions: false
    });
    
    // Verify suggestions were not generated
    expect(spyOnGenerateImprovementSuggestions).not.toHaveBeenCalled();
    
    // Cleanup
    spyOnGenerateImprovementSuggestions.mockRestore();
  });
});
