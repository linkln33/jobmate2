"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { JobMateCreationWizard } from "./jobmate-creation-wizard";
import { jobMateService } from "@/services/jobMateService";
import { JobMate, JobMateMatch } from "@/types/jobmate";
import { JobMateSummaryCard } from "./jobmate-summary-card";
import { JobMateDashboard } from "./jobmate-dashboard";

interface JobMateDashboardSummaryProps {
  userId: string;
}

export function JobMateDashboardSummary({ userId }: JobMateDashboardSummaryProps) {
  const [jobMates, setJobMates] = useState<JobMate[]>([]);
  const [matches, setMatches] = useState<JobMateMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [showFullDashboard, setShowFullDashboard] = useState(false);
  const [selectedJobMateId, setSelectedJobMateId] = useState<string | null>(null);
  
  // Load JobMates on component mount
  useEffect(() => {
    const loadJobMates = async () => {
      try {
        const userJobMates = await jobMateService.getUserJobMates(userId);
        setJobMates(userJobMates);
        
        // Load all matches for all JobMates
        if (userJobMates.length > 0) {
          const allMatches: JobMateMatch[] = [];
          for (const jobMate of userJobMates) {
            const jobMateMatches = await jobMateService.getJobMateMatches(jobMate.id);
            allMatches.push(...jobMateMatches);
          }
          setMatches(allMatches);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load JobMates:", error);
        setIsLoading(false);
      }
    };
    
    loadJobMates();
  }, [userId]);
  
  // Run a JobMate to find matches
  const runJobMate = async (jobMateId: string) => {
    try {
      const newMatches = await jobMateService.runJobMate(jobMateId);
      setMatches(prev => [...prev, ...newMatches]);
    } catch (error) {
      console.error("Failed to run JobMate:", error);
    }
  };
  
  // Toggle JobMate status (active/paused)
  const toggleJobMateStatus = async (jobMate: JobMate) => {
    try {
      const updatedJobMate = await jobMateService.updateJobMate(jobMate.id, {
        status: jobMate.status === 'active' ? 'paused' : 'active'
      });
      
      setJobMates(prev => 
        prev.map(jm => jm.id === updatedJobMate.id ? updatedJobMate : jm)
      );
    } catch (error) {
      console.error("Failed to update JobMate status:", error);
    }
  };
  
  // Get match count for a JobMate
  const getMatchCount = (jobMateId: string) => {
    return matches.filter(match => match.jobMateId === jobMateId).length;
  };
  
  // Handle JobMate creation success
  const handleJobMateCreated = (newJobMate: JobMate) => {
    setJobMates(prev => [...prev, newJobMate]);
    setShowWizard(false);
  };

  // Render JobMate cards
  const renderJobMateCards = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <p>Loading JobMates...</p>
        </div>
      );
    }
    
    if (jobMates.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-lg font-medium mb-2">No JobMates Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first JobMate to start finding matches based on your preferences
          </p>
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Your First JobMate
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {jobMates.map(jobMate => (
          <JobMateSummaryCard
            key={jobMate.id}
            jobMate={jobMate}
            matchCount={getMatchCount(jobMate.id)}
            onRun={() => runJobMate(jobMate.id)}
            onToggleStatus={() => toggleJobMateStatus(jobMate)}
            onView={() => {
              setSelectedJobMateId(jobMate.id);
              setShowFullDashboard(true);
            }}
          />
        ))}
        <div className="flex items-center justify-center border border-dashed rounded-lg p-6 h-full">
          <Button variant="outline" onClick={() => setShowWizard(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create New JobMate
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      {renderJobMateCards()}
      
      {/* JobMate Creation Wizard Dialog */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-3xl p-0 max-h-[90vh] overflow-y-auto">
          <JobMateCreationWizard 
            userId={userId}
            onClose={() => setShowWizard(false)}
            onSuccess={handleJobMateCreated}
          />
        </DialogContent>
      </Dialog>
      
      {/* Full JobMate Dashboard Dialog */}
      <Dialog open={showFullDashboard} onOpenChange={setShowFullDashboard}>
        <DialogContent className="max-w-5xl p-0 max-h-[90vh] overflow-y-auto">
          <JobMateDashboard 
            userId={userId}
            initialSelectedJobMateId={selectedJobMateId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
