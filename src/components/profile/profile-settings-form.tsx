"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Bell, Lock, Eye, Mail, Phone, Globe } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ProfileSettingsFormProps {
  settings?: {
    notifications?: {
      email: boolean;
      push: boolean;
      sms: boolean;
      newMessages: boolean;
      jobUpdates: boolean;
      marketing: boolean;
    };
    privacy?: {
      profileVisibility: 'public' | 'private' | 'contacts';
      showEmail: boolean;
      showPhone: boolean;
      showLocation: boolean;
      allowRecommendations: boolean;
    };
    account?: {
      language: string;
      timezone: string;
      currency: string;
    };
  };
  onSave?: (settings: any) => void;
  className?: string;
}

export function ProfileSettingsForm({ settings, onSave, className }: ProfileSettingsFormProps) {
  const [formSettings, setFormSettings] = React.useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      newMessages: true,
      jobUpdates: true,
      marketing: false,
      ...settings?.notifications
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: true,
      allowRecommendations: true,
      ...settings?.privacy
    },
    account: {
      language: 'en',
      timezone: 'UTC',
      currency: 'USD',
      ...settings?.account
    }
  });

  const handleNotificationChange = (key: string) => {
    setFormSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };

  const handlePrivacyChange = (key: string) => {
    setFormSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key as keyof typeof prev.privacy]
      }
    }));
  };

  const handleSelectChange = (section: string, key: string, value: string) => {
    setFormSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formSettings);
    }
    toast({
      title: "Settings saved",
      description: "Your profile settings have been updated successfully.",
    });
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" /> Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Channels</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="flex-1">Email Notifications</Label>
                  <Switch 
                    id="email-notifications" 
                    checked={formSettings.notifications.email} 
                    onCheckedChange={() => handleNotificationChange('email')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="flex-1">Push Notifications</Label>
                  <Switch 
                    id="push-notifications" 
                    checked={formSettings.notifications.push} 
                    onCheckedChange={() => handleNotificationChange('push')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications" className="flex-1">SMS Notifications</Label>
                  <Switch 
                    id="sms-notifications" 
                    checked={formSettings.notifications.sms} 
                    onCheckedChange={() => handleNotificationChange('sms')} 
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Types</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-messages" className="flex-1">New Messages</Label>
                  <Switch 
                    id="new-messages" 
                    checked={formSettings.notifications.newMessages} 
                    onCheckedChange={() => handleNotificationChange('newMessages')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="job-updates" className="flex-1">Job Updates</Label>
                  <Switch 
                    id="job-updates" 
                    checked={formSettings.notifications.jobUpdates} 
                    onCheckedChange={() => handleNotificationChange('jobUpdates')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing" className="flex-1">Marketing & Promotions</Label>
                  <Switch 
                    id="marketing" 
                    checked={formSettings.notifications.marketing} 
                    onCheckedChange={() => handleNotificationChange('marketing')} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" /> Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <Select 
                  value={formSettings.privacy.profileVisibility} 
                  onValueChange={(value) => handleSelectChange('privacy', 'profileVisibility', value)}
                >
                  <SelectTrigger id="profile-visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="contacts">Contacts Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Information Visibility</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" /> Show Email
                    </Label>
                    <Switch 
                      id="show-email" 
                      checked={formSettings.privacy.showEmail} 
                      onCheckedChange={() => handlePrivacyChange('showEmail')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-phone" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" /> Show Phone Number
                    </Label>
                    <Switch 
                      id="show-phone" 
                      checked={formSettings.privacy.showPhone} 
                      onCheckedChange={() => handlePrivacyChange('showPhone')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-location" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" /> Show Location
                    </Label>
                    <Switch 
                      id="show-location" 
                      checked={formSettings.privacy.showLocation} 
                      onCheckedChange={() => handlePrivacyChange('showLocation')} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={formSettings.account.language} 
                  onValueChange={(value) => handleSelectChange('account', 'language', value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={formSettings.account.timezone} 
                  onValueChange={(value) => handleSelectChange('account', 'timezone', value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                    <SelectItem value="CST">Central Time (CST)</SelectItem>
                    <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                    <SelectItem value="GMT">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formSettings.account.currency} 
                  onValueChange={(value) => handleSelectChange('account', 'currency', value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                    <SelectItem value="AUD">AUD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
