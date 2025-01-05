import { useState, useEffect } from "react";
import SetupWizard from "./components/SetupWizard";
import { loadPreferences } from "./utils/storage";
import CircuitBreaker from "./components/CircuitBreaker";
import "./index.css";

function App() {
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(true);
  const [location, setLocation] = useState("home");

  useEffect(() => {
    const saved = loadPreferences();
    if (saved) {
      setPreferences(saved);
      setShowSetup(false);
    }
    setIsLoading(false);
  }, []);

  const handleSetupComplete = (newPreferences) => {
    setPreferences(newPreferences);
    setShowSetup(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center bg-gray-900 text-gray-300">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-500 text-center">
          Cye (/sʌɪ/)
        </h1>
        {showSetup ? (
          <SetupWizard
            onComplete={handleSetupComplete}
            preferences={preferences}
          />
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowSetup(true)}
              className="absolute top-0 right-0 px-3 py-1 bg-gray-800 hover:bg-gray-700 
                         rounded text-gray-500 hover:text-gray-300 transition-colors"
            >
              ?
            </button>
            <CircuitBreaker preferences={preferences} location={location} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
