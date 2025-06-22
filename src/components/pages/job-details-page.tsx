"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, DollarSign, Clock, User, ArrowLeft, MessageSquare, Briefcase, AlertCircle } from "lucide-react";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, formatDate } from "@/lib/utils";

interface JobDetailsPageProps {
  jobId: string;
}

// Mock job data for demonstration
const MOCK_JOB = {
  id: "job123",
  title: "House Cleaning for 3-Bedroom Home",
  description: "Need a thorough cleaning of my 3-bedroom, 2-bathroom home. Tasks include dusting, vacuuming, mopping, bathroom cleaning, and kitchen cleaning. All cleaning supplies will be provided. Looking for someone with experience and attention to detail.",
  status: "OPEN",
  city: "San Francisco",
  state: "CA",
  zipCode: "94105",
  scheduledStartTime: "2025-07-01T10:00:00Z",
  budgetMin: 100,
  budgetMax: 150,
  createdAt: "2025-06-10T14:30:00Z",
  urgencyLevel: "MEDIUM",
  isRemote: false,
  serviceCategory: {
    id: "1",
    name: "Home Cleaning"
  },
  customer: {
    id: "user456",
    firstName: "John",
    lastName: "Doe",
    profileImageUrl: null,
    rating: 4.8,
    jobsPosted: 12
  },
  proposals: [
    {
      id: "prop789",
      specialist: {
        id: "spec123",
        firstName: "Jane",
        lastName: "Smith",
        profileImageUrl: null,
        rating: 4.9,
        jobsCompleted: 45
      },
      price: 125,
      estimatedDuration: 3,
      message: "I have 5+ years of experience in home cleaning and would love to help you with this job. I pay special attention to detail and ensure all areas are thoroughly cleaned.",
      status: "PENDING",
      createdAt: "2025-06-11T09:15:00Z"
    },
    {
      id: "prop790",
      specialist: {
        id: "spec124",
        firstName: "Robert",
        lastName: "Johnson",
        profileImageUrl: null,
        rating: 4.7,
        jobsCompleted: 32
      },
      price: 140,
      estimatedDuration: 2.5,
      message: "I can provide a deep cleaning service for your home with eco-friendly products if you prefer. I have experience with homes of all sizes.",
      status: "PENDING",
      createdAt: "2025-06-11T11:30:00Z"
    }
  ]
};

export function JobDetailsPage({ jobId }: JobDetailsPageProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [job, setJob] = React.useState<typeof MOCK_JOB | null>(null);
  const [loadingJob, setLoadingJob] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("details");

  // Fetch job details
  React.useEffect(() => {
    const fetchJobDetails = async () => {
      setLoadingJob(true);
      try {
        // This would be replaced with an actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setJob(MOCK_JOB);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again.");
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication or fetching job
  if (isLoading || loadingJob) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  // Show error if job couldn't be loaded
  if (error || !job) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || "Job not found. It may have been removed or is no longer available."}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Determine if the current user is the job poster
  const isJobPoster = user?.id === job.customer.id;
  
  // Determine if the current user has already submitted a proposal
  const hasSubmittedProposal = job.proposals.some(
    proposal => proposal.specialist.id === user?.id
  );

  function getStatusBadge(status: string) {
    switch (status.toUpperCase()) {
      case "DRAFT": 
        return <Badge variant="outline">Draft</Badge>;
      case "OPEN": 
        return <Badge variant="secondary">Open</Badge>;
      case "IN_PROGRESS": 
        return <Badge variant="warning">In Progress</Badge>;
      case "COMPLETED": 
        return <Badge variant="success">Completed</Badge>;
      case "CANCELLED": 
        return <Badge variant="destructive">Cancelled</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  function getUrgencyBadge(urgency?: string | null) {
    if (!urgency) return null;
    
    switch (urgency.toUpperCase()) {
      case "LOW": 
        return <Badge variant="outline">Low Urgency</Badge>;
      case "MEDIUM": 
        return <Badge variant="secondary">Medium Urgency</Badge>;
      case "HIGH": 
        return <Badge variant="destructive">High Urgency</Badge>;
      default: 
        return null;
    }
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{job.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                {isJobPoster && <TabsTrigger value="proposals">Proposals ({job.proposals.length})</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Job Details</CardTitle>
                        <CardDescription>Posted on {formatDate(job.createdAt)}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(job.status)}
                        {getUrgencyBadge(job.urgencyLevel)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="whitespace-pre-line">{job.description}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Location</h3>
                          <p className="text-muted-foreground">
                            {job.city}{job.state ? `, ${job.state}` : ''} {job.zipCode}
                            {job.isRemote && " (Remote available)"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Budget</h3>
                          <p className="text-muted-foreground">
                            {job.budgetMin && job.budgetMax 
                              ? `${formatCurrency(job.budgetMin)} - ${formatCurrency(job.budgetMax)}`
                              : job.budgetMin 
                                ? `From ${formatCurrency(job.budgetMin)}`
                                : job.budgetMax 
                                  ? `Up to ${formatCurrency(job.budgetMax)}`
                                  : 'Not specified'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Start Date</h3>
                          <p className="text-muted-foreground">
                            {job.scheduledStartTime 
                              ? formatDate(job.scheduledStartTime)
                              : 'Flexible'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Category</h3>
                          <p className="text-muted-foreground">{job.serviceCategory.name}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {!isJobPoster && job.status === "OPEN" && (
                    <CardFooter>
                      {hasSubmittedProposal ? (
                        <Alert className="w-full">
                          <MessageSquare className="h-4 w-4" />
                          <AlertTitle>Proposal Submitted</AlertTitle>
                          <AlertDescription>
                            You have already submitted a proposal for this job.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Button className="w-full" onClick={() => router.push(`/jobs/${job.id}/propose`)}>
                          Submit Proposal
                        </Button>
                      )}
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
              
              {isJobPoster && (
                <TabsContent value="proposals">
                  <Card>
                    <CardHeader>
                      <CardTitle>Proposals ({job.proposals.length})</CardTitle>
                      <CardDescription>
                        Review proposals from specialists interested in your job
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {job.proposals.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No proposals yet</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {job.proposals.map((proposal) => (
                            <Card key={proposal.id}>
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={proposal.specialist.profileImageUrl || undefined} />
                                      <AvatarFallback>
                                        {proposal.specialist.firstName[0]}{proposal.specialist.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <CardTitle className="text-base">
                                        {proposal.specialist.firstName} {proposal.specialist.lastName}
                                      </CardTitle>
                                      <CardDescription>
                                        {proposal.specialist.jobsCompleted} jobs completed · {proposal.specialist.rating} stars
                                      </CardDescription>
                                    </div>
                                  </div>
                                  <div>
                                    <Badge variant="outline">
                                      {formatCurrency(proposal.price)}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <p>{proposal.message}</p>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    Estimated duration: {proposal.estimatedDuration} {proposal.estimatedDuration === 1 ? 'hour' : 'hours'}
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => router.push(`/specialists/${proposal.specialist.id}`)}>
                                  View Profile
                                </Button>
                                <Button onClick={() => alert(`Hiring ${proposal.specialist.firstName} (this would be implemented in a real app)`)}>
                                  Hire
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Posted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={job.customer.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {job.customer.firstName[0]}{job.customer.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {job.customer.firstName} {job.customer.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {job.customer.jobsPosted} jobs posted · {job.customer.rating} stars
                    </p>
                  </div>
                </div>
              </CardContent>
              {!isJobPoster && (
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => alert("Message functionality would be implemented here")}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            {isJobPoster && job.status === "OPEN" && (
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={() => router.push(`/jobs/${job.id}/edit`)}>
                  Edit Job
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
