"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

interface EditableAboutProps {
  bio: string;
  onChange: (field: string, value: string) => void;
  isEditing: boolean;
  onEditClick: () => void;
}

export function EditableAbout({ bio, onChange, isEditing, onEditClick }: EditableAboutProps) {
  const [localBio, setLocalBio] = useState(bio);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalBio(e.target.value);
  };

  const handleSave = () => {
    onChange('bio', localBio);
  };

  const handleCancel = () => {
    setLocalBio(bio);
    onEditClick();
  };

  React.useEffect(() => {
    setLocalBio(bio);
  }, [bio]);

  return (
    <div>
      <SectionHeader 
        title="About" 
        isEditing={isEditing} 
        onEditClick={onEditClick} 
      />
      
      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            placeholder="Tell us about yourself..."
            className="min-h-[150px]"
            value={localBio}
            onChange={handleChange}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleSave();
              onEditClick();
            }}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="prose dark:prose-invert max-w-none">
          {bio ? (
            <p className="whitespace-pre-wrap">{bio}</p>
          ) : (
            <p className="text-muted-foreground italic">No bio provided. Click edit to add information about yourself.</p>
          )}
        </div>
      )}
    </div>
  );
}
