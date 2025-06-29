"use client";

import React, { useState, useEffect } from 'react';
// Import the unified Job type
import { Job } from '@/types/job';
// Import other types from match service
import { Specialist, MatchResult } from '@/services/match-service';
import { aiMatchService, MatchAssistanceContext } from '@/services/ai-match-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, RefreshCw, ChevronDown, ChevronUp, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchAIAssistantProps {
  specialist: Specialist;
  selectedJob?: Job;
  matchResults?: Array<{
    job: Job;
    matchResult: MatchResult;
  }>;
}

export function MatchAIAssistant({ specialist, selectedJob, matchResults }: MatchAIAssistantProps) {
  const [activeTab, setActiveTab] = useState<string>('match-tips');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  
  // AI suggestion states
  const [matchTips, setMatchTips] = useState<string[]>([]);
  const [matchExplanation, setMatchExplanation] = useState<{
    explanation: string;
    improvementTips: string[];
  }>({ explanation: '', improvementTips: [] });
  const [profileTips, setProfileTips] = useState<{
    skillSuggestions: string[];
    rateSuggestions: string[];
    generalTips: string[];
  }>({ skillSuggestions: [], rateSuggestions: [], generalTips: [] });
  
  // Load initial suggestions
  useEffect(() => {
    loadMatchTips();
  }, []);
  
  // Update match explanation when selected job changes
  useEffect(() => {
    if (selectedJob) {
      loadMatchExplanation();
      setActiveTab('job-explanation');
    }
  }, [selectedJob]);
  
  // Load match improvement tips
  const loadMatchTips = async () => {
    setIsLoading(true);
    
    try {
      const context: MatchAssistanceContext = {
        specialist,
        matchResults
      };
      
      const suggestions = await aiMatchService.generateMatchImprovementSuggestions(context);
      setMatchTips(suggestions);
    } catch (error) {
      console.error('Error loading match tips:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load explanation for selected job
  const loadMatchExplanation = async () => {
    if (!selectedJob) return;
    
    setIsLoading(true);
    
    try {
      const context: MatchAssistanceContext = {
        specialist,
        selectedJob,
        matchResults
      };
      
      const explanation = await aiMatchService.generateMatchExplanation(context);
      setMatchExplanation(explanation);
    } catch (error) {
      console.error('Error loading match explanation:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load profile optimization tips
  const loadProfileTips = async () => {
    setIsLoading(true);
    
    try {
      const context: MatchAssistanceContext = {
        specialist,
        matchResults
      };
      
      const tips = await aiMatchService.generateProfileOptimizationTips(context);
      setProfileTips(tips);
    } catch (error) {
      console.error('Error loading profile tips:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Load data for the selected tab if needed
    if (value === 'profile-tips' && profileTips.skillSuggestions.length === 0) {
      loadProfileTips();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
            <CardTitle className="text-lg">AI Match Assistant</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="match-tips">Match Tips</TabsTrigger>
                  <TabsTrigger value="profile-tips">Profile Optimization</TabsTrigger>
                  {selectedJob && (
                    <TabsTrigger value="job-explanation" className="col-span-2">
                      Selected Job Insights
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="match-tips" className="mt-0 space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
                      Improve Your Match Score
                    </h3>
                    
                    {isLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-6 bg-gray-100 animate-pulse rounded" />
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {matchTips.map((tip, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <span className="text-amber-500 mr-2">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={loadMatchTips}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh Tips
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="profile-tips" className="mt-0 space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-2">
                          <div className="h-5 bg-gray-100 w-1/3 animate-pulse rounded" />
                          <div className="h-4 bg-gray-100 animate-pulse rounded" />
                          <div className="h-4 bg-gray-100 animate-pulse rounded" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Recommended Skills to Add</h3>
                        <div className="flex flex-wrap gap-1">
                          {profileTips.skillSuggestions.map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50">
                              + {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Rate Optimization</h3>
                        <ul className="space-y-1">
                          {profileTips.rateSuggestions.map((tip, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">General Profile Tips</h3>
                        <ul className="space-y-1">
                          {profileTips.generalTips.map((tip, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={loadProfileTips}
                        disabled={isLoading}
                      >
                        <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh Tips
                      </Button>
                    </>
                  )}
                </TabsContent>
                
                {selectedJob && (
                  <TabsContent value="job-explanation" className="mt-0 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          Why This Job Matches You
                        </h3>
                        
                        {matchResults?.find(m => m.job.id === selectedJob.id) && (
                          <Badge variant="outline" className="bg-green-50">
                            {matchResults.find(m => m.job.id === selectedJob.id)?.matchResult.score}% Match
                          </Badge>
                        )}
                      </div>
                      
                      {isLoading ? (
                        <div className="space-y-2">
                          <div className="h-16 bg-gray-100 animate-pulse rounded" />
                          <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                          <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm">{matchExplanation.explanation}</p>
                          
                          <div className="pt-2">
                            <h4 className="text-sm font-medium mb-1">Tips to Improve Your Chances</h4>
                            <ul className="space-y-1">
                              {matchExplanation.improvementTips.map((tip, index) => (
                                <li key={index} className="text-sm flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={loadMatchExplanation}
                            disabled={isLoading}
                          >
                            <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh Analysis
                          </Button>
                        </>
                      )}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
