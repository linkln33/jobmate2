import { NextRequest } from 'next/server';
import { createApiHandler, validateBody, getQueryParam } from '../../utils';
import { skillService } from '@/services/api';
import { z } from 'zod';

// Schema for adding a skill to user profile
const addUserSkillSchema = z.object({
  skill_id: z.string().uuid(),
  proficiency_level: z.number().min(1).max(5).optional(),
  years_experience: z.number().optional(),
  is_featured: z.boolean().optional(),
});

// Schema for updating a user skill
const updateUserSkillSchema = z.object({
  proficiency_level: z.number().min(1).max(5).optional(),
  years_experience: z.number().optional(),
  is_featured: z.boolean().optional(),
});

// GET /api/skills/user - Get skills for the current user or a specific user
export const GET = createApiHandler(async (req) => {
  const userId = getQueryParam(req, 'user_id');
  
  if (userId) {
    // Get skills for a specific user
    return await skillService.getUserSkills(userId);
  } else {
    // Get skills for the current user
    return await skillService.getMySkills();
  }
});

// POST /api/skills/user - Add a skill to the current user's profile
export const POST = createApiHandler(async (req) => {
  const data = await validateBody(req, addUserSkillSchema);
  
  // Add skill to user profile
  return await skillService.addUserSkill(
    data.skill_id,
    data.proficiency_level,
    data.years_experience,
    data.is_featured
  );
});
