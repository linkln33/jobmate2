import { NextRequest } from 'next/server';
import { createApiHandler } from '../../utils';
import { notificationService } from '@/services/api';

// GET /api/notifications/[id] - Get a specific notification by ID (not typically needed)
export const GET = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  
  // Mark the notification as read when viewed
  return await notificationService.markAsRead(id);
});

// PATCH /api/notifications/[id] - Mark a notification as read
export const PATCH = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  
  // Mark the notification as read
  return await notificationService.markAsRead(id);
});

// DELETE /api/notifications/[id] - Delete a notification
export const DELETE = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  
  // Delete the notification
  return await notificationService.deleteNotification(id);
});
