"use client";

import React from "react";
import { motion } from "framer-motion";
import { AssistantMode } from "@/contexts/AssistantContext/types";

interface PromptSuggestionsProps {
  mode: AssistantMode;
  context?: string;
  onSelectPrompt: (prompt: string) => void;
}

/**
 * Component that displays context-specific prompt buttons for the assistant
 */
const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  mode,
  context,
  onSelectPrompt,
}) => {
  // Get prompts based on mode and context
  const getPrompts = (): string[] => {
    switch (mode) {
      case "MATCHING":
        return [
          "Find best matches",
          "Improve match score",
          "Expand search area",
          "Filter by skills",
        ];
      case "PROJECT_SETUP":
        return [
          "Suggest job title",
          "Estimate fair price",
          "Add skill tags",
          "Write job description",
        ];
      case "PROFILE":
        return [
          "Improve my bio",
          "Suggest missing skills",
          "Optimize profile visibility",
          "Review portfolio",
        ];
      case "PAYMENTS":
        return [
          "Explain payment process",
          "Calculate service fee",
          "Payment options",
          "Resolve payment issue",
        ];
      case "MARKETPLACE":
        return [
          "Find popular services",
          "Compare similar listings",
          "Suggest pricing",
          "Improve visibility",
        ];
      case "GENERAL":
      default:
        return [
          "How does JobMate work?",
          "Getting started guide",
          "Account settings help",
          "Contact support",
        ];
    }
  };

  // Get context-specific prompts if context is provided
  const getContextPrompts = (): string[] => {
    if (!context) return [];

    // Add more context-specific prompts based on the current page
    if (context.includes("job-creation")) {
      return [
        "Help me write a job description",
        "What skills should I require?",
        "How much should I budget?",
      ];
    }

    if (context.includes("profile-edit")) {
      return [
        "Make my profile stand out",
        "What skills are in demand?",
        "Improve my portfolio",
      ];
    }

    if (context.includes("messages")) {
      return [
        "Draft a professional response",
        "Negotiate politely",
        "Ask for clarification",
      ];
    }

    return [];
  };

  // Combine mode-based and context-specific prompts, removing duplicates
  const allPrompts = [...getPrompts(), ...getContextPrompts()];
  const uniquePrompts = Array.from(new Set(allPrompts));

  return (
    <div className="flex flex-wrap gap-2 my-3">
      {uniquePrompts.map((prompt: string, index: number) => (
        <motion.button
          key={prompt}
          onClick={() => onSelectPrompt(prompt)}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {prompt}
        </motion.button>
      ))}
    </div>
  );
};

export default PromptSuggestions;
