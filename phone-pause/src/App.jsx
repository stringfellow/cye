import { useState, useEffect } from "react";
import SetupWizard from "./components/SetupWizard";
import { loadPreferences } from "./utils/storage";
import CircuitBreaker from "./components/CircuitBreaker";

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
    <div>
      <h1 className="text-2xl font-bold mb-4">Cye (/sʌɪ/)</h1>
      {showSetup ? (
        <SetupWizard
          onComplete={handleSetupComplete}
          preferences={preferences}
        />
      ) : (
        <div>
          <button
            onClick={() => setShowSetup(true)}
            className="mb-4 px-3 py-1 bg-gray-200 rounded"
          >
            ?
          </button>
          <CircuitBreaker preferences={preferences} location={location} />
        </div>
      )}
    </div>
  );
}

export default App;
