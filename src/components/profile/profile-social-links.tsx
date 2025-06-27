"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Globe, Twitter, Linkedin, Github, Instagram, Facebook, Youtube } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

interface ProfileSocialLinksProps {
  socialLinks?: SocialLink[];
  onSave?: (links: SocialLink[]) => void;
  className?: string;
}

export function ProfileSocialLinks({ socialLinks = [], onSave, className }: ProfileSocialLinksProps) {
  const [links, setLinks] = React.useState<SocialLink[]>(socialLinks.length > 0 ? socialLinks : [
    { platform: 'website', url: '', icon: <Globe className="h-4 w-4" /> },
    { platform: 'twitter', url: '', icon: <Twitter className="h-4 w-4" /> },
    { platform: 'linkedin', url: '', icon: <Linkedin className="h-4 w-4" /> },
    { platform: 'github', url: '', icon: <Github className="h-4 w-4" /> },
    { platform: 'instagram', url: '', icon: <Instagram className="h-4 w-4" /> },
    { platform: 'facebook', url: '', icon: <Facebook className="h-4 w-4" /> },
    { platform: 'youtube', url: '', icon: <Youtube className="h-4 w-4" /> }
  ]);

  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index].url = value;
    setLinks(updatedLinks);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(links);
    }
  };

  const getPlatformLabel = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Social Links</CardTitle>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {links.map((link, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`social-${link.platform}`} className="flex items-center">
              {link.icon}
              <span className="ml-2">{getPlatformLabel(link.platform)}</span>
            </Label>
            <div className="flex">
              <Input
                id={`social-${link.platform}`}
                value={link.url}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                placeholder={`Your ${link.platform} URL`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
