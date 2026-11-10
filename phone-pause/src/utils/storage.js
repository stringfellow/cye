// utils/storage.js

const COOLDOWN_KEY = "nextPromptAvailableAt";

// Save data to localStorage
export const savePreferences = (preferences) => {
  try {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save preferences:", error);
  }
};

export const loadCooldownUntil = () => {
  try {
    const saved = localStorage.getItem(COOLDOWN_KEY);
    if (saved === null) return 0;
    if (saved.trim() === "") {
      console.error("Saved prompt cooldown is invalid.");
      return null;
    }

    const cooldownUntil = Number(saved);
    if (!Number.isFinite(cooldownUntil)) {
      console.error("Saved prompt cooldown is invalid.");
      return null;
    }

    return cooldownUntil > Date.now() ? cooldownUntil : 0;
  } catch (error) {
    console.error("Failed to load prompt cooldown:", error);
    return null;
  }
};

export const saveCooldownUntil = (timestamp) => {
  try {
    localStorage.setItem(COOLDOWN_KEY, String(timestamp));
    return true;
  } catch (error) {
    console.error("Failed to save prompt cooldown:", error);
    return false;
  }
};

// Load data from localStorage
export const loadPreferences = () => {
  try {
    const saved = localStorage.getItem("userPreferences");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load preferences:", error);
    return null;
  }
};

// Clear all saved data
export const clearPreferences = () => {
  try {
    localStorage.removeItem("userPreferences");
  } catch (error) {
    console.error("Failed to clear preferences:", error);
  }
};
