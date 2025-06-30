import { NextRequest } from 'next/server';
import { createApiHandler, validateBody, getQueryParam } from '../utils';
import { skillService } from '@/services/api';
import { z } from 'zod';

// Schema for creating a new skill (admin only)
const createSkillSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  category: z.string().optional(),
  popularity: z.number().optional(),
});

// GET /api/skills - Get skills with optional filtering
export const GET = createApiHandler(async (req) => {
  const searchTerm = getQueryParam(req, 'search');
  const category = getQueryParam(req, 'category');
  
  if (searchTerm) {
    // Search for skills
    return await skillService.searchSkills(searchTerm);
  } else if (category) {
    // Get skills by category
    return await skillService.getAllSkills(category);
  } else {
    // Get all skills
    return await skillService.getAllSkills();
  }
}, { requireAuth: false });

// POST /api/skills - Create a new skill (admin only)
export const POST = createApiHandler(async (req) => {
  const data = await validateBody(req, createSkillSchema);
  
  // Create a new skill (admin only)
  return await skillService.createSkill(data);
}, { requireAdmin: true });
