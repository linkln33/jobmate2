/**
 * Service for managing user preferences
 * Integrates with the preference API client
 */

import { preferenceApi } from './api/preference-api';

// Fallback to simulated data if API calls fail in development
const DEV_MODE = process.env.NODE_ENV === 'development';

// Simulate API delay for development
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

export class PreferenceService {
  /**
   * Get user preferences for a specific intent and category
   * @param userId User ID
   * @param intentId Intent ID
   * @param categoryId Category ID
   * @returns Promise with the preferences
   */
  async getPreferences(userId: string, intentId: string, categoryId: string) {
    try {
      // Call the real API
      const result = await preferenceApi.getPreferences(userId, intentId, categoryId);
      
      // Return the result
      return result;
    } catch (error) {
      console.error('Error in getPreferences:', error);
      
      // In development mode, fall back to simulated data
      if (DEV_MODE) {
        await simulateApiDelay();
        return {
          success: true,
          preferences: this.getDefaultPreferences(intentId, categoryId)
        };
      }
      
      // In production, return the error
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
  async savePreferences(userId: string, intentId: string, categoryId: string, preferences: any) {
    try {
      // Call the real API
      const result = await preferenceApi.savePreferences(userId, intentId, categoryId, preferences);
      
      // Return the result
      return result;
    } catch (error) {
      console.error('Error in savePreferences:', error);
      
      // In development mode, fall back to simulated data
      if (DEV_MODE) {
        await simulateApiDelay();
        return {
          success: true,
          preferencesId: 'pref-' + Math.random().toString(36).substring(2, 9)
        };
      }
      
      // In production, return the error
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Get default preferences for a specific intent and category
   * @param intentId Intent ID
   * @param categoryId Category ID
   * @returns Default preferences
   */
  private getDefaultPreferences(intentId: string, categoryId: string) {
    // Common default preferences
    const commonDefaults = {
      location: {
        city: '',
        zipCode: '',
        lat: 0,
        lng: 0
      },
      maxDistance: 25,
      availability: {
        weekdays: true,
        weekends: false
      }
    };
    
    // Intent-specific defaults
    switch (intentId) {
      case 'hire-someone':
        return {
          ...commonDefaults,
          budget: {
            min: 20,
            max: 100
          },
          skills: [],
          urgencyLevel: 'normal'
        };
        
      case 'find-work':
        return {
          ...commonDefaults,
          rate: {
            min: 20,
            max: 100,
            preferred: 50
          },
          skills: [],
          responseTime: 'normal'
        };
        
      default:
        return commonDefaults;
    }
  }
}

// Export singleton instance
export const preferenceService = new PreferenceService();
