"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { MessageSquarePlus, Copy, Check, RefreshCw, Wand2 } from 'lucide-react';
import { Job, Specialist, MatchResult } from '@/types/job-match-types';
import { autoReplyService, AutoReplyTemplate } from '@/services/auto-reply-service';
import { cn } from '@/lib/utils';

interface AutoReplyGeneratorProps {
  job: Partial<Job>;
  specialist: Partial<Specialist>;
  matchResult?: MatchResult;
  trigger?: React.ReactNode;
  className?: string;
}

export function AutoReplyGenerator({
  job,
  specialist,
  matchResult,
  trigger,
  className
}: AutoReplyGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AutoReplyTemplate>('full_response');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [editedText, setEditedText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Generate response when dialog opens or tab changes
  const generateResponse = async (templateType: AutoReplyTemplate = activeTab) => {
    setIsGenerating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate the response
      const response = autoReplyService.generateTemplate(templateType, {
        job,
        specialist,
        matchResult
      });
      
      setGeneratedText(response);
      setEditedText(response);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle dialog open
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    
    if (newOpen && !generatedText) {
      generateResponse('full_response');
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    const templateType = value as AutoReplyTemplate;
    setActiveTab(templateType);
    generateResponse(templateType);
  };
  
  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("flex items-center gap-2", className)}
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>Generate Response</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Smart Response Generator
          </DialogTitle>
          <DialogDescription>
            Generate a professional response for "{job.title}" based on your profile and match data.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="full_response" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="full_response">Complete Response</TabsTrigger>
            <TabsTrigger value="skills_highlight">Skills Highlight</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            {isGenerating && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-md">
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Generating response...</span>
                </div>
              </div>
            )}
            
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Your response will appear here..."
            />
          </div>
        </Tabs>
        
        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => generateResponse()}
              disabled={isGenerating}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
              Regenerate
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={copyToClipboard}
              disabled={isGenerating || !editedText}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
