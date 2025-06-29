import { MatchService } from '@/services/match-service';
import { Job } from '@/types/job';
import { Specialist } from '@/types/job-match-types';

describe('MatchService', () => {
  let matchService: MatchService;
  
  // Sample job and specialist for testing
  const sampleJob: Job = {
    id: '1',
    title: 'Test Job',
    description: 'This is a test job',
    city: 'New York',
    zipCode: '10001',
    lat: 40.7128,
    lng: -74.0060,
    budget: 100,
    urgencyLevel: 'normal',
    createdAt: '2023-01-01T00:00:00Z',
    serviceCategory: { name: 'cleaning' },
    customer: { id: '1', name: 'Test Customer', rating: 4.5 }
  };
  
  const sampleSpecialist: Specialist = {
    id: '1',
    name: 'Test Specialist',
    skills: ['cleaning', 'organizing'],
    location: { lat: 40.7128, lng: -74.0060 },
    rating: 4.8,
    hourlyRate: 50,
    availability: { weekdays: true, weekends: false },
    responseTime: 'fast'
  };

  beforeEach(() => {
    matchService = new MatchService();
  });

  test('calculateMatchScore returns a valid match result', () => {
    const result = matchService.calculateMatchScore(sampleJob, sampleSpecialist);
    
    // Verify the result has the expected structure
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('factors');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test('calculateMatchScore handles optional job properties', () => {
    // Create a job with missing optional properties
    const incompleteJob: Job = {
      id: '2',
      title: 'Incomplete Job',
      // Missing description, city, zipCode, etc.
      lat: 40.7128,
      lng: -74.0060,
      budget: 100
    };
    
    // Should not throw an error
    expect(() => {
      const result = matchService.calculateMatchScore(incompleteJob, sampleSpecialist);
      expect(result).toHaveProperty('score');
    }).not.toThrow();
  });

  test('calculateSkillMatch returns higher score for better skill matches', () => {
    // Test with exact match
    const exactMatchScore = matchService.calculateSkillMatch(
      ['cleaning'], 
      ['cleaning', 'organizing']
    );
    
    // Test with no match
    const noMatchScore = matchService.calculateSkillMatch(
      ['plumbing'], 
      ['cleaning', 'organizing']
    );
    
    // Test with partial match
    const partialMatchScore = matchService.calculateSkillMatch(
      ['cleaning', 'plumbing'], 
      ['cleaning', 'organizing']
    );
    
    // Verify scores follow expected pattern
    expect(exactMatchScore).toBeGreaterThan(noMatchScore);
    expect(exactMatchScore).toBeGreaterThanOrEqual(partialMatchScore);
    expect(partialMatchScore).toBeGreaterThan(noMatchScore);
  });

  test('calculateLocationProximity returns higher score for closer locations', () => {
    // Same location
    const sameLocationScore = matchService.calculateLocationProximity(
      { lat: 40.7128, lng: -74.0060 },
      { lat: 40.7128, lng: -74.0060 }
    );
    
    // Nearby location
    const nearbyLocationScore = matchService.calculateLocationProximity(
      { lat: 40.7128, lng: -74.0060 },
      { lat: 40.7130, lng: -74.0065 }
    );
    
    // Far location
    const farLocationScore = matchService.calculateLocationProximity(
      { lat: 40.7128, lng: -74.0060 },
      { lat: 41.8781, lng: -87.6298 } // Chicago coordinates
    );
    
    // Verify scores follow expected pattern
    expect(sameLocationScore).toBeGreaterThan(nearbyLocationScore);
    expect(nearbyLocationScore).toBeGreaterThan(farLocationScore);
  });

  test('calculatePriceMatch returns higher score for better price matches', () => {
    // Create specialists with different rates
    const lowRateSpecialist = { ...sampleSpecialist, hourlyRate: 50 };
    const matchingRateSpecialist = { ...sampleSpecialist, hourlyRate: 100 };
    const highRateSpecialist = { ...sampleSpecialist, hourlyRate: 200 };
    
    // Calculate scores
    const lowRateScore = matchService.calculatePriceMatch(sampleJob, lowRateSpecialist);
    const matchingRateScore = matchService.calculatePriceMatch(sampleJob, matchingRateSpecialist);
    const highRateScore = matchService.calculatePriceMatch(sampleJob, highRateSpecialist);
    
    // Verify scores follow expected pattern
    expect(matchingRateScore).toBeGreaterThanOrEqual(lowRateScore);
    expect(lowRateScore).toBeGreaterThan(highRateScore);
  });

  test('calculateUrgencyCompatibility returns higher score for matching urgency', () => {
    // Create jobs with different urgency levels
    const highUrgencyJob = { ...sampleJob, urgencyLevel: 'high' };
    const normalUrgencyJob = { ...sampleJob, urgencyLevel: 'normal' };
    const lowUrgencyJob = { ...sampleJob, urgencyLevel: 'low' };
    
    // Create specialists with different response times
    const fastSpecialist = { ...sampleSpecialist, responseTime: 'fast' };
    const normalSpecialist = { ...sampleSpecialist, responseTime: 'normal' };
    const slowSpecialist = { ...sampleSpecialist, responseTime: 'slow' };
    
    // Calculate scores for high urgency job
    const highUrgencyFastScore = matchService.calculateUrgencyCompatibility(highUrgencyJob, fastSpecialist);
    const highUrgencySlowScore = matchService.calculateUrgencyCompatibility(highUrgencyJob, slowSpecialist);
    
    // Calculate scores for low urgency job
    const lowUrgencyFastScore = matchService.calculateUrgencyCompatibility(lowUrgencyJob, fastSpecialist);
    const lowUrgencySlowScore = matchService.calculateUrgencyCompatibility(lowUrgencyJob, slowSpecialist);
    
    // Verify scores follow expected pattern
    expect(highUrgencyFastScore).toBeGreaterThan(highUrgencySlowScore);
    expect(lowUrgencySlowScore).toBeGreaterThanOrEqual(lowUrgencyFastScore);
  });
});
