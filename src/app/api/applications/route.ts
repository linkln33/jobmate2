import { NextRequest } from 'next/server';
import { createApiHandler, validateBody, getNumericQueryParam, getQueryParam } from '../utils';
import { applicationService, applicationPrismaService } from '@/services/api';
import { z } from 'zod';

// Schema for creating a new application
const createApplicationSchema = z.object({
  listing_id: z.string().uuid(),
  cover_letter: z.string().optional(),
  proposed_rate: z.number().optional(),
  proposed_timeline: z.string().optional(),
  additional_info: z.string().optional(),
  attachments: z.array(z.string()).optional(), // Array of attachment IDs
});

// GET /api/applications - Get applications for the current user
export const GET = createApiHandler(async (req) => {
  // Check if we're filtering by listing
  const listingId = getQueryParam(req, 'listing_id');
  const status = getQueryParam(req, 'status')?.split(',');
  const pageSize = getNumericQueryParam(req, 'pageSize', 10);
  const pageNumber = getNumericQueryParam(req, 'pageNumber', 1);
  
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  if (listingId) {
    // Get applications for a specific listing (for listing owners)
    return await applicationPrismaService.getApplicationsForListing(listingId, userId);
  } else {
    // Get the current user's applications
    return await applicationPrismaService.getMyApplications(userId);
  }
});

// POST /api/applications - Create a new application
export const POST = createApiHandler(async (req) => {
  const data = await validateBody(req, createApplicationSchema);
  
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Create the application with the validated data
  const application = await applicationPrismaService.createApplication({
    jobId: data.listing_id,
    specialistId: userId,
    coverLetter: data.cover_letter,
    proposedRate: data.proposed_rate,
    proposedTimeline: data.proposed_timeline,
    additionalInfo: data.additional_info,
    attachments: data.attachments?.map(path => ({ path }))
  });
  
  return application;
});
