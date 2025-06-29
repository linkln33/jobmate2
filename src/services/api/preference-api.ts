/**
 * API client for the preference system
 */

// Define response types
export interface PreferenceResponse {
  success: boolean;
  preferences?: any;
  error?: string;
}

export interface SavePreferenceResponse {
  success: boolean;
  preferencesId?: string;
  error?: string;
}

/**
 * API client for the preference system
 */
export class PreferenceApiClient {
  private baseUrl: string;
  
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Get user preferences for a specific intent and category
   * @param userId User ID
   * @param intentId Intent ID
   * @param categoryId Category ID
   * @returns Promise with the preferences
   */
  async getPreferences(
    userId: string,
    intentId: string,
    categoryId: string
  ): Promise<PreferenceResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/preferences?userId=${userId}&intentId=${intentId}&categoryId=${categoryId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Failed to get preferences'
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        preferences: data.preferences
      };
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Save user preferences
   * @param userId User ID
   * @param intentId Intent ID
   * @param categoryId Category ID
   * @param preferences Preferences data
   * @returns Promise with the save result
   */
  async savePreferences(
    userId: string,
    intentId: string,
    categoryId: string,
    preferences: any
  ): Promise<SavePreferenceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
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
}

// Export a singleton instance
export const preferenceApi = new PreferenceApiClient();
