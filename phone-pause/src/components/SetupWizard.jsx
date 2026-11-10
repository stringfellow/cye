import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  MINIMUM_COOLDOWN_MINUTES,
  normalizeCooldownMinutes,
} from "../utils/preferences";
import { savePreferences } from "../utils/storage";

const DEFAULT_PREFERENCES = {
  hasPet: "",
  allowTasks: true,
  hasNature: true,
  hasAphantasia: false,
  cooldownMinutes: MINIMUM_COOLDOWN_MINUTES,
};

function SetupWizard({ onComplete, preferences: existingPreferences }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  // Initialize form with existing preferences when available
  useEffect(() => {
    if (existingPreferences) {
      setPreferences({
        ...DEFAULT_PREFERENCES,
        ...existingPreferences,
        cooldownMinutes: normalizeCooldownMinutes(
          existingPreferences.cooldownMinutes
        ),
      });
    }
  }, [existingPreferences]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedPreferences = {
      ...preferences,
      cooldownMinutes: normalizeCooldownMinutes(preferences.cooldownMinutes),
    };
    savePreferences(savedPreferences);
    onComplete(savedPreferences);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <p className="mb-4 text-gray-400">
        Cye ("Close your eyes", or "sigh") is a circuit breaker app - when you
        feel the need to open an app on your phone for a dopamine hit (but you
        don't really know why you're doing it), open this instead.
      </p>
      <p className="mb-8 text-gray-400">
        Cye will offer you a suggestion, based on your preferences and location
        if possible, to make you look away from your phone at least momentarily,
        which can sometimes be all we need to disrupt the cycle of looking for
        something to do on it.
      </p>
      <p className="mb-8 text-gray-400">
        After you thank yourself, Cye stays paused. Your next prompt appears
        when you reopen or return to Cye after the pause you choose.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 text-gray-400">
        <div className="mb-4">
          <label className="block mb-2">
            Do you have a pet?
            <select
              className="block w-full mt-1 p-2 border rounded text-gray-100 bg-gray-900"
              value={preferences.hasPet}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  hasPet: e.target.value === "" ? null : e.target.value,
                })
              }
            >
              <option value="">Choose...</option>
              <option value="false">No</option>
              <option value="many">Many kinds!</option>
              <option value="dog">A dog or pack</option>
              <option value="cat">A cat or clowder</option>
              <option value="rabbit">A rabbit or fluffle</option>
            </select>
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="checkbox"
              checked={preferences.allowTasks}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  allowTasks: e.target.checked,
                })
              }
              className="mr-2"
            />
            Do you want to allow Cye to nudge you with tasks?
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="checkbox"
              checked={preferences.hasNature}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  hasNature: e.target.checked,
                })
              }
              className="mr-2"
            />
            Can generally see a tree, the sky, a plant or any other nature from
            a nearby window?
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="checkbox"
              checked={preferences.hasAphantasia}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  hasAphantasia: e.target.checked,
                })
              }
              className="mr-2"
            />
            Do you have aphantasia (inability to visualise in your mind's eye)?
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="cooldownMinutes">
            Minimum pause before another prompt (minutes)
            <input
              id="cooldownMinutes"
              type="number"
              min={MINIMUM_COOLDOWN_MINUTES}
              step="1"
              required
              className="block w-full mt-1 p-2 border rounded text-gray-100 bg-gray-900"
              value={preferences.cooldownMinutes}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  cooldownMinutes:
                    e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          </label>
          <p className="text-sm text-gray-500">
            At least 1 minute. Cye will not show another prompt until you reopen
            or return to it after this pause.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 text-gray-100 p-2 rounded hover:bg-blue-800"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
}

SetupWizard.propTypes = {
  onComplete: PropTypes.func.isRequired,
  preferences: PropTypes.shape({
    hasPet: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    allowTasks: PropTypes.bool,
    hasNature: PropTypes.bool,
    hasAphantasia: PropTypes.bool,
    cooldownMinutes: PropTypes.number,
  }),
};

export default SetupWizard;
