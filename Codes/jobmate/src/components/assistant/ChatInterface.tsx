"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Copy, ArrowRight } from "lucide-react";
import axios from "axios";
import { useAssistant } from "@/contexts/AssistantContext/AssistantContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

      // Simulate AI response (replace with actual API call in production)
      setTimeout(() => {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: getSimulatedResponse(userInput, state.currentMode),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);

        // In production, replace with actual API call:
        // const response = await axios.post("/api/assistant/chat", {
        //   message: userInput,
        //   mode: state.currentMode,
        //   context: window.location.pathname,
        // });
        // setMessages((prev) => [...prev, response.data]);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  // Simulate AI response based on user input and mode
  // This will be replaced with actual AI integration
  const getSimulatedResponse = (input: string, mode: string): string => {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes("hello") || inputLower.includes("hi")) {
      return "Hello! How can I help you with JobMate today?";
    }
    
    if (inputLower.includes("help")) {
      return "I'm here to help! What specific aspect of JobMate do you need assistance with?";
    }
    
    switch (mode) {
      case "MATCHING":
        if (inputLower.includes("match") || inputLower.includes("job")) {
          return "I can help you find better job matches! Would you like me to suggest some filters or help optimize your matching criteria?";
        }
        return "I see you're in matching mode. I can help you find the perfect job matches based on your skills and preferences.";
        
      case "PROJECT_SETUP":
        if (inputLower.includes("title") || inputLower.includes("description")) {
          return "Creating a compelling job posting is important! Would you like me to suggest a title or help write a clear description?";
        }
        return "I can help you set up your project. What specific part are you working on - title, description, budget, or required skills?";
        
      case "PROFILE":
        return "Your profile is your professional identity on JobMate. I can help you optimize it to attract more opportunities.";
        
      default:
        return "I'm here to assist you with JobMate. What would you like to know or do?";
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 my-8">
            <Bot className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>Ask me anything about JobMate!</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.role === "user" ? "You" : "Assistant"}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="flex justify-end gap-1 mt-1">
                  {message.role === "assistant" && (
                    <>
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="text-xs opacity-70 hover:opacity-100"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      {onInsertContent && (
                        <button
                          onClick={() => handleInsert(message.content)}
                          className="text-xs opacity-70 hover:opacity-100"
                          title="Insert into form"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </>
                  )}
                  <span className="text-xs opacity-50">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-muted rounded-lg p-4 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="border-t p-4 dark:border-gray-700"
      >
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleTextareaChange}
              placeholder="Ask me anything..."
              className="w-full resize-none px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[40px] max-h-[120px] dark:bg-gray-800 dark:border-gray-700"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`p-2 rounded-md ${
              isLoading
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            disabled={isLoading || !userInput.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
