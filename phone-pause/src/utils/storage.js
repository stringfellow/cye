// utils/storage.js

// Save data to localStorage
export const savePreferences = (preferences) => {
  try {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save preferences:", error);
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
