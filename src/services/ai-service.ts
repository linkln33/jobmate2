import axios from 'axios';

// Types for AI service responses
interface AISuggestion {
  text: string;
  confidence: number;
}

interface AIAnalysisResponse {
  suggestions: AISuggestion[];
  analysis: Record<string, any>;
}

// Context types for different scenarios
export type JobPostContext = {
  title?: string;
  description?: string;
  category?: string;
  images?: string[]; // Base64 or URLs
  location?: string;
};

export type SpecialistContext = {
  services: string[];
  previousJobs?: number;
  rating?: number;
  location?: string;
};

class AIService {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }
  
  // Generate job post suggestions based on partial input
  async getJobPostSuggestions(context: JobPostContext): Promise<string[]> {
    try {
      // For development, return mock data if no API key
      if (!this.apiKey) {
        return this.getMockJobSuggestions(context);
      }
      
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an AI assistant helping users create job postings on JobMate, a service marketplace platform. Provide helpful, concise suggestions to improve their job posting."
            },
            {
              role: "user",
              content: `I'm creating a job posting with the following information:
                ${context.title ? `Title: ${context.title}` : ''}
                ${context.description ? `Description: ${context.description}` : ''}
                ${context.category ? `Category: ${context.category}` : ''}
                ${context.location ? `Location: ${context.location}` : ''}
                
                Please provide 3 short, specific suggestions to improve my job posting. Each suggestion should be a single sentence.`
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const suggestions = response.data.choices[0].message.content
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
      
      return suggestions.slice(0, 3);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return [];
    }
  }
  
  // Generate specialist profile suggestions
  async getSpecialistSuggestions(context: SpecialistContext): Promise<string[]> {
    try {
      // For development, return mock data if no API key
      if (!this.apiKey) {
        return this.getMockSpecialistSuggestions(context);
      }
      
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an AI assistant helping service providers optimize their profiles on JobMate, a service marketplace platform. Provide helpful, concise suggestions to improve their profile and get more jobs."
            },
            {
              role: "user",
              content: `I'm a service provider with the following information:
                Services: ${context.services.join(', ')}
                ${context.previousJobs ? `Completed Jobs: ${context.previousJobs}` : ''}
                ${context.rating ? `Rating: ${context.rating}/5` : ''}
                ${context.location ? `Location: ${context.location}` : ''}
                
                Please provide 3 short, specific suggestions to improve my profile and get more jobs. Each suggestion should be a single sentence.`
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const suggestions = response.data.choices[0].message.content
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
      
      return suggestions.slice(0, 3);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return [];
    }
  }
  
  // Analyze image and return relevant information
  async analyzeImage(imageBase64: string): Promise<Record<string, any>> {
    try {
      // For development, return mock data if no API key
      if (!this.apiKey) {
        return {
          objects: ['chair', 'table', 'lamp'],
          condition: 'good',
          estimatedValue: '$150-200',
          suggestedCategory: 'Furniture Repair'
        };
      }
      
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "system",
              content: "You are an AI assistant that analyzes images for a service marketplace platform. Identify objects, conditions, and suggest relevant service categories."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "What's in this image? Please identify the main objects, their condition, and suggest a service category that might be relevant for fixing or improving what's shown."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 300
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Process the response to extract structured information
      // This is simplified - in production you'd want more robust parsing
      const analysisText = response.data.choices[0].message.content;
      
      return {
        rawAnalysis: analysisText,
        // Add more structured parsing here in production
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      return {};
    }
  }
  
  // Mock data for development without API key
  private getMockJobSuggestions(context: JobPostContext): string[] {
    return [
      "Add specific measurements or dimensions to make your job requirements clearer.",
      "Include your preferred time window for service completion to attract the right specialists.",
      "Upload a photo of the issue to help specialists provide more accurate quotes."
    ];
  }
  
  private getMockSpecialistSuggestions(context: SpecialistContext): string[] {
    return [
      "Add before/after photos of your previous work to showcase your quality.",
      "Specify your availability hours to appear in more relevant search results.",
      "Consider adding complementary services like 'furniture assembly' to attract more clients."
    ];
  }
}

export const aiService = new AIService();
