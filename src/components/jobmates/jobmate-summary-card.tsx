"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { JobMate, JobMateMatch } from "@/types/jobmate";
import { Bot, Play, Pause, Target, Briefcase, Home, Wrench } from "lucide-react";

interface JobMateSummaryCardProps {
  jobMate: JobMate;
  matchCount: number;
  onRun: () => void;
  onToggleStatus: () => void;
  onView: () => void;
}

export function JobMateSummaryCard({ 
  jobMate, 
  matchCount, 
  onRun, 
  onToggleStatus, 
  onView 
}: JobMateSummaryCardProps) {
  // Helper function to get the appropriate icon based on category
  const getCategoryIcon = () => {
    switch(jobMate.categoryFocus) {
      case 'jobs':
        return <Briefcase className="h-4 w-4 mr-1" />;
      case 'rentals':
        return <Home className="h-4 w-4 mr-1" />;
      case 'services':
        return <Wrench className="h-4 w-4 mr-1" />;
      default:
        return <Bot className="h-4 w-4 mr-1" />;
    }
  };

  // Helper function to get a readable goal from the intent
  const getGoalText = () => {
    switch(jobMate.intent) {
      case 'earn':
        return "Find job opportunities";
      case 'hire':
        return "Find candidates to hire";
      case 'sell':
        return "Find buyers for listings";
      case 'rent':
        return "Find rental properties";
      case 'list':
        return "Find listing opportunities";
      case 'buy':
        return "Find items to purchase";
      case 'help':
        return "Find help services";
      case 'learn':
        return "Find learning resources";
      case 'browse':
      default:
        return "Browse available options";
    }
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl mr-2">{jobMate.emoji || '🤖'}</span>
            <CardTitle className="text-base">{jobMate.name}</CardTitle>
          </div>
          <Badge variant={jobMate.status === 'active' ? "default" : "outline"}>
            {jobMate.status === 'active' ? 'Active' : 'Paused'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground line-clamp-2">
            {jobMate.description || 'No description provided'}
          </div>
          
          <div className="flex items-center text-sm">
            <Target className="h-4 w-4 mr-1 text-blue-500" />
            <span className="font-medium">{getGoalText()}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              {getCategoryIcon()}
              <span>{jobMate.categoryFocus.charAt(0).toUpperCase() + jobMate.categoryFocus.slice(1)}</span>
            </div>
            <div>
              <span className="font-medium">{matchCount}</span> matches
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus();
          }}
          title={jobMate.status === 'active' ? 'Pause JobMate' : 'Activate JobMate'}
        >
          {jobMate.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRun();
          }}
          title="Run JobMate to find matches"
        >
          <Target className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onView}
          className="ml-auto"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
