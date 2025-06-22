"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, MessageSquare, Minimize2, Maximize2 } from 'lucide-react';
import { AnimatedAIAssistant } from './animated-ai-assistant';
import { Button } from '@/components/ui/button';

interface FloatingAIAssistantProps {
  className?: string;
  initiallyOpen?: boolean;
}

export function FloatingAIAssistant({
  className = '',
  initiallyOpen = false
}: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string; isUser: boolean}>>([
    { text: "Hi there! I'm your JobMate AI assistant. How can I help you today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages([...messages, { text: inputValue, isUser: true }]);
      
      // Simulate AI response (in a real app, this would call an API)
      setTimeout(() => {
        const responses = [
          "I can help you find the perfect job match based on your skills.",
          "Would you like me to analyze your resume and suggest improvements?",
          "I can show you trending jobs in your field right now.",
          "Need help preparing for an interview? I can provide tips specific to your industry."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
      }, 1000);
      
      setInputValue('');
    }
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
            
            {/* Chat messages */}
            <div className="h-64 overflow-y-auto p-3 flex flex-col space-y-3">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={cn(
                    'max-w-[80%] p-2 rounded-lg',
                    message.isUser 
                      ? 'bg-blue-500 text-white self-end rounded-br-none' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start rounded-bl-none'
                  )}
                >
                  {message.text}
                </div>
              ))}
            </div>
            
            {/* Input area */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-grow bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                size="sm"
                onClick={handleSendMessage}
                className="ml-2"
              >
                Send
              </Button>
            </div>
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
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  );
}
