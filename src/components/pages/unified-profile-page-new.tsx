"use client";

import { useState, useEffect } from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/context/ProfileContext';
import { EditableProfileImages } from '@/components/profile/EditableProfileImages';
import { profileService } from '@/services/profileService';
import { useRouter } from 'next/navigation';
import { MarketplaceListingCard } from '@/components/marketplace/marketplace-listing-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ListingCreationWizard } from '@/components/marketplace/create-listing/listing-creation-wizard';
import { SectionHeader } from '@/components/ui/section-header';
import { JobMateDashboard } from '@/components/jobmates/jobmate-dashboard';
// Calendar component import removed
// Define interfaces for component props to help TypeScript
// These interfaces define the expected props for components without proper type declarations
interface ScrollAreaProps {
  className?: string;
  children: React.ReactNode;
}

interface UnifiedReviewsCardProps {
  reviews: any[];
  // Use the props that the component actually expects
  averageRating?: number;
  totalReviews?: number;
}

interface JobCategoryIconProps {
  category: string;
  className?: string;
}

interface VerificationBadgeProps {
  verified: boolean;
  className?: string;
}

interface EditableCertificationsProps {
  certifications: any[];
  onSave: (certifications: any) => void;
}

interface EditableEducationProps {
  education: any[];
  onSave: (education: any) => void;
}

interface EditableWorkHistoryProps {
  workHistory: any[];
  onSave: (workHistory: any) => void;
}

interface EditableProfileInfoProps {
  profileInfo: any;
  onSave: (profileInfo: any) => void;
}

interface EditableSkillsProps {
  skills: any[];
  onSave: (skills: any) => void;
}

interface ProfileCompletionCardProps {
  profile: any;
  className?: string;
}

interface ProfileVerificationCardProps {
  profile: any;
  className?: string;
}

interface ProfileStatsCardProps {
  stats: any;
  className?: string;
}

interface ProfileSocialLinksProps {
  socialLinks: any;
  isEditing: boolean;
  onSave: (socialLinks: any) => void;
}

interface ProfileSettingsFormProps {
  settings: any;
  onSave: (settings: any) => void;
}

// Import the components with type assertions to fix TypeScript errors
// @ts-ignore - Ignore TypeScript errors for missing module declarations
import { ScrollArea } from '@/components/ui/scroll-area';
// @ts-ignore
import { UnifiedReviewsCard } from '@/components/profile/unified-reviews-card-new';
// @ts-ignore
import { JobCategoryIcon } from '@/components/ui/job-category-icon';
// @ts-ignore
import { VerificationBadge } from '@/components/ui/verification-badge';

// Profile Components with type assertions
// @ts-ignore
import { EditableCertifications } from '@/components/profile/editable-certifications';
// @ts-ignore
import { EditableEducation } from '@/components/profile/editable-education';
// @ts-ignore
import { EditableWorkHistory } from '@/components/profile/editable-work-history';
// @ts-ignore
import { EditableProfileInfo } from '@/components/profile/editable-profile-info';
// @ts-ignore
import { EditableSkills } from '@/components/profile/editable-skills';
// @ts-ignore
import { EditableExpertise } from '@/components/profile/editable-expertise';
// @ts-ignore
import { ProfileCompletionCard } from '@/components/profile/profile-completion-card';
// @ts-ignore
import { ProfileVerificationCard } from '@/components/profile/profile-verification-card';
// @ts-ignore
import { ProfileStatsCard } from '@/components/profile/profile-stats-card';
// @ts-ignore
import { ProfileSocialLinks } from '@/components/profile/profile-social-links';
// @ts-ignore
import { ProfileSettingsForm } from '@/components/profile/profile-settings-form';

// Icons
import { 
  Briefcase, Star, X, Settings, Edit, Check, ChevronLeft, ChevronRight, MapPin, Calendar, Clock, DollarSign, 
  Package2, MessageSquare, UserPlus, MoreHorizontal, ThumbsUp, Share2, Users, Key, LogOut, CreditCard, Trash2 
} from 'lucide-react';

// Using the imported SectionHeader component from @/components/ui/section-header

export default function UnifiedProfilePageNew() {
  const { profileData, error, saveProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const [isListingWizardOpen, setIsListingWizardOpen] = useState(false);
  const router = useRouter();
  
  // Add a useEffect to handle loading state
  useEffect(() => {
    if (profileData) {
      setIsLoading(false);
    }
  }, [profileData]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = (updatedData: any) => {
    saveProfile({
      ...profileData,
      ...updatedData
    });
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully."
    });
    setIsEditing(false);
  };
  
  // Show loading state if profile data is not available yet
  if (isLoading || !profileData) {
    return (
      <UnifiedDashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-300 h-32 w-32 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      </UnifiedDashboardLayout>
    );
  }
  
  return (
    <UnifiedDashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header with Editable Images */}
        <div className="relative mb-16">
          <EditableProfileImages
            avatarUrl={profileData?.avatar || ''}
            coverImageUrl={profileData?.coverImage || ''}
            name={profileData?.name || 'User'}
            isEditing={isEditing}
            onAvatarChange={(file: File) => {
              setIsUploading(true);
              try {
                // Upload avatar via profileService
                profileService.uploadAvatar(file)
                  .then((url: string) => {
                    saveProfile({
                      ...profileData,
                      avatar: url
                    });
                    toast({
                      title: "Avatar Updated",
                      description: "Your profile picture has been updated successfully."
                    });
                  })
                  .catch((error: Error) => {
                    toast({
                      title: "Upload Failed",
                      description: "Failed to upload avatar. Please try again.",
                      variant: "destructive"
                    });
                    console.error("Avatar upload error:", error);
                  })
                  .finally(() => {
                    setIsUploading(false);
                  });
              } catch (error) {
                setIsUploading(false);
                console.error("Error starting avatar upload:", error);
              }
            }}
            onCoverImageChange={(file: File) => {
              setIsUploading(true);
              try {
                // Upload cover image via profileService
                profileService.uploadCoverImage(file)
                  .then((url: string) => {
                    saveProfile({
                      ...profileData,
                      coverImage: url
                    });
                    toast({
                      title: "Cover Image Updated",
                      description: "Your cover image has been updated successfully."
                    });
                  })
                  .catch((error: Error) => {
                    toast({
                      title: "Upload Failed",
                      description: "Failed to upload cover image. Please try again.",
                      variant: "destructive"
                    });
                    console.error("Cover image upload error:", error);
                  })
                  .finally(() => {
                    setIsUploading(false);
                  });
              } catch (error) {
                setIsUploading(false);
                console.error("Error starting cover image upload:", error);
              }
            }}
          />
        </div>
        
        {/* Profile Header with Actions */}
        <div className="pt-6 px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{profileData?.name || 'User'}</h1>
                  <VerificationBadge verified={profileData?.verified || false} size="md" />
                </div>
                <p className="text-muted-foreground">{profileData?.title || 'No title set'}</p>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <MapPin size={14} />
                  <span>{profileData?.location || 'No location set'}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={toggleEditMode} className="gap-1">
                    <X size={16} /> Cancel
                  </Button>
                  <Button onClick={() => handleSaveProfile(profileData)} className="gap-1">
                    <Check size={16} /> Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="gap-1">
                    <Briefcase size={16} /> Hire Me
                  </Button>
                  <Button variant="outline" className="gap-1">
                    Message
                  </Button>
                  <Button onClick={toggleEditMode} className="gap-1">
                    <Edit size={16} /> Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Tabs */}
        <Tabs defaultValue="profile" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-6 md:w-fit">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            {/* Two-column layout for desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content - 2/3 width on desktop */}
              <div className="md:col-span-2 space-y-6">
                {/* About Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <SectionHeader 
                        title="About" 
                        description="Tell us about yourself and your professional background"
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <EditableProfileInfo 
                        profileData={profileData} 
                        onSave={handleSaveProfile} 
                      />
                    ) : (
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-muted-foreground">{profileData?.bio || 'No bio available'}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Skills Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <SectionHeader title="Skills & Expertise" />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <EditableSkills 
                        skills={profileData?.skills || []} 
                        onSave={(skills: any) => handleSaveProfile({ skills })} 
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData?.skills?.length > 0 ? (
                          profileData.skills.map((skill: {name: string}, index: number) => (
                            <Badge key={index} variant="secondary" className="text-sm py-1">
                              {skill.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No skills listed</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Work History */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <SectionHeader 
                        title="Work History" 
                        description="Your professional experience"
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <EditableWorkHistory 
                        workHistory={profileData?.workHistory || []} 
                        onSave={(workHistory: any) => handleSaveProfile({ workHistory })} 
                      />
                    ) : (
                      <div className="space-y-4">
                        {profileData?.workHistory?.length > 0 ? (
                          profileData.workHistory.map((job: any, index: number) => (
                            <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{job.title}</h4>
                                  <p className="text-muted-foreground">{job.company}</p>
                                </div>
                                <Badge variant="outline">{job.employmentType}</Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Calendar size={14} />
                                <span>{job.startDate} - {job.endDate || 'Present'}</span>
                              </div>
                              <p className="mt-2 text-sm">{job.description}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No work history available</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Education */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <SectionHeader 
                        title="Education" 
                        description="Your academic background"
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <EditableEducation 
                        education={profileData?.education || []} 
                        onSave={(education: any) => handleSaveProfile({ education })} 
                      />
                    ) : (
                      <div className="space-y-4">
                        {profileData?.education?.length > 0 ? (
                          profileData.education.map((edu: any, index: number) => (
                            <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                              <h4 className="font-medium">{edu.degree}</h4>
                              <p className="text-muted-foreground">{edu.institution}</p>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Calendar size={14} />
                                <span>{edu.startYear} - {edu.endYear || 'Present'}</span>
                              </div>
                              {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No education history available</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <SectionHeader 
                        title="Certifications" 
                        description="Professional certifications and credentials"
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <EditableCertifications 
                        certifications={profileData?.certifications || []} 
                        onSave={(certifications: any) => handleSaveProfile({ certifications })} 
                      />
                    ) : (
                      <div className="space-y-4">
                        {profileData?.certifications?.length > 0 ? (
                          profileData.certifications.map((cert: any, index: number) => (
                            <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                              <h4 className="font-medium">{cert.name}</h4>
                              <p className="text-muted-foreground">{cert.issuer}</p>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Calendar size={14} />
                                <span>Issued: {cert.issueDate}</span>
                                {cert.expiryDate && (
                                  <>
                                    <span>•</span>
                                    <span>Expires: {cert.expiryDate}</span>
                                  </>
                                )}
                              </div>
                              {cert.credentialId && (
                                <p className="text-sm mt-1">Credential ID: {cert.credentialId}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No certifications available</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Availability Calendar */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <SectionHeader 
                        title="Availability Calendar" 
                        description="Manage your available, booked and holiday dates"
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <Button variant="outline" size="sm">
                          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                        <h3 className="text-lg font-medium">July 2025</h3>
                        <Button variant="outline" size="sm">
                          Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                            <div key={i} className="text-center text-sm font-medium py-2">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {/* Empty cells for days before month starts */}
                          {Array.from({ length: 2 }, (_, i) => (
                            <div key={`empty-${i}`} className="h-16 w-full"></div>
                          ))}
                          
                          {/* Actual days */}
                          {Array.from({ length: 31 }, (_, i) => {
                            // Determine the type of day (available, booked, holiday)
                            const isAvailable = i % 7 === 1 || i % 7 === 2;
                            const isBooked = i % 7 === 3 || i % 7 === 4;
                            const isHoliday = i % 7 === 5;
                            
                            let bgClass = '';
                            if (isAvailable) bgClass = 'bg-green-100 dark:bg-green-900/20';
                            if (isBooked) bgClass = 'bg-red-100 dark:bg-red-900/20';
                            if (isHoliday) bgClass = 'bg-blue-100 dark:bg-blue-900/20';
                            
                            return (
                              <div 
                                key={i} 
                                className={`h-16 w-full border rounded-md p-1 relative ${bgClass}`}
                              >
                                <div className="absolute top-1 left-1 font-medium">{i + 1}</div>
                                {isAvailable && (
                                  <div className="absolute bottom-1 left-1 right-1 text-xs text-green-700 dark:text-green-300">
                                    Available
                                  </div>
                                )}
                                {isBooked && (
                                  <div className="absolute bottom-1 left-1 right-1 text-xs text-red-700 dark:text-red-300">
                                    Booked
                                  </div>
                                )}
                                {isHoliday && (
                                  <div className="absolute bottom-1 left-1 right-1 text-xs text-blue-700 dark:text-blue-300">
                                    Holiday
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm text-muted-foreground">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm text-muted-foreground">Booked</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm text-muted-foreground">Holiday</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - 1/3 width on desktop */}
              <div className="space-y-6">
                {/* Profile Completion */}
                <ProfileCompletionCard 
                  completionPercentage={profileData?.completionPercentage || 0} 
                  missingFields={profileData?.missingFields || []} 
                />

                {/* Profile Verification */}
                <ProfileVerificationCard 
                  verified={profileData?.verified || false} 
                  verificationDetails={profileData?.verificationDetails || {}} 
                />

                {/* Profile Stats */}
                <ProfileStatsCard 
                  stats={profileData?.stats || {}} 
                />

                {/* Social Links */}
                <Card>
                  <CardHeader>
                    <SectionHeader title="Social Links" />
                  </CardHeader>
                  <CardContent>
                    <ProfileSocialLinks 
                      socialLinks={profileData?.socialLinks || {}} 
                      isEditing={isEditing} 
                      onSave={(socialLinks: any) => handleSaveProfile({ socialLinks })} 
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Full width reviews content */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <SectionHeader 
                        title="Reviews" 
                        description="What others are saying about you"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* @ts-ignore - Ignore TypeScript errors for props mismatch */}
                    <UnifiedReviewsCard
                      userId={profileData.id || "user-1"}
                      userType="specialist"
                      reputation={{
                        stats: {
                          overallRating: profileData.averageRating || 4.5,
                          totalReviews: profileData.totalReviews || 0,
                          completionRate: 98,
                          responseRate: 95,
                          avgResponseTime: "2 hours",
                          memberSince: "Jan 2023",
                          totalJobsCompleted: profileData.completedJobs || 24,
                          repeatCustomerRate: 75,
                          specialistLevel: "Established",
                          nextLevelProgress: 85,
                          nextLevelRequirements: {
                            jobsNeeded: 5,
                            ratingNeeded: 4.8
                          }
                        },
                        achievements: [],
                        externalReviews: []
                      }}
                      reviews={profileData.reviews || []}
                      reviewStats={{
                        averageRating: profileData.averageRating || 4.5,
                        totalReviews: profileData.totalReviews || 0,
                        ratingBreakdown: {
                          "5": 70,
                          "4": 20,
                          "3": 7,
                          "2": 2,
                          "1": 1
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content - 2/3 width on desktop */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <SectionHeader 
                        title="Jobs History" 
                        description="Jobs you've worked on"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      View All Jobs
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {profileData?.jobsHistory?.length > 0 ? (
                      <div className="space-y-4">
                        {profileData.jobsHistory.map((job: any, index: number) => (
                          <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                            <div className="rounded-md bg-muted p-2 h-10 w-10 flex items-center justify-center">
                              <JobCategoryIcon category={job.category} size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{job.title}</h4>
                                  <p className="text-sm text-muted-foreground">{job.client}</p>
                                </div>
                                <Badge variant={job.status === 'Completed' ? 'success' : 'secondary'}>
                                  {job.status}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  <span>{job.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>{job.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign size={14} />
                                  <span>{job.payment}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No job history available</p>
                        <Button variant="outline" className="mt-4">Find Jobs</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar - 1/3 width on desktop */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <SectionHeader title="Job Stats" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Completed Jobs</span>
                        <span className="font-medium">{profileData?.stats?.completedJobs || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">In Progress</span>
                        <span className="font-medium">{profileData?.stats?.inProgressJobs || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cancellation Rate</span>
                        <span className="font-medium">{profileData?.stats?.cancellationRate || '0%'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">On-time Rate</span>
                        <span className="font-medium">{profileData?.stats?.onTimeRate || '0%'}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Earnings</span>
                        <span className="font-medium">${profileData?.stats?.totalEarnings || '0'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content - 2/3 width on desktop */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <SectionHeader 
                        title="Your Marketplace Listings" 
                        description="Items and services you're offering"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsListingWizardOpen(true)}
                    >
                      Create New Listing
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {profileData?.marketplaceListings?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profileData.marketplaceListings.map((listing: any, index: number) => (
                          <MarketplaceListingCard
                            key={listing.id || index}
                            id={listing.id || `listing-${index}`}
                            title={listing.title}
                            description={listing.description}
                            price={listing.pricing?.price?.toString() || '0'}
                            priceUnit={listing.pricing?.unit || 'fixed'}
                            imageUrl={listing.media && listing.media[0] ? listing.media[0] : ''}
                            tags={listing.category ? [listing.category] : []}
                            type={listing.type || 'item'}
                            isFeatured={listing.isFeatured}
                            isVerified={true}
                            user={{
                              name: profileData?.name || 'User',
                              avatar: profileData?.avatar
                            }}
                            stats={{
                              views: listing.views || 0,
                              likes: listing.saves || 0
                            }}
                            onClick={() => router.push(`/marketplace/listing/${listing.id}`)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You don't have any marketplace listings yet</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setIsListingWizardOpen(true)}
                        >
                          Create Your First Listing
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar - 1/3 width on desktop */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <SectionHeader title="Marketplace Stats" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Active Listings</span>
                        <span className="font-medium">{profileData?.marketplaceStats?.activeListings || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Sales</span>
                        <span className="font-medium">{profileData?.marketplaceStats?.totalSales || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Featured Listings</span>
                        <span className="font-medium">{profileData?.marketplaceStats?.featuredListings || 0}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Revenue</span>
                        <span className="font-medium">${profileData?.marketplaceStats?.totalRevenue || '0'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <SectionHeader title="Promote Your Listings" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Boost visibility and sales by featuring your listings
                    </p>
                    <Button className="w-full">Upgrade to Featured</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content - 2/3 width on desktop */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <SectionHeader 
                      title="Your Network" 
                      description="People you're connected with"
                    />
                  </CardHeader>
                  <CardContent>
                    {profileData?.connections?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {profileData.connections.map((connection: any, index: number) => (
                          <div key={index} className="flex flex-col items-center p-4 border rounded-lg">
                            <Avatar className="h-16 w-16 mb-2">
                              {connection.avatar ? (
                                <AvatarImage src={connection.avatar} alt={connection.name} />
                              ) : (
                                <AvatarFallback>{connection.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              )}
                            </Avatar>
                            <h4 className="font-medium text-center">{connection.name}</h4>
                            <p className="text-sm text-muted-foreground text-center mb-2">{connection.title}</p>
                            <div className="flex gap-2 mt-auto">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MessageSquare size={14} />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <UserPlus size={14} />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You haven't connected with anyone yet</p>
                        <Button variant="outline" className="mt-4">Find People to Connect With</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <SectionHeader 
                      title="Activity Feed" 
                      description="Recent updates from your network"
                    />
                  </CardHeader>
                  <CardContent>
                    {profileData?.activityFeed?.length > 0 ? (
                      <div className="space-y-6">
                        {profileData.activityFeed.map((activity: any, index: number) => (
                          <div key={index} className="flex gap-4">
                            <Avatar className="h-10 w-10">
                              {activity.user.avatar ? (
                                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                              ) : (
                                <AvatarFallback>{activity.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="font-medium">{activity.user.name}</span>
                                <span className="text-muted-foreground">{activity.action}</span>
                                {activity.target && (
                                  <span className="font-medium">{activity.target}</span>
                                )}
                              </div>
                              {activity.content && (
                                <p className="text-sm mt-1">{activity.content}</p>
                              )}
                              {activity.image && (
                                <div className="mt-2 rounded-md overflow-hidden">
                                  <img 
                                    src={activity.image} 
                                    alt="Activity attachment" 
                                    className="max-h-48 object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                                  <ThumbsUp size={14} className="mr-1" />
                                  <span>{activity.likes || 0}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                                  <MessageSquare size={14} className="mr-1" />
                                  <span>{activity.comments || 0}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                                  <Share2 size={14} className="mr-1" />
                                  <span>Share</span>
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              {activity.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar - 1/3 width on desktop */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <SectionHeader title="Connection Suggestions" />
                  </CardHeader>
                  <CardContent>
                    {profileData?.connectionSuggestions?.length > 0 ? (
                      <div className="space-y-4">
                        {profileData.connectionSuggestions.map((suggestion: any, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              {suggestion.avatar ? (
                                <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                              ) : (
                                <AvatarFallback>{suggestion.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{suggestion.name}</h4>
                              <p className="text-xs text-muted-foreground truncate">{suggestion.title}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <UserPlus size={14} className="mr-1" />
                              <span>Connect</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No suggestions available</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <SectionHeader title="Groups" />
                  </CardHeader>
                  <CardContent>
                    {profileData?.groups?.length > 0 ? (
                      <div className="space-y-4">
                        {profileData.groups.map((group: any, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              {group.icon ? (
                                <img src={group.icon} alt={group.name} className="h-6 w-6" />
                              ) : (
                                <Users size={20} className="text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{group.name}</h4>
                              <p className="text-xs text-muted-foreground truncate">{group.members} members</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-2">You're not in any groups yet</p>
                        <Button variant="outline" size="sm">Discover Groups</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <SectionHeader title="Events" />
                  </CardHeader>
                  <CardContent>
                    {profileData?.events?.length > 0 ? (
                      <div className="space-y-4">
                        {profileData.events.map((event: any, index: number) => (
                          <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar size={14} className="text-muted-foreground" />
                              <span className="text-sm font-medium">{event.date}</span>
                            </div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{event.location}</p>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Check size={14} className="mr-1" />
                                <span>Interested</span>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-2">No upcoming events</p>
                        <Button variant="outline" size="sm">Browse Events</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content - 2/3 width on desktop */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <SectionHeader 
                      title="Account Settings" 
                      description="Manage your account preferences"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Profile Settings Form */}
                      <ProfileSettingsForm 
                        settings={profileData?.settings} 
                        onSave={(settings: any) => {
                          toast({
                            title: "Settings updated",
                            description: "Your account settings have been updated successfully."
                          });
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <SectionHeader 
                      title="Privacy Settings" 
                      description="Control your privacy and visibility"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="profile-visibility" className="font-medium">Profile Visibility</Label>
                          <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                        </div>
                        <Select defaultValue={profileData?.privacy?.profileVisibility || "public"}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="connections">Connections</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Activity Visibility</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-jobs" className="flex-1">Show my job history</Label>
                            <Switch id="show-jobs" defaultChecked={profileData?.privacy?.showJobs !== false} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-reviews" className="flex-1">Show reviews I've received</Label>
                            <Switch id="show-reviews" defaultChecked={profileData?.privacy?.showReviews !== false} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-earnings" className="flex-1">Show my earnings</Label>
                            <Switch id="show-earnings" defaultChecked={profileData?.privacy?.showEarnings === true} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* JobMates Dashboard Integration */}
                <Card className="w-full mt-6">
                  <CardHeader>
                    <SectionHeader
                      title="JobMates"
                      description="AI agents that find matches for you"
                    />
                  </CardHeader>
                  <CardContent className="p-0">
                    {profileData ? (
                      <JobMateDashboard userId={profileData.id} />
                    ) : (
                      <div className="flex justify-center items-center p-6">
                        <p className="text-muted-foreground">Loading JobMates...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <SectionHeader 
                      title="Notification Settings" 
                      description="Manage how you receive notifications"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Email Notifications</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-messages" className="flex-1">Messages</Label>
                            <Switch id="email-messages" defaultChecked={profileData?.notifications?.emailMessages !== false} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-jobs" className="flex-1">Job Opportunities</Label>
                            <Switch id="email-jobs" defaultChecked={profileData?.notifications?.emailJobs !== false} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-marketing" className="flex-1">Marketing & Promotions</Label>
                            <Switch id="email-marketing" defaultChecked={profileData?.notifications?.emailMarketing === true} />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Push Notifications</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="push-messages" className="flex-1">Messages</Label>
                            <Switch id="push-messages" defaultChecked={profileData?.notifications?.pushMessages !== false} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="push-jobs" className="flex-1">Job Opportunities</Label>
                            <Switch id="push-jobs" defaultChecked={profileData?.notifications?.pushJobs !== false} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="push-reviews" className="flex-1">New Reviews</Label>
                            <Switch id="push-reviews" defaultChecked={profileData?.notifications?.pushReviews !== false} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar - 1/3 width on desktop */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <SectionHeader title="Account" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{profileData?.email || 'email@example.com'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Member Since</span>
                        <span className="font-medium">{profileData?.memberSince || 'Jan 2023'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Account Type</span>
                        <Badge>{profileData?.accountType || 'Free'}</Badge>
                      </div>
                      <Separator />
                      <div className="pt-2">
                        <Button variant="outline" className="w-full">
                          <Key className="mr-2 h-4 w-4" />
                          Change Password
                        </Button>
                      </div>
                      <div>
                        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <SectionHeader title="Subscription" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Current Plan</span>
                        <Badge variant="outline">{profileData?.subscription?.plan || 'Free'}</Badge>
                      </div>
                      {profileData?.subscription?.plan !== 'Free' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Renewal Date</span>
                            <span className="font-medium">{profileData?.subscription?.renewalDate || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Payment Method</span>
                            <div className="flex items-center gap-1">
                              <CreditCard size={14} />
                              <span>••••{profileData?.subscription?.lastFourDigits || '1234'}</span>
                            </div>
                          </div>
                        </>
                      )}
                      <Separator />
                      <div className="pt-2">
                        <Button className="w-full">
                          {profileData?.subscription?.plan === 'Free' ? 'Upgrade Plan' : 'Manage Subscription'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <SectionHeader title="Danger Zone" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Actions here are permanent and cannot be undone.
                      </p>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Listing Creation Wizard Dialog */}
      <Dialog open={isListingWizardOpen} onOpenChange={setIsListingWizardOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <ListingCreationWizard 
            onClose={() => setIsListingWizardOpen(false)}
            onSuccess={() => {
              setIsListingWizardOpen(false);
              toast({
                title: "Listing created successfully",
                description: "Your new marketplace listing has been created.",
              });
              // Refresh profile data to show the new listing
              // In a real implementation, we would fetch the updated profile
              // For now, we'll just show the toast notification
            }}
          />
        </DialogContent>
      </Dialog>
    </UnifiedDashboardLayout>
  );
}
