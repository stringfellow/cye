const checkConditions = {
  PET: (prefs, petTypes) => petTypes.includes(prefs.petType),
  NATURE_VIEW: (prefs) => prefs.hasNatureView === true,
  NO_APHANTASIA: (prefs) => prefs.hasAphantasia === false,

  TIME_SUNSET: (prefs, time, sunsetTime) => {
    const diff = sunsetTime - time;
    return diff > 0 && diff < 1800000; // Within 30 mins
  },
  TIME_MORNING: (prefs, time) => {
    const hour = new Date(time).getHours();
    return hour >= 5 && hour <= 9;
  },
};

const formatPermanentTodo = (todo) => {
  const prefixes = [
    "A wee nudge: ",
    "Take a breath and ",
    "How about... ",
  ];
  const suffixes = [
    ", g'wan",
    " — just a wee bit",
    ", you can do it",
    ", you'll be glad for it",
    ", maybe with a podcast?",
  ];
  const style = Math.floor(Math.random() * 4);

  const withCapitalizedFirstLetter = todo.replace(/^./u, (letter) =>
    letter.toUpperCase()
  );
  const withLowercaseFirstLetter = todo.replace(/^./u, (letter) =>
    letter.toLowerCase()
  );

  const prefix =
    prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix =
    suffixes[Math.floor(Math.random() * suffixes.length)];

  if (style === 1) return `${prefix}${withLowercaseFirstLetter}`;
  if (style === 2) return `${withCapitalizedFirstLetter}${suffix}`;
  if (style === 3) {
    return `${prefix}${withLowercaseFirstLetter}${suffix}`;
  }
  return withCapitalizedFirstLetter;
};

const circuitBreakers = [
  {
    id: 1,
    render: "Close your eyes a wee minute",
  },
  {
    id: 2,
    render: "Close your eyes a wee minute, imagine a cloud",
  },
  {
    id: 3,
    conditions: [
      { check: checkConditions.PET, args: [["cat", "dog", "many pets"]] },
      { check: checkConditions.NATURE_VIEW },
    ],
    render: ({ preferences, location }) => (
      <div>
        <p>Go pet your {preferences.petType} while looking out at nature </p>
      </div>
    ),
  },
  {
    id: 4,
    render: ({ preferences, location }) => (
      <div>
        <p>Watch the sunset with your {preferences.petType}</p>
      </div>
    ),
    conditions: [
      { check: checkConditions.TIME_SUNSET },
      { check: checkConditions.PET, args: [["cat", "dog", "many pets"]] },
    ],
  },
  {
    id: 5,
    render: ({ preferences, location }) => {
      const randInt = Math.floor(Math.random() * 10) + 1;
      return (
        <div>
          <p>Count to {randInt} </p>
        </div>
      );
    },
  },
  {
    id: 8,
    render:
      "Turn phone upside down and balance something (like a pencil) on it somehow",
  },
  {
    id: 9,
    render:
      "Stand up and stretch as high as you can, phone in hand. Hold it up as long as your arms can/embarrassment allows",
  },
  {
    id: 10,
    render:
      "Walk around the room/space, and look somewhere you don't usually look.",
  },
  {
    id: 11,
    render: ({ preferences, location }) => (
      <div>
        <p>What’s your {preferences.petType} up to? Give them a wee scritch</p>
      </div>
    ),
    conditions: [
      { check: checkConditions.PET, args: [["cat", "dog", "many pets"]] },
    ],
  },
  {
    id: 12,
    render:
      "Go and look at the back of a drawer in your kitchen, nothing to do, just be curious!",
  },
  {
    id: 14,
    render:
      "Do a quick body scan... Any part of you too cold? Close eyes and see if you can warm it",
  },
  {
    id: 15,
    render:
      "Close your eyes, what feels good or neutral in your body right now?",
  },
  {
    id: 16,
    render: "Close your eyes, what do you hear?",
    conditions: [],
  },
  {
    id: 17,
    render: "Close your eyes, what do you smell?",
  },
  {
    id: 18,
    render: "Close your eyes, what colour do you see?",
  },
  {
    id: 19,
    render: ({ preferences, location }) => {
      const visualisations = [
        "an apple",
        "your best friend's face",
        "an orange flower",
      ];
      const chosenVis =
        visualisations[Math.floor(Math.random() * visualisations.length)];
      return (
        <div>
          <p>Close your eyes, try to visualise a {chosenVis}</p>
        </div>
      );
    },
    conditions: [{ check: checkConditions.NO_APHANTASIA }],
  },
  {
    id: 20,
    render:
      "Put your music on. Close your eyes. What are the lyrics, or what's the dominant instrument?",
  },
];

export const getValidCircuitBreakers = (
  prefs,
  time = Date.now(),
  location = null
) => {
  const userTaskBreakers =
    prefs.allowTasks === true
      ? [
          ["permanent", prefs.permanentTodos],
          ["one-time", prefs.oneTimeTodos],
        ].flatMap(([type, todos]) =>
          Array.isArray(todos)
            ? todos.flatMap((todo, index) => {
                if (typeof todo !== "string" || todo.trim().length === 0) {
                  return [];
                }

                const text = todo.trim();
                return [
                  {
                    id: `user-${type}-${index}`,
                    render:
                      type === "permanent" && text.length <= 30
                        ? () => formatPermanentTodo(text)
                        : text,
                    ...(type === "one-time" && { oneTimeTodoIndex: index }),
                  },
                ];
              })
            : []
        )
      : [];

  return [...circuitBreakers, ...userTaskBreakers].filter(
    (circuitBreaker) =>
      !circuitBreaker?.conditions?.length ||
      circuitBreaker.conditions.every(({ check, args = [] }) =>
        check(prefs, ...args, time, location)
      )
  );
};
