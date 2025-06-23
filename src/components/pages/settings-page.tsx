"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, Moon, Sun, Globe, Shield, User, Key, Smartphone, Palette, MessageSquare } from "lucide-react";
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';

export function SettingsPage() {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [assistantEnabled, setAssistantEnabled] = useState(true);
  const [assistantVoice, setAssistantVoice] = useState(true);
  const [assistantSuggestions, setAssistantSuggestions] = useState(true);

  return (
    <UnifiedDashboardLayout title="Settings" showMap={false}>
      <div className="container mx-auto py-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-8">
          {/* General Settings */}
          <div id="general" className="pt-2">
            <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
            <div className="grid gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Appearance</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Moon className="h-5 w-5" />
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                      </div>
                      <Switch 
                        id="dark-mode" 
                        checked={darkMode} 
                        onCheckedChange={setDarkMode} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Palette className="h-5 w-5" />
                        <Label htmlFor="theme">Theme</Label>
                      </div>
                      <Select defaultValue="default">
                        <SelectTrigger id="theme" className="w-full">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="vibrant">Vibrant</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Language & Region</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <Label htmlFor="language">Language</Label>
                      </div>
                      <Select 
                        value={language} 
                        onValueChange={setLanguage}
                      >
                        <SelectTrigger id="language" className="w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <Label htmlFor="timezone">Time Zone</Label>
                      </div>
                      <Select defaultValue="utc">
                        <SelectTrigger id="timezone" className="w-full">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                          <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                          <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                          <SelectItem value="cet">CET (Central European Time)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </div>
          
          {/* Account Settings */}
          <div id="account" className="pt-2">
            <div className="grid gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Profile Information</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user?.name || ""} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ""} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" defaultValue={user?.phone || ""} />
                    </div>
                    
                    <Button>Save Changes</Button>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Password</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    
                    <Button>Update Password</Button>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Account Management</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{user?.role || "User"}</Badge>
                        {user?.verificationLevel > 0 && (
                          <Badge className="bg-blue-500">Verified Level {user?.verificationLevel}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Account Actions</Label>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline">Download My Data</Button>
                        <Button variant="destructive">Deactivate Account</Button>
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div id="notifications" className="pt-2">
            <div className="grid gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Notification Preferences</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <Label htmlFor="notifications">All Notifications</Label>
                      </div>
                      <Switch 
                        id="notifications" 
                        checked={notificationsEnabled} 
                        onCheckedChange={setNotificationsEnabled} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch 
                        id="email-notifications" 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications}
                        disabled={!notificationsEnabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <Switch 
                        id="push-notifications" 
                        checked={pushNotifications} 
                        onCheckedChange={setPushNotifications}
                        disabled={!notificationsEnabled}
                      />
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Notification Types</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="job-notifications">Job Updates</Label>
                      <Switch id="job-notifications" defaultChecked disabled={!notificationsEnabled} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message-notifications">New Messages</Label>
                      <Switch id="message-notifications" defaultChecked disabled={!notificationsEnabled} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="payment-notifications">Payment Updates</Label>
                      <Switch id="payment-notifications" defaultChecked disabled={!notificationsEnabled} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-notifications">Marketing & Promotions</Label>
                      <Switch id="marketing-notifications" disabled={!notificationsEnabled} />
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </div>
          
          {/* Privacy & Security Settings */}
          <div id="privacy" className="pt-2">
            <div className="grid gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Privacy Settings</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="profile-visibility">Profile Visibility</Label>
                      <Select defaultValue="public">
                        <SelectTrigger id="profile-visibility" className="w-[180px]">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="contacts">Contacts Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="location-sharing">Location Sharing</Label>
                      <Switch id="location-sharing" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="activity-status">Show Activity Status</Label>
                      <Switch id="activity-status" defaultChecked />
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Security</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Login Sessions</Label>
                      <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">MacOS • Chrome • San Francisco, CA</p>
                          </div>
                          <Badge>Active Now</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage All Sessions</Button>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Data & Privacy</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-collection">Allow Data Collection</Label>
                      <Switch id="data-collection" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="personalized-ads">Personalized Ads</Label>
                      <Switch id="personalized-ads" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Privacy Documents</Label>
                      <div className="flex flex-col space-y-2">
                        <Button variant="link" className="justify-start p-0">Privacy Policy</Button>
                        <Button variant="link" className="justify-start p-0">Terms of Service</Button>
                        <Button variant="link" className="justify-start p-0">Cookie Policy</Button>
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </div>
          
          {/* Assistant Settings */}
          <div id="assistant" className="pt-2">
            <div className="grid gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Assistant Preferences</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5" />
                        <Label htmlFor="assistant-enabled">Enable Assistant</Label>
                      </div>
                      <Switch 
                        id="assistant-enabled" 
                        checked={assistantEnabled} 
                        onCheckedChange={setAssistantEnabled} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="assistant-voice">Voice Interaction</Label>
                      <Switch 
                        id="assistant-voice" 
                        checked={assistantVoice} 
                        onCheckedChange={setAssistantVoice}
                        disabled={!assistantEnabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="assistant-suggestions">Proactive Suggestions</Label>
                      <Switch 
                        id="assistant-suggestions" 
                        checked={assistantSuggestions} 
                        onCheckedChange={setAssistantSuggestions}
                        disabled={!assistantEnabled}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="assistant-tone">Assistant Tone</Label>
                      </div>
                      <Select defaultValue="professional" disabled={!assistantEnabled}>
                        <SelectTrigger id="assistant-tone" className="w-full">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Assistant Data</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Conversation History</Label>
                      <p className="text-sm text-muted-foreground">
                        Your assistant learns from your interactions to provide better help.
                      </p>
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm">View History</Button>
                        <Button variant="outline" size="sm">Clear History</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="assistant-learning">Allow Learning from Interactions</Label>
                        <p className="text-sm text-muted-foreground">
                          Helps improve assistant responses over time
                        </p>
                      </div>
                      <Switch id="assistant-learning" defaultChecked disabled={!assistantEnabled} />
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
