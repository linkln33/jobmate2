import { scoreSuggestions } from '../mlIntegration';
import { AssistantContextState } from '@/contexts/AssistantContext/types';
import { getSupabaseServiceClient } from '@/lib/supabase/client';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  getSupabaseServiceClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    then: jest.fn().mockImplementation(callback => Promise.resolve(callback({ data: null, error: null })))
  }))
}));

describe('ML Integration - Suggestion Scoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserId = 'user-123';
  const mockContext: AssistantContextState = {
    currentPath: '/project/setup',
    currentMode: 'PROJECT_SETUP',
    isAuthenticated: true,
    userRole: 'SPECIALIST',
    previousInteractions: []
  };

  test('should score suggestions based on context match', async () => {
    const mockSupabase = getSupabaseServiceClient() as jest.Mocked<any>;
    
    // Mock user data
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'users') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: {
              id: mockUserId,
              name: 'Test User',
              email: 'test@example.com',
              role: 'user'
            },
            error: null
          })
        };
      } else if (table === 'userSkills') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [
              { skill: { name: 'JavaScript' } },
              { skill: { name: 'React' } }
            ],
            error: null
          })
        };
      } else if (table === 'assistantMemoryLogs') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: [],
            error: null
          })
        };
      } else if (table === 'assistantPreferences') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({
            data: { proactivityLevel: 2 },
            error: null
          })
        };
      }
      return mockSupabase;
    });

    // Test suggestions
    const suggestions = [
      {
        title: 'Matching suggestion',
        context: 'project_setup',
        action: 'VIEW_PROJECT_SETUP',
        priority: 3
      },
      {
        title: 'Unrelated suggestion',
        context: 'payment',
        action: 'VIEW_PAYMENT',
        priority: 2
      }
    ];

    const result = await scoreSuggestions(mockUserId, suggestions, mockContext);

    // Verify scoring results
    expect(result).toHaveLength(2);
    expect(result[0].relevanceScore).toBeGreaterThan(result[1].relevanceScore);
    expect(result[0].relevanceScore).toBeGreaterThanOrEqual(50);
    expect(result[0].relevanceScore).toBeLessThanOrEqual(100);
  });

  test('should score suggestions based on user history', async () => {
    // Mock user data
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: mockUserId,
      skills: []
    });

    // Mock memory logs with history of accepting similar suggestions
    (prisma as any).assistantMemoryLog.findMany.mockResolvedValue([
      {
        action: 'VIEW_PROFILE',
        context: 'profile',
        interactionType: 'suggestion_accepted',
        createdAt: new Date()
      },
      {
        action: 'VIEW_PROFILE',
        context: 'profile',
        interactionType: 'suggestion_accepted',
        createdAt: new Date()
      }
    ]);
    
    // Mock preferences
    (prisma as any).assistantPreference.findUnique.mockResolvedValue({
      proactivityLevel: 2
    });

    // Test suggestions
    const suggestions = [
      {
        title: 'Profile suggestion',
        context: 'profile',
        action: 'VIEW_PROFILE',
        priority: 2
      },
      {
        title: 'New suggestion',
        context: 'marketplace',
        action: 'VIEW_MARKETPLACE',
        priority: 2
      }
    ];

    const result = await scoreSuggestions(mockUserId, suggestions, mockContext);

    // Verify scoring results - profile suggestion should score higher due to history
    expect(result).toHaveLength(2);
    expect(result[0].relevanceScore).toBeGreaterThan(result[1].relevanceScore);
  });

  test('should boost scores for suggestions matching user skills', async () => {
    const mockSupabase = getSupabaseServiceClient() as jest.Mocked<any>;
    
    // Mock all Supabase responses
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'users') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: {
              id: mockUserId,
              name: 'Test User',
              email: 'test@example.com',
              role: 'user'
            },
            error: null
          })
        };
      } else if (table === 'userSkills') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [
              { skill: { name: 'JavaScript' } },
              { skill: { name: 'React' } },
              { skill: { name: 'Node.js' } }
            ],
            error: null
          })
        };
      } else if (table === 'assistantMemoryLogs') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: [
              {
                context: JSON.stringify({
                  topic: 'JavaScript',
                  sentiment: 'positive'
                })
              },
              {
                context: JSON.stringify({
                  topic: 'React',
                  sentiment: 'positive'
                })
              }
            ],
            error: null
          })
        };
      } else if (table === 'assistantPreferences') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({
            data: { proactivityLevel: 3 },
            error: null
          })
        };
      }
      return mockSupabase;
    });

    // Test suggestions with skills
    const suggestions = [
      {
        title: 'JavaScript job',
        context: 'job_matching',
        action: 'VIEW_JOB',
        priority: 2,
        skills: ['JavaScript', 'HTML']
      },
      {
        title: 'Python job',
        context: 'job_matching',
        action: 'VIEW_JOB',
        priority: 2,
        skills: ['Python', 'Django']
      }
    ];

    const result = await scoreSuggestions(mockUserId, suggestions, mockContext);

    // Verify scoring results - JavaScript job should score higher due to skill match
    expect(result).toHaveLength(2);
    expect(result[0].relevanceScore).toBeGreaterThan(result[1].relevanceScore);
  });

  test('should handle errors gracefully', async () => {
    const mockSupabase = getSupabaseServiceClient() as jest.Mocked<any>;
    
    // Mock database error
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'users') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: new Error('Database error')
          })
        };
      }
      return mockSupabase;
    });

    const suggestions = [
      {
        title: 'Test suggestion',
        context: 'test',
        action: 'TEST',
        priority: 2
      }
    ];

    const result = await scoreSuggestions(mockUserId, suggestions, mockContext);

    // Should return suggestions with default score
    expect(result).toHaveLength(1);
    expect(result[0].relevanceScore).toBe(50);
  });

  test('should apply recency penalty for recently seen suggestions', async () => {
    const mockSupabase = getSupabaseServiceClient() as jest.Mocked<any>;
    
    // Mock all Supabase responses
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'users') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: {
              id: mockUserId,
              name: 'Test User',
              email: 'test@example.com',
              role: 'user'
            },
            error: null
          })
        };
      } else if (table === 'userSkills') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null
          })
        };
      } else if (table === 'assistantMemoryLogs') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: [
              {
                interactionType: 'suggestion_shown',
                context: JSON.stringify({
                  suggestionId: 'suggestion-1'
                }),
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
              }
            ],
            error: null
          })
        };
      } else if (table === 'assistantPreferences') {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({
            data: { proactivityLevel: 2 },
            error: null
          })
        };
      }
      return mockSupabase;
    });

    // Test suggestions
    const suggestions = [
      {
        title: 'Recent suggestion',
        context: 'test',
        action: 'TEST',
        priority: 2
      },
      {
        title: 'New suggestion',
        context: 'test',
        action: 'TEST',
        priority: 2
      }
    ];

    const result = await scoreSuggestions(mockUserId, suggestions, mockContext);

    // Verify scoring results - recent suggestion should have lower score
    expect(result).toHaveLength(2);
    expect(result[0].relevanceScore).toBeLessThan(result[1].relevanceScore);
  });
});
