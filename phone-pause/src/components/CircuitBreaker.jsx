import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { getValidCircuitBreakers } from "../utils/circuitBreakers";
import { normalizeCooldownMinutes } from "../utils/preferences";
import { loadCooldownUntil, saveCooldownUntil } from "../utils/storage";

function CircuitBreaker({ preferences, location, onPreferencesChange }) {
  const [cooldown, setCooldown] = useState(() => {
    const until = loadCooldownUntil();
    return {
      until,
      ready: until === 0,
      storageUnavailable: until === null,
    };
  });
  const [prompt, setPrompt] = useState(null);
  const [promptVersion, setPromptVersion] = useState(0);
  const [markOneTimeTodoDone, setMarkOneTimeTodoDone] = useState(false);

  const pickNewCircuitBreaker = useCallback(() => {
    const validCircuitBreakers = getValidCircuitBreakers(
      preferences,
      Date.now(),
      location
    );
    const randomIndex = Math.floor(Math.random() * validCircuitBreakers.length);
    const curr = validCircuitBreakers[randomIndex];
    if (!curr) {
      setPrompt({ content: <div>Nothing to see</div> });
    } else {
      setPrompt({
        content:
          typeof curr.render === "string"
            ? curr.render
            : curr.render({ preferences, location }),
        oneTimeTodoIndex: curr.oneTimeTodoIndex,
      });
    }
    setPromptVersion((version) => version + 1);
    setMarkOneTimeTodoDone(false);
  }, [location, preferences]);

  useEffect(() => {
    if (cooldown.ready) {
      pickNewCircuitBreaker();
    }
  }, [cooldown.ready, pickNewCircuitBreaker]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;

      setCooldown((current) => {
        if (
          current.ready ||
          current.storageUnavailable ||
          current.until > Date.now()
        ) {
          return current;
        }

        return { ...current, ready: true };
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleAcknowledge = () => {
    if (
      markOneTimeTodoDone &&
      Number.isInteger(prompt?.oneTimeTodoIndex) &&
      preferences.oneTimeTodos?.[prompt.oneTimeTodoIndex]
    ) {
      onPreferencesChange({
        ...preferences,
        oneTimeTodos: preferences.oneTimeTodos.filter(
          (_, index) => index !== prompt.oneTimeTodoIndex
        ),
      });
    }

    const cooldownMinutes = normalizeCooldownMinutes(
      preferences.cooldownMinutes
    );
    const until = Date.now() + cooldownMinutes * 60 * 1000;
    const saved = saveCooldownUntil(until);

    setCooldown({
      until,
      ready: false,
      storageUnavailable: !saved,
    });
    setPrompt(null);
  };

  if (!preferences) return <p>...</p>;

  return (
    <div className="text-center">
      {cooldown.ready ? (
        <>
          <div key={promptVersion} className="circuit-breaker-prompt">
            <div className="text-xl mb-8 text-gray-100">{prompt?.content}</div>
            {Number.isInteger(prompt?.oneTimeTodoIndex) && (
              <label className="mb-6 flex items-center justify-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={markOneTimeTodoDone}
                  onChange={(event) =>
                    setMarkOneTimeTodoDone(event.target.checked)
                  }
                />
                Mark this task done
              </label>
            )}
            <button
              onClick={handleAcknowledge}
              className="mb-8 rounded-lg border border-blue-800 bg-blue-900 px-6 py-3 font-medium text-blue-100 shadow-md transition-colors hover:bg-blue-800 active:bg-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              Ok. Thank you, me
            </button>
          </div>
        </>
      ) : (
        <div className="text-gray-500" aria-live="polite">
          <p>Take a moment away from your phone.</p>
          <p>Your next prompt will be here when you return after the pause.</p>
          {cooldown.storageUnavailable && (
            <p role="alert">
              Cye could not save the pause on this device. Check your browser
              storage settings before continuing.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

CircuitBreaker.propTypes = {
  preferences: PropTypes.shape({
    hasPet: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    allowTasks: PropTypes.bool,
    hasNature: PropTypes.bool,
    hasAphantasia: PropTypes.bool,
    cooldownMinutes: PropTypes.number,
    permanentTodos: PropTypes.arrayOf(PropTypes.string),
    oneTimeTodos: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  location: PropTypes.string,
  onPreferencesChange: PropTypes.func.isRequired,
};

export default CircuitBreaker;
