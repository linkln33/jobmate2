import { NextRequest } from 'next/server';
import { createApiHandler, validateBody } from '../../../utils';
import { skillService } from '@/services/api';
import { z } from 'zod';

// Schema for updating a user skill
const updateUserSkillSchema = z.object({
  proficiency_level: z.number().min(1).max(5).optional(),
  years_experience: z.number().optional(),
  is_featured: z.boolean().optional(),
});

// PATCH /api/skills/user/[id] - Update a specific user skill
export const PATCH = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  const data = await validateBody<z.infer<typeof updateUserSkillSchema>>(req, updateUserSkillSchema);
  
  // Update the user skill
  return await skillService.updateUserSkill(id, {
    proficiencyLevel: data.proficiency_level,
    yearsExperience: data.years_experience,
    isFeatured: data.is_featured
  });
});

// DELETE /api/skills/user/[id] - Remove a skill from the user's profile
export const DELETE = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  
  // Remove the skill from the user's profile
  return await skillService.removeUserSkill(id);
});
