"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionHeader } from '@/components/ui/section-header';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface EditableContactInfoProps {
  email: string;
  phone: string;
  location: string;
  availability: string;
  onChange: (field: string, value: string) => void;
  isEditing: boolean;
  onEditClick: () => void;
}

export function EditableContactInfo({
  email,
  phone,
  location,
  availability,
  onChange,
  isEditing,
  onEditClick
}: EditableContactInfoProps) {
  const [localEmail, setLocalEmail] = useState(email);
  const [localPhone, setLocalPhone] = useState(phone);
  const [localLocation, setLocalLocation] = useState(location);
  const [localAvailability, setLocalAvailability] = useState(availability);

  // Update local state when props change
  React.useEffect(() => {
    setLocalEmail(email);
    setLocalPhone(phone);
    setLocalLocation(location);
    setLocalAvailability(availability);
  }, [email, phone, location, availability]);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'email':
        setLocalEmail(value);
        break;
      case 'phone':
        setLocalPhone(value);
        break;
      case 'location':
        setLocalLocation(value);
        break;
      case 'availability':
        setLocalAvailability(value);
        break;
    }
  };

  // Save all changes
  const handleSave = () => {
    onChange('email', localEmail);
    onChange('phone', localPhone);
    onChange('location', localLocation);
    onChange('availability', localAvailability);
  };

  return (
    <div>
      <SectionHeader 
        title="Contact Information" 
        isEditing={isEditing} 
        onEditClick={onEditClick} 
      />
      
      {isEditing ? (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={localEmail}
              onChange={(e) => handleChange('email', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={localPhone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={localLocation}
              onChange={(e) => handleChange('location', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="availability" className="text-right">
              Availability
            </Label>
            <Input
              id="availability"
              value={localAvailability}
              onChange={(e) => handleChange('availability', e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{email || 'No email provided'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{phone || 'No phone provided'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{location || 'No location provided'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{availability || 'No availability provided'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
