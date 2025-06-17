/**
 * API utilities for job matching
 */

interface MatchFilters {
  categories?: string[];
  maxDistance?: number;
  minBudget?: number;
  maxBudget?: number;
  urgencyLevel?: string[];
  showVerifiedOnly?: boolean;
  showNeighborsOnly?: boolean;
}

interface MatchPreferences {
  prioritizeLocation?: boolean;
  prioritizeRate?: boolean;
  prioritizeUrgent?: boolean;
}

interface Pagination {
  page: number;
  limit: number;
}

interface MatchResponse {
  matches: Array<{
    job: any; // Will be properly typed when integrated with shared types
    matchResult: {
      score: number;
      factors: {
        skillMatch: number;
        locationProximity: number;
        reputationScore: number;
        priceMatch: number;
        availabilityMatch: number;
        urgencyCompatibility: number;
      };
      explanations: string[];
    }
  }>;
  pagination: {
    totalMatches: number;
    currentPage: number;
    totalPages: number;
  }
}

/**
 * Fetch job matches for a specialist from the API
 * @param specialistId ID of the specialist to get matches for
 * @param filters Optional filters to apply to job search
 * @param preferences Optional matching preferences
 * @param page Page number for pagination (defaults to 1)
 * @param limit Number of results per page (defaults to 10)
 * @returns Promise with match results or null if error
 */
export async function fetchJobMatches(
  specialistId: string,
  filters: MatchFilters = {},
  preferences: MatchPreferences = {},
  page: number = 1,
  limit: number = 10
): Promise<MatchResponse | null> {
  try {
    const response = await fetch('/api/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        specialistId,
        filters,
        preferences,
        pagination: { page, limit }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching job matches:', errorData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch job matches:', error);
    return null;
  }
}
