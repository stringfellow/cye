import { useState, useEffect } from "react";
import SetupWizard from "./components/SetupWizard";
import { loadPreferences } from "./utils/storage";
import CircuitBreaker from "./components/CircuitBreaker";

function App() {
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [doSetup, setDoSetup] = useState(true);
  // const [location, setLocation] = useState("home"); // Placeholder

  useEffect(() => {
    const saved = loadPreferences();
    if (saved) setPreferences(saved);
    setIsLoading(false);
  }, []);

  const becomeReady = () => {
    setDoSetup(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cye (/sʌɪ/)</h1>
      {preferences || !doSetup ? (
        <div>
          <button onClick={() => setDoSetup(true)}>?</button>
          <CircuitBreaker preferences={preferences} location={location} />
        </div>
      ) : (
        <SetupWizard onComplete={becomeReady} doSetup={doSetup} />
      )}
    </div>
  );
}

export default App;
