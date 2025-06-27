"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';

interface EditableEducationProps {
  education: any[];
  onSave: (education: any[]) => void;
}

export function EditableEducation({ education = [], onSave }: EditableEducationProps) {
  const handleSave = () => {
    onSave(education);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Education</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>
      
      {education.length > 0 ? (
        <div className="space-y-3">
          {education.map((edu, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="font-medium">{edu.degree}</div>
                <div className="text-sm text-muted-foreground">{edu.institution}</div>
                <div className="text-sm">{edu.startDate} - {edu.endDate || 'Present'}</div>
                {edu.description && <div className="text-sm mt-2">{edu.description}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No education history added yet. Click "Add" to add your education.
        </div>
      )}
    </div>
  );
}
