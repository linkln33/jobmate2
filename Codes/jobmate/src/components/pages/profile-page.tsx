"use client";

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
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
  Award, 
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Upload,
  Check,
  X,
  Camera,
  Save,
  Clock,
  DollarSign,
  ThumbsUp,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Facebook,
  ExternalLink,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Languages,
  GraduationCap,
  Building,
  Heart,
  MessageSquare
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Type definitions for our enhanced profile data
type SocialPlatform = 'WEBSITE' | 'LINKEDIN' | 'GITHUB' | 'TWITTER' | 'INSTAGRAM' | 'FACEBOOK' | 'OTHER';
type ReviewType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

interface UserSocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  username?: string;
  isVerified: boolean;
  isPublic: boolean;
}

interface UserSkill {
  id: string;
  skillId: string;
  skill: {
    id: string;
    name: string;
    categoryId?: string;
    category?: {
      id: string;
      name: string;
      iconUrl?: string;
      emoji?: string;
      color?: string;
    };
  };
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number;
  endorsementCount: number;
  endorsements?: SkillEndorsement[];
}

interface SkillEndorsement {
  id: string;
  endorserId: string;
  endorser: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  comment?: string;
  createdAt: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  projectUrl?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    iconUrl?: string;
    emoji?: string;
    color?: string;
  };
  completionDate?: string;
  displayOrder: number;
  isPublic: boolean;
}

interface ReviewMedia {
  id: string;
  mediaUrl: string;
  mediaType: string;
}

interface Review {
  id: string;
  reviewerId: string;
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  revieweeId: string;
  reviewee: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  jobId: string;
  job: {
    id: string;
    title: string;
    status: string;
    completedAt?: string;
  };
  overallRating: number;
  timingRating?: number;
  satisfactionRating?: number;
  costRating?: number;
  communicationRating?: number;
  comment?: string;
  reviewType?: ReviewType;
  isPublic: boolean;
  helpfulCount: number;
  reportCount: number;
  reviewMedia?: ReviewMedia[];
  createdAt: string;
  updatedAt: string;
}

interface ReviewStatistics {
  totalReviews: number;
  averageRating: number;
  positivePercentage: number;
  reviewBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  criteriaAverages: {
    timing: number;
    satisfaction: number;
    cost: number;
    communication: number;
  };
}

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  joinDate: string;
  profileImageUrl?: string;
  bio?: string;
  role: 'CUSTOMER' | 'SPECIALIST' | 'ADMIN';
  skills: UserSkill[];
  socials: UserSocialLink[];
  portfolioItems: PortfolioItem[];
  reviews: Review[];
  reviewStats?: ReviewStatistics;
  completedJobs: number;
  specialistProfile?: {
    averageResponseTime?: number;
    averageDeliveryTime?: number;
    businessName?: string;
    businessAddress?: string;
    businessRegistrationNumber?: string;
    taxIdentificationNumber?: string;
    isBusinessVerified: boolean;
    isIdentityVerified: boolean;
    isAddressVerified: boolean;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    averageRating: number;
    positiveReviewPercentage: number;
    totalReviews: number;
    languages?: string[];
    education?: {
      institution: string;
      degree: string;
      fieldOfStudy: string;
      from: string;
      to?: string;
      isVerified: boolean;
    }[];
    workHistory?: {
      company: string;
      position: string;
      description?: string;
      from: string;
      to?: string;
      isVerified: boolean;
    }[];
  };
  wallet?: {
    balance: number;
    pendingPayments: number;
    transactions: {
      id: number;
      type: string;
      amount: number;
      date: string;
      status: string;
    }[];
  };
  badges?: {
    id: number;
    name: string;
    icon: string;
  }[];
}

interface ProfilePageProps {
  user: any;
}

// Star rating component
function StarRating({ rating, category }: { rating: number; category: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={`${category}-${star}`} 
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{category}</span>
    </div>
  );
}

// Social icon component
function SocialIcon({ platform }: { platform: SocialPlatform }) {
  switch (platform) {
    case 'WEBSITE':
      return <Globe className="h-4 w-4" />;
    case 'LINKEDIN':
      return <Linkedin className="h-4 w-4" />;
    case 'GITHUB':
      return <Github className="h-4 w-4" />;
    case 'TWITTER':
      return <Twitter className="h-4 w-4" />;
    case 'INSTAGRAM':
      return <Instagram className="h-4 w-4" />;
    case 'FACEBOOK':
      return <Facebook className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
}

// Proficiency level badge component
function ProficiencyBadge({ level }: { level: ProficiencyLevel }) {
  const colors = {
    BEGINNER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    INTERMEDIATE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    ADVANCED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    EXPERT: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
  };
  
  const labels = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    EXPERT: 'Expert'
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[level]}`}>
      {labels[level]}
    </span>
  );
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [activeRole, setActiveRole] = useState(user?.role || 'CUSTOMER');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [newSkill, setNewSkill] = useState('');
  const [skillProficiency, setSkillProficiency] = useState<ProficiencyLevel>('INTERMEDIATE');
  const [skillYears, setSkillYears] = useState<number>(1);
  const [newSocialPlatform, setNewSocialPlatform] = useState<SocialPlatform>('WEBSITE');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialUsername, setNewSocialUsername] = useState('');
  const [isPublicSocial, setIsPublicSocial] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Data fetching functions
  const fetchProfileData = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use the mock data already in state
      // const response = await fetch('/api/profile');
      // if (!response.ok) throw new Error('Failed to fetch profile data');
      // const data = await response.json();
      // setProfileData(data);
      
      // Using mock data instead of API call
      console.log('Using mock profile data');
      return Promise.resolve();
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return Promise.reject(error);
    }
  };
  
  const fetchUserSkills = async () => {
    try {
      // Mock skills data
      const mockSkills: UserSkill[] = [
        { 
          id: '1',
          skillId: '1', 
          skill: { id: '1', name: 'Plumbing' }, 
          proficiencyLevel: 'EXPERT', 
          yearsOfExperience: 5, 
          endorsements: [],
          endorsementCount: 0
        },
        { 
          id: '2',
          skillId: '2', 
          skill: { id: '2', name: 'Electrical' }, 
          proficiencyLevel: 'INTERMEDIATE', 
          yearsOfExperience: 3, 
          endorsements: [],
          endorsementCount: 0
        },
        { 
          id: '3',
          skillId: '3', 
          skill: { id: '3', name: 'Carpentry' }, 
          proficiencyLevel: 'ADVANCED', 
          yearsOfExperience: 4, 
          endorsements: [],
          endorsementCount: 0
        }
      ];
      
      setProfileData(prev => ({ ...prev, skills: mockSkills }));
      return Promise.resolve();
    } catch (error) {
      console.error('Error fetching skills:', error);
      return Promise.reject(error);
    }
  };
  
  const fetchUserSocials = async () => {
    try {
      // Mock socials data
      const mockSocials: UserSocialLink[] = [
        { 
          id: '1', 
          platform: 'LINKEDIN' as SocialPlatform, 
          url: 'https://linkedin.com/in/johndoe', 
          username: 'johndoe', 
          isPublic: true,
          isVerified: true
        },
        { 
          id: '2', 
          platform: 'GITHUB' as SocialPlatform, 
          url: 'https://github.com/johndoe', 
          username: 'johndoe', 
          isPublic: true,
          isVerified: false
        }
      ];
      
      setProfileData(prev => ({ ...prev, socials: mockSocials }));
      return Promise.resolve();
    } catch (error) {
      console.error('Error fetching social links:', error);
      return Promise.reject(error);
    }
  };
  
  const fetchPortfolioItems = async () => {
    try {
      // Mock portfolio data
      const mockPortfolio: PortfolioItem[] = [
        { 
          id: '1', 
          title: 'Kitchen Renovation', 
          description: 'Complete kitchen remodel', 
          imageUrl: '', 
          category: { id: '1', name: 'CONSTRUCTION', iconUrl: '', emoji: '🔨', color: '#4CAF50' }, 
          completionDate: '2023-05-15',
          displayOrder: 1,
          isPublic: true
        },
        { 
          id: '2', 
          title: 'Bathroom Repair', 
          description: 'Fixed leaking pipes and replaced tiles', 
          imageUrl: '', 
          category: { id: '2', name: 'PLUMBING', iconUrl: '', emoji: '🔧', color: '#2196F3' }, 
          completionDate: '2023-04-10',
          displayOrder: 2,
          isPublic: true
        }
      ];
      
      setProfileData(prev => ({ ...prev, portfolioItems: mockPortfolio }));
      return Promise.resolve();
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return Promise.reject(error);
    }
  };
  
  const fetchUserReviews = async () => {
    try {
      // Mock reviews data
      const mockReviews: Review[] = [
        {
          id: '1',
          reviewerId: 'user-2',
          revieweeId: 'user-1',
          reviewer: { id: 'user-2', firstName: 'Jane', lastName: 'Smith' },
          reviewee: { id: 'user-1', firstName: 'John', lastName: 'Doe' },
          jobId: 'job-1',
          job: { id: 'job-1', title: 'Plumbing Repair', status: 'COMPLETED', completedAt: '2023-06-01' },
          overallRating: 5,
          timingRating: 5,
          satisfactionRating: 5,
          costRating: 4,
          communicationRating: 5,
          comment: 'Excellent work! Very professional and completed the job ahead of schedule.',
          createdAt: '2023-06-01',
          updatedAt: '2023-06-01',
          isPublic: true,
          helpfulCount: 3,
          reportCount: 0
        },
        {
          id: '2',
          reviewerId: 'user-3',
          revieweeId: 'user-1',
          reviewer: { id: 'user-3', firstName: 'Mike', lastName: 'Johnson' },
          reviewee: { id: 'user-1', firstName: 'John', lastName: 'Doe' },
          jobId: 'job-2',
          job: { id: 'job-2', title: 'Bathroom Renovation', status: 'COMPLETED', completedAt: '2023-05-15' },
          overallRating: 4,
          timingRating: 4,
          satisfactionRating: 5,
          costRating: 4,
          communicationRating: 5,
          comment: 'Great job on our bathroom renovation. Would hire again.',
          createdAt: '2023-05-15',
          updatedAt: '2023-05-15',
          isPublic: true,
          helpfulCount: 1,
          reportCount: 0
        }
      ];
      
      const mockReviewStats: ReviewStatistics = {
        totalReviews: 18,
        averageRating: 4.5,
        positivePercentage: 94,
        reviewBreakdown: {
          positive: 17,
          neutral: 1,
          negative: 0
        },
        criteriaAverages: {
          timing: 4.5,
          satisfaction: 5.0,
          cost: 4.0,
          communication: 5.0
        }
      };
      
      setProfileData(prev => ({ 
        ...prev, 
        reviews: mockReviews,
        reviewStats: mockReviewStats
      }));
      return Promise.resolve();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return Promise.reject(error);
    }
  };
  
  // Effect to load data on component mount
  useEffect(() => {
    // Set a loading state
    setIsLoading(true);
    
    // Use Promise.all to handle all fetch requests together
    Promise.all([
      fetchProfileData(),
      fetchUserSkills(),
      fetchUserSocials(),
      fetchPortfolioItems(),
      fetchUserReviews()
    ])
    .catch(error => {
      console.error('Error loading profile data:', error);
      // Show error toast only once
      toast({
        title: 'Error',
        description: 'Failed to load profile data. Please try again.',
        variant: 'destructive'
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [user?.id]);
  
  // Handle skill endorsement
  const handleEndorseSkill = async (skillId: string) => {
    try {
      const response = await fetch('/api/profile/skills/endorsements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId })
      });
      
      if (!response.ok) throw new Error('Failed to endorse skill');
      fetchUserSkills(); // Refresh skills after endorsement
      
      toast({
        title: 'Success',
        description: 'Skill endorsed successfully!',
      });
    } catch (error) {
      console.error('Error endorsing skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to endorse skill. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Handle adding a new skill
  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    
    try {
      const response = await fetch('/api/profile/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSkill,
          proficiencyLevel: skillProficiency,
          yearsOfExperience: skillYears
        })
      });
      
      if (!response.ok) throw new Error('Failed to add skill');
      fetchUserSkills(); // Refresh skills
      setNewSkill('');
      
      toast({
        title: 'Success',
        description: 'Skill added successfully!',
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to add skill. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Handle adding a new social link
  const handleAddSocial = async () => {
    if (!newSocialUrl.trim()) return;
    
    try {
      const response = await fetch('/api/profile/socials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: newSocialPlatform,
          url: newSocialUrl,
          username: newSocialUsername,
          isPublic: isPublicSocial
        })
      });
      
      if (!response.ok) throw new Error('Failed to add social link');
      fetchUserSocials(); // Refresh socials
      setNewSocialUrl('');
      setNewSocialUsername('');
      
      toast({
        title: 'Success',
        description: 'Social link added successfully!',
      });
    } catch (error) {
      console.error('Error adding social link:', error);
      toast({
        title: 'Error',
        description: 'Failed to add social link. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // State for profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    id: user?.id || 'user-1',
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    joinDate: 'June 2023',
    profileImageUrl: user?.profileImageUrl || '',
    bio: 'Experienced homeowner with a passion for home improvement and maintenance projects.',
    role: user?.role || 'SPECIALIST',
    skills: [],
    socials: [],
    portfolioItems: [],
    reviews: [],
    completedJobs: 24,
    reviewStats: {
      totalReviews: 18,
      averageRating: 4.8,
      positivePercentage: 94,
      reviewBreakdown: {
        positive: 17,
        neutral: 1,
        negative: 0
      },
      criteriaAverages: {
        timing: 4.9,
        satisfaction: 4.8,
        cost: 4.7,
        communication: 4.9
      }
    },
    wallet: {
      balance: 450.75,
      pendingPayments: 120.00,
      transactions: [
        { id: 1, type: 'deposit', amount: 200, date: '2023-06-10', status: 'completed' },
        { id: 2, type: 'payment', amount: -150, date: '2023-06-08', status: 'completed' },
        { id: 3, type: 'withdrawal', amount: -100, date: '2023-06-01', status: 'completed' }
      ]
    },
    badges: [
      { id: 1, name: 'Quick Responder', icon: 'star' },
      { id: 2, name: 'Top Rated', icon: 'award' },
      { id: 3, name: 'Verified', icon: 'shield' }
    ]
  });
  
  // Handle profile image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({
          ...prev,
          profileImageUrl: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle save profile
  const handleSaveProfile = () => {
    // In a real app, you would send this data to your backend
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
  };
  
  // Handle skill removal
  const handleRemoveSkill = (skillId: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== skillId)
    }));
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile sidebar */}
          <div className="md:w-1/3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  {/* Profile Image with Upload Option */}
                  <div className="relative group">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={profileData.profileImageUrl} />
                      <AvatarFallback className="text-lg bg-brand-100 text-brand-800">
                        {getInitials(`${profileData.firstName} ${profileData.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Camera icon overlay for image upload */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    
                    {/* Hidden file input */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  
                  {/* Name and Location - Editable */}
                  {isEditing ? (
                    <div className="w-full space-y-2 mb-4">
                      <div className="flex gap-2">
                        <Input 
                          name="firstName"
                          value={profileData.firstName} 
                          onChange={handleInputChange}
                          placeholder="First Name"
                          className="w-1/2"
                        />
                        <Input 
                          name="lastName"
                          value={profileData.lastName} 
                          onChange={handleInputChange}
                          placeholder="Last Name"
                          className="w-1/2"
                        />
                      </div>
                      <Input 
                        name="location"
                        value={profileData.location} 
                        onChange={handleInputChange}
                        placeholder="Location"
                      />
                    </div>
                  ) : (
                    <div className="mb-6">
                      <h1 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h1>
                      <p className="text-muted-foreground">{profileData.location}</p>
                      
                      {/* Expertise Badges */}
                      {profileData.skills && profileData.skills.length > 0 && (
                        <div className="mt-4">
                          <ExpertiseBadgeGroup 
                            skills={profileData.skills} 
                            size="sm" 
                            showLabels={false} 
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Edit/Save Profile Button */}
                  {isEditing ? (
                    <Button className="w-full mb-2" onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" /> Save Profile
                    </Button>
                  ) : (
                    <Button className="w-full mb-2" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  )}
                  
                  {/* Contact info - Editable */}
                  <div className="w-full mt-6 space-y-3 text-left">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {isEditing ? (
                        <Input 
                          name="email"
                          value={profileData.email} 
                          onChange={handleInputChange}
                          placeholder="Email"
                          className="h-8 text-sm"
                        />
                      ) : (
                        <span className="text-sm">{profileData.email}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {isEditing ? (
                        <Input 
                          name="phone"
                          value={profileData.phone} 
                          onChange={handleInputChange}
                          placeholder="Phone"
                          className="h-8 text-sm"
                        />
                      ) : (
                        <span className="text-sm">{profileData.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Member since {profileData.joinDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Wallet card (simplified) */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" /> Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold">${profileData.wallet?.balance.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-lg">${profileData.wallet?.pendingPayments.toFixed(2) || '0.00'}</p>
                  </div>
                  <Button className="w-full">Withdraw Funds</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:w-2/3">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              {/* Overview tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p>{profileData.bio}</p>
                    )}
                  </CardContent>
                </Card>
                
                {activeRole === 'SPECIALIST' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills & Expertise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Expertise badges with labels */}
                      <div className="mb-6">
                        <ExpertiseBadgeGroup 
                          skills={profileData.skills} 
                          size="md" 
                          showLabels={true} 
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill) => (
                          <div key={skill.id} className="flex items-center gap-1 bg-muted rounded-full px-3 py-1">
                            <span>{skill.skill.name}</span>
                            {isEditing && (
                              <X className="h-4 w-4 cursor-pointer" onClick={() => handleRemoveSkill(skill.id)} />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {isEditing && (
                        <div className="mt-4">
                          <Input 
                            placeholder="Add a skill..." 
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSkill();
                              }
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {activeRole === 'SPECIALIST' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.portfolioItems.map((item) => (
                          <div key={item.id} className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            {item.imageUrl ? (
                              <div className="aspect-video bg-muted relative">
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.title} 
                                  className="object-cover w-full h-full"
                                />
                                {item.category && (
                                  <div className="absolute top-2 right-2">
                                    <div className="bg-black/60 backdrop-blur-sm text-white rounded-full p-1.5">
                                      <JobCategoryIcon 
                                        category={item.category.name} 
                                        className="h-4 w-4" 
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="aspect-video bg-muted flex items-center justify-center relative">
                                {item.category && (
                                  <JobCategoryIcon 
                                    category={item.category.name} 
                                    className="h-12 w-12 text-gray-400" 
                                  />
                                )}
                                {item.category && (
                                  <div className="absolute top-2 right-2">
                                    <div className="bg-black/60 backdrop-blur-sm text-white rounded-full p-1.5">
                                      <JobCategoryIcon 
                                        category={item.category.name} 
                                        className="h-4 w-4" 
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{item.title}</h4>
                                {item.completionDate && (
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(item.completionDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                              {item.category && (
                                <div className="mt-3">
                                  <JobCategoryBadge 
                                    category={item.category.name}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {profileData.badges?.map((badge) => (
                        <div key={badge.id} className="flex flex-col items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-2">
                            {badge.icon === 'star' && <Star className="h-6 w-6 text-brand-500" />}
                            {badge.icon === 'award' && <Award className="h-6 w-6 text-brand-500" />}
                            {badge.icon === 'shield' && <Shield className="h-6 w-6 text-brand-500" />}
                          </div>
                          <span className="text-sm font-medium">{badge.name}</span>
                        </div>
                      )) || (
                        <p className="text-sm text-muted-foreground">No badges earned yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {activeRole === 'SPECIALIST' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{profileData.completedJobs}</p>
                          <p className="text-sm text-muted-foreground">Jobs Completed</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{profileData.reviewStats?.averageRating || 0}</p>
                          <p className="text-sm text-muted-foreground">Average Rating</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{profileData.reviews.length}</p>
                          <p className="text-sm text-muted-foreground">Reviews</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Jobs tab */}
              <TabsContent value="jobs">
                <Card>
                  <CardHeader>
                    <CardTitle>Job History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profileData.completedJobs > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                              <JobCategoryIcon category="PLUMBING" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-medium">Bathroom Sink Repair</h3>
                              <p className="text-sm text-muted-foreground">Fixed leaking faucet and replaced drain</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  Completed
                                </Badge>
                                <span className="text-xs text-muted-foreground">May 15, 2023</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$120.00</p>
                            <div className="flex items-center justify-end mt-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md">
                              <JobCategoryIcon category="GARDENING" className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h3 className="font-medium">Backyard Landscaping</h3>
                              <p className="text-sm text-muted-foreground">Planted new flowers and trimmed hedges</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  Completed
                                </Badge>
                                <span className="text-xs text-muted-foreground">April 22, 2023</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$85.00</p>
                            <div className="flex items-center justify-end mt-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <Star className="h-3 w-3 text-gray-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Your recent jobs will appear here.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Reviews tab */}
              <TabsContent value="reviews">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Reviews</CardTitle>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">{profileData.reviewStats?.averageRating || 0}</span>
                      <span className="text-muted-foreground">({profileData.reviews.length} reviews)</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {profileData.reviews && profileData.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {/* eBay-style feedback percentage */}
                        <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-lg border border-brand-200 dark:border-brand-800">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-lg">Positive Feedback</h3>
                              <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{profileData.reviewStats?.positivePercentage || 0}%</p>
                              <p className="text-sm text-muted-foreground">Based on {profileData.reviewStats?.totalReviews || 18} reviews</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mb-1">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-medium">{profileData.reviewStats?.reviewBreakdown.positive || 0}</span>
                                <span className="text-xs text-muted-foreground">Positive</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center mb-1">
                                  <span className="text-white text-xs font-bold">―</span>
                                </div>
                                <span className="font-medium">{profileData.reviewStats?.reviewBreakdown.neutral || 0}</span>
                                <span className="text-xs text-muted-foreground">Neutral</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mb-1">
                                  <X className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-medium">{profileData.reviewStats?.reviewBreakdown.negative || 0}</span>
                                <span className="text-xs text-muted-foreground">Negative</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Summary of ratings */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h3 className="font-medium mb-3">Rating Summary</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StarRating 
                              rating={profileData.reviewStats?.criteriaAverages.timing || 0} 
                              category="Timing"
                            />
                            <StarRating 
                              rating={profileData.reviewStats?.criteriaAverages.satisfaction || 0} 
                              category="Satisfaction"
                            />
                            <StarRating 
                              rating={profileData.reviewStats?.criteriaAverages.cost || 0} 
                              category="Cost"
                            />
                            <StarRating 
                              rating={profileData.reviewStats?.criteriaAverages.communication || 0} 
                              category="Communication"
                            />
                          </div>
                        </div>
                        
                        {/* Individual reviews */}
                        <div className="space-y-4">
                          {profileData.reviews.map((review) => (
                            <div key={review.id} className="border-b pb-4 last:border-b-0">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium">{review.reviewer.firstName} {review.reviewer.lastName}</h4>
                                  <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              
                              {/* Individual rating criteria */}
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                          key={`timing-${review.id}-${star}`} 
                                          className={`h-3 w-3 ${star <= (review.timingRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">Timing</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                          key={`satisfaction-${review.id}-${star}`} 
                                          className={`h-3 w-3 ${star <= (review.satisfactionRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">Satisfaction</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                          key={`cost-${review.id}-${star}`} 
                                          className={`h-3 w-3 ${star <= (review.costRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">Cost</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                          key={`communication-${review.id}-${star}`} 
                                          className={`h-3 w-3 ${star <= (review.communicationRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">Communication</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Review type indicator */}
                              <div className="mb-2">
                                {(review.overallRating || 0) > 3 && (
                                  <Badge className="bg-green-500 hover:bg-green-600">Positive</Badge>
                                )}
                                {(review.overallRating || 0) === 3 && (
                                  <Badge variant="secondary">Neutral</Badge>
                                )}
                                {(review.overallRating || 0) < 3 && (
                                  <Badge className="bg-red-500 hover:bg-red-600">Negative</Badge>
                                )}
                              </div>
                              
                              <p className="text-sm">{review.comment || 'No comment provided.'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No reviews yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Account settings will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
