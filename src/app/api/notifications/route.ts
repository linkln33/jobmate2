import { NextRequest } from 'next/server';
import { createApiHandler, validateBody, getNumericQueryParam } from '../utils';
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

// Schema for registering a device
const registerDeviceSchema = z.object({
  deviceToken: z.string(),
  deviceType: z.string(),
});

// GET /api/notifications - Get notifications for the current user
export const GET = createApiHandler(async (req) => {
  const limit = getNumericQueryParam(req, 'limit', 20);
  const offset = getNumericQueryParam(req, 'offset', 0);
  
  // Get the current user's notifications
  return await notificationService.getMyNotifications(limit, offset);
});

// POST /api/notifications - Mark all notifications as read
export const POST = createApiHandler(async (req) => {
  // Mark all notifications as read
  return await notificationService.markAllAsRead();
});
