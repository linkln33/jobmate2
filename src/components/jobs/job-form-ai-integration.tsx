"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { aiService, JobPostContext } from '@/services/ai-service';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import { AIAssistantButton } from '@/components/ai/ai-assistant-button';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface JobFormAIIntegrationProps {
  formValues: {
    title?: string;
    description?: string;
    categoryId?: string;
    categoryName?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  onSuggestionApply: (field: string, value: string) => void;
}

export function JobFormAIIntegration({ 
  formValues, 
  onSuggestionApply 
}: JobFormAIIntegrationProps) {
  const { 
    setContext, 
    setSuggestions, 
    toggleAssistant, 
    isVisible,
    setIsLoading
  } = useAIAssistant();
  
  // Track if we've shown initial suggestions
  const [hasShownSuggestions, setHasShownSuggestions] = useState(false);

  // Generate suggestions when form values change significantly
  useEffect(() => {
    const hasMinimumContent = 
      (formValues.title && formValues.title.length > 5) || 
      (formValues.description && formValues.description.length > 15);
    
    if (hasMinimumContent && !hasShownSuggestions) {
      generateSuggestions();
      setHasShownSuggestions(true);
    }
  }, [formValues]);

  // Function to generate AI suggestions
  const generateSuggestions = async () => {
    // Set context for the AI assistant
    const contextStr = `Creating job: ${formValues.title || ''} in ${formValues.categoryName || 'unknown category'}`;
    setContext(contextStr);
    
    // Only proceed if we have some content
    if (!formValues.title && !formValues.description) {
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Create context object for AI service
    const context: JobPostContext = {
      title: formValues.title,
      description: formValues.description,
      category: formValues.categoryName,
      location: formValues.city 
        ? `${formValues.city}${formValues.state ? ', ' + formValues.state : ''}` 
        : undefined
    };
    
    try {
      // Get suggestions from AI service
      const suggestions = await aiService.getJobPostSuggestions(context);
      
      // Update suggestions in context
      setSuggestions(suggestions);
      
      // Show assistant if we got suggestions and it's not already visible
      if (suggestions.length > 0 && !isVisible) {
        toggleAssistant();
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-2 px-1">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateSuggestions}
          className="text-brand-600 border-brand-200"
        >
          <Wand2 className="h-3.5 w-3.5 mr-1" />
          Improve My Job Post
        </Button>
      </div>
      
      <AIAssistantButton variant="ghost" size="sm" />
    </div>
  );
}
