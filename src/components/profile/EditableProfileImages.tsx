"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Edit, Star, Award, Shield, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface EditableProfileImagesProps {
  avatarUrl: string;
  coverImageUrl: string;
  name: string;
  isEditing: boolean;
  onAvatarChange: (file: File) => void;
  onCoverImageChange: (file: File) => void;
}

export function EditableProfileImages({
  avatarUrl,
  coverImageUrl,
  name,
  isEditing,
  onAvatarChange,
  onCoverImageChange
}: EditableProfileImagesProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [isHoveringCover, setIsHoveringCover] = useState(false);

  const handleAvatarClick = () => {
    if (isEditing) {
      avatarInputRef.current?.click();
    }
  };

  const handleCoverClick = () => {
    if (isEditing) {
      coverInputRef.current?.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCoverImageChange(file);
    }
  };

  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <div 
        className="relative w-full h-60 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHoveringCover(true)}
        onMouseLeave={() => setIsHoveringCover(false)}
      >
        {coverImageUrl ? (
          <Image 
            src={coverImageUrl} 
            alt="Cover" 
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">No cover image</p>
          </div>
        )}
        
        {/* Cover image edit overlay */}
        {isEditing && (
          <div 
            className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200 ${isHoveringCover ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleCoverClick}
          >
            <Button variant="secondary" size="sm" className="gap-2">
              <Camera className="h-4 w-4" />
              {coverImageUrl ? 'Change Cover' : 'Add Cover'}
            </Button>
          </div>
        )}
        
        <input 
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>
      
      {/* Avatar */}
      <div 
        className="absolute -bottom-16 left-8 rounded-full border-4 border-background"
        onMouseEnter={() => setIsHoveringAvatar(true)}
        onMouseLeave={() => setIsHoveringAvatar(false)}
      >
        <div className="relative">
          <Avatar className="h-32 w-32">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-3xl">{getInitials(name)}</AvatarFallback>
          </Avatar>
          
          {/* Avatar edit overlay */}
          {isEditing && (
            <div 
              className={`absolute inset-0 rounded-full bg-black/30 flex items-center justify-center transition-opacity duration-200 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}
              onClick={handleAvatarClick}
            >
              <Edit className="h-6 w-6 text-white" />
            </div>
          )}
          
          <input 
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>
      
      {/* eBay-style Reputation System */}
      <div className="absolute -bottom-16 right-8 flex flex-col items-end">
        <div className="flex items-center gap-2 mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Top Rated Seller (5-star rating)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            650+ Jobs
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Identity verified</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <BadgeCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Top Rated</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Top 5% of service providers</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Elite</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Elite service provider status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
