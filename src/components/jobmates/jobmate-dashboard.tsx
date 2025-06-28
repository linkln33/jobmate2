"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Settings, Play, Pause, Trash2, Edit, Share2, MessageSquare } from "lucide-react";
import { JobMateCreationWizard } from "./jobmate-creation-wizard";
import { jobMateService } from "@/services/jobMateService";
import { JobMate, JobMateMatch } from "@/types/jobmate";

interface JobMateDashboardProps {
  userId: string;
  initialSelectedJobMateId?: string | null;
}

export function JobMateDashboard({ userId, initialSelectedJobMateId }: JobMateDashboardProps) {
  const [jobMates, setJobMates] = useState<JobMate[]>([]);
  const [selectedJobMate, setSelectedJobMate] = useState<JobMate | null>(null);
  const [matches, setMatches] = useState<JobMateMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const router = useRouter();
  
  // Load JobMates on component mount
  useEffect(() => {
    const loadJobMates = async () => {
      try {
        const userJobMates = await jobMateService.getUserJobMates(userId);
        setJobMates(userJobMates);
        
        if (userJobMates.length > 0) {
          // If initialSelectedJobMateId is provided, select that JobMate
          if (initialSelectedJobMateId) {
            const selectedJM = userJobMates.find(jm => jm.id === initialSelectedJobMateId);
            if (selectedJM) {
              setSelectedJobMate(selectedJM);
              loadMatches(selectedJM.id);
            } else {
              // Fallback to first JobMate if the specified one isn't found
              setSelectedJobMate(userJobMates[0]);
              loadMatches(userJobMates[0].id);
            }
          } else {
            // Default to first JobMate if no initialSelectedJobMateId
            setSelectedJobMate(userJobMates[0]);
            loadMatches(userJobMates[0].id);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load JobMates:", error);
        setIsLoading(false);
      }
    };
    
    loadJobMates();
  }, [userId, initialSelectedJobMateId]);
  
  // Load matches for a JobMate
  const loadMatches = async (jobMateId: string) => {
    try {
      const jobMateMatches = await jobMateService.getJobMateMatches(jobMateId);
      setMatches(jobMateMatches);
    } catch (error) {
      console.error("Failed to load matches:", error);
    }
  };
  
  // Handle JobMate selection
  const handleSelectJobMate = (jobMate: JobMate) => {
    setSelectedJobMate(jobMate);
    loadMatches(jobMate.id);
  };
  
  // Handle JobMate creation
  const handleJobMateCreated = (newJobMate: JobMate) => {
    setJobMates(prev => [...prev, newJobMate]);
    setSelectedJobMate(newJobMate);
    setShowWizard(false);
    loadMatches(newJobMate.id);
  };
  
  // Handle JobMate status toggle
  const toggleJobMateStatus = async (jobMate: JobMate) => {
    const newStatus = jobMate.status === 'active' ? 'paused' : 'active';
    try {
      const updatedJobMate = await jobMateService.updateJobMate(jobMate.id, { status: newStatus });
      setJobMates(prev => prev.map(jm => jm.id === jobMate.id ? updatedJobMate : jm));
      
      if (selectedJobMate?.id === jobMate.id) {
        setSelectedJobMate(updatedJobMate);
      }
    } catch (error) {
      console.error("Failed to update JobMate status:", error);
    }
  };
  
  // Handle JobMate deletion
  const deleteJobMate = async (jobMateId: string) => {
    try {
      await jobMateService.deleteJobMate(jobMateId);
      setJobMates(prev => prev.filter(jm => jm.id !== jobMateId));
      
      if (selectedJobMate?.id === jobMateId) {
        const remaining = jobMates.filter(jm => jm.id !== jobMateId);
        if (remaining.length > 0) {
          setSelectedJobMate(remaining[0]);
          loadMatches(remaining[0].id);
        } else {
          setSelectedJobMate(null);
          setMatches([]);
        }
      }
    } catch (error) {
      console.error("Failed to delete JobMate:", error);
    }
  };
  
  // Handle running a JobMate to find matches
  const runJobMate = async (jobMateId: string) => {
    try {
      const newMatches = await jobMateService.runJobMate(jobMateId);
      setMatches(prev => [...newMatches, ...prev]);
    } catch (error) {
      console.error("Failed to run JobMate:", error);
    }
  };
  
  // Handle match status update
  const updateMatchStatus = async (matchId: string, status: 'viewed' | 'saved' | 'contacted' | 'rejected') => {
    try {
      const updatedMatch = await jobMateService.updateMatchStatus(matchId, status);
      setMatches(prev => prev.map(match => match.id === matchId ? updatedMatch : match));
    } catch (error) {
      console.error("Failed to update match status:", error);
    }
  };
  
  // Render JobMate card
  const renderJobMateCard = (jobMate: JobMate) => {
    const isSelected = selectedJobMate?.id === jobMate.id;
    
    return (
      <Card 
        key={jobMate.id} 
        className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-accent'}`}
        onClick={() => handleSelectJobMate(jobMate)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{jobMate.emoji}</span>
              <CardTitle>{jobMate.name}</CardTitle>
            </div>
            <Badge variant={jobMate.status === 'active' ? 'default' : 'secondary'}>
              {jobMate.status === 'active' ? 'Active' : 'Paused'}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{jobMate.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-sm">
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-medium">{jobMate.categoryFocus}</span>
            </div>
            <div className="flex justify-between">
              <span>Matches:</span>
              <span className="font-medium">
                {matches.filter(m => m.jobMateId === jobMate.id).length}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              toggleJobMateStatus(jobMate);
            }}
          >
            {jobMate.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              runJobMate(jobMate.id);
            }}
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Edit functionality will be implemented later
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              deleteJobMate(jobMate.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Render match card
  const renderMatchCard = (match: JobMateMatch) => {
    // In a real implementation, we would fetch the listing details
    // For now, we'll use mock data
    const mockListing = {
      id: match.listingId,
      title: `Listing ${match.listingId}`,
      description: "This is a mock listing description for demonstration purposes.",
      price: "$100",
      location: "San Francisco, CA"
    };
    
    return (
      <Card key={match.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{mockListing.title}</CardTitle>
            <Badge>{match.compatibilityScore}% Match</Badge>
          </div>
          <CardDescription>{mockListing.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Price:</span> {mockListing.price}
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span> {mockListing.location}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => updateMatchStatus(match.id, 'saved')}
          >
            Save
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => updateMatchStatus(match.id, 'contacted')}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Contact
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => updateMatchStatus(match.id, 'rejected')}
          >
            Ignore
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 relative">
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          onClick={() => setShowWizard(true)}
          size="lg"
          className="rounded-full w-16 h-16 shadow-lg bg-gradient-to-r from-primary/80 to-primary backdrop-blur-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your JobMates</h1>
        <Button onClick={() => setShowWizard(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create JobMate
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">Loading JobMates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* JobMate List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Agents</h2>
            
            {jobMates.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground mb-4">You don't have any JobMates yet</p>
                <Button onClick={() => setShowWizard(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First JobMate
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobMates.map(renderJobMateCard)}
              </div>
            )}
          </div>
          
          {/* JobMate Details & Matches */}
          <div className="md:col-span-2">
            {selectedJobMate ? (
              <Tabs defaultValue="matches">
                <TabsList className="mb-4">
                  <TabsTrigger value="matches">Matches</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="matches">
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        {selectedJobMate.emoji} {selectedJobMate.name}'s Matches
                      </h2>
                      <Button 
                        size="sm"
                        onClick={() => runJobMate(selectedJobMate.id)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Run Now
                      </Button>
                    </div>
                    
                    {matches.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No matches found yet</p>
                        <Button onClick={() => runJobMate(selectedJobMate.id)}>
                          Find Matches
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {matches.map(renderMatchCard)}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="insights">
                  <div className="bg-card rounded-lg p-6 border text-center">
                    <h3 className="text-lg font-medium mb-4">AI Insights</h3>
                    <p className="text-muted-foreground">
                      AI-powered insights will be available in the premium version
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="bg-card rounded-lg p-6 border">
                    <h3 className="text-lg font-medium mb-4">JobMate Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Preferences
                        </Button>
                        <Button variant="outline">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share as Template
                        </Button>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button variant="destructive" onClick={() => deleteJobMate(selectedJobMate.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete JobMate
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="bg-card rounded-lg p-6 border text-center">
                <p className="text-muted-foreground mb-4">
                  Select a JobMate to view details or create your first one
                </p>
                <Button onClick={() => setShowWizard(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create JobMate
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* JobMate Creation Wizard Dialog */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-4xl p-0">
          <JobMateCreationWizard 
            userId={userId}
            onClose={() => setShowWizard(false)}
            onSuccess={handleJobMateCreated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
