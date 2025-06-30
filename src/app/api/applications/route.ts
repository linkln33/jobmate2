import { NextRequest } from 'next/server';
import { createApiHandler, validateBody, getNumericQueryParam, getQueryParam } from '../utils';
import { applicationService } from '@/services/api';
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
  
  if (listingId) {
    // Get applications for a specific listing (for listing owners)
    return await applicationService.getApplicationsForListing(
      listingId,
      status,
      pageSize,
      pageNumber
    );
  } else {
    // Get the current user's applications
    return await applicationService.getMyApplications(
      status,
      pageSize,
      pageNumber
    );
  }
});

// POST /api/applications - Create a new application
export const POST = createApiHandler(async (req) => {
  const data = await validateBody(req, createApplicationSchema);
  
  // Extract attachments if provided
  const { attachments, ...applicationData } = data;
  
  // Create the application
  const application = await applicationService.createApplication(applicationData);
  
  // Link attachments if provided
  if (attachments && attachments.length > 0) {
    await applicationService.linkAttachments(application.id, attachments);
  }
  
  return application;
});
