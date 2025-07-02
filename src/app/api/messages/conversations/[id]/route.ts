import { NextRequest } from 'next/server';
import { createApiHandler, getNumericQueryParam } from '../../../utils';
import { messageService } from '@/services/api';

/**
 * GET /api/messages/conversations/[id] - Get conversation details and messages
 * @param req - The request object
 * @param context - Context containing route parameters
 * @returns Conversation details with messages
 */
export const GET = createApiHandler(async (req, context) => {
  // Extract ID from the URL path
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];
  const limit = getNumericQueryParam(req, 'limit', 50);
  
  // Get conversation details
  const conversation = await messageService.getConversationById(id);
  
  // Get messages for the conversation
  const messages = await messageService.getMessages(id, limit);
  
  // Mark conversation as read
  await messageService.markConversationAsRead(id);
  
  return {
    conversation,
    messages
  };
});

/**
 * DELETE /api/messages/conversations/[id] - Delete conversation
 * @param req - The request object
 * @param context - Context containing route parameters
 * @returns Success status
 */
export const DELETE = createApiHandler(async (req, context) => {
  // Extract ID from the URL path
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];
  
  // For now, just return success
  // In a real implementation, you would delete or archive the conversation
  return { success: true };
});
