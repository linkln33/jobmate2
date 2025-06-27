"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Save, X } from 'lucide-react';

interface EditableSkillsProps {
  skills: any[];
  onSave: (skills: any[]) => void;
}

export function EditableSkills({ skills = [], onSave }: EditableSkillsProps) {
  const [skillsList, setSkillsList] = React.useState(skills);
  const [newSkill, setNewSkill] = React.useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkillsList(prev => [...prev, { name: newSkill.trim(), level: 'Intermediate' }]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkillsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(skillsList);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Skills</h3>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input 
              value={newSkill} 
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button variant="outline" onClick={handleAddSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                {skill.name}
                <button 
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            
            {skillsList.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No skills added yet. Add skills to showcase your expertise.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
