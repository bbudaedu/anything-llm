import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loadPreferences,
  savePreferences,
  DEFAULT_PREFERENCES,
  isLocalStorageAvailable,
} from "@/utils/thinkingToggleStorage";

// Create the context
const ThinkingToggleContext = createContext({
  showThinking: DEFAULT_PREFERENCES.showThinking,
  mode: DEFAULT_PREFERENCES.mode,
  isSimpleMode: true,
  setShowThinking: () => {},
  setMode: () => {},
  toggleMode: () => {},
  preferences: DEFAULT_PREFERENCES,
  updatePreferences: () => {},
  isLoading: false,
});

/**
 * Custom hook to use the ThinkingToggleContext
 * @returns {Object} Context value with thinking display state and actions
 */
export function useThinkingToggle() {
  const context = useContext(ThinkingToggleContext);
  if (!context) {
    throw new Error(
      "useThinkingToggle must be used within a ThinkingToggleProvider"
    );
  }
  return context;
}

/**
 * Provider component for thinking toggle functionality
 * Manages global state for thinking process display control
 */
export function ThinkingToggleProvider({ children }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize preferences from localStorage on mount
  useEffect(() => {
    try {
      const loadedPreferences = loadPreferences();
      setPreferences(loadedPreferences);
    } catch (error) {
      console.warn("Failed to initialize thinking display preferences:", error);
      setPreferences(DEFAULT_PREFERENCES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && isLocalStorageAvailable()) {
      const success = savePreferences(preferences);
      if (!success) {
        console.warn("Failed to persist thinking display preferences");
      }
    }
  }, [preferences, isLoading]);

  /**
   * Update preferences with new values
   * @param {Object} newPreferences - New preference values to merge
   */
  const updatePreferences = (newPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      ...newPreferences,
      lastUpdated: Date.now(),
    }));
  };

  /**
   * Set the showThinking state
   * @param {boolean} show - Whether to show thinking process
   */
  const setShowThinking = (show) => {
    updatePreferences({
      showThinking: show,
    });
  };

  /**
   * Toggle thinking display on/off
   */
  const toggleThinking = () => {
    setShowThinking(!preferences.showThinking);
  };

  // Derived state - 保持向後相容性
  const isSimpleMode = !preferences.showThinking;

  const contextValue = {
    showThinking: preferences.showThinking,
    isSimpleMode,
    setShowThinking,
    toggleThinking,
    preferences,
    updatePreferences,
    isLoading,
  };

  return (
    <ThinkingToggleContext.Provider value={contextValue}>
      {children}
    </ThinkingToggleContext.Provider>
  );
}

export { ThinkingToggleContext };
