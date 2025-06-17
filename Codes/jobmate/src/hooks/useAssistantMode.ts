'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAssistant } from '@/contexts/AssistantContext/AssistantContext';
import { AssistantMode } from '@/contexts/AssistantContext/types';

/**
 * Hook to automatically detect and set the assistant mode based on the current route
 * @returns The current assistant mode and context
 */
export const useAssistantMode = () => {
  const { state, actions } = useAssistant();
  const pathname = usePathname();
  
  useEffect(() => {
    if (pathname) {
      actions.detectModeFromPath(pathname);
    }
  }, [pathname, actions]);
  
  /**
   * Manually override the current assistant mode
   * @param mode The assistant mode to set
   */
  const setMode = (mode: AssistantMode) => {
    actions.setMode(mode);
  };
  
  /**
   * Set the current context for more specific suggestions
   * @param context The context string
   */
  const setContext = (context: string) => {
    // Update context in state
    if (state.currentContext !== context) {
      // This is handled through state updates in the context
      actions.fetchSuggestions(state.currentMode, context);
    }
  };
  
  return {
    currentMode: state.currentMode,
    currentContext: state.currentContext,
    setMode,
    setContext
  };
};

export default useAssistantMode;
