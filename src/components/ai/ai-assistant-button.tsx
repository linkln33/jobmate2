"use client";

import React from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIAssistant } from '@/contexts/AIAssistantContext';

interface AIAssistantButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function AIAssistantButton({ 
  variant = 'default', 
  size = 'default',
  className = ''
}: AIAssistantButtonProps) {
  const { toggleAssistant, isVisible } = useAIAssistant();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleAssistant}
      className={`${className} ${isVisible ? 'bg-brand-200 hover:bg-brand-300' : ''}`}
    >
      <Bot className={`${size === 'icon' ? 'h-4 w-4' : 'h-4 w-4 mr-2'}`} />
      {size !== 'icon' && 'AI Assistant'}
    </Button>
  );
}
