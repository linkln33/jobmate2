import { NextRequest } from 'next/server';
import { createApiHandler, validateBody, getNumericQueryParam, getQueryParam } from '../utils';
import { listingPrismaService } from '@/services/api/listing.prisma.service';
import { z } from 'zod';

// Schema for creating a new listing
const createListingSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10),
  category_id: z.string().uuid(),
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
});

// Schema for updating a listing
const updateListingSchema = createListingSchema.partial();

// GET /api/listings - Get listings with optional search parameters
export const GET = createApiHandler(async (req) => {
  // Get search parameters from query string
  const searchTerm = getQueryParam(req, 'search') || undefined;
  const categoryId = getQueryParam(req, 'category') || undefined;
  const minBudget = getNumericQueryParam(req, 'minBudget', 0);
  const maxBudget = getNumericQueryParam(req, 'maxBudget', 0);
  const location = getQueryParam(req, 'location') || undefined;
  const maxDistance = getNumericQueryParam(req, 'maxDistance', 0);
  const status = getQueryParam(req, 'status')?.split(',') || ['open'];
  const tags = getQueryParam(req, 'tags')?.split(',') || undefined;
  const sortBy = getQueryParam(req, 'sortBy') || 'created_at';
  const sortDirection = getQueryParam(req, 'sortDirection') === 'asc' ? 'asc' : 'desc';
  const pageSize = getNumericQueryParam(req, 'pageSize', 10);
  const pageNumber = getNumericQueryParam(req, 'pageNumber', 1);
  
  // Get user location if provided
  const userLat = getNumericQueryParam(req, 'userLat', 0);
  const userLng = getNumericQueryParam(req, 'userLng', 0);
  const userLocation = userLat && userLng ? { lat: userLat, lng: userLng } : undefined;
  
  // Search listings with parameters
  return await listingPrismaService.searchListings({
    query: searchTerm,
    categoryId,
    minBudget,
    maxBudget,
    location,
    isRemote: undefined, // Add if needed
    status: status[0], // Prisma service expects a single status
    tags,
    sortBy,
    sortOrder: sortDirection
  }, pageNumber, pageSize);
}, { requireAuth: false });

// POST /api/listings - Create a new listing
export const POST = createApiHandler(async (req) => {
  const data = await validateBody(req, createListingSchema);
  
  // Create the listing with all data
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const listing = await listingPrismaService.createListing(userId, {
    title: data.title,
    description: data.description,
    categoryId: data.category_id,
    budgetMin: data.budget_min,
    budgetMax: data.budget_max,
    location: data.location,
    latitude: data.location_lat,
    longitude: data.location_lng,
    // Convert tags to attachments if needed
    attachments: [] // Add attachments handling if needed
  });
  
  return listing;
});

async function getListingByIdHelper(id: string) {
  return await listingPrismaService.getListingById(id);
}

async function updateListingHelper(id: string, data: any) {
  // Validate the request body
  const validatedData = updateListingSchema.parse(data);
  
  // Update the listing
  const updatedListing = await listingPrismaService.updateListing(id, validatedData);
  
  return updatedListing;
}

async function deleteListingHelper(id: string, userId: string) {
  return await listingPrismaService.deleteListing(id, userId);
}
