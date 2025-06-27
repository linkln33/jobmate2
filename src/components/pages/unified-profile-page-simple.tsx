"use client";

import { useState, useEffect } from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/context/ProfileContext';
import { EditableProfileImages } from '@/components/profile/EditableProfileImages';
import { profileService } from '@/services/profileService';

// Simple SectionHeader component
const SectionHeader = ({ 
  title, 
  description
}: { 
  title: string; 
  description?: string;
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mt-1">{description}</p>}
    </div>
  );
};

export function UnifiedProfilePage() {
  const { profileData, saveProfile } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Add a useEffect to handle loading state
  useEffect(() => {
    if (profileData) {
      setIsLoading(false);
    }
  }, [profileData]);
  
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
            isEditing={false}
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
          />
        </div>
        
        {/* Profile Info */}
        <div className="pt-6 px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">{profileData?.name || 'User'}</h1>
              <p className="text-muted-foreground">{profileData?.title || 'No title set'}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" className="mr-2">Message</Button>
              <Button>Connect</Button>
            </div>
          </div>
        </div>
        
        {/* Profile Tabs */}
        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="grid grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <SectionHeader 
                  title="About" 
                  description="Tell us about yourself and your professional background"
                />
              </CardHeader>
              <CardContent>
                <p>{profileData?.bio || 'No bio available'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <SectionHeader 
                  title="Skills & Expertise" 
                />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData?.skills?.map((skill: {name: string}, index: number) => (
                    <div key={index} className="bg-muted rounded-full px-3 py-1 text-sm">
                      {skill.name}
                    </div>
                  )) || <p>No skills listed</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <SectionHeader 
                  title="Reviews" 
                  description="What others are saying about you"
                />
              </CardHeader>
              <CardContent>
                <p>Reviews will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other tabs would go here */}
          <TabsContent value="jobs" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <SectionHeader title="Jobs" />
              </CardHeader>
              <CardContent>
                <p>Jobs will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="marketplace" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <SectionHeader title="Marketplace Listings" />
              </CardHeader>
              <CardContent>
                <p>Your marketplace listings will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <SectionHeader title="Account Settings" />
              </CardHeader>
              <CardContent>
                <p>Account settings will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedDashboardLayout>
  );
}
