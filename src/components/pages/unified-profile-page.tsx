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
import { JobCategoryIcon, JobCategoryBadge } from "../ui/job-category-icon";
import { ExpertiseBadge, ExpertiseBadgeGroup } from "../ui/expertise-badge";
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
  Trash2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ReputationSystem } from '@/components/reputation/reputation-system';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { ProfileSkeleton } from '@/components/skeletons/profile-skeleton';

// Import the profile page component from the original file
// and just change the layout wrapper

export function UnifiedProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const router = useRouter();

  // Use the same functionality as the original profile page
  // but wrapped in UnifiedDashboardLayout instead of MainLayout

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfileData();
    }
  }, [authLoading, user]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setProfileData({
          id: "user123",
          firstName: user?.firstName || "Alex",
          lastName: user?.lastName || "Johnson",
          email: user?.email || "alex.johnson@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          bio: "Experienced handyman with 10+ years in residential and commercial repairs. Specialized in plumbing, electrical, and carpentry work.",
          avatar: user?.avatar || "/avatars/avatar-1.jpg",
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
          }
        });
        setIsLoading(false);
      }, 1000);
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

  // The rest of the component would be the same as the original profile page
  // Just returning the content wrapped in UnifiedDashboardLayout

  if (isLoading || !profileData) {
    return (
      <UnifiedDashboardLayout title="Profile" hideSidebar={false} showMap={false} isPublicPage={false}>
        <ProfileSkeleton />
      </UnifiedDashboardLayout>
    );
  }

  return (
    <UnifiedDashboardLayout title={`${profileData.firstName} ${profileData.lastName} - Profile`} hideSidebar={false} showMap={false} isPublicPage={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Profile content would go here - same as original profile page */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold">Profile Page</h1>
          <p className="text-muted-foreground">This is the unified version of the profile page using UnifiedDashboardLayout</p>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
