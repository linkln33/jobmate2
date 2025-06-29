/**
 * API client for the Jobmates matching service
 */

import { Job } from '@/types/job';
import { Specialist } from '@/types/job-match-types';

// Define response types
export interface SavePreferencesResponse {
  success: boolean;
  preferencesId?: string;
  error?: string;
}

export interface GetMatchesResponse {
  success: boolean;
  matches?: Array<{
    job: Job;
    score: number;
    factors: Record<string, number>;
  }>;
  error?: string;
}

/**
 * API client for the Jobmates matching service
 */
export class MatchingApiClient {
  private baseUrl: string;
  
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Save user preferences to the backend
   * @param intentId User's selected intent
   * @param categoryId User's selected category
   * @param preferences User's customized preferences
   * @returns Promise with the save result
   */
  async savePreferences(
    intentId: string,
    categoryId: string,
    preferences: any
  ): Promise<SavePreferencesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intentId,
          categoryId,
          preferences
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Failed to save preferences'
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        preferencesId: data.preferencesId
      };
    } catch (error) {
      console.error('Error saving preferences:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Get matches based on saved preferences
   * @param preferencesId ID of the saved preferences
   * @returns Promise with the matches result
   */
  async getMatches(preferencesId: string): Promise<GetMatchesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/matches?preferencesId=${preferencesId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Failed to get matches'
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        matches: data.matches
      };
    } catch (error) {
      console.error('Error getting matches:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Get specialist profile
   * @param specialistId ID of the specialist
   * @returns Promise with the specialist profile
   */
  async getSpecialistProfile(specialistId: string): Promise<Specialist | null> {
    try {
      const response = await fetch(`${this.baseUrl}/specialists/${specialistId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.specialist;
    } catch (error) {
      console.error('Error getting specialist profile:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const matchingApi = new MatchingApiClient();
