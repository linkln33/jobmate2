"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { JobCategoryBadge, SkillBadge } from '@/components/ui/job-category-icon';
import { SectionHeader } from './section-header';

interface EditableExpertiseProps {
  skills: string[];
  categories: string[];
  expertise: string[];
  isEditing: boolean;
  onEditClick: () => void;
  onChange: (field: string, value: any) => void;
}

export function EditableExpertise({
  skills,
  categories,
  expertise,
  isEditing,
  onEditClick,
  onChange
}: EditableExpertiseProps) {
  const [newSkill, setNewSkill] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onChange('skills', [...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    onChange('skills', skills.filter(s => s !== skill));
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onChange('categories', [...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };
  
  const handleRemoveCategory = (category: string) => {
    onChange('categories', categories.filter(c => c !== category));
  };
  
  const handleAddExpertise = () => {
    if (newExpertise.trim() && !expertise.includes(newExpertise.trim())) {
      onChange('expertise', [...expertise, newExpertise.trim()]);
      setNewExpertise('');
    }
  };
  
  const handleRemoveExpertise = (exp: string) => {
    onChange('expertise', expertise.filter(e => e !== exp));
  };
  
  return (
    <div className="space-y-4">
      <SectionHeader 
        title="Skills & Expertise" 
        isEditing={isEditing} 
        onEditClick={onEditClick} 
      />
      
      <div>
        <h4 className="text-sm font-medium mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((skill, index) => (
            <SkillBadge 
              key={index} 
              skill={skill}
              onRemove={isEditing ? () => handleRemoveSkill(skill) : undefined}
            />
          ))}
        </div>
        
        {isEditing && (
          <div className="flex gap-2 mt-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button size="sm" variant="outline" onClick={handleAddSkill}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map((category, index) => (
            <div key={index} className="relative">
              <JobCategoryBadge category={category} />
              {isEditing && (
                <button 
                  onClick={() => handleRemoveCategory(category)}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted"
                >
                  <X className="h-2 w-2" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex gap-2 mt-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add a category"
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />
            <Button size="sm" variant="outline" onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Areas of Expertise</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {expertise.map((exp, index) => (
            <SkillBadge
              key={index}
              skill={exp}
              onRemove={isEditing ? () => handleRemoveExpertise(exp) : undefined}
              className="border border-gray-200 dark:border-gray-700"
            />
          ))}
        </div>
        
        {isEditing && (
          <div className="flex gap-2 mt-2">
            <Input
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              placeholder="Add an expertise area"
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddExpertise();
                }
              }}
            />
            <Button size="sm" variant="outline" onClick={handleAddExpertise}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
