"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Copy, ArrowRight } from "lucide-react";
import axios from "axios";
import { useAssistant } from "@/contexts/AssistantContext/AssistantContext";
import { AssistantMode } from "@/contexts/AssistantContext/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatInterfaceProps {
  onInsertContent?: (content: string) => void;
}

/**
 * Interactive chat interface component for the AI Assistant
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({ onInsertContent }) => {
  const { state, actions } = useAssistant();
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      // Log the interaction
      await axios.post("/api/assistant/memory", {
        action: "manual_query",
        mode: state.currentMode,
        context: {
          query: userInput,
          path: window.location.pathname,
        },
        aiGenerated: false,
      });

          // Create a placeholder message for streaming simulation
      const messageId = Date.now().toString();
      const assistantMessage: Message = {
        id: messageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true
      };

      // Add empty message that will be streamed into
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Get the full response
      const fullResponse = getSimulatedResponse(userInput, state.currentMode);
      
      // Simulate streaming but faster for better user experience
      let charIndex = 0;
      const chunkSize = 5; // Process more characters at once for faster response
      const streamInterval = setInterval(() => {
        if (charIndex < fullResponse.length) {
          const nextIndex = Math.min(charIndex + chunkSize, fullResponse.length);
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId 
                ? { ...msg, content: fullResponse.substring(0, nextIndex) }
                : msg
            )
          );
          charIndex = nextIndex;
        } else {
          // Streaming complete
          clearInterval(streamInterval);
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId 
                ? { ...msg, content: fullResponse, isStreaming: false }
                : msg
            )
          );
          setIsLoading(false);
          
          // Log the interaction
          actions.logInteraction('CHAT_RESPONSE', { 
            query: userInput,
            response_length: fullResponse.length 
          });
        }
      }, 10); // Faster speed
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  // Simulate AI response based on user input and mode
  // This will be replaced with actual AI integration
  const getSimulatedResponse = (input: string, mode: AssistantMode): string => {
    const inputLower = input.toLowerCase();
    
    // Generic greetings
    if (inputLower.includes("hello") || inputLower.includes("hi")) {
      return "Hello! How can I help you with JobMate today?";
    }
    
    if (inputLower.includes("help")) {
      return "I'm here to help! What specific aspect of JobMate do you need assistance with?";
    }
    
    // Mode-specific responses
    switch (mode) {
      case "MATCHING":
        if (inputLower.includes("match") || inputLower.includes("job")) {
          return "I can help you find better job matches! Would you like me to suggest some filters or help optimize your matching criteria? Based on your profile, focusing on location flexibility and highlighting your top 3 skills could improve your match score by up to 30%.";
        }
        if (inputLower.includes("price") || inputLower.includes("rate") || inputLower.includes("salary")) {
          return "Based on your skills and the current market rates in your area, I'd recommend setting your hourly rate between $45-60 for web development projects. This is competitive while reflecting your 3+ years of experience.";
        }
        if (inputLower.includes("nearby") || inputLower.includes("location") || inputLower.includes("area")) {
          return "There are currently 5 jobs within 10 miles of your location. 3 of them are for web development, and 2 are for graphic design. The closest one is just 2 miles away and was posted yesterday.";
        }
        return "I see you're in matching mode. I can help you find the perfect job matches based on your skills and preferences. Your current match score is 78/100 - adding portfolio examples could boost this significantly.";
        
      case "PROJECT_SETUP":
        if (inputLower.includes("title") || inputLower.includes("name")) {
          return "For your project, I'd suggest a title like 'Professional E-commerce Website Development' or 'Custom Online Store Creation & Setup'. Clear titles that specify deliverables tend to attract 40% more qualified specialists.";
        }
        if (inputLower.includes("description")) {
          return "Here's a template for your project description:\n\n---\nLooking for an experienced web developer to create a professional e-commerce website for my small business. The site should include:\n\n• Product catalog with filtering options\n• Secure payment processing\n• Mobile-responsive design\n• Basic SEO optimization\n• Admin dashboard for inventory management\n\nIdeal candidates will have experience with Shopify or WooCommerce and can provide examples of previous e-commerce projects.\n---\n\nFeel free to customize this to your specific needs!";
        }
        if (inputLower.includes("budget") || inputLower.includes("price") || inputLower.includes("cost")) {
          return "Based on your project requirements and current market rates, I'd recommend a budget range of $1,500-2,000 for a standard e-commerce site. This typically includes design, development, and basic SEO setup. For more complex features like custom payment integrations, consider adding 20-30% to your budget.";
        }
        if (inputLower.includes("timeline") || inputLower.includes("deadline") || inputLower.includes("schedule")) {
          return "For an e-commerce project of this scope, I'd recommend allowing 3-4 weeks for completion. This gives adequate time for design approval, development, testing, and revisions. Setting realistic timelines leads to better quality work and fewer delays.";
        }
        return "I can help you set up your project. What specific part are you working on - title, description, budget, or required skills? A well-structured project posting increases your chances of finding the right specialist by 65%.";
        
      case "PROFILE":
        if (inputLower.includes("improve") || inputLower.includes("optimize")) {
          return "To improve your profile, consider:\n\n1. Adding a professional photo (increases response rate by 40%)\n2. Expanding your bio to highlight specific achievements\n3. Adding 2-3 portfolio items with visual examples\n4. Getting at least 3 skill endorsements from previous clients\n5. Completing all verification steps for the 'Verified' badge";
        }
        if (inputLower.includes("bio") || inputLower.includes("about")) {
          return "Here's a suggested bio for your profile:\n\n---\nExperienced web developer with 5+ years specializing in responsive design and e-commerce solutions. I've helped over 30 small businesses establish their online presence with custom websites that drive real results. My approach combines clean code, user-focused design, and SEO best practices to create sites that look great and perform even better.\n\nTech stack: React, Node.js, WordPress, Shopify, WooCommerce\nIndustries: Retail, Professional Services, Food & Beverage\n---\n\nFeel free to personalize this with your specific experience!";
        }
        if (inputLower.includes("skill") || inputLower.includes("tag")) {
          return "Based on your profile and current market demand, I recommend adding these skills:\n\n1. React.js (high demand, +40% more job opportunities)\n2. Responsive Design (requested in 85% of web projects)\n3. E-commerce Platforms (Shopify/WooCommerce)\n4. UI/UX Design (complements your development skills)\n5. Performance Optimization (becoming increasingly important)\n\nRemove less relevant skills like Flash or older technologies to keep your profile focused.";
        }
        return "Your profile is your professional identity on JobMate. I can help you optimize it to attract more opportunities. Currently, your profile is 70% complete - adding portfolio items and skill endorsements would significantly increase your visibility to potential clients.";
        
      case "PAYMENTS":
        if (inputLower.includes("escrow") || inputLower.includes("payment process")) {
          return "JobMate uses a secure escrow payment system to protect both clients and specialists. Here's how it works:\n\n1. Client funds the project escrow account\n2. Specialist completes the work as agreed\n3. Client reviews and approves the deliverables\n4. Funds are released to the specialist\n\nThis ensures you only pay for approved work, and specialists know the funds are secured before they begin.";
        }
        if (inputLower.includes("dispute") || inputLower.includes("problem") || inputLower.includes("issue")) {
          return "If you're experiencing issues with a project, here's how to handle it:\n\n1. First, communicate directly with the other party through JobMate messages\n2. If unresolved, you can open a formal dispute by clicking 'Open Dispute' on the project page\n3. Provide clear details about the issue and your desired resolution\n4. A JobMate mediator will review both sides and help reach a fair solution\n\nMost disputes are resolved within 3-5 business days.";
        }
        if (inputLower.includes("review") || inputLower.includes("feedback")) {
          return "Here's a template for a balanced, helpful review:\n\n---\n[Specialist Name] delivered excellent work on my website project. Communication was prompt and professional throughout the process. The final design exceeded my expectations in terms of visual appeal and functionality. Particularly impressed with the responsive design and attention to detail. Would definitely work with [Name] again for future projects.\n\nRating: 5/5\n---\n\nSpecific details about what you liked make reviews more helpful to others.";
        }
        return "I can help with any payment-related questions, including escrow protection, invoicing, or handling disputes. JobMate's secure payment system ensures safe transactions for all parties.";
        
      case "MARKETPLACE":
        if (inputLower.includes("find") || inputLower.includes("search") || inputLower.includes("specialist")) {
          return "To find the best specialist for your project:\n\n1. Use specific filters like skills, rating (4.5+ recommended), and completion rate\n2. Check portfolios for relevant experience in your industry\n3. Read reviews focusing on communication and deadline adherence\n4. Consider specialists who ask thoughtful questions about your project\n\nI've noticed specialists with 10+ completed projects and response times under 2 hours tend to provide the most reliable service.";
        }
        if (inputLower.includes("demand") || inputLower.includes("popular") || inputLower.includes("trend")) {
          return "In your area, web development services are currently in high demand with a 30% increase in job postings over the last month. Specifically, e-commerce development, mobile optimization, and SEO services are trending. This could be a good time to either hire specialists in these fields or offer these services if you have the skills.";
        }
        return "I can help you navigate the JobMate marketplace to find the perfect specialist or service. Would you like recommendations based on your browsing history or project requirements?";
        
      case "GENERAL":
      default:
        if (inputLower.includes("trust") || inputLower.includes("reputation")) {
          return "Your current Trust Score is 85/100, which puts you in the 'Highly Trusted' tier. To reach the 'Elite' tier (90+), consider:\n\n1. Completing 2 more verified projects\n2. Maintaining your 100% on-time completion rate\n3. Getting 3 more positive reviews\n\nElite tier members receive priority placement in search results and access to exclusive high-value projects.";
        }
        return "I'm here to assist you with JobMate. What would you like to know or do? I can help with finding jobs, setting up projects, optimizing your profile, managing payments, or navigating the marketplace.";
    }
  };

  // Handle textarea auto-resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Copy message content to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could add a toast notification here
  };

  // Insert content into form if onInsertContent is provided
  const handleInsert = (content: string) => {
    if (onInsertContent) {
      onInsertContent(content);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.role === "user" ? (
                    <div className="flex items-center">
                      <span className="text-xs font-medium">You</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-xs font-medium">Assistant</span>
                    </div>
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                  {message.isStreaming && (
                    <span className="inline-block animate-pulse">▌</span>
                  )}
                </div>
                {!message.isStreaming && message.role === "assistant" && (
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => onInsertContent?.(message.content)}
                      className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center"
                    >
                      <ArrowRight size={12} className="mr-1" />
                      Insert
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(message.content)}
                      className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center ml-2"
                    >
                      <Copy size={12} className="mr-1" />
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t p-2">
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
          <input
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 focus:outline-none"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
