import { NextRequest } from 'next/server';
import { createApiHandler, validateBody } from '../../utils';
import { notificationService } from '@/services/api';
import { z } from 'zod';

// Schema for updating notification preferences
const updatePreferencesSchema = z.object({
  type: z.string(),
  channels: z.object({
    email: z.boolean(),
    push: z.boolean(),
    in_app: z.boolean(),
  }),
});

// GET /api/notifications/preferences - Get notification preferences for the current user
export const GET = createApiHandler(async (req) => {
  // Get the current user's notification preferences
  return await notificationService.getMyNotificationPreferences();
});

// PATCH /api/notifications/preferences - Update notification preferences
export const PATCH = createApiHandler(async (req) => {
  const data = await validateBody<z.infer<typeof updatePreferencesSchema>>(req, updatePreferencesSchema);
  
  // Update notification preferences
  return await notificationService.updateNotificationPreference(
    data.type,
    data.channels
  );
});
