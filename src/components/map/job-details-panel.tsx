"use client";

import React from 'react';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Calendar, Star } from 'lucide-react';

interface JobDetailsPanelProps {
  job: Job | null;
  onClose?: () => void;
}

export function JobDetailsPanel({ job, onClose }: JobDetailsPanelProps) {
  if (!job) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-500">No job selected</p>
        </div>
      </div>
    );
  }

  // Handle customer display based on the type
  const customerDisplay = typeof job.customer === 'string' ? (
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
        {job.customer.substring(0, 2).toUpperCase()}
      </div>
      <div>
        <p className="font-medium">Customer</p>
        <p className="text-sm text-gray-500">ID: {job.customer}</p>
      </div>
    </div>
  ) : (
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
        {job.customer.firstName.charAt(0)}{job.customer.lastName.charAt(0)}
      </div>
      <div>
        <p className="font-medium">{job.customer.firstName} {job.customer.lastName}</p>
        <p className="text-sm text-gray-500">Customer ID: {job.customer.id}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-semibold">{job.title}</h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Job Details</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{job.address || `${job.city || ''}, ${job.zipCode || ''}`}</span>
            </div>
            {(job.budgetMin !== undefined && job.budgetMax !== undefined) ? (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                <span>${job.budgetMin} - ${job.budgetMax}</span>
              </div>
            ) : job.price ? (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                <span>{job.price}</span>
              </div>
            ) : null}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>{job.createdAt ? `Posted on ${job.createdAt}` : job.time || job.scheduledTime || 'Flexible timing'}</span>
            </div>
            {job.urgency && (
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-gray-500" />
                <span>Urgency: {job.urgency}</span>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Customer</h3>
          {customerDisplay}
        </div>
      </div>
      
      {job.description && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300">{job.description}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline">Contact Customer</Button>
        <Button>Apply for Job</Button>
      </div>
    </div>
  );
}
