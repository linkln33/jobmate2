"use client";

import { useState, useEffect, useRef, ChangeEvent } from 'react';
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
import { ProfileProvider, useProfile } from '@/context/ProfileContext';
import { UnifiedReviewsCard } from '@/components/profile/unified-reviews-card-new';
import { EditableProfileImages } from '@/components/profile/EditableProfileImages';
import { ProfileCompatibilityCard } from '@/components/profile/profile-compatibility-card';
// Creating a simple SectionHeader component inline instead of importing it

// Simple SectionHeader component to replace the missing import
const SectionHeader = ({ 
  title, 
  description,
  isEditing,
  onEditClick 
}: { 
  title: string; 
  description?: string;
  isEditing?: boolean;
  onEditClick?: () => void;
}) => {
  return (
    <div className="mb-6 flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {onEditClick && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEditClick}
          className="text-muted-foreground hover:text-foreground"
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      )}
    </div>
  );
};
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
  Image,
  ShoppingBag,
  Eye,
  Users,
  BriefcaseBusiness,
  Building2,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
// Commented out missing components
// import { JobsTab } from '@/components/profile/jobs/jobs-tab';
// import { RoleSwitcher } from '@/components/profile/jobs/role-switcher';
// import { UserMarketplace } from '@/components/profile/marketplace/user-marketplace';
// import { SocialMediaTab } from '@/components/profile/social/social-media-tab';
// UserRole is now defined directly in this file
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
// Define ProfileData type directly since @/types/profile doesn't exist
type UserRole = 'freelancer' | 'employer' | 'both';

type Certification = {
  name: string;
  issuer: string;
  year: string;
  expires?: string;
  certificateUrl?: string;
  certificateFile?: string;
};

type Experience = {
  id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
};

type Skill = {
  id?: string;
  name: string;
  level?: number;
};

type Category = {
  id?: string;
  name: string;
  skills: Skill[];
};

type ProfileData = {
  id: string;
  userId: string;
  name: string;
  role: UserRole;
  avatar?: string;
  coverImage?: string;
  title?: string;
  bio?: string;
  location?: string;
  website?: string;
  email: string;
  phone?: string;
  categories?: Category[];
  skills?: Skill[];
  experience?: Experience[];
  certifications?: Certification[];
  isVerified?: boolean;
  joinedDate: string;
  completedJobs?: number;
  totalEarnings?: number;
  rating?: number;
  reviewCount?: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
    instagram?: string;
  };
  settings?: {
    profileVisibility: 'public' | 'private' | 'connections';
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketplaceUpdates: boolean;
  };
}

export function UnifiedProfilePage() {
  const { user } = useAuth();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const tabParam = searchParams ? searchParams.get('tab') : null;
  const validTabs = ["profile", "reviews", "jobs", "marketplace", "rentals", "social", "settings"];
  
  // State for active tab
  const [activeTab, setActiveTab] = useState(
    tabParam && validTabs.includes(tabParam) ? tabParam : "profile"
  );
  
  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Update URL without full page reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url);
    }
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  
  // Use ProfileContext for state management
  const { profileData, isLoading, isEditing, activeRole, error, saveProfile, toggleEditing, setActiveRole } = useProfile();
  
  // Using saveProfile and toggleEditing from ProfileContext

  // State for editing mode for each section
  const [editingSections, setEditingSections] = useState({
    about: false,
    expertise: false,
    contact: false,
    experience: false,
    certifications: false
  });
  
  // Helper function to toggle editing for a specific section
  const toggleSectionEditing = (section: keyof typeof editingSections) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Profile data is managed by the ProfileContext

  // Handle avatar image upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profileData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Use the saveProfile method from context
        saveProfile({
          ...profileData,
          avatar: reader.result as string
        });
        
        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been updated successfully."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover image upload
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profileData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Use the saveProfile method from context
        saveProfile({
          ...profileData,
          coverImage: reader.result as string
        });
        
        toast({
          title: "Cover Photo Updated",
          description: "Your cover photo has been updated successfully."
        });
      };
      reader.readAsDataURL(file);
    }
  };

    // Show loading skeleton while profile data is loading
  if (isLoading || !profileData) {
    return (
      <UnifiedDashboardLayout title="Profile" hideSidebar={false} showMap={false} isPublicPage={false}>
        <ProfileSkeleton />
      </UnifiedDashboardLayout>
    );
  }

  return (
    <>
      <UnifiedDashboardLayout title="Profile" hideSidebar={false} showMap={false} isPublicPage={false}>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Profile Header with Editable Images */}
          <div className="relative mb-16">
          <EditableProfileImages
            avatarUrl={profileData.avatar || ''}
            coverImageUrl={profileData.coverImage || ''}
            name={profileData.name}
            onAvatarChange={(file) => {
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
            onCoverImageChange={(file) => {
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
            isEditing={isEditing}
          />
        </div>
        
        {/* Profile Info */}
        <div className="pt-6 px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h1>
                <VerificationBadge verified={true} size="md" />
                {profileData.reputation?.stats.totalJobsCompleted >= 500 && (
                  <div className="flex items-center gap-1" title="Green Star - $500+ earned">
                    <Star className="h-5 w-5 text-green-500" fill="currentColor" />
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">{profileData.jobTitle}</p>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              {!isEditing ? (
                <div className="flex gap-3">
                  <button 
                    onClick={toggleEditing}
                    className="flex items-center gap-1 text-xs font-medium hover:text-primary transition-colors"
                  >  
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-1 text-xs font-medium hover:text-primary transition-colors"
                  >  
                    <Eye className="h-4 w-4" />
                    View As
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={toggleEditing}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      // Save profile changes is handled by the context
                      // Each component already saves changes as they happen
                      toggleEditing();
                      toast({
                        title: "Profile Updated",
                        description: "Your profile has been updated successfully."
                      });
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
          <Tabs defaultValue="profile" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-7 md:w-fit">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="rentals">Rentals</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6">
                  {/* EditableAbout component commented out 
                    <EditableAbout
                    bio={profileData.bio}
                    jobTitle={profileData.jobTitle}
                    hourlyRate={profileData.hourlyRate}
                    onChange={(field, value) => {
                      saveProfile({
                        ...profileData,
                        [field]: value
                      });
                    }}
                    isEditing={editingSections.about}
                    onEditClick={() => toggleSectionEditing('about')}
                    /> */}
                  {editingSections.about && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => toggleSectionEditing('about')}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => toggleSectionEditing('about')}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Only show compatibility card when viewing someone else's profile */}
                {!isEditing && profileData.id !== 'current-user' && (
                  <ProfileCompatibilityCard userId={profileData.id} className="h-full" />
                )}
                <Card>
                  <CardContent className="pt-6">
                    {/* <EditableExpertise
                      skills={profileData.skills}
                      categories={profileData.categories}
                      expertise={profileData.expertise}
                      onChange={(field: string, value: any) => {
                        saveProfile({
                          ...profileData,
                          [field]: value
                        });
                      }}
                      isEditing={editingSections.expertise}
                      onEditClick={() => toggleSectionEditing('expertise')}
                    />
                    {editingSections.expertise && (
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => toggleSectionEditing('expertise')}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => toggleSectionEditing('expertise')}
                        >
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    {/* <EditableCertifications
                      certifications={profileData.certifications as Certification[]}
                      onChange={(certifications) => {
                        saveProfile({
                          ...profileData,
                          certifications
                        });
                      }}
                      isEditing={editingSections.certifications}
                      onEditClick={() => toggleSectionEditing('certifications')}
                    />
                    {editingSections.certifications && (
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => toggleSectionEditing('certifications')}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => toggleSectionEditing('certifications')}
                        >
                          Save Changes
                        </Button>
                      </div>
                    )}
                    
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    {/* <EditableExperience
                      experience={profileData.experience}
                      onChange={(experience) => {
                        saveProfile({
                          ...profileData,
                          experience
                        });
                      }}
                      isEditing={editingSections.experience}
                      onEditClick={() => toggleSectionEditing('experience')}
                    />
                    {editingSections.experience && (
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => toggleSectionEditing('experience')}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => toggleSectionEditing('experience')}
                        >
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    {/* <EditableContactInfo
                      email={profileData.email}
                      phone={profileData.phone}
                      location={profileData.location}
                      availability={profileData.availability}
                      onChange={(field, value) => {
                        saveProfile({
                          ...profileData,
                          [field]: value
                        });
                      }}
                      isEditing={editingSections.contact}
                      onEditClick={() => toggleSectionEditing('contact')}
                    />
                    {editingSections.contact && (
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => toggleSectionEditing('contact')}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => toggleSectionEditing('contact')}
                        >
                          Save Changes
                        </Button>
                      </div>
                    )}
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
                  {/* Unified Reviews Card */}
                  {profileData && (
                    <UnifiedReviewsCard
                      userId={profileData.id}
                      userType="specialist"
                      reputation={profileData.reputation || {
                        stats: {
                          overallRating: 4.8,
                          totalReviews: 120,
                          completionRate: 98,
                          responseRate: 99,
                          avgResponseTime: "2 hours",
                          memberSince: "2023-01-15",
                          totalJobsCompleted: 115,
                          repeatCustomerRate: 65,
                          specialistLevel: "Top Rated",
                          nextLevelProgress: 85,
                          nextLevelRequirements: {
                            jobsNeeded: 15,
                            ratingNeeded: 4.9,
                            daysNeeded: 30
                          }
                        },
                        achievements: [],
                        externalReviews: []
                      }}
                      reviews={profileData.reviews || []}
                      reviewStats={profileData.reviewStats || { 
                        averageRating: 4.8, 
                        totalReviews: 120, 
                        ratingBreakdown: {
                          "Communication": 4.9,
                          "Quality": 4.8,
                          "Value": 4.7,
                          "Timeliness": 4.9,
                          "Professionalism": 5.0
                        } 
                      }}
                      onLoadMore={() => console.log('Load more reviews')}
                    />
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <Card>
                <CardHeader>
                  <SectionHeader 
                    title="Jobs" 
                    isEditing={isEditing} 
                    onEditClick={() => toggleEditing()} 
                  />
                </CardHeader>
                <CardContent>
                  {/* <JobsTab /> */}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Marketplace Tab */}
            <TabsContent value="marketplace" className="space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Marketplace</h2>
                </CardHeader>
                <CardContent>
                  {/* <UserMarketplace userId={profileData.id} isOwnProfile={true} /> */}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Rentals Tab */}
            <TabsContent value="rentals" className="space-y-6">
              <Card>
                <CardHeader>
                  <SectionHeader 
                    title="Equipment Rentals" 
                    isEditing={isEditing} 
                    onEditClick={() => toggleEditing()} 
                  />
                  <CardDescription>Coming soon - Rent and list equipment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Rental Marketplace Coming Soon</h3>
                    <p className="text-muted-foreground mb-4">
                      List your equipment for rent or find equipment to rent from others in your area.
                    </p>
                    <Button variant="outline">Get Notified When Available</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-6 mt-6">
              {/* <SocialMediaTab /> */}
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
                  <CardDescription>Configure how you receive notifications from JobMate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch checked={profileData.preferences.notifications.email} onCheckedChange={() => {}} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Switch checked={profileData.preferences.notifications.push} onCheckedChange={() => {}} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                      </div>
                      <Switch checked={profileData.preferences.notifications.sms} onCheckedChange={() => {}} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </UnifiedDashboardLayout>
      
      {/* Profile Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Profile Preview</h3>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Profile Card Preview */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="h-28 relative">
                  {/* Cover image */}
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={profileData.coverImage || '/images/default-cover.jpg'} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Profile picture positioned at the bottom edge of the header */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 border-4 border-white dark:border-gray-900 rounded-full overflow-hidden shadow-md">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileData.avatar} alt={`${profileData.firstName} ${profileData.lastName}`} />
                      <AvatarFallback>{getInitials(`${profileData.firstName} ${profileData.lastName}`)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                <div className="px-6 pt-14 pb-6">
                  <div className="text-center mb-3">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</h3>
                      <VerificationBadge verified={true} size="sm" />
                      {profileData.reputation?.stats.totalJobsCompleted >= 500 && (
                        <div className="flex items-center" title="Green Star - $500+ earned">
                          <Star className="h-5 w-5 text-green-500" fill="currentColor" />
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{profileData.location}</p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 mt-3">
                    <div className="flex items-center">
                      <span className="font-semibold">${profileData.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                      <span className="font-semibold">{profileData.reviewStats.averageRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="font-semibold">{profileData.completedJobs} jobs</span>
                    </div>
                  </div>
                  
                  <p className="text-sm mt-4 line-clamp-3 text-center">
                    {profileData.bio}
                  </p>
                  
                  <div className="flex gap-2 mt-4 flex-wrap justify-center">
                    {profileData.categories.slice(0, 3).map((category: string, i: number) => (
                      <div key={i} className="flex items-center gap-1 px-3 py-1 rounded-full" 
                           style={{
                             backgroundColor: `var(--category-${category.toLowerCase().replace(/\s+/g, '-')}-bg, var(--${['blue', 'green', 'amber', 'purple', 'pink'][i % 5]}-100))`,
                             color: `var(--category-${category.toLowerCase().replace(/\s+/g, '-')}-text, var(--${['blue', 'green', 'amber', 'purple', 'pink'][i % 5]}-700))`
                           }}>
                        <JobCategoryIcon category={category} className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{category}</span>
                      </div>
                    ))}
                    {profileData.categories.length > 3 && (
                      <Badge variant="outline">+{profileData.categories.length - 3} more</Badge>
                    )}
                  </div>
                  
                  <Button className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white">
                    See profile
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>This is how your profile appears to others in search results and recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
