"use client";

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Bot, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Lightbulb, 
  Loader2, 
  MessageSquare,
  Minimize2,
  Maximize2,
  Send,
  Mic,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { GlassCard, GlassCardContent, GlassCardHeader } from '@/components/ui/glass-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import { cn } from '@/lib/utils';
import { AnimatedAIAssistant } from '../ui/animated-ai-assistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface UnifiedAIAssistantProps {
  className?: string;
  initiallyOpen?: boolean;
  initialMessages?: Message[];
  userAvatarUrl?: string;
  userName?: string;
}

export function UnifiedAIAssistant({
  className = '',
  initiallyOpen = false,
  initialMessages = [],
  userAvatarUrl,
  userName = 'You'
}: UnifiedAIAssistantProps) {
  // States from original AIAssistant
  const { 
    isVisible, 
    toggleAssistant, 
    currentSuggestions, 
    isLoading,
    currentContext 
  } = useAIAssistant();
  
  // States from FloatingAIAssistant
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages.length > 0 ? initialMessages : [{
    id: '1',
    content: "Hi there! I'm your JobMate AI assistant. How can I help you today?",
    sender: 'assistant',
    timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('suggestions');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current && activeTab === 'chat') {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized, activeTab]);

  // Combined toggle functions
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen) {
      toggleAssistant(); // Ensure the assistant context is active when opening
    }
  };

  const toggleMinimize = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMinimized(!isMinimized);
  };
  
  const closeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const responses = [
        "I can help you find the perfect job match based on your skills.",
        "Would you like me to analyze your resume and suggest improvements?",
        "I can show you trending jobs in your field right now.",
        "Need help preparing for an interview? I can provide tips specific to your industry."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass-card border border-blue-500/20 rounded-xl shadow-lg shadow-blue-500/10 mb-4 w-80 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 flex items-center justify-between text-white">
              <div className="flex items-center">
                <AnimatedAIAssistant size="sm" variant="minimal" className="mr-2" />
                <h3 className="font-medium">JobMate Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMinimize}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Minimize2 size={18} />
                </button>
                <button 
                  onClick={toggleOpen}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Tabs for switching between suggestions and chat */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="suggestions" className="text-sm">
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Suggestions
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="text-sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Chat
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Content based on active tab */}
            <div className="h-64 overflow-y-auto">
              {activeTab === 'suggestions' ? (
                <div className="p-3">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-2" />
                      <p className="text-sm text-muted-foreground">Generating suggestions...</p>
                    </div>
                  ) : currentSuggestions.length > 0 ? (
                    <div className="space-y-3">
                      {currentSuggestions.map((suggestion, index) => (
                        <div 
                          key={index} 
                          className="flex items-start space-x-3 p-3 rounded-lg bg-brand-50 hover:bg-brand-100 transition-colors cursor-pointer"
                        >
                          <Lightbulb className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        I'll provide suggestions as you work. Fill out more details to get personalized help.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 flex flex-col space-y-3">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={cn(
                        'flex items-start gap-2 mb-4',
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.sender === 'assistant' && (
                        <Avatar className="h-8 w-8 border border-primary/10">
                          <AvatarFallback className="bg-primary/10 text-primary/80">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={cn(
                          'max-w-[80%] p-3 rounded-lg',
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-muted rounded-tl-none'
                        )}
                      >
                        {message.content}
                        <div className="text-xs opacity-50 text-right mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {message.sender === 'user' && (
                        <Avatar className="h-8 w-8 border border-primary/10">
                          {userAvatarUrl ? (
                            <AvatarImage src={userAvatarUrl} />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary/80">
                              {userName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-2 self-start">
                      <Avatar className="h-8 w-8 border border-primary/10">
                        <AvatarFallback className="bg-primary/10 text-primary/80">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-3 rounded-lg rounded-tl-none flex items-center gap-1">
                        <span className="animate-bounce h-2 w-2 bg-current rounded-full opacity-75"></span>
                        <span className="animate-bounce h-2 w-2 bg-current rounded-full opacity-75" style={{ animationDelay: '0.2s' }}></span>
                        <span className="animate-bounce h-2 w-2 bg-current rounded-full opacity-75" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input area (only for chat tab) */}
            {activeTab === 'chat' && (
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-grow bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isTyping}
                />
                <Button 
                  size="icon"
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="rounded-full h-9 w-9 flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
            
            {/* Footer with context (only for suggestions tab) */}
            {activeTab === 'suggestions' && (
              <div className="bg-gray-50 dark:bg-gray-800 py-2 px-4 text-xs text-muted-foreground border-t border-gray-200 dark:border-gray-700">
                {currentContext ? `Context: ${currentContext}` : 'AI assistant is ready to help'}
              </div>
            )}
          </motion.div>
        )}
        
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card border border-blue-500/20 rounded-xl shadow-lg shadow-blue-500/10 mb-4 p-3 flex items-center justify-between"
          >
            <div className="flex items-center">
              <AnimatedAIAssistant size="sm" variant="minimal" className="mr-2" />
              <h3 className="font-medium">JobMate Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMinimize}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Maximize2 size={18} />
              </button>
              <button 
                onClick={toggleOpen}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toggle button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleOpen}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-14 h-14 flex items-center justify-center text-white shadow-lg shadow-blue-500/30"
        >
          <Lightbulb size={24} />
        </motion.button>
      )}
    </div>
  );
}
