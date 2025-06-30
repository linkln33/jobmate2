import { NextRequest } from 'next/server';
import { createApiHandler, getNumericQueryParam } from '../../../../utils';
import { messageService } from '@/services/api';

// GET /api/messages/conversations/[id] - Get messages for a specific conversation
export const GET = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  const limit = getNumericQueryParam(req, 'limit', 50);
  const offset = getNumericQueryParam(req, 'offset', 0);
  
  // Get messages for the conversation
  const messages = await messageService.getConversationMessages(id, limit, offset);
  
  // Mark messages as read
  await messageService.markConversationAsRead(id);
  
  return messages;
});

// DELETE /api/messages/conversations/[id] - Leave a conversation
export const DELETE = createApiHandler(async (req, { params }) => {
  const id = params?.id as string;
  
  // Leave the conversation
  await messageService.leaveConversation(id);
  
  return { success: true };
});
