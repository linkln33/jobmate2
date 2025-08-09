import { NextRequest } from 'next/server';
import { createApiHandler, validateBody } from '../../utils';
import { notificationService } from '@/services/api';
import { z } from 'zod';

// Schema for registering a device
const registerDeviceSchema = z.object({
  deviceToken: z.string(),
  deviceType: z.string(),
});

// POST /api/notifications/devices - Register a device for push notifications
export const POST = createApiHandler(async (req) => {
  const data = await validateBody<z.infer<typeof registerDeviceSchema>>(req, registerDeviceSchema);
  
  // Register the device
  return await notificationService.registerDevice(
    data.deviceToken,
    data.deviceType
  );
});

// DELETE /api/notifications/devices - Unregister a device
export const DELETE = createApiHandler(async (req) => {
  const deleteSchema = z.object({ deviceToken: z.string() });
  const data = await validateBody<z.infer<typeof deleteSchema>>(req, deleteSchema);
  
  // Unregister the device
  return await notificationService.unregisterDevice(data.deviceToken);
});
