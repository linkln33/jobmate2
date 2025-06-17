"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X, ChevronUp, ChevronDown, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAIAssistant } from '@/contexts/AIAssistantContext';

export function AIAssistant() {
  const { 
    isVisible, 
    toggleAssistant, 
    currentSuggestions, 
    isLoading,
    currentContext 
  } = useAIAssistant();
  
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-20 md:bottom-6 right-6 z-50 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border border-brand-200 shadow-lg overflow-hidden">
            <CardHeader className="bg-brand-50 py-3 px-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-brand-600" />
                <h3 className="font-medium text-brand-800">JobMate Assistant</h3>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={toggleAssistant}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {isExpanded && (
              <>
                <CardContent className="p-4">
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
                </CardContent>
                <CardFooter className="bg-gray-50 py-2 px-4 text-xs text-muted-foreground">
                  {currentContext ? `Context: ${currentContext}` : 'AI assistant is ready to help'}
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
