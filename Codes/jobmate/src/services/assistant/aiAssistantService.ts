/**
 * AI Assistant Service
 * Handles communication with OpenAI's API for generating AI responses
 */

import OpenAI from 'openai';
import { AssistantMode, AssistantContext } from '@/contexts/AssistantContext/types';

// Initialize OpenAI client
let openai: OpenAI | null = null;

// Initialize the OpenAI client if API key is available
const initializeOpenAI = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not found. AI Assistant will use fallback responses.');
    return null;
  }
  
  try {
    return new OpenAI({ apiKey });
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
    return null;
  }
};

// Types
export interface AIAssistantOptions {
  mode: AssistantMode;
  context?: AssistantContext;
  conversationHistory?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  maxTokens?: number;
  temperature?: number;
}

export interface AIAssistantResponse {
  content: string;
  isAIGenerated: boolean;
}

// Fallback responses when API is unavailable
const fallbackResponses = {
  MATCHING: [
    "Based on your profile, I recommend focusing on roles that match your top skills.",
    "You might want to adjust your matching preferences to see more relevant job opportunities.",
    "Your current match score could be improved by adding more details to your profile.",
    "I notice you haven't updated your skills recently. Would you like to review them?",
  ],
  PROJECT_SETUP: [
    "To set up your project effectively, make sure to define clear milestones and deliverables.",
    "Consider breaking down your project into smaller tasks for better management.",
    "Don't forget to specify your preferred communication methods in the project setup.",
    "Setting clear payment terms upfront will help avoid misunderstandings later.",
  ],
  PAYMENTS: [
    "Your payment history shows consistent transactions. Would you like to set up automatic billing?",
    "Consider updating your payment method for faster processing.",
    "You have an upcoming invoice due in 5 days. Would you like to schedule payment now?",
    "Based on your usage, you might benefit from our premium subscription plan.",
  ],
  PROFILE: [
    "Your profile is 80% complete. Adding a professional photo could increase visibility.",
    "Consider updating your portfolio with recent projects to attract more clients.",
    "Your skills section is impressive, but adding certifications could strengthen it further.",
    "I notice you haven't received many reviews. Consider requesting feedback from past clients.",
  ],
  MARKETPLACE: [
    "Based on your browsing history, you might be interested in these trending services.",
    "These top-rated freelancers match your recent search criteria.",
    "Consider filtering by rating to find the highest quality services in this category.",
    "Would you like to save this search for future reference?",
  ],
  GENERAL: [
    "How can I help you with JobMate today?",
    "I'm here to assist with any questions about the platform.",
    "Is there anything specific you'd like to know about using JobMate?",
    "I can help with matching, project setup, payments, and more. What do you need?",
  ],
};

/**
 * Generate a random fallback response based on mode
 */
const getFallbackResponse = (mode: AssistantMode): AIAssistantResponse => {
  const responses = fallbackResponses[mode] || fallbackResponses.GENERAL;
  const randomIndex = Math.floor(Math.random() * responses.length);
  
  return {
    content: responses[randomIndex],
    isAIGenerated: false,
  };
};

/**
 * Generate system prompt based on mode and context
 */
const generateSystemPrompt = (mode: AssistantMode, context?: AssistantContext): string => {
  const basePrompt = `You are JobMate's AI Assistant, currently in ${mode.replace('_', ' ')} mode. 
Your goal is to provide helpful, concise, and relevant information to the user.`;
  
  const modeSpecificPrompts = {
    MATCHING: `Focus on helping the user find the best job matches based on their skills, preferences, and career goals. 
Provide suggestions to improve their matching score and visibility to potential employers.`,
    
    PROJECT_SETUP: `Help the user set up their project effectively with clear milestones, deliverables, and communication plans. 
Offer guidance on best practices for project management and client relationships.`,
    
    PAYMENTS: `Assist the user with payment-related queries, including invoicing, payment methods, subscription plans, and billing history. 
Provide clear explanations of payment processes and options.`,
    
    PROFILE: `Guide the user in optimizing their profile for maximum visibility and appeal to potential clients or employers. 
Suggest improvements to their bio, skills, portfolio, and other profile elements.`,
    
    MARKETPLACE: `Help the user navigate the marketplace effectively, finding relevant services or freelancers based on their needs. 
Provide tips for evaluating options and making informed decisions.`,
    
    GENERAL: `Provide general assistance with any aspect of the JobMate platform. 
Be ready to answer questions about features, processes, and best practices.`,
  };
  
  let contextPrompt = '';
  if (context) {
    contextPrompt = `\nCurrent context: ${JSON.stringify(context)}`;
  }
  
  return `${basePrompt}\n\n${modeSpecificPrompts[mode]}${contextPrompt}\n\nKeep your responses concise, helpful, and professional.`;
};

/**
 * Generate AI response using OpenAI API
 */
export const generateAIResponse = async (
  query: string,
  options: AIAssistantOptions
): Promise<AIAssistantResponse> => {
  // Initialize OpenAI if not already done
  if (!openai) {
    openai = initializeOpenAI();
  }
  
  // If OpenAI client couldn't be initialized, use fallback
  if (!openai) {
    return getFallbackResponse(options.mode);
  }
  
  try {
    // Prepare conversation history
    const messages = [
      { 
        role: 'system', 
        content: generateSystemPrompt(options.mode, options.context)
      },
      ...(options.conversationHistory || []),
      { role: 'user', content: query }
    ];
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
    });
    
    // Extract and return the response content
    const content = response.choices[0]?.message?.content || '';
    
    return {
      content,
      isAIGenerated: true,
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return getFallbackResponse(options.mode);
  }
};

/**
 * Generate suggestions based on user context and mode
 */
export const generateContextualSuggestions = async (
  mode: AssistantMode,
  context: AssistantContext,
  userProfile?: any
): Promise<string[]> => {
  // Initialize OpenAI if not already done
  if (!openai) {
    openai = initializeOpenAI();
  }
  
  // If OpenAI client couldn't be initialized, use fallback
  if (!openai) {
    return fallbackResponses[mode].slice(0, 3);
  }
  
  try {
    const prompt = `
Based on the following information, generate 3 helpful suggestions for the user:
- Current mode: ${mode}
- Context: ${JSON.stringify(context)}
${userProfile ? `- User profile: ${JSON.stringify(userProfile)}` : ''}

Return exactly 3 suggestions as a JSON array of strings. Each suggestion should be concise (max 100 characters) and directly actionable.
`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates contextual suggestions.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    const content = response.choices[0]?.message?.content || '';
    
    try {
      const parsedContent = JSON.parse(content);
      if (Array.isArray(parsedContent.suggestions)) {
        return parsedContent.suggestions.slice(0, 3);
      }
    } catch (e) {
      console.error('Error parsing AI suggestions:', e);
    }
    
    return fallbackResponses[mode].slice(0, 3);
  } catch (error) {
    console.error('Error generating contextual suggestions:', error);
    return fallbackResponses[mode].slice(0, 3);
  }
};

export default {
  generateAIResponse,
  generateContextualSuggestions,
};
