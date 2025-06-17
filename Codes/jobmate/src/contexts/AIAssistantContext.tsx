"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AIAssistantContextType = {
  isVisible: boolean;
  toggleAssistant: () => void;
  currentSuggestions: string[];
  currentContext: string;
  isLoading: boolean;
  setContext: (context: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  setIsLoading: (loading: boolean) => void;
  clearSuggestions: () => void;
};

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [currentContext, setCurrentContext] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleAssistant = () => setIsVisible(prev => !prev);
  
  const setContext = (context: string) => {
    setCurrentContext(context);
  };

  const setSuggestions = (suggestions: string[]) => {
    setCurrentSuggestions(suggestions);
  };

  const clearSuggestions = () => {
    setCurrentSuggestions([]);
  };

  return (
    <AIAssistantContext.Provider
      value={{
        isVisible,
        toggleAssistant,
        currentSuggestions,
        currentContext,
        isLoading,
        setContext,
        setSuggestions,
        setIsLoading,
        clearSuggestions,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
}

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
