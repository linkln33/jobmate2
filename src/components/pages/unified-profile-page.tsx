"use client";

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Phone } from "lucide-react";
import { VerificationBadge } from "../ui/verification-badge";
import { ExpertiseBadgeGroup } from "../ui/expertise-badge";
import { ReputationSystem } from "../reputation/reputation-system";
import { JobCategoryIcon, JobCategoryBadge } from "../ui/job-category-icon";
import { ProfileSkeleton } from "../skeletons/profile-skeleton";
import { getInitials } from '@/lib/utils';
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  Star, 
  MessageSquare,
  Briefcase,
  Award,
  Check,
  X,
  Edit,
  Camera,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Define profile data type
interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  coverImage: string;
  jobTitle: string;
  hourlyRate: number;
  availability: string;
  skills: string[];
  categories: string[];
  expertise: string[];
  languages: string[];
  education: Array<{ degree: string; institution: string; year: string }>;
  certifications: Array<{ name: string; issuer: string; year: string; expires: string }>;
  experience: Array<{ title: string; company: string; period: string; description: string }>;
  completedJobs: number;
  reviews: Array<{ id: string; clientName: string; clientAvatar: string; rating: number; date: string; comment: string }>;
  reviewStats: { averageRating: number; totalReviews: number; ratingBreakdown: Record<string, number> };
  wallet: { balance: number; pendingPayments: number; transactions: Array<{ id: string; type: string; amount: number; date: string; description: string }> };
  verifications: Record<string, boolean>;
  preferences: { notifications: Record<string, boolean>; privacy: Record<string, boolean> };
  reputation: {
    stats: {
      overallRating: number;
      totalReviews: number;
      completionRate: number;
      responseRate: number;
      avgResponseTime: string;
      memberSince: string;
      totalJobsCompleted: number;
      repeatCustomerRate: number;
      specialistLevel: 'Newcomer' | 'Rising Talent' | 'Established' | 'Top Rated' | 'Elite';
      nextLevelProgress: number;
      nextLevelRequirements: {
        jobsNeeded: number;
        ratingNeeded: number;
        daysNeeded?: number;
      };
    };
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      dateEarned: string;
      category: 'service' | 'community' | 'reliability' | 'skill';
      level: 'bronze' | 'silver' | 'gold' | 'platinum';
    }>;
    externalReviews: Array<{
      platform: string;
      url: string;
      rating: number;
      reviewCount: number;
      verified: boolean;
      logoUrl: string;
    }>;
    feedbackSystem: {
      positiveAttributes: Array<{ name: string; count: number }>;
      negativeAttributes: Array<{ name: string; count: number }>;
      recentFeedback: Array<{ attribute: string; date: string }>;
    };
  };
}

export function UnifiedProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfileData();
    }
  }, [authLoading, user]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // Restore the setTimeout to fix syntax errors
      setTimeout(() => {
        setProfileData({
          id: "user123",
          firstName: user?.firstName || "Alex",
          lastName: user?.lastName || "Johnson",
          email: user?.email || "alex.johnson@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          bio: "Experienced handyman with 10+ years in residential and commercial repairs. Specialized in plumbing, electrical, and carpentry work.",
          avatar: user && user.profileImageUrl ? user.profileImageUrl : "/avatars/avatar-1.jpg",
          coverImage: "/images/profile-cover.jpg",
          jobTitle: "Professional Handyman",
          hourlyRate: 45,
          availability: "Weekdays 9AM-5PM",
          skills: ["Plumbing", "Electrical", "Carpentry", "Painting", "Drywall"],
          categories: ["home-repair", "plumbing", "electrical"],
          expertise: ["residential", "commercial", "emergency"],
          languages: ["English", "Spanish"],
          education: [
            { degree: "Certificate in Plumbing", institution: "Trade Technical College", year: "2010" }
          ],
          certifications: [
            { name: "Licensed Electrician", issuer: "State Board", year: "2012", expires: "2024" }
          ],
          experience: [
            { 
              title: "Senior Handyman", 
              company: "City Home Services", 
              period: "2015 - Present",
              description: "Providing comprehensive home repair services including plumbing, electrical, and carpentry."
            },
            { 
              title: "Maintenance Technician", 
              company: "Apartment Complex", 
              period: "2010 - 2015",
              description: "Responsible for all maintenance and repairs for a 200-unit apartment complex."
            }
          ],
          completedJobs: 247,
          reviews: [
            {
              id: "rev1",
              clientName: "Jennifer Smith",
              clientAvatar: "/avatars/avatar-2.jpg",
              rating: 5,
              date: "2023-05-15",
              comment: "Alex did an amazing job fixing our leaky faucet and replacing the bathroom sink. Very professional and efficient."
            },
            {
              id: "rev2",
              clientName: "Michael Brown",
              clientAvatar: "/avatars/avatar-3.jpg",
              rating: 4,
              date: "2023-04-22",
              comment: "Great work on the electrical wiring. Showed up on time and completed the job within the estimated timeframe."
            }
          ],
          reviewStats: {
            averageRating: 4.8,
            totalReviews: 183,
            ratingBreakdown: {
              5: 150,
              4: 25,
              3: 5,
              2: 2,
              1: 1
            }
          },
          wallet: {
            balance: 1250.75,
            pendingPayments: 350.00,
            transactions: [
              { id: "tx1", type: "payment", amount: 125.00, date: "2023-05-18", description: "Payment for plumbing repair" },
              { id: "tx2", type: "withdrawal", amount: -500.00, date: "2023-05-10", description: "Withdrawal to bank account" },
              { id: "tx3", type: "payment", amount: 85.50, date: "2023-05-05", description: "Payment for electrical work" }
            ]
          },
          verifications: {
            email: true,
            phone: true,
            identity: true,
            background: true,
            insurance: true
          },
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            privacy: {
              showProfile: true,
              showReviews: true,
              showLocation: false
            }
          },
          // Reputation system data
          reputation: {
            stats: {
              overallRating: 4.8,
              totalReviews: 183,
              completionRate: 98,
              responseRate: 99,
              avgResponseTime: "1.5 hours",
              memberSince: "Jan 2020",
              totalJobsCompleted: 247,
              repeatCustomerRate: 72,
              specialistLevel: "Top Rated",
              nextLevelProgress: 85,
              nextLevelRequirements: {
                jobsNeeded: 15,
                ratingNeeded: 4.9,
                daysNeeded: 30
              }
            },
            achievements: [
              {
                id: "ach1",
                name: "Speed Demon",
                description: "Consistently responds to inquiries within 1 hour",
                icon: "Zap",
                dateEarned: "2023-02-15",
                category: "reliability",
                level: "gold"
              },
              {
                id: "ach2",
                name: "Top Performer",
                description: "Maintained a 4.8+ rating for 6 consecutive months",
                icon: "Award",
                dateEarned: "2023-01-10",
                category: "service",
                level: "platinum"
              },
              {
                id: "ach3",
                name: "Community Helper",
                description: "Completed 5 pro-bono jobs for community members in need",
                icon: "Users",
                dateEarned: "2022-11-22",
                category: "community",
                level: "silver"
              },
              {
                id: "ach4",
                name: "Master Plumber",
                description: "Completed 100+ plumbing jobs with a 4.9+ rating",
                icon: "Shield",
                dateEarned: "2022-09-05",
                category: "skill",
                level: "gold"
              }
            ],
            externalReviews: [
              {
                platform: "Yelp",
                url: "https://yelp.com/biz/alex-handyman",
                rating: 4.7,
                reviewCount: 42,
                verified: true,
                logoUrl: "/logos/yelp.svg"
              },
              {
                platform: "Google",
                url: "https://maps.google.com/biz/alex-handyman",
                rating: 4.9,
                reviewCount: 78,
                verified: true,
                logoUrl: "/logos/google.svg"
              },
              {
                platform: "Angie's List",
                url: "https://angieslist.com/sp/alex-handyman",
                rating: 4.8,
                reviewCount: 35,
                verified: true,
                logoUrl: "/logos/angies-list.svg"
              }
            ],
            feedbackSystem: {
              positiveAttributes: [
                { name: "Punctual", count: 156 },
                { name: "Professional", count: 142 },
                { name: "Quality Work", count: 178 },
                { name: "Fair Price", count: 132 },
                { name: "Clean", count: 121 },
                { name: "Communicative", count: 145 }
              ],
              negativeAttributes: [
                { name: "Late", count: 3 },
                { name: "Messy", count: 2 },
                { name: "Expensive", count: 5 }
              ],
              recentFeedback: [
                { attribute: "Quality Work", date: "2023-05-15" },
                { attribute: "Professional", date: "2023-05-15" },
                { attribute: "Punctual", date: "2023-05-12" },
                { attribute: "Communicative", date: "2023-05-10" },
                { attribute: "Fair Price", date: "2023-05-08" }
              ]
            }
          }
        });
        setIsLoading(false);
      }, 100); // Using a very short delay to minimize waiting time
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  if (isLoading || !profileData) {
    return (
      <UnifiedDashboardLayout title="Profile" hideSidebar={false} showMap={false} isPublicPage={false}>
        <ProfileSkeleton />
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout title={`${profileData.firstName} ${profileData.lastName} - Profile`} hideSidebar={false} showMap={false} isPublicPage={false}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-48 w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
            {profileData.coverImage && (
              <img 
                src={profileData.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="absolute -bottom-12 left-6 flex items-end">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profileData.avatar} alt={`${profileData.firstName} ${profileData.lastName}`} />
                <AvatarFallback>{getInitials(`${profileData.firstName} ${profileData.lastName}`)}</AvatarFallback>
              </Avatar>
              {isEditing ? (
                <button 
                  className="absolute bottom-0 right-0 p-1 bg-primary rounded-full text-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      // Handle image upload
                      console.log('Image selected:', e.target.files?.[0]);
                    }}
                  />
                </button>
              ) : null}
            </div>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="pt-14 px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h1>
                <VerificationBadge verified={true} size="md" />
              </div>
              <p className="text-muted-foreground">{profileData.jobTitle}</p>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      // Save profile changes
                      toast({
                        title: "Profile Updated",
                        description: "Your profile has been updated successfully."
                      });
                      setIsEditing(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-primary">{profileData.completedJobs}</div>
              <div className="text-sm text-muted-foreground">Jobs Completed</div>
            </div>
            <div className="bg-card rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-primary">{profileData.reviewStats.averageRating.toFixed(1)}</div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.round(profileData.reviewStats.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">({profileData.reviewStats.totalReviews})</span>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-primary">${profileData.hourlyRate}</div>
              <div className="text-sm text-muted-foreground">Hourly Rate</div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 md:w-fit">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea 
                      value={profileData.bio} 
                      onChange={(e) => {
                        // Update bio in state
                      }}
                      className="min-h-[120px]"
                    />
                  ) : (
                    <p>{profileData.bio}</p>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {profileData.categories.map((category, index) => (
                            <JobCategoryBadge key={index} category={category} />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Expertise</h4>
                        <ExpertiseBadgeGroup expertise={profileData.expertise} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span>{profileData.availability}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.experience.map((exp, index) => (
                        <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                          <h4 className="font-medium">{exp.title}</h4>
                          <div className="text-sm text-muted-foreground">{exp.company} • {exp.period}</div>
                          <p className="mt-2 text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Certifications & Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Certifications</h4>
                        {profileData.certifications.map((cert, index) => (
                          <div key={index} className="flex justify-between items-start mb-2 last:mb-0">
                            <div>
                              <div className="font-medium">{cert.name}</div>
                              <div className="text-sm text-muted-foreground">{cert.issuer} • {cert.year}</div>
                            </div>
                            <Badge variant="outline">Expires {cert.expires}</Badge>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-2 border-t">
                        <h4 className="text-sm font-medium mb-2">Education</h4>
                        {profileData.education.map((edu, index) => (
                          <div key={index}>
                            <div className="font-medium">{edu.degree}</div>
                            <div className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              {isLoading ? (
                <ProfileSkeleton />
              ) : (
                <div className="space-y-6">
                  {/* Reputation System */}
                  {profileData?.reputation && (
                    <ReputationSystem
                      userId={profileData.id}
                      userType="specialist"
                      stats={profileData.reputation.stats}
                      achievements={profileData.reputation.achievements}
                      externalReviews={profileData.reputation.externalReviews}
                    />
                  )}
                  
                  {/* Feedback System */}
                  {profileData?.reputation?.feedbackSystem && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Client Feedback</CardTitle>
                        <CardDescription>
                          Common attributes clients mention about your work
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Positive Attributes</h4>
                            <div className="flex flex-wrap gap-2">
                              {profileData.reputation.feedbackSystem.positiveAttributes.map((attr, i) => (
                                <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                                  {attr.name} ({attr.count})
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {profileData.reputation.feedbackSystem.negativeAttributes.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Areas for Improvement</h4>
                              <div className="flex flex-wrap gap-2">
                                {profileData.reputation.feedbackSystem.negativeAttributes.map((attr, i) => (
                                  <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                                    {attr.name} ({attr.count})
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-medium mb-2">Recent Feedback</h4>
                            <div className="space-y-2">
                              {profileData.reputation.feedbackSystem.recentFeedback.map((feedback, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span>{feedback.attribute}</span>
                                  <span className="text-muted-foreground">{new Date(feedback.date).toLocaleDateString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Reviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Reviews</CardTitle>
                      <CardDescription>
                        Client reviews and feedback for your services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {profileData?.reviews.map((review) => (
                        <div key={review.id} className="mb-6 border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={review.clientAvatar} alt={review.clientName} />
                                <AvatarFallback>{review.clientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{review.clientName}</h4>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <div className="flex mr-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  <span>{new Date(review.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Reviews
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Bathroom Plumbing Repair</h4>
                          <div className="text-sm text-muted-foreground">Completed on May 15, 2023</div>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>$120</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>3 hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>San Francisco, CA</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Kitchen Sink Installation</h4>
                          <div className="text-sm text-muted-foreground">Completed on May 10, 2023</div>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>$180</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>4 hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Oakland, CA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input 
                      id="hourlyRate" 
                      type="number" 
                      value={profileData.hourlyRate} 
                      onChange={() => {}} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Input 
                      id="availability" 
                      value={profileData.availability} 
                      onChange={() => {}} 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive job alerts and messages via email</p>
                    </div>
                    <Switch checked={profileData.preferences.notifications.email} onCheckedChange={() => {}} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch checked={profileData.preferences.notifications.push} onCheckedChange={() => {}} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                    </div>
                    <Switch checked={profileData.preferences.notifications.sms} onCheckedChange={() => {}} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
