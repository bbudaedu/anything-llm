/**
 * Utility functions for thinking toggle preferences persistence
 * Handles localStorage operations with error handling and validation
 */

// Constants
export const THINKING_DISPLAY_KEY = "thinking_display_preferences";
export const DEFAULT_PREFERENCES = {
  showThinking: false, // Default to simple mode as per requirements
  mode: "simple",
  lastUpdated: Date.now(),
  syncWithServer: false,
};

/**
 * Validate preferences object structure
 * @param {Object} preferences - Preferences object to validate
 * @returns {boolean} Whether preferences are valid
 */
export function validatePreferences(preferences) {
  if (!preferences || typeof preferences !== "object") {
    return false;
  }

  // Check required fields
  const requiredFields = ["showThinking", "mode"];
  for (const field of requiredFields) {
    if (!(field in preferences)) {
      return false;
    }
  }

  // Validate field types and values
  if (typeof preferences.showThinking !== "boolean") {
    return false;
  }

  if (!["simple", "detailed"].includes(preferences.mode)) {
    return false;
  }

  return true;
}

/**
 * Load preferences from localStorage with validation
 * @returns {Object} Loaded preferences or defaults if invalid/missing
 */
export function loadPreferences() {
  try {
    const stored = localStorage.getItem(THINKING_DISPLAY_KEY);
    if (!stored) {
      return { ...DEFAULT_PREFERENCES };
    }

    const parsed = JSON.parse(stored);
    if (!validatePreferences(parsed)) {
      console.warn(
        "Invalid thinking display preferences found, using defaults"
      );
      return { ...DEFAULT_PREFERENCES };
    }

    // Merge with defaults to ensure all fields are present
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      lastUpdated: parsed.lastUpdated || Date.now(),
    };
  } catch (error) {
    console.warn("Failed to load thinking display preferences:", error);
    return { ...DEFAULT_PREFERENCES };
  }
}

/**
 * Save preferences to localStorage with error handling
 * @param {Object} preferences - Preferences object to save
 * @returns {boolean} Whether save was successful
 */
export function savePreferences(preferences) {
  try {
    if (!validatePreferences(preferences)) {
      console.warn("Attempted to save invalid preferences:", preferences);
      return false;
    }

    const toSave = {
      ...preferences,
      lastUpdated: Date.now(),
    };

    localStorage.setItem(THINKING_DISPLAY_KEY, JSON.stringify(toSave));
    return true;
  } catch (error) {
    console.warn("Failed to save thinking display preferences:", error);
    return false;
  }
}

/**
 * Clear preferences from localStorage
 * @returns {boolean} Whether clear was successful
 */
export function clearPreferences() {
  try {
    localStorage.removeItem(THINKING_DISPLAY_KEY);
    return true;
  } catch (error) {
    console.warn("Failed to clear thinking display preferences:", error);
    return false;
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} Whether localStorage is available
 */
export function isLocalStorageAvailable() {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get preferences with fallback for environments without localStorage
 * @returns {Object} Preferences object
 */
export function getPreferencesWithFallback() {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage not available, using default preferences");
    return { ...DEFAULT_PREFERENCES };
  }

  return loadPreferences();
}

/**
 * Migrate old preference format if needed
 * @param {Object} preferences - Current preferences
 * @returns {Object} Migrated preferences
 */
export function migratePreferences(preferences) {
  // Future migration logic can be added here
  // For now, just ensure all required fields are present
  return {
    ...DEFAULT_PREFERENCES,
    ...preferences,
  };
}
