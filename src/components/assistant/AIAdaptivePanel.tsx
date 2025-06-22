'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Settings, MessageSquare, MessageCircle, ListChecks } from 'lucide-react';
import { useAssistant } from '@/contexts/AssistantContext/AssistantContext';
import { AssistantMode, ProactivityLevel } from '@/contexts/AssistantContext/types';
import SuggestionCard from '@/components/assistant/SuggestionCard';
import PriceEstimateCard from '@/components/assistant/PriceEstimateCard';
import ModeSelector from '@/components/assistant/ModeSelector';
import ChatInterface from './ChatInterface';
import PromptSuggestions from './PromptSuggestions';
import IdleAnimation from './IdleAnimation';
import MobileAdaptation from './MobileAdaptation';
import { insertIntoActiveField } from '@/utils/formAutoInsert';

// Mode color mapping
const modeColors = {
  MATCHING: 'bg-blue-500',
  PROJECT_SETUP: 'bg-green-500',
  PAYMENTS: 'bg-purple-500',
  PROFILE: 'bg-orange-500',
  MARKETPLACE: 'bg-pink-500',
  GENERAL: 'bg-gray-500',
};

const modeIcons = {
  MATCHING: '🔍',
  PROJECT_SETUP: '🛠️',
  PAYMENTS: '💰',
  PROFILE: '👤',
  MARKETPLACE: '🏪',
  GENERAL: '💡',
};

const AIAdaptivePanel: React.FC = () => {
  const { state, actions } = useAssistant();
  const { 
    isEnabled, 
    currentMode, 
    isPanelOpen, 
    suggestions, 
    isLoading,
    proactivityLevel
  } = state;
  
  // Local state for panel view mode and idle state
  const [viewMode, setViewMode] = useState<'suggestions' | 'chat' | 'prompts'>('suggestions');
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Close panel when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPanelOpen) {
        actions.closePanel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isPanelOpen, actions]);
  
  // Track user activity and set idle state
  useEffect(() => {
    const idleTimeout = 30000; // 30 seconds
    
    const handleActivity = () => {
      setIsIdle(false);
      setLastActivity(Date.now());
    };
    
    const checkIdle = () => {
      if (Date.now() - lastActivity > idleTimeout) {
        setIsIdle(true);
      }
    };
    
    // Set up event listeners for user activity
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    
    // Check for idle state every 5 seconds
    const interval = setInterval(checkIdle, 5000);
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity]);

  // Don't render if assistant is disabled
  if (!isEnabled) return null;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => {
          actions.togglePanel();
          setIsIdle(false);
          setLastActivity(Date.now());
        }}
        className={`fixed bottom-6 right-6 rounded-full p-3 shadow-lg z-50 ${modeColors[currentMode]}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-white text-2xl">
          {modeIcons[currentMode]}
        </div>
      </motion.button>
      
      {/* Idle Animation */}
      <IdleAnimation 
        mode={currentMode}
        isActive={isIdle && isEnabled && !isPanelOpen}
      />

      {/* Panel - Wrapped with MobileAdaptation for responsive design */}
      <MobileAdaptation isOpen={isPanelOpen} onClose={actions.closePanel}>
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              className="fixed right-0 top-0 h-full bg-white dark:bg-gray-900 shadow-xl z-50 w-80 md:w-96 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
            {/* Header */}
            <div className={`p-4 text-white ${modeColors[currentMode]} flex justify-between items-center`}>
              <div className="flex items-center space-x-2">
                <span className="text-xl">{modeIcons[currentMode]}</span>
                <h2 className="text-lg font-semibold">
                  JobMate Assistant: {currentMode.replace('_', ' ')}
                </h2>
              </div>
              <button onClick={actions.closePanel} className="p-1 rounded-full hover:bg-white/20">
                <X size={20} />
              </button>
            </div>

            {/* Mode Selector */}
            <ModeSelector 
              currentMode={currentMode} 
              onModeChange={actions.setMode} 
            />

            {/* View Mode Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => {
                  setViewMode('suggestions');
                  setIsIdle(false);
                  setLastActivity(Date.now());
                }}
                className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${viewMode === 'suggestions' ? `${modeColors[currentMode]} text-white` : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                <ListChecks size={16} />
                <span>Suggestions</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('chat');
                  setIsIdle(false);
                  setLastActivity(Date.now());
                }}
                className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${viewMode === 'chat' ? `${modeColors[currentMode]} text-white` : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                <MessageCircle size={16} />
                <span>Chat</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('prompts');
                  setIsIdle(false);
                  setLastActivity(Date.now());
                }}
                className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${viewMode === 'prompts' ? `${modeColors[currentMode]} text-white` : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                <ChevronRight size={16} />
                <span>Prompts</span>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Suggestions View */}
              {viewMode === 'suggestions' && (
                <div className="p-4 space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((suggestion) => {
                      // Check if this is a price-related suggestion
                      const isPriceEstimate = 
                        suggestion.context?.includes('pricing') || 
                        suggestion.title?.includes('Price') || 
                        suggestion.title?.includes('Cost') || 
                        suggestion.title?.includes('Budget') ||
                        suggestion.content?.includes('$');
                      
                      return isPriceEstimate ? (
                        <PriceEstimateCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          onDismiss={() => actions.dismissSuggestion(suggestion.id)}
                        />
                      ) : (
                        <SuggestionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          onDismiss={() => actions.dismissSuggestion(suggestion.id)}
                        />
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-50" />
                      <p>No suggestions available for this mode.</p>
                      <p className="text-sm mt-2">
                        Try switching to a different mode or check back later.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Chat View */}
              {viewMode === 'chat' && (
                <ChatInterface 
                  onInsertContent={(content) => {
                    insertIntoActiveField(content);
                    actions.logInteraction('CONTENT_INSERTED', { content_length: content.length });
                  }} 
                />
              )}
              
              {/* Prompts View */}
              {viewMode === 'prompts' && (
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
                  <PromptSuggestions 
                    mode={currentMode}
                    context={state.currentContext}
                    onSelectPrompt={(prompt) => {
                      setViewMode('chat');
                      actions.logInteraction('PROMPT_SELECTED', { prompt });
                      // In a real implementation, this would automatically send the prompt to the chat
                    }}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Proactivity Level:
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => actions.setProactivityLevel(level as ProactivityLevel)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        proactivityLevel === level
                          ? `${modeColors[currentMode]} text-white`
                          : 'bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <button
                  onClick={() => actions.toggleEnabled()}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <Settings size={16} className="mr-1" />
                  {isEnabled ? 'Disable Assistant' : 'Enable Assistant'}
                </button>
                <button
                  onClick={() => {
                    actions.logInteraction('FEEDBACK_REQUESTED');
                    // This would open a feedback form in a real implementation
                    alert('Feedback functionality would be implemented here');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Send Feedback
                </button>
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </MobileAdaptation>

      {/* Overlay */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={actions.closePanel}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAdaptivePanel;
