/**
 * Type declarations for openai
 */

declare module 'openai' {
  export interface OpenAIOptions {
    apiKey: string;
    organization?: string;
    baseURL?: string;
    timeout?: number;
    maxRetries?: number;
  }

  export interface ChatCompletionMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

  export interface ChatCompletionOptions {
    model: string;
    messages: ChatCompletionMessage[];
    temperature?: number;
    top_p?: number;
    n?: number;
    stream?: boolean;
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    user?: string;
  }

  export interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      index: number;
      message: ChatCompletionMessage;
      finish_reason: string;
    }>;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }

  export default class OpenAI {
    constructor(options: OpenAIOptions);
    
    chat: {
      completions: {
        create: (options: ChatCompletionOptions) => Promise<ChatCompletionResponse>;
      };
    };
  }
}
