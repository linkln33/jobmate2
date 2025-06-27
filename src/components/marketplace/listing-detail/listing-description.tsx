"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ListingDescriptionProps {
  description: string;
  tags: string[];
}

export function ListingDescription({ description, tags }: ListingDescriptionProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Description</h2>
      
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {description.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
      
      {tags && tags.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
