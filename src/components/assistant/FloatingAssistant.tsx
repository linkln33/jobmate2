"use client";

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X, Minimize2, Send, Mic, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard, GlassCardContent, GlassCardHeader } from '@/components/ui/glass-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface FloatingAssistantProps {
  initialMessages?: Message[];
  userAvatarUrl?: string;
  userName?: string;
}

export function FloatingAssistant({
  initialMessages = [],
  userAvatarUrl,
  userName = 'You'
}: FloatingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated response to: "${inputValue}"`,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating button when closed */}
      {!isOpen && (
        <motion.button
          className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Bot className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '500px',
              width: isMinimized ? '300px' : '380px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative"
          >
            <GlassCard 
              className="w-full h-full overflow-hidden"
              intensity="high"
              variant="elevated"
              colorTint="blue"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/ai-assistant-avatar.png" alt="AI Assistant" />
                    <AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white">JobMate Assistant</h3>
                    {!isMinimized && (
                      <p className="text-xs text-gray-500 dark:text-gray-300">How can I help you today?</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                    onClick={minimizeChat}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                    onClick={closeChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages area - only show if not minimized */}
              {!isMinimized && (
                <div className="flex-1 overflow-y-auto p-4 h-[380px]">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Bot className="h-12 w-12 text-blue-500 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">JobMate AI Assistant</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300 max-w-[250px] mt-2">
                        Ask me anything about jobs, services, or how to use JobMate!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex items-start",
                            message.sender === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          {message.sender === "assistant" && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              <AvatarImage src="/ai-assistant-avatar.png" alt="AI Assistant" />
                              <AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2 max-w-[80%] text-sm",
                              message.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                            )}
                          >
                            {message.content}
                          </div>
                          {message.sender === "user" && (
                            <Avatar className="h-8 w-8 ml-2 mt-1">
                              <AvatarImage src={userAvatarUrl} alt={userName} />
                              <AvatarFallback className="bg-gray-300 text-gray-800">
                                {userName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex items-start">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src="/ai-assistant-avatar.png" alt="AI Assistant" />
                            <AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
                          </Avatar>
                          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl px-4 py-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              )}

              {/* Input area - only show if not minimized */}
              {!isMinimized && (
                <form onSubmit={handleSubmit} className="border-t border-white/10 p-4 flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full mr-1"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full mr-2"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/30 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full ml-2 bg-blue-600 text-white hover:bg-blue-700"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
