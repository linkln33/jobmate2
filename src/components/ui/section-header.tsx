import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ 
  title, 
  description 
}: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
