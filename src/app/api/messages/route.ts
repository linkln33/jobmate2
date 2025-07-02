import { NextRequest } from 'next/server';
import { createApiHandler, validateBody, getNumericQueryParam } from '../utils';
import { messageService, messagePrismaService } from '@/services/api';
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
  
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Get the current user's conversations
  return await messagePrismaService.getMyConversations(userId, limit, offset);
});

// POST /api/messages - Create a new conversation or send a message
export const POST = createApiHandler(async (req) => {
  // Try to parse as a new conversation first
  try {
    const conversationData = await validateBody(req, createConversationSchema);
    
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Create a new conversation
    const conversation = await messagePrismaService.createConversation({
      creatorId: userId,
      participantIds: conversationData.participant_ids,
      jobId: conversationData.listing_id,
      applicationId: conversationData.application_id
    });
    
    // Send initial message if provided
    if (conversationData.initial_message) {
      await messagePrismaService.sendMessage({
        conversationId: conversation.id,
        senderId: userId,
        content: conversationData.initial_message
      });
    }
    
    return conversation;
  } catch (error) {
    // If it's not a new conversation, try to parse as a new message
    const messageData = await validateBody(req, sendMessageSchema);
    
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Send the message
    const message = await messagePrismaService.sendMessage({
      conversationId: messageData.conversation_id,
      senderId: userId,
      content: messageData.content
    });
    
    return message;
  }
});
