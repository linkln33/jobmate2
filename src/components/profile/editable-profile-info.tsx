"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

interface EditableProfileInfoProps {
  profileInfo: any;
  onSave: (profileInfo: any) => void;
}

export function EditableProfileInfo({ profileInfo = {}, onSave }: EditableProfileInfoProps) {
  const [info, setInfo] = React.useState(profileInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(info);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Profile Information</h3>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={info.name || ''} 
                onChange={handleChange} 
                placeholder="Your full name" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={info.title || ''} 
                onChange={handleChange} 
                placeholder="e.g. Senior Developer" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              value={info.bio || ''} 
              onChange={handleChange} 
              placeholder="Tell us about yourself" 
              rows={4} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={info.location || ''} 
                onChange={handleChange} 
                placeholder="City, Country" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={info.phone || ''} 
                onChange={handleChange} 
                placeholder="Your phone number" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
