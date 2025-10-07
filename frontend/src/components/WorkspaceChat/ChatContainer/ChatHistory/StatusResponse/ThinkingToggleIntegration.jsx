import React from "react";
import { useThinkingToggle } from "@/ThinkingToggleContext";

/**
 * Simple thinking toggle integration for StatusResponse
 * Shows/hides thinking content based on user preference
 */
export function useThinkingToggleIntegration() {
  const { showThinking } = useThinkingToggle();
  
  return {
    showThinking,
    shouldShowThinking: showThinking,
    shouldShowSimpleMode: !showThinking,
  };
}

/**
 * Simple progress indicator for when thinking is hidden
 */
export function SimpleThinkingIndicator({ isThinking, currentStep }) {
  if (!isThinking) return null;
  
  return (
    <div className="flex items-center space-x-2 p-2 bg-theme-bg-chat-input rounded">
      <div className="w-4 h-4 border-2 border-theme-text-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm text-theme-text-secondary">
        {currentStep || "Processing..."}
      </span>
    </div>
  );
}