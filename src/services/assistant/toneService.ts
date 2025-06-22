/**
 * Tone Service
 * 
 * Provides tone detection, selection, and adjustment capabilities for the assistant
 */

import { prisma } from '@/lib/prisma';
import { AssistantMode, ToneStyle, TonePreference } from '@/contexts/AssistantContext/types';

/**
 * Extended tone preference with userId for service operations
 */
export interface TonePreferenceWithUser extends TonePreference {
  userId: string;
}

/**
 * Get user's tone preferences
 * @param userId User ID
 * @returns Tone preferences object
 */
export const getUserTonePreferences = async (userId: string): Promise<TonePreference | null> => {
  try {
    const preferences = await prisma.assistantPreference.findUnique({
      where: { userId }
    });

    if (!preferences || !preferences.tonePreferences) {
      return null;
    }

    return preferences.tonePreferences as unknown as TonePreference;
  } catch (error) {
    console.error('Error retrieving tone preferences:', error);
    return null;
  }
};

/**
 * Save user's tone preferences
 * @param userId User ID
 * @param preferences Tone preferences to save
 * @returns Boolean indicating success
 */
export const saveTonePreferences = async (userId: string, preferences: TonePreference): Promise<boolean> => {
  try {
    await prisma.assistantPreference.upsert({
      where: { userId },
      update: {
        // Cast to any to bypass TypeScript checking since we know the schema supports this
        tonePreferences: preferences as any
      },
      create: {
        userId,
        isEnabled: true,
        proactivityLevel: 2,
        preferredModes: ['JOB_SEARCH', 'PROJECT_SETUP'],
        dismissedSuggestions: [],
        // Cast to any to bypass TypeScript checking
        tonePreferences: preferences as any
      }
    });
    return true;
  } catch (error) {
    console.error('Error saving tone preferences:', error);
    return false;
  }
};

/**
 * Detect appropriate tone based on context and user history
 * @param userId User ID
 * @param mode Current assistant mode
 * @param context Additional context for tone detection
 * @returns Recommended tone style
 */
export const detectTone = async (
  userId: string, 
  mode: AssistantMode, 
  context?: Record<string, any>
): Promise<ToneStyle> => {
  // First check if user has explicit preferences
  const preferences = await getUserTonePreferences(userId);
  
  if (preferences) {
    // Use mode-specific tone if available
    if (preferences.modeSpecificTones && preferences.modeSpecificTones[mode]) {
      return preferences.modeSpecificTones[mode];
    }
    
    // Fall back to default tone
    if (preferences.defaultTone) {
      return preferences.defaultTone;
    }
  }
  
  // If no preferences, analyze recent interactions to determine preferred tone
  try {
    const recentLogs = await prisma.assistantMemoryLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });
    
    // Default tones by mode if no history or preferences
    const defaultTonesByMode: Record<AssistantMode, ToneStyle> = {
      JOB_SEARCH: 'encouraging',
      PROJECT_SETUP: 'professional',
      MARKETPLACE: 'friendly',
      PAYMENTS: 'professional',
      MESSAGES: 'casual',
      PROFILE: 'friendly',
      DASHBOARD: 'professional'
    };
    
    // If we have interaction history, analyze it
    if (recentLogs.length > 0) {
      // For now, use simple heuristics based on mode frequency
      const modeFrequency: Record<string, number> = {};
      
      recentLogs.forEach(log => {
        modeFrequency[log.mode] = (modeFrequency[log.mode] || 0) + 1;
      });
      
      // Find most frequent mode
      let mostFrequentMode = mode;
      let highestFrequency = 0;
      
      Object.entries(modeFrequency).forEach(([currentMode, frequency]) => {
        if (frequency > highestFrequency) {
          mostFrequentMode = currentMode as AssistantMode;
          highestFrequency = frequency;
        }
      });
      
      // Return tone based on most frequent mode
      return defaultTonesByMode[mostFrequentMode] || 'professional';
    }
    
    // Fall back to default for current mode
    return defaultTonesByMode[mode] || 'professional';
  } catch (error) {
    console.error('Error analyzing tone from history:', error);
    return 'professional'; // Safe default
  }
};

/**
 * Apply tone style to a message
 * @param message Original message
 * @param tone Tone style to apply
 * @returns Message with applied tone
 */
export const applyTone = (message: string, tone: ToneStyle): string => {
  // Simple implementation - in a real system, this would use more sophisticated NLP
  switch (tone) {
    case 'professional':
      return message
        .replace(/hey|hi there|hello there/gi, 'Hello')
        .replace(/thanks|thx/gi, 'Thank you')
        .replace(/sorry/gi, 'I apologize')
        .replace(/great|awesome|cool/gi, 'excellent');
      
    case 'friendly':
      return message
        .replace(/hello|greetings/gi, 'Hi there')
        .replace(/thank you/gi, 'Thanks')
        .replace(/I apologize/gi, 'Sorry about that')
        .replace(/excellent|satisfactory/gi, 'great');
      
    case 'technical':
      return message
        .replace(/simple|easy/gi, 'straightforward')
        .replace(/problem/gi, 'issue')
        .replace(/fix/gi, 'resolve')
        .replace(/look at/gi, 'analyze');
      
    case 'casual':
      return message
        .replace(/hello|greetings/gi, 'Hey')
        .replace(/thank you/gi, 'Thanks')
        .replace(/excellent|outstanding/gi, 'awesome')
        .replace(/I apologize/gi, "Sorry");
      
    case 'encouraging':
      return message
        .replace(/you can/gi, "you'll be able to")
        .replace(/good job/gi, "excellent work")
        .replace(/problem/gi, "challenge")
        .replace(/difficult/gi, "challenging but achievable");
      
    default:
      return message;
  }
};

/**
 * Get tone description for display
 * @param tone Tone style
 * @returns Description of the tone
 */
export const getToneDescription = (tone: ToneStyle): string => {
  const descriptions: Record<ToneStyle, string> = {
    professional: 'Clear, formal, and business-oriented communication',
    friendly: 'Warm, approachable, and conversational',
    technical: 'Precise, detailed, and terminology-focused',
    casual: 'Relaxed, informal, and straightforward',
    encouraging: 'Supportive, positive, and motivational'
  };
  
  return descriptions[tone] || 'Standard communication style';
};

export default {
  getUserTonePreferences,
  saveTonePreferences,
  detectTone,
  applyTone,
  getToneDescription
};
