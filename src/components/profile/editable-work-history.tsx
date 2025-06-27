"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';

interface EditableWorkHistoryProps {
  workHistory: any[];
  onSave: (workHistory: any[]) => void;
}

export function EditableWorkHistory({ workHistory = [], onSave }: EditableWorkHistoryProps) {
  const handleSave = () => {
    onSave(workHistory);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Work History</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>
      
      {workHistory.length > 0 ? (
        <div className="space-y-3">
          {workHistory.map((job, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="font-medium">{job.title}</div>
                <div className="text-sm text-muted-foreground">{job.company}</div>
                <div className="text-sm">{job.startDate} - {job.endDate || 'Present'}</div>
                {job.description && <div className="text-sm mt-2">{job.description}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No work history added yet. Click "Add" to add your work experience.
        </div>
      )}
    </div>
  );
}
