'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Minimize2,
  Maximize2,
  Settings,
  HelpCircle,
  MessageSquare,
  ListChecks,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { useAssistant } from '@/contexts/AssistantContext/AssistantContext';
import { AssistantMode, ProactivityLevel } from '@/contexts/AssistantContext/types';
import { insertIntoActiveField } from '@/utils/formAutoInsert';

// Dynamic import for ChatInterface to avoid SSR issues
const ChatInterface = dynamic(() => import('@/components/assistant/ChatInterface'), {
  ssr: false,
});

// Idle animation component with simplified design
interface IdleAnimationProps {
  mode: AssistantMode;
  isActive: boolean;
}

// Mode color mapping
const modeColors: Record<AssistantMode | string, string> = {
  MATCHING: 'bg-blue-500',
  PROJECT_SETUP: 'bg-green-500',
  PAYMENTS: 'bg-purple-500',
  PROFILE: 'bg-orange-500',
  MARKETPLACE: 'bg-pink-500',
  GENERAL: 'bg-indigo-500',
};

// Mode icon mapping - using emojis for better visual distinction
const modeIcons: Record<AssistantMode | string, string> = {
  MATCHING: '🔍',
  PROJECT_SETUP: '🛠️',
  PAYMENTS: '💰',
  PROFILE: '👤',
  MARKETPLACE: '🏪',
  GENERAL: '💡',
};

const IdleAnimation: React.FC<IdleAnimationProps> = ({ mode, isActive }) => {
  if (!isActive) return null;
  
  const modeColor = modeColors[mode] || 'bg-blue-500';
  const colorClass = modeColor.replace('bg-', 'text-');
  
  return (
    <div className="fixed bottom-24 right-6 z-40">
      <div className="relative w-8 h-8">
        <div className={`absolute inset-0 ${modeColor} rounded-full opacity-30 animate-ping`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className={colorClass} size={20} />
        </div>
      </div>
    </div>
  );
};

// Define types for contextual prompts
type ContextualPrompt = string;

interface AIAdaptivePanelProps {}

// Create a component that will be dynamically imported with SSR disabled
const AIAdaptivePanelContent: React.FC<AIAdaptivePanelProps> = () => {
  const { state, actions } = useAssistant();
  const { 
    isEnabled, 
    currentMode, 
    isPanelOpen, 
    suggestions, 
    isLoading,
    proactivityLevel
  } = state;
  
  // Local state for idle state and minimized state
  // No more view modes - unified interface
  const [isMinimized, setIsMinimized] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  // State for chat functionality
  const [messages, setMessages] = useState<Array<{text: string; isUser: boolean}>>([{
    text: "Hi! I'm your JobMate Assistant. How can I help you today?",
    isUser: false
  }, {
    text: "You can ask me about:",
    isUser: false
  }]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to get contextual prompts based on current mode and context
  const getContextualPrompts = () => {
    // Default prompts
    const defaultPrompts = [
      "How can I use this feature?",
      "What does this do?",
      "Give me tips for using JobMate"
    ];
    
    // Return mode-specific prompts or default ones
    switch (currentMode) {
      case 'MATCHING':
        return [
          "Find me relevant job matches",
          "How do I improve my match score?",
          "What makes a good job match?"
        ];
      case 'PROJECT_SETUP':
        return [
          "Help me set up my project",
          "What information should I include?",
          "How detailed should my project description be?"
        ];
      case 'PAYMENTS':
        return [
          "How do payments work?",
          "What payment methods are accepted?",
          "Is there a fee for processing payments?"
        ];
      case 'PROFILE':
        return [
          "How can I improve my profile?",
          "What skills should I highlight?",
          "How do I make my profile stand out?"
        ];
      case 'MARKETPLACE':
        return [
          "How do I find projects?",
          "How do I submit a proposal?",
          "What makes a winning proposal?"
        ];
      default:
        return defaultPrompts;
    }
  };

  // Handle prompt click
  const handlePromptClick = async (prompt: string) => {
    // Log the interaction
    await actions.logInteraction('PROMPT_SELECTED', { prompt });
    
    // Add user message
    addMessage(prompt, true);
    
    // Generate AI response
    await generateResponse(prompt);
  };
  
  // Add a message to the chat
  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prev => [...prev, { text, isUser }]);
  };
  
  // Generate AI response based on user input and current page context
  const generateResponse = async (userInput: string) => {
    try {
      // Log the interaction with the assistant
      await actions.logInteraction('USER_QUERY', { query: userInput });
      
      // In a real implementation, this would call the AI API
      // For now, we'll use contextual responses based on the current page
      let response = "";
      const input = userInput.toLowerCase();
      
      // Get the current page context from the URL path
      const currentPath = state.currentPath;
      let pageContext = "general";
      
      // Determine which page the user is currently on
      if (currentPath.includes('/matches') || currentPath.includes('/jobs/nearby')) {
        pageContext = "job_matching";
      } else if (currentPath.includes('/projects') || currentPath.includes('/jobs/create')) {
        pageContext = "project_setup";
      } else if (currentPath.includes('/payments') || currentPath.includes('/billing')) {
        pageContext = "payments";
      } else if (currentPath.includes('/profile') || currentPath.includes('/settings')) {
        pageContext = "profile";
      } else if (currentPath.includes('/marketplace') || currentPath.includes('/services')) {
        pageContext = "marketplace";
      }
      
      // Provide responses based on the current page context
      switch (pageContext) {
        case "job_matching":
          if (input.includes('job') || input.includes('match') || input.includes('find')) {
            response = "JobMate's matching algorithm analyzes your skills, experience, and preferences to find suitable job opportunities. Based on your profile, I've identified 5 potential matches with a compatibility score of 85% or higher. These matches consider your expertise in web development, preferred salary range, and location preferences.";
          } else if (input.includes('improve') || input.includes('better')) {
            response = "To improve your job matches, I recommend: 1) Adding more specific technical skills with proficiency levels, 2) Completing your work history with measurable achievements, 3) Setting more precise salary and location preferences, and 4) Specifying your availability and preferred work arrangements.";
          } else if (input.includes('explain') || input.includes('how')) {
            response = "JobMate's matching system works by analyzing three key factors: 1) Skill alignment - comparing your skills with job requirements, 2) Experience fit - evaluating your work history against job expectations, and 3) Preference matching - considering location, salary, and work arrangements. The algorithm assigns a compatibility score from 0-100% for each potential match.";
          } else {
            response = "I can help you understand job matches, improve your matching score, filter opportunities by specific criteria, or explain how our matching algorithm works. What specific aspect of job matching would you like to explore?";
          }
          break;
          
        case "project_setup":
          if (input.includes('project') || input.includes('setup') || input.includes('create')) {
            response = "For setting up a successful project, make sure to include clear deliverables, timeline expectations, and budget details. Would you like me to help you draft a project description?";
          } else if (input.includes('template') || input.includes('example')) {
            response = "I can provide templates for different types of projects. What kind of project are you setting up? Software development, design, marketing, or something else?";
          } else {
            response = "I can help you set up your project with best practices, create templates, or provide guidance on project scoping. What specific aspect of project setup do you need help with?";
          }
          break;
          
        case "payments":
          if (input.includes('payment') || input.includes('invoice')) {
            response = "JobMate supports multiple payment methods including credit cards, PayPal, and bank transfers. Your current payment method is set to automatic monthly billing. Would you like to change this?";
          } else if (input.includes('fee') || input.includes('charge')) {
            response = "JobMate charges a 5% service fee on all transactions. This covers payment processing, platform maintenance, and our guarantee protection for both parties.";
          } else {
            response = "I can help you with payment methods, invoicing, transaction history, or fee structures. What specific payment information do you need?";
          }
          break;
          
        case "profile":
          if (input.includes('profile') || input.includes('improve')) {
            response = "Your profile is currently 75% complete. Adding a professional photo and more details about your past work experience would significantly improve your visibility to potential clients.";
          } else if (input.includes('skill') || input.includes('add')) {
            response = "When adding skills to your profile, be specific about your expertise level and include relevant certifications. This helps our matching algorithm connect you with the right opportunities.";
          } else {
            response = "I can help you optimize your profile, suggest skills to highlight, or provide tips on making your profile stand out to potential clients or employers.";
          }
          break;
          
        case "marketplace":
          if (input.includes('find') || input.includes('search')) {
            response = "The JobMate marketplace currently has over 200 active projects in your skill areas. You can filter by budget range, project duration, or required skills to find the best matches.";
          } else if (input.includes('proposal') || input.includes('bid')) {
            response = "When submitting a proposal, make sure to address the client's specific requirements and highlight relevant past work. Personalized proposals have a 35% higher success rate.";
          } else {
            response = "I can help you navigate the marketplace, find relevant projects, create winning proposals, or understand client requirements better.";
          }
          break;
          
        default: // general context
          if (input.includes('help') || input.includes('can you')) {
            response = "I'm your JobMate Assistant! I can help you with job matching, project setup, payments, profile optimization, and navigating the marketplace. What would you like assistance with today?";
          } else if (input.includes('hello') || input.includes('hi')) {
            response = "Hello! I'm your JobMate Assistant. I'm here to help you make the most of the platform. What can I assist you with today?";
          } else {
            response = "I'm here to help with all aspects of JobMate. You can ask me about finding jobs, setting up projects, managing payments, optimizing your profile, or using the marketplace.";
          }
      }
      
      // Add the response directly
      addMessage(response, false);
      
    } catch (error) {
      console.error('Error generating response:', error);
      // Add error message
      addMessage("Sorry, I encountered an error processing your request. Please try again.", false);
    }
  };
  
  // Handle user input submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Store the input value before clearing it
    const userMessage = inputValue;
    
    // Add user message
    addMessage(userMessage, true);
    
    // Clear input immediately for better UX
    setInputValue('');
    
    // Generate AI response (now async)
    await generateResponse(userMessage);
  };

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
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
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
          setIsMinimized(false);
        }}
        className={`fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-blue-500/30`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-white text-2xl flex items-center justify-center">
          {modeIcons[currentMode]}
        </div>
      </motion.button>
      
      {/* Idle Animation */}
      <IdleAnimation 
        mode={currentMode}
        isActive={isIdle && isEnabled && !isPanelOpen}
      />

      {/* Panel */}
      <AnimatePresence>
        {isPanelOpen && !isMinimized && (
          <motion.div
            className="fixed bottom-24 right-6 bg-white dark:bg-gray-900 shadow-xl z-50 w-80 md:w-96 flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 max-h-[500px]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 flex items-center justify-between text-white rounded-t-xl">
              <div className="flex items-center space-x-2">
                <span className="text-xl">
                  <Bot size={20} />
                </span>
                <h2 className="text-lg font-semibold">
                  JobMate Assistant
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsMinimized(true)} 
                  className="p-1 rounded-full hover:bg-white/20"
                  aria-label="Minimize assistant"
                >
                  <Minimize2 size={16} />
                </button>
                <button 
                  onClick={actions.closePanel} 
                  className="p-1 rounded-full hover:bg-white/20"
                  aria-label="Close assistant"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* No mode selector buttons - simplified interface */}

            {/* No tabs - unified interface */}

            {/* Reorganized Content Area with Chat at Bottom */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col h-full">
                {/* Suggestions Section */}
                {suggestions && Array.isArray(suggestions) && suggestions.length > 0 && (
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Lightbulb size={16} className="mr-1 text-yellow-500" />
                      Suggestions
                    </h3>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div 
                          key={index} 
                          className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800"
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              {suggestion.content}
                            </p>
                            <button 
                              onClick={() => actions.dismissSuggestion(suggestion.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2"
                              aria-label="Dismiss suggestion"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="mt-2">
                            <button
                              onClick={() => {
                                actions.logInteraction('SUGGESTION_ACTION_CLICKED', { 
                                  suggestionId: suggestion.id
                                });
                              }}
                              className="text-xs bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-gray-700"
                            >
                              Apply Suggestion
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Chat Interface with Integrated Prompts */}
                <div className="mt-auto flex-1 flex flex-col p-3">
                  <div className="flex-1 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg mb-2">
                    {/* Dynamic chat messages */}
                    <div className="mb-4">
                      {messages.map((message, index) => (
                        <div key={index} className={`flex items-start mb-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                          <div 
                            className={`rounded-lg p-2 max-w-[80%] ${message.isUser 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-blue-100 dark:bg-blue-900/30 text-gray-800 dark:text-gray-200'}`}
                          >
                            {message.text === "You can ask me about:" ? (
                              <>
                                <p className="text-sm">You can ask me about:</p>
                                <div className="mt-2 space-y-1">
                                  {getContextualPrompts().map((prompt, promptIndex) => (
                                    <button
                                      key={promptIndex}
                                      onClick={() => handlePromptClick(prompt)}
                                      className="w-full text-left p-1 rounded bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 text-xs transition-colors"
                                    >
                                      {prompt}
                                    </button>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <p className="text-sm">{message.text}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  
                  {/* Chat Input */}
                  <form onSubmit={handleSubmit} className="flex items-center">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button 
                      type="submit" 
                      className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                      disabled={!inputValue.trim()}
                    >
                      <MessageCircle size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Simple Footer */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => actions.toggleEnabled()}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center"
                >
                  <Settings size={14} className="mr-1" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    actions.logInteraction('FEEDBACK_REQUESTED');
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Send Feedback
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Minimized Panel */}
      <AnimatePresence>
        {isPanelOpen && isMinimized && (
          <motion.div
            className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg z-50 flex items-center p-2 text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <span className="text-sm mr-2">{currentMode}</span>
            <button 
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-white/20 rounded-full"
              aria-label="Expand assistant"
            >
              <Maximize2 size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Dynamically import the component with SSR disabled
const AIAdaptivePanel = dynamic(() => Promise.resolve(AIAdaptivePanelContent), {
  ssr: false,
});

export default AIAdaptivePanel;
