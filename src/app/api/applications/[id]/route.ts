import { NextRequest } from 'next/server';
import { createApiHandler, validateBody } from '../../utils';
import { applicationService } from '@/services/api';
import { z } from 'zod';

// Schema for updating an application
const updateApplicationSchema = z.object({
  cover_letter: z.string().optional(),
  proposed_rate: z.number().optional(),
  proposed_timeline: z.string().optional(),
  additional_info: z.string().optional(),
  status: z.enum(['pending', 'under_review', 'accepted', 'rejected', 'withdrawn']).optional(),
  attachments: z.array(z.string()).optional(), // Array of attachment IDs
});

// GET /api/applications/[id] - Get a specific application by ID
export const GET = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  
  // Get the application with extended details
  return await applicationService.getApplicationById(id);
});

// PATCH /api/applications/[id] - Update a specific application
export const PATCH = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  const data = await validateBody(req, updateApplicationSchema);
  
  // Extract attachments if provided
  const { attachments, ...applicationData } = data;
  
  // Update the application
  const application = await applicationService.updateApplication(id, applicationData);
  
  // Update attachments if provided
  if (attachments && Array.isArray(attachments)) {
    await applicationService.setAttachments(id, attachments);
  }
  
  return application;
});

// DELETE /api/applications/[id] - Withdraw an application
export const DELETE = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  
  // Withdraw the application
  await applicationService.withdrawApplication(id);
  
  return { success: true };
});
