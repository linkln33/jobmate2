"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, Settings, Edit, Share2, MessageSquare, ChevronRight } from "lucide-react";
import { jobMateService } from "@/services/jobMateService";
import { JobMate, JobMateMatch } from "@/types/jobmate";
import { useToast } from "@/components/ui/use-toast";

export default function JobMateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [jobMate, setJobMate] = useState<JobMate | null>(null);
  const [matches, setMatches] = useState<JobMateMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const jobMateId = params.id as string;
    
    const loadJobMate = async () => {
      try {
        const jobMateData = await jobMateService.getJobMate(jobMateId);
        if (!jobMateData) {
          toast({
            title: "JobMate Not Found",
            description: "The requested JobMate could not be found.",
            variant: "destructive",
          });
          router.push("/dashboard/jobmates");
          return;
        }
        
        setJobMate(jobMateData);
        
        // Load matches
        const jobMateMatches = await jobMateService.getJobMateMatches(jobMateId);
        setMatches(jobMateMatches);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load JobMate:", error);
        toast({
          title: "Error",
          description: "Failed to load JobMate details.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    loadJobMate();
  }, [params.id, router, toast]);
  
  // Toggle JobMate status
  const toggleJobMateStatus = async () => {
    if (!jobMate) return;
    
    const newStatus = jobMate.status === 'active' ? 'paused' : 'active';
    try {
      const updatedJobMate = await jobMateService.updateJobMate(jobMate.id, { status: newStatus });
      setJobMate(updatedJobMate);
      
      toast({
        title: `JobMate ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
        description: `${jobMate.name} is now ${newStatus}.`,
      });
    } catch (error) {
      console.error("Failed to update JobMate status:", error);
      toast({
        title: "Error",
        description: "Failed to update JobMate status.",
        variant: "destructive",
      });
    }
  };
  
  // Run JobMate to find matches
  const runJobMate = async () => {
    if (!jobMate) return;
    
    try {
      toast({
        title: "Finding Matches",
        description: `${jobMate.name} is searching for new matches...`,
      });
      
      const newMatches = await jobMateService.runJobMate(jobMate.id);
      setMatches(prev => [...newMatches, ...prev]);
      
      toast({
        title: "Matches Found",
        description: `${jobMate.name} found ${newMatches.length} new matches.`,
      });
    } catch (error) {
      console.error("Failed to run JobMate:", error);
      toast({
        title: "Error",
        description: "Failed to find matches.",
        variant: "destructive",
      });
    }
  };
  
  // Update match status
  const updateMatchStatus = async (matchId: string, status: 'viewed' | 'saved' | 'contacted' | 'rejected') => {
    try {
      const updatedMatch = await jobMateService.updateMatchStatus(matchId, status);
      setMatches(prev => prev.map(match => match.id === matchId ? updatedMatch : match));
      
      toast({
        title: "Match Updated",
        description: `Match status updated to ${status}.`,
      });
    } catch (error) {
      console.error("Failed to update match status:", error);
      toast({
        title: "Error",
        description: "Failed to update match status.",
        variant: "destructive",
      });
    }
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
      location: "San Francisco, CA",
      imageUrl: "https://via.placeholder.com/150"
    };
    
    return (
      <Card key={match.id} className="mb-4">
        <div className="flex md:flex-row flex-col">
          <div className="w-full md:w-1/4">
            <div className="h-full bg-muted rounded-l-lg overflow-hidden">
              <div className="h-48 md:h-full bg-cover bg-center" style={{ backgroundImage: `url(${mockListing.imageUrl})` }}></div>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{mockListing.title}</CardTitle>
                <Badge className={match.compatibilityScore >= 80 ? "bg-green-500" : 
                               match.compatibilityScore >= 60 ? "bg-emerald-500" : 
                               match.compatibilityScore >= 40 ? "bg-amber-500" : "bg-red-500"}>
                  {match.compatibilityScore}% Match
                </Badge>
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
                <div>
                  <span className="text-muted-foreground">Status:</span> {match.status}
                </div>
                <div>
                  <span className="text-muted-foreground">Found:</span> {new Date(match.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <div className="p-4 pt-2 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateMatchStatus(match.id, 'saved')}
                disabled={match.status === 'saved'}
              >
                Save
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateMatchStatus(match.id, 'contacted')}
                disabled={match.status === 'contacted'}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Contact
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => updateMatchStatus(match.id, 'rejected')}
                disabled={match.status === 'rejected'}
              >
                Ignore
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={() => {
                  // In a real app, this would navigate to the listing detail page
                  toast({
                    title: "View Listing",
                    description: "Viewing listing details would open here.",
                  });
                }}
              >
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };
  
  if (isLoading || !jobMate) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Loading JobMate details...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/dashboard/jobmates")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to JobMates
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{jobMate.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold">{jobMate.name}</h1>
              <p className="text-muted-foreground">{jobMate.description}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={jobMate.status === 'active' ? 'default' : 'outline'}
              onClick={toggleJobMateStatus}
            >
              {jobMate.status === 'active' ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                // In a real app, this would open the edit form
                toast({
                  title: "Edit JobMate",
                  description: "Editing functionality will be implemented soon.",
                });
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                // In a real app, this would open sharing options
                toast({
                  title: "Share Template",
                  description: "Template sharing will be available in the premium version.",
                });
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>JobMate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Status</h3>
                <Badge variant={jobMate.status === 'active' ? 'default' : 'secondary'}>
                  {jobMate.status === 'active' ? 'Active' : 'Paused'}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Category</h3>
                <p>{jobMate.category}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Subcategories</h3>
                <div className="flex flex-wrap gap-1">
                  {jobMate.subcategories?.map((subcategory, index) => (
                    <Badge key={index} variant="outline">{subcategory}</Badge>
                  )) || <p className="text-sm text-muted-foreground">No subcategories selected</p>}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Created</h3>
                <p className="text-sm">{new Date(jobMate.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Matches</h3>
                <p>{matches.length} found</p>
              </div>
              
              <Button 
                className="w-full" 
                onClick={runJobMate}
              >
                <Play className="mr-2 h-4 w-4" />
                Find New Matches
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Premium Feature</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                Unlock AI-powered insights with JobMates Premium
              </p>
              <Button variant="outline">Upgrade</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="matches">
            <TabsList className="mb-4">
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="matches">
              <div className="bg-card rounded-lg p-4 border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Matches</h2>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // In a real app, this would open filter options
                        toast({
                          title: "Filter Matches",
                          description: "Filtering functionality will be implemented soon.",
                        });
                      }}
                    >
                      Filter
                    </Button>
                    <Button 
                      size="sm"
                      onClick={runJobMate}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Run Now
                    </Button>
                  </div>
                </div>
                
                {matches.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No matches found yet</p>
                    <Button onClick={runJobMate}>
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
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>JobMate Preferences</CardTitle>
                  <CardDescription>
                    These preferences determine how {jobMate.name} finds and scores matches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">General Preferences</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Price Importance</p>
                        <p className="text-sm text-muted-foreground">
                          {(jobMate.preferences.generalPreferences?.priceImportance || 0.5) * 100}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Location Importance</p>
                        <p className="text-sm text-muted-foreground">
                          {(jobMate.preferences.generalPreferences?.locationImportance || 0.5) * 100}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Quality Importance</p>
                        <p className="text-sm text-muted-foreground">
                          {(jobMate.preferences.generalPreferences?.qualityImportance || 0.5) * 100}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Weight Preferences</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {jobMate.preferences.weightPreferences && Object.entries(jobMate.preferences.weightPreferences).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                          <p className="text-sm text-muted-foreground">{(value * 100).toFixed(0)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={() => {
                        // In a real app, this would open the preferences editor
                        toast({
                          title: "Edit Preferences",
                          description: "Preference editing will be implemented soon.",
                        });
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chat">
              <Card>
                <CardHeader>
                  <CardTitle>Chat with {jobMate.name}</CardTitle>
                  <CardDescription>Premium Feature</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Chat with your JobMate to get personalized recommendations and insights
                  </p>
                  <Button>Upgrade to Premium</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>JobMate Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Automation Settings</h3>
                    <p className="text-muted-foreground mb-4">
                      Control how this JobMate operates automatically
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-run daily</p>
                          <p className="text-sm text-muted-foreground">
                            Automatically search for new matches daily
                          </p>
                        </div>
                        <Button variant="outline" disabled>Premium</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-message for high matches</p>
                          <p className="text-sm text-muted-foreground">
                            Automatically contact listings with high match scores
                          </p>
                        </div>
                        <Button variant="outline" disabled>Premium</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when new matches are found
                          </p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Archive JobMate</p>
                          <p className="text-sm text-muted-foreground">
                            Hide this JobMate but keep its data
                          </p>
                        </div>
                        <Button variant="outline">Archive</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Delete JobMate</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete this JobMate and all its data
                          </p>
                        </div>
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            // In a real app, this would show a confirmation dialog
                            toast({
                              title: "Delete JobMate",
                              description: "Are you sure you want to delete this JobMate?",
                              variant: "destructive",
                            });
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
