import { useContext, useCallback } from "react";
import { ThinkingToggleContext } from "@/ThinkingToggleContext";

/**
 * Custom hook for thinking toggle functionality
 * Provides state management and utility functions for thinking process display control
 * @returns {Object} Thinking toggle state and actions
 */
export function useThinkingToggle() {
  const context = useContext(ThinkingToggleContext);

  if (!context) {
    throw new Error(
      "useThinkingToggle must be used within a ThinkingToggleProvider"
    );
  }

  const {
    showThinking,
    isSimpleMode,
    setShowThinking,
    toggleThinking,
    preferences,
    updatePreferences,
    isLoading,
  } = context;

  /**
   * Get display mode configuration
   * @returns {Object} Display configuration object
   */
  const getDisplayConfig = useCallback(() => {
    return {
      showThinking,
      isSimpleMode,
      showProgressIndicator: !showThinking,
      showFullThoughts: showThinking,
    };
  }, [showThinking, isSimpleMode]);

  /**
   * Reset preferences to default values
   */
  const resetToDefaults = useCallback(() => {
    updatePreferences({
      showThinking: false,
      mode: "simple",
      syncWithServer: false,
    });
  }, [updatePreferences]);

  /**
   * Update multiple preference values at once
   * @param {Object} updates - Object containing preference updates
   */
  const batchUpdatePreferences = useCallback(
    (updates) => {
      updatePreferences(updates);
    },
    [updatePreferences]
  );

  return {
    // State
    showThinking,
    isSimpleMode,
    preferences,
    isLoading,

    // Actions
    setShowThinking,
    toggleThinking,
    updatePreferences,
    batchUpdatePreferences,
    resetToDefaults,

    // Utilities
    getDisplayConfig,
  };
}
