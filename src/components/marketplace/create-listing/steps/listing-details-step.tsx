"use client";

import { useState } from "react";
import { MarketplaceListing } from "@/types/marketplace";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface ListingDetailsStepProps {
  data: Partial<MarketplaceListing>;
  updateData: (data: Partial<MarketplaceListing>) => void;
  errors: Record<string, string>;
}

export function ListingDetailsStep({ data, updateData, errors }: ListingDetailsStepProps) {
  const [tagInput, setTagInput] = useState("");
  
  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !data.tags?.includes(tagInput.trim())) {
      const newTags = [...(data.tags || []), tagInput.trim()];
      updateData({ tags: newTags });
      setTagInput("");
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = (data.tags || []).filter(tag => tag !== tagToRemove);
    updateData({ tags: newTags });
  };
  
  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Listing Details</h2>
        <p className="text-muted-foreground mb-6">
          Provide detailed information about your {data.type || "listing"}
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder={`Enter a descriptive title for your ${data.type || "listing"}`}
            value={data.title || ""}
            onChange={(e) => updateData({ title: e.target.value })}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            A clear, concise title helps buyers find your listing (5-100 characters)
          </p>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder={`Describe your ${data.type || "listing"} in detail...`}
            value={data.description || ""}
            onChange={(e) => updateData({ description: e.target.value })}
            className={`min-h-[200px] ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Include details like condition, features, specifications, etc. (20-2000 characters)
          </p>
        </div>
        
        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className={errors.tags ? "border-red-500" : ""}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={handleAddTag}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tags}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Add relevant tags to help buyers find your listing (max 10 tags)
          </p>
          
          {/* Tags display */}
          <div className="flex flex-wrap gap-2 mt-3">
            {(data.tags || []).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="px-2 py-1 text-xs flex items-center gap-1"
              >
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="condition">Condition</Label>
          <select
            id="condition"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={data.condition || ""}
            onChange={(e) => updateData({ condition: e.target.value })}
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="salvage">For Parts or Not Working</option>
          </select>
        </div>
      </div>
    </div>
  );
}
