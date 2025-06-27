"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';

interface EditableCertificationsProps {
  certifications: any[];
  onSave: (certifications: any[]) => void;
}

export function EditableCertifications({ certifications = [], onSave }: EditableCertificationsProps) {
  const handleSave = () => {
    onSave(certifications);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Certifications</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>
      
      {certifications.length > 0 ? (
        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="font-medium">{cert.name}</div>
                <div className="text-sm text-muted-foreground">{cert.issuer}</div>
                <div className="text-sm">{cert.issueDate} - {cert.expiryDate || 'No Expiry'}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No certifications added yet. Click "Add" to add your first certification.
        </div>
      )}
    </div>
  );
}
