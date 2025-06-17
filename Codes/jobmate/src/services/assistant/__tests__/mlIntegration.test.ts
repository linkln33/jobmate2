import { scoreSuggestions } from '../mlIntegration';
import { AssistantContextState } from '@/contexts/AssistantContext/types';
import { prisma } from '@/lib/prisma';

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

// Mock assistantMemoryLog and assistantPreference
(prisma as any).assistantMemoryLog = {
  findMany: jest.fn()
};

(prisma as any).assistantPreference = {
  findUnique: jest.fn()
};

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
    // Mock user data
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: mockUserId,
      skills: [{ skill: { name: 'JavaScript' } }, { skill: { name: 'React' } }]
    });

    // Mock memory logs (empty for this test)
    (prisma as any).assistantMemoryLog.findMany.mockResolvedValue([]);
    
    // Mock preferences
    (prisma as any).assistantPreference.findUnique.mockResolvedValue({
      proactivityLevel: 2
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

  test('should score suggestions based on skill relevance', async () => {
    // Mock user data with skills
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: mockUserId,
      skills: [
        { skill: { name: 'JavaScript' } },
        { skill: { name: 'React' } },
        { skill: { name: 'Node.js' } }
      ]
    });

    // Mock memory logs (empty for this test)
    (prisma as any).assistantMemoryLog.findMany.mockResolvedValue([]);
    
    // Mock preferences
    (prisma as any).assistantPreference.findUnique.mockResolvedValue({
      proactivityLevel: 3
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
    // Force an error by making the Prisma call reject
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

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
    // Mock user data
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: mockUserId,
      skills: []
    });

    // Mock memory logs with recent suggestion
    (prisma as any).assistantMemoryLog.findMany.mockResolvedValue([
      {
        title: 'Recent suggestion',
        context: 'test',
        interactionType: 'suggestion_shown',
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
