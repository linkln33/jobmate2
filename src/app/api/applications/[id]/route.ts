import { NextRequest } from 'next/server';
import { createApiHandler, validateBody } from '../../utils';
import { applicationService, applicationPrismaService } from '@/services/api';
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
export const GET = createApiHandler(async (req, context) => {
  // We'll get the id from the URL path segment
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];
  
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Get the application with extended details
  return await applicationPrismaService.getApplicationById(id, userId);
});

// PATCH /api/applications/[id] - Update a specific application
export const PATCH = createApiHandler(async (req, context) => {
  // We'll get the id from the URL path segment
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];
  
  const data = await validateBody(req, updateApplicationSchema);
  
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Update the application using Prisma service
  const application = await applicationPrismaService.updateApplication(id, {
    coverLetter: data.cover_letter,
    proposedRate: data.proposed_rate,
    proposedTimeline: data.proposed_timeline,
    additionalInfo: data.additional_info,
    status: data.status,
    attachments: data.attachments?.map(path => ({ path }))
  }, userId);
  
  return application;
});

// DELETE /api/applications/[id] - Withdraw an application
export const DELETE = createApiHandler(async (req, context) => {
  // We'll get the id from the URL path segment
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];
  
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Withdraw the application using Prisma service
  await applicationPrismaService.updateApplication(id, { status: 'withdrawn' }, userId);
  
  return { success: true };
});
