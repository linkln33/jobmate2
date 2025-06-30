import { NextRequest } from 'next/server';
import { createApiHandler, validateBody, getNumericQueryParam } from '../utils';
import { messageService } from '@/services/api';
import { z } from 'zod';

// Schema for creating a new conversation
const createConversationSchema = z.object({
  participant_ids: z.array(z.string().uuid()).min(1),
  listing_id: z.string().uuid().optional(),
  application_id: z.string().uuid().optional(),
  initial_message: z.string().optional(),
});

// Schema for sending a new message
const sendMessageSchema = z.object({
  conversation_id: z.string().uuid(),
  content: z.string().min(1),
});

// GET /api/messages - Get conversations for the current user
export const GET = createApiHandler(async (req) => {
  const limit = getNumericQueryParam(req, 'limit', 20);
  const offset = getNumericQueryParam(req, 'offset', 0);
  
  // Get the current user's conversations
  return await messageService.getMyConversations(limit, offset);
});

// POST /api/messages - Create a new conversation or send a message
export const POST = createApiHandler(async (req) => {
  // Try to parse as a new conversation first
  try {
    const conversationData = await validateBody(req, createConversationSchema);
    
    // Create a new conversation
    const conversation = await messageService.createConversation(
      conversationData.participant_ids,
      conversationData.listing_id,
      conversationData.application_id
    );
    
    // Send initial message if provided
    if (conversationData.initial_message) {
      await messageService.sendMessage(conversation.id, conversationData.initial_message);
    }
    
    return conversation;
  } catch (error) {
    // If it's not a new conversation, try to parse as a new message
    const messageData = await validateBody(req, sendMessageSchema);
    
    // Send a message to an existing conversation
    const message = await messageService.sendMessage(
      messageData.conversation_id,
      messageData.content
    );
    
    return message;
  }
});
