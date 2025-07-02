import { NextRequest } from 'next/server';
import { createApiHandler, getNumericQueryParam } from '../../../utils';
import { messageService, messagePrismaService } from '@/services/api';

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
  
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Get conversation details
  const conversation = await messagePrismaService.getConversationById(id, userId);
  
  // Get messages for the conversation
  const messages = await messagePrismaService.getMessages(id, limit);
  
  // Mark conversation as read
  await messagePrismaService.markConversationAsRead(id, userId);
  
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
  
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Delete or archive the conversation
  await messagePrismaService.deleteConversation(id, userId);
  
  return { success: true };
});
