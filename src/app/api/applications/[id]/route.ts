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
export const GET = createApiHandler(async (req, context) => {
  // We'll get the id from the URL path segment
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];
  
  // Get the application with extended details
  return await applicationService.getApplicationById(id);
});

// PATCH /api/applications/[id] - Update a specific application
export const PATCH = createApiHandler(async (req, context) => {
  // We'll get the id from the URL path segment
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];
  
  const data = await validateBody(req, updateApplicationSchema);
  
  // Update the application - ensure data is properly typed
  const typedData = data as Parameters<typeof applicationService.updateApplication>[1];
  const application = await applicationService.updateApplication(id, typedData);
  
  return application;
});

// DELETE /api/applications/[id] - Withdraw an application
export const DELETE = createApiHandler(async (req, context) => {
  // We'll get the id from the URL path segment
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];
  
  // Withdraw the application - using updateApplication with status=withdrawn
  await applicationService.updateApplication(id, { status: 'withdrawn' } as Parameters<typeof applicationService.updateApplication>[1]);
  
  return { success: true };
});
