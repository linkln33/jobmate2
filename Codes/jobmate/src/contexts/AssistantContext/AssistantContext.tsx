'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { 
  AssistantContextValue, 
  AssistantContextState, 
  AssistantMode, 
  ProactivityLevel,
  AssistantPreference,
  AssistantSuggestion
} from './types';

// Create context with default values
const initialState: AssistantContextState = {
  isEnabled: true,
  currentMode: 'GENERAL',
  proactivityLevel: ProactivityLevel.Balanced,
  isPanelOpen: false,
  isLoading: false,
  error: null,
  preferences: null,
  suggestions: [],
  userRole: null,
  currentPath: '',
  currentContext: ''
};

// Create the context
const AssistantContext = createContext<AssistantContextValue | undefined>(undefined);

// Provider props interface
interface AssistantProviderProps {
  children: ReactNode;
}

// Assistant Provider component
export const AssistantProvider: React.FC<AssistantProviderProps> = ({ children }) => {
  const [state, setState] = useState<AssistantContextState>(initialState);
  const pathname = usePathname();

  // Initialize assistant
  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        await fetchPreferences();
        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error('Error initializing assistant:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to initialize assistant' 
        }));
      }
    };

    initializeAssistant();
  }, []);

  // Update mode when path changes
  useEffect(() => {
    if (pathname) {
      detectModeFromPath(pathname);
      setState(prev => ({ ...prev, currentPath: pathname }));
    }
  }, [pathname]);

  // Fetch suggestions when mode changes
  useEffect(() => {
    if (state.isEnabled && state.currentMode) {
      fetchSuggestions(state.currentMode, state.currentContext);
    }
  }, [state.currentMode, state.currentContext, state.isEnabled]);

  // Panel controls
  const openPanel = () => setState(prev => ({ ...prev, isPanelOpen: true }));
  const closePanel = () => setState(prev => ({ ...prev, isPanelOpen: false }));
  const togglePanel = () => setState(prev => ({ ...prev, isPanelOpen: !prev.isPanelOpen }));

  // Mode detection and control
  const detectModeFromPath = (path: string) => {
    let detectedMode: AssistantMode = 'GENERAL';

    // Route-based mode detection
    if (path.includes('/matches') || path.includes('/jobs/nearby')) {
      detectedMode = 'MATCHING';
    } else if (path.includes('/projects') || path.includes('/jobs/create')) {
      detectedMode = 'PROJECT_SETUP';
    } else if (path.includes('/payments') || path.includes('/billing')) {
      detectedMode = 'PAYMENTS';
    } else if (path.includes('/profile') || path.includes('/settings')) {
      detectedMode = 'PROFILE';
    } else if (path.includes('/marketplace') || path.includes('/services')) {
      detectedMode = 'MARKETPLACE';
    }

    // Set context based on specific path patterns
    let context = '';
    if (path.includes('/matches')) {
      context = 'job_matching';
    } else if (path.includes('/jobs/create')) {
      context = 'job_creation';
    } else if (path.includes('/profile/skills')) {
      context = 'skills_management';
    }

    setState(prev => ({ 
      ...prev, 
      currentMode: detectedMode,
      currentContext: context
    }));
  };

  const setMode = (mode: AssistantMode) => {
    setState(prev => ({ ...prev, currentMode: mode }));
  };

  // Preference controls
  const toggleEnabled = async () => {
    try {
      const newEnabledState = !state.isEnabled;
      
      setState(prev => ({ ...prev, isEnabled: newEnabledState }));
      
      if (state.preferences) {
        await axios.put('/api/assistant/preferences', {
          isEnabled: newEnabledState
        });
      }
    } catch (error) {
      console.error('Error toggling assistant:', error);
      setState(prev => ({ 
        ...prev, 
        isEnabled: !prev.isEnabled, // Revert on error
        error: 'Failed to update assistant preferences' 
      }));
    }
  };

  const setProactivityLevel = async (level: ProactivityLevel) => {
    try {
      setState(prev => ({ ...prev, proactivityLevel: level }));
      
      if (state.preferences) {
        await axios.put('/api/assistant/preferences', {
          proactivityLevel: level
        });
      }
    } catch (error) {
      console.error('Error setting proactivity level:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to update proactivity level' 
      }));
    }
  };

  const dismissSuggestion = async (suggestionId: string) => {
    try {
      // Update local state
      setState(prev => ({
        ...prev,
        suggestions: prev.suggestions.filter(s => s.id !== suggestionId)
      }));
      
      // Update on server
      await axios.post('/api/assistant/preferences/dismiss', {
        suggestionId
      });
      
      // Log interaction
      await logInteraction('DISMISS_SUGGESTION', { suggestionId });
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to dismiss suggestion' 
      }));
      
      // Refetch suggestions to restore state
      await fetchSuggestions(state.currentMode, state.currentContext);
    }
  };

  // Data fetching
  const fetchPreferences = async () => {
    try {
      const response = await axios.get('/api/assistant/preferences');
      const preferences: AssistantPreference = response.data;
      
      setState(prev => ({
        ...prev,
        preferences,
        isEnabled: preferences.isEnabled,
        proactivityLevel: preferences.proactivityLevel as ProactivityLevel
      }));
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to fetch assistant preferences' 
      }));
    }
  };

  const fetchSuggestions = async (mode?: AssistantMode, context?: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const params = new URLSearchParams();
      if (mode) params.append('mode', mode);
      if (context) params.append('context', context);
      
      const response = await axios.get(`/api/assistant/suggestions?${params.toString()}`);
      const { suggestions } = response.data;
      
      setState(prev => ({
        ...prev,
        suggestions,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to fetch assistant suggestions',
        suggestions: []
      }));
    }
  };

  // Utility functions
  const logInteraction = async (action: string, metadata: any = {}) => {
    try {
      await axios.post('/api/assistant/memory', {
        action,
        mode: state.currentMode,
        context: state.currentContext,
        metadata: {
          ...metadata,
          path: pathname
        }
      });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  // Combine state and actions
  const contextValue: AssistantContextValue = {
    state,
    actions: {
      openPanel,
      closePanel,
      togglePanel,
      setMode,
      detectModeFromPath,
      toggleEnabled,
      setProactivityLevel,
      dismissSuggestion,
      fetchPreferences,
      fetchSuggestions,
      logInteraction
    }
  };

  return (
    <AssistantContext.Provider value={contextValue}>
      {children}
    </AssistantContext.Provider>
  );
};

// Custom hook to use the assistant context
export const useAssistant = (): AssistantContextValue => {
  const context = useContext(AssistantContext);
  
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  
  return context;
};

export default AssistantContext;
