import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  DEFAULT_PERMANENT_TODOS,
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
  permanentTodos: [...DEFAULT_PERMANENT_TODOS],
  oneTimeTodos: [],
};

function SetupWizard({ onComplete, preferences: existingPreferences }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [todoDrafts, setTodoDrafts] = useState({
    permanentTodos: "",
    oneTimeTodos: "",
  });

  // Initialize form with existing preferences when available
  useEffect(() => {
    if (existingPreferences) {
      setPreferences({
        ...DEFAULT_PREFERENCES,
        ...existingPreferences,
        permanentTodos: Array.isArray(existingPreferences.permanentTodos)
          ? existingPreferences.permanentTodos.filter(
              (todo) => typeof todo === "string"
            )
          : [...DEFAULT_PERMANENT_TODOS],
        oneTimeTodos: Array.isArray(existingPreferences.oneTimeTodos)
          ? existingPreferences.oneTimeTodos.filter(
              (todo) => typeof todo === "string"
            )
          : [],
        cooldownMinutes: normalizeCooldownMinutes(
          existingPreferences.cooldownMinutes
        ),
      });
    }
  }, [existingPreferences]);

  const addTodo = (listName) => {
    const todo = todoDrafts[listName].trim();
    if (!todo) return;

    setPreferences((current) => ({
      ...current,
      [listName]: [...current[listName], todo],
    }));
    setTodoDrafts((current) => ({ ...current, [listName]: "" }));
  };

  const handleTodoKeyDown = (event, listName) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTodo(listName);
    }
  };

  const removeTodo = (listName, index) => {
    setPreferences((current) => ({
      ...current,
      [listName]: current[listName].filter(
        (_, todoIndex) => todoIndex !== index
      ),
    }));
  };

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

        {preferences.allowTasks && (
          <section className="space-y-6 rounded border border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-200">
              Your todo nudges
            </h2>
            <p className="text-sm text-gray-500">
              These are saved on this device. Turn off task nudges to pause all
              task suggestions; your lists will stay here.
            </p>

            {[
              {
                name: "permanentTodos",
                title: "Permanent todos",
                description:
                  "Recurring chores you can be nudged about again, like doing the dishes or tidying up.",
                action: "Remove",
              },
              {
                name: "oneTimeTodos",
                title: "One-time todos",
                description:
                  "Tasks to do once, like buying a book or returning a parcel. Mark them done to remove them.",
                action: "Mark done",
              },
            ].map(({ name, title, description, action }) => (
              <div key={name}>
                <h3 className="font-medium text-gray-200">{title}</h3>
                <p className="mb-2 text-sm text-gray-500">{description}</p>
                <div className="mb-3 flex gap-2">
                  <input
                    type="text"
                    className="min-w-0 flex-1 rounded border bg-gray-900 p-2 text-gray-100"
                    value={todoDrafts[name]}
                    aria-label={`Add ${title.toLowerCase()}`}
                    onChange={(event) =>
                      setTodoDrafts((current) => ({
                        ...current,
                        [name]: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => handleTodoKeyDown(event, name)}
                  />
                  <button
                    type="button"
                    className="rounded bg-gray-800 px-3 text-gray-200 hover:bg-gray-700"
                    onClick={() => addTodo(name)}
                  >
                    Add
                  </button>
                </div>
                {preferences[name].length > 0 && (
                  <ul className="space-y-2">
                    {preferences[name].map((todo, index) => (
                      <li
                        key={`${todo}-${index}`}
                        className="flex items-center justify-between gap-3 rounded bg-gray-800 p-2 text-left text-gray-200"
                      >
                        <span className="break-words">{todo}</span>
                        <button
                          type="button"
                          className="shrink-0 text-sm text-gray-400 underline hover:text-gray-100"
                          onClick={() => removeTodo(name, index)}
                        >
                          {action}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

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
    permanentTodos: PropTypes.arrayOf(PropTypes.string),
    oneTimeTodos: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SetupWizard;
