import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loadPreferences,
  savePreferences,
  DEFAULT_PREFERENCES,
  isLocalStorageAvailable,
} from "@/utils/thinkingToggleStorage";
import { userFromStorage } from "@/utils/request";
import System from "@/models/system";
import Admin from "@/models/admin";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

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
  isAdmin: false,
  canControlThinking: false,
  multiUserMode: false,
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
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [multiUserMode, setMultiUserMode] = useState(false);

  // Initialize user role and system settings
  useEffect(() => {
    const initializeContext = async () => {
      try {
        // Check user role
        const user = userFromStorage();
        const userIsAdmin = user?.role === "admin";
        setIsAdmin(userIsAdmin);

        // Check if multi-user mode is enabled
        const systemKeys = await System.keys();
        const isMultiUser = systemKeys?.MultiUserMode || false;
        setMultiUserMode(isMultiUser);

        // Load preferences based on mode
        let loadedPreferences;
        if (isMultiUser) {
          // In multi-user mode, get system-wide setting
          try {
            const systemSetting = await Admin.getThinkingDisplaySetting();
            loadedPreferences = {
              ...DEFAULT_PREFERENCES,
              showThinking: systemSetting.success
                ? systemSetting.thinking_display_enabled
                : false,
              lastUpdated: Date.now(),
            };
          } catch (error) {
            console.warn(
              "Failed to load system thinking display setting:",
              error
            );
            // Fallback to localStorage for backward compatibility
            loadedPreferences = loadPreferences();
          }
        } else {
          // In single-user mode, use localStorage
          loadedPreferences = loadPreferences();
        }

        setPreferences(loadedPreferences);
      } catch (error) {
        console.warn("Failed to initialize thinking display context:", error);

        // Graceful degradation - use safe defaults
        setPreferences({
          ...DEFAULT_PREFERENCES,
          showThinking: false, // Default to hidden on error
        });
        setIsAdmin(false);
        setMultiUserMode(false);

        // Optionally show user-friendly error message
        if (process.env.NODE_ENV === "development") {
          console.error("ThinkingToggleContext initialization error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeContext();
  }, []);

  // Set up polling for system setting changes in multi-user mode
  useEffect(() => {
    if (!multiUserMode || isLoading) return;

    const pollInterval = 30000; // Poll every 30 seconds
    let intervalId;

    const pollSystemSetting = async () => {
      try {
        const systemSetting = await Admin.getThinkingDisplaySetting();
        if (systemSetting.success) {
          const currentShowThinking = preferences.showThinking;
          const systemShowThinking = systemSetting.thinking_display_enabled;

          // Only update if the setting has changed
          if (currentShowThinking !== systemShowThinking) {
            updatePreferences({
              showThinking: systemShowThinking,
              lastUpdated: Date.now(),
            });

            // Notify user of the change (only if not admin to avoid duplicate notifications)
            if (!isAdmin) {
              const message = systemShowThinking
                ? t(
                    "thinkingToggle.feedback.enabledByAdmin",
                    "Thinking process display has been enabled by an administrator"
                  )
                : t(
                    "thinkingToggle.feedback.disabledByAdmin",
                    "Thinking process display has been disabled by an administrator"
                  );
              toast.info(message);
            }
          }
        }
      } catch (error) {
        // Silently fail polling to avoid spam in console
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "Failed to poll system thinking display setting:",
            error
          );
        }
      }
    };

    // Start polling
    intervalId = setInterval(pollSystemSetting, pollInterval);

    // Cleanup on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [multiUserMode, isLoading, preferences.showThinking]);

  // Persist preferences to localStorage only in single-user mode
  useEffect(() => {
    if (!isLoading && !multiUserMode && isLocalStorageAvailable()) {
      const success = savePreferences(preferences);
      if (!success) {
        console.warn("Failed to persist thinking display preferences");
      }
    }
  }, [preferences, isLoading, multiUserMode]);

  /**
   * Update preferences with new values
   * @param {Object} newPreferences - New preference values to merge
   */
  const updatePreferences = (newPreferences) => {
    try {
      setPreferences((prev) => ({
        ...prev,
        ...newPreferences,
        lastUpdated: Date.now(),
      }));
    } catch (error) {
      console.warn("Failed to update thinking display preferences:", error);
      // Don't throw error to prevent UI crashes
    }
  };

  /**
   * Set the showThinking state
   * @param {boolean} show - Whether to show thinking process
   */
  const setShowThinking = async (show) => {
    try {
      // Strict permission checking
      if (multiUserMode && !isAdmin) {
        console.warn(
          "Non-admin users cannot control thinking display in multi-user mode"
        );
        return false;
      }

      if (!canControlThinking) {
        console.warn(
          "User does not have permission to control thinking display"
        );
        return false;
      }

      const newValue = Boolean(show);

      // In multi-user mode, save to system setting (admin only)
      if (multiUserMode && isAdmin) {
        try {
          const result = await Admin.updateThinkingDisplaySetting(newValue);
          if (result.success) {
            updatePreferences({
              showThinking: newValue,
            });

            // Show success feedback
            const message = newValue
              ? t(
                  "thinkingToggle.feedback.enabled",
                  "Thinking process display enabled for all users"
                )
              : t(
                  "thinkingToggle.feedback.disabled",
                  "Thinking process display disabled for all users"
                );
            toast.success(message);

            return true;
          } else {
            console.error(
              "Failed to update system thinking display setting:",
              result.error
            );
            toast.error(
              t(
                "thinkingToggle.feedback.error",
                "Failed to update thinking display setting"
              )
            );
            return false;
          }
        } catch (error) {
          console.error(
            "Failed to update system thinking display setting:",
            error
          );
          toast.error(
            t(
              "thinkingToggle.feedback.error",
              "Failed to update thinking display setting"
            )
          );
          return false;
        }
      } else if (!multiUserMode) {
        // In single-user mode, save to localStorage
        updatePreferences({
          showThinking: newValue,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.warn("Failed to set thinking display state:", error);
      return false;
    }
  };

  /**
   * Toggle thinking display on/off
   * @returns {Promise<boolean>} Whether the toggle was successful
   */
  const toggleThinking = async () => {
    try {
      if (multiUserMode && !isAdmin) {
        console.warn(
          "Non-admin users cannot toggle thinking display in multi-user mode"
        );
        return false;
      }

      if (!canControlThinking) {
        console.warn(
          "User does not have permission to toggle thinking display"
        );
        return false;
      }

      return await setShowThinking(!preferences.showThinking);
    } catch (error) {
      console.warn("Failed to toggle thinking display:", error);
      return false;
    }
  };

  // Derived state - 保持向後相容性
  const isSimpleMode = !preferences.showThinking;

  // Determine if user can control thinking display
  // In single-user mode, all users can control it
  // In multi-user mode, only admins can control it
  const canControlThinking = !multiUserMode || isAdmin;

  /**
   * Refresh the thinking display setting from the system
   * Used to sync with changes made by other admins
   */
  const refreshSystemSetting = async () => {
    if (!multiUserMode) return;

    try {
      const systemSetting = await Admin.getThinkingDisplaySetting();
      if (systemSetting.success) {
        updatePreferences({
          showThinking: systemSetting.thinking_display_enabled,
          lastUpdated: Date.now(),
        });
      }
    } catch (error) {
      console.warn("Failed to refresh system thinking display setting:", error);
    }
  };

  const contextValue = {
    showThinking: preferences.showThinking,
    isSimpleMode,
    setShowThinking,
    toggleThinking,
    refreshSystemSetting,
    preferences,
    updatePreferences,
    isLoading,
    isAdmin,
    canControlThinking,
    multiUserMode,
  };

  return (
    <ThinkingToggleContext.Provider value={contextValue}>
      {children}
    </ThinkingToggleContext.Provider>
  );
}

export { ThinkingToggleContext };
