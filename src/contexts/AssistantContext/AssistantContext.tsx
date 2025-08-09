'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import useSWR from 'swr';
import { useAuth } from '@/contexts/AuthContext';
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

  // Auth-gated initialization (SWR handles fetching)
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) {
      // Reset assistant state for guests
      setState(prev => ({
        ...prev,
        preferences: null,
        suggestions: [],
        error: null,
        isLoading: false,
      }));
    }
  }, [isAuthenticated]);

  // Update mode when path changes
  useEffect(() => {
    if (pathname) {
      detectModeFromPath(pathname);
      setState(prev => ({ ...prev, currentPath: pathname }));
    }
  }, [pathname]);

  // SWR fetchers
  const fetcher = (url: string) => axios.get(url).then(r => r.data);

  // Preferences caching (authenticated + enabled only)
  const shouldFetchPrefs = isAuthenticated && state.isEnabled;
  const { data: prefsData, error: prefsError, isLoading: prefsLoading, mutate: mutatePrefs } = useSWR(
    shouldFetchPrefs ? '/api/assistant/preferences' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (prefsError) {
      setState(prev => ({ ...prev, error: 'Failed to fetch assistant preferences' }));
      return;
    }
    if (prefsData) {
      setState(prev => ({
        ...prev,
        preferences: prefsData,
        isEnabled: prefsData.isEnabled,
        proactivityLevel: prefsData.proactivityLevel,
      }));
    }
  }, [prefsData, prefsError]);

  // Suggestions caching (keyed by mode/context)
  const suggestionsKey = isAuthenticated && state.isEnabled && state.currentMode
    ? `/api/assistant/suggestions?${new URLSearchParams({ mode: state.currentMode, context: state.currentContext || '' }).toString()}`
    : null;
  const { data: suggData, error: suggError, isLoading: suggLoading, mutate: mutateSuggestions } = useSWR(
    suggestionsKey,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  useEffect(() => {
    if (suggError) {
      setState(prev => ({ ...prev, error: 'Failed to fetch assistant suggestions', suggestions: [] }));
      return;
    }
    if (suggData && Array.isArray(suggData.suggestions)) {
      setState(prev => ({ ...prev, suggestions: suggData.suggestions }));
    }
  }, [suggData, suggError]);

  // Reflect loading from SWR
  useEffect(() => {
    setState(prev => ({ ...prev, isLoading: !!(prefsLoading || suggLoading) }));
  }, [prefsLoading, suggLoading]);

  // Panel controls
  const openPanel = () => setState(prev => ({ ...prev, isPanelOpen: true }));
  const closePanel = () => {
    setState(prev => ({ ...prev, isPanelOpen: false }));
    // Flush any pending interaction logs on close
    void flushLogs();
  };
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
        await mutatePrefs();
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
        await mutatePrefs();
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
      await mutateSuggestions();
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to dismiss suggestion' 
      }));
      
      // Refetch suggestions to restore state
      await mutateSuggestions();
    }
  };

  // Data fetching
  const fetchPreferences = async () => {
    try {
      await mutatePrefs();
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
      await mutateSuggestions();
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setState(prev => ({ 
        ...prev,
        error: 'Failed to fetch assistant suggestions',
        suggestions: []
      }));
    }
  };

  // Utility functions
  // Basic batching of interaction logs
  const logQueueRef = useRef<any[]>([]);
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);
  const FLUSH_INTERVAL = 5000;
  const flushLogs = async () => {
    if (!logQueueRef.current.length) return;
    const batch = logQueueRef.current.splice(0, logQueueRef.current.length);
    try {
      await axios.post('/api/assistant/memory', { batch });
    } catch (error) {
      console.error('Error logging interaction batch:', error);
    }
  };
  const scheduleFlush = () => {
    if (flushTimerRef.current) return;
    flushTimerRef.current = setTimeout(async () => {
      flushTimerRef.current = null;
      await flushLogs();
    }, FLUSH_INTERVAL);
  };
  const logInteraction = async (action: string, metadata: any = {}) => {
    logQueueRef.current.push({
      action,
      mode: state.currentMode,
      context: state.currentContext,
      metadata: { ...metadata, path: pathname },
      ts: Date.now(),
    });
    scheduleFlush();
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
