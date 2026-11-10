import { useState, useEffect } from "react";
import SetupWizard from "./components/SetupWizard";
import {
  consumeActivePrompt,
  loadPreferences,
  saveCooldownUntil,
  savePreferences,
} from "./utils/storage";
import {
  DEFAULT_PERMANENT_TODOS,
  normalizeCooldownMinutes,
} from "./utils/preferences";
import CircuitBreaker from "./components/CircuitBreaker";
import "./index.css";

function App() {
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(true);
  const [location, setLocation] = useState("home");
  const [promptStorageUnavailable, setPromptStorageUnavailable] =
    useState(false);

  useEffect(() => {
    const saved = loadPreferences();
    const activePrompt = consumeActivePrompt();
    if (saved) {
      const loadedPreferences = {
        ...saved,
        permanentTodos: Array.isArray(saved.permanentTodos)
          ? saved.permanentTodos
          : [...DEFAULT_PERMANENT_TODOS],
      };
      if (!Array.isArray(saved.permanentTodos)) {
        savePreferences(loadedPreferences);
      }
      if (activePrompt === null) {
        setPromptStorageUnavailable(true);
      } else if (activePrompt) {
        const cooldownUntil =
          Date.now() +
          normalizeCooldownMinutes(loadedPreferences.cooldownMinutes) *
            60 *
            1000;
        if (!saveCooldownUntil(cooldownUntil)) {
          setPromptStorageUnavailable(true);
        }
      }
      setPreferences(loadedPreferences);
      setShowSetup(false);
    }
    setIsLoading(false);
  }, []);

  const handleSetupComplete = (newPreferences) => {
    setPreferences(newPreferences);
    setShowSetup(false);
  };

  const handlePreferencesChange = (newPreferences) => {
    savePreferences(newPreferences);
    setPreferences(newPreferences);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center bg-gray-900 text-gray-300">
      <div className="w-full max-w-4xl p-8">
        {showSetup ? (
          <div>
            <h1 className="text-2xl font-bold mb-8 text-gray-500 text-center">
              Cye (/sʌɪ/)
            </h1>
            <SetupWizard
              onComplete={handleSetupComplete}
              preferences={preferences}
            />
          </div>
        ) : (
          <div className="relative">
            <h1 className="text-2xl font-bold text-gray-500 text-center">
              Cye (/sʌɪ/)
              <button
                onClick={() => setShowSetup(true)}
                className="absolute top-0 right-0 px-2 py-1 bg-gray-800 hover:bg-gray-700 
                         rounded text-gray-500 hover:text-gray-300 transition-colors text-sm"
              >
                ?
              </button>
            </h1>
            <div className="mt-4">
              <CircuitBreaker
                preferences={preferences}
                location={location}
                onPreferencesChange={handlePreferencesChange}
                promptStorageUnavailable={promptStorageUnavailable}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
