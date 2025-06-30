import { NextRequest } from 'next/server';
import { createApiHandler, validateBody } from '../../utils';
import { listingService } from '@/services/api';
import { z } from 'zod';

// Schema for updating a listing
const updateListingSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(10).optional(),
  category_id: z.string().uuid().optional(),
  location: z.string().optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  budget_type: z.enum(['fixed', 'hourly', 'monthly']).optional(),
  required_skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  is_remote: z.boolean().optional(),
  duration_type: z.string().optional(),
  duration_value: z.number().optional(),
  visibility: z.enum(['public', 'private', 'invite']).optional(),
  status: z.enum(['draft', 'open', 'in_progress', 'completed', 'cancelled']).optional(),
});

// GET /api/listings/[id] - Get a specific listing by ID
export const GET = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  
  // Get the listing with extended details
  const listing = await listingService.getListingById(id);
  
  // Increment view count
  await listingService.incrementViewCount(id);
  
  return listing;
}, { requireAuth: false });

// PATCH /api/listings/[id] - Update a specific listing
export const PATCH = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  const data = await validateBody(req, updateListingSchema);
  
  // Extract tags if provided
  const { tags, ...listingData } = data;
  
  // Update the listing
  const listing = await listingService.updateListing(id, listingData);
  
  // Update tags if provided
  if (tags && Array.isArray(tags)) {
    await listingService.setListingTags(id, tags);
  }
  
  return listing;
});

// DELETE /api/listings/[id] - Delete a specific listing
export const DELETE = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  
  // Delete the listing
  await listingService.deleteListing(id);
  
  return { success: true };
});
