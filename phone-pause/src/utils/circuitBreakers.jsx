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
      "Stand up and stretch as high as you can. Hold up your arms as long as you can!",
  },
  {
    id: 10,
    render:
      "Walk around the space, and look somewhere you don't usually look.",
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
          <p>Close your eyes, try to visualise {chosenVis}</p>
        </div>
      );
    },
    conditions: [{ check: checkConditions.NO_APHANTASIA }],
  },
  {
    id: 20,
    render:
      "Put some music on. Close your eyes. What are the lyrics about?"
  },
  {
    id: 21,
    render:
      "Put some music on. Close your eyes. What instruments can you hear?"
  },
  {
    id: 22,
    render:
      "Put some music on. Close your eyes. Does it bring up any memories?"
  },
  {
    id: 23,
    render:
      "Put some music on. Close your eyes. Just listen."
  },
  {
    id: 24,
    render:
      "Close your eyes, is there anyone you'd like to say hi to right now?"
  },
  {
    id: 25,
    render:
      "Close your eyes for a few breaths. Notice the sounds nearest to you, then the sounds furthest away."
  },
  {
    id: 26,
    render:
      "Close your eyes and notice where your body is supported by the chair, floor, or bed."
  },
  {
    id: 27,
    render:
      "Close your eyes. Let your next exhale be a little longer, if that feels comfortable."
  },
  {
    id: 28,
    render:
      "Close your eyes and notice one place in your body that feels comfortable or simply neutral."
  },
  {
    id: 29,
    render:
      "Rub your fingertips gently across your sleeve or another soft fabric. Notice how it feels."
  },
  {
    id: 30,
    render:
      "Press your fingertips together one by one, slowly, and notice the small points of contact."
  },
  {
    id: 31,
    render:
      "Reach for a nearby object. Explore its texture with your fingers for a few seconds."
  },
  {
    id: 32,
    render:
      "Uncurl your hands, stretch your fingers, then let them rest loosely."
  },
  {
    id: 33,
    render:
      "Put your phone down, then look around and find three things with the same colour."
  },
  {
    id: 34,
    render:
      "Stand up and gently roll your shoulders a few times."
  },
  {
    id: 35,
    render:
      "Take a few steps to look at something from a different angle."
  },
  {
    id: 36,
    render:
      "Take a sip of water, noticing its temperature and taste."
  },
  {
    id: 37,
    render: ({ preferences, location }) => {
      const visualisations = [
        "a red balloon drifting across a clear sky",
        "a lemon cut open on a wooden board",
        "a small boat floating on still water",
        "a candle flame gently moving",
        "a smooth stone resting in your palm",
        "a familiar room filled with morning light",
        "a tiny green shoot pushing through soil",
        "your favourite place in a different season",
        "an orange flower opening in the sun",
        "a cloud slowly changing shape",
        "a paper boat floating along a gentle stream",
        "a path winding through a quiet garden",
        "a beach just after the tide has gone out",
        "sunlight making a bright square on the floor",
        "a bowl of ripe peaches on a table",
        "a train passing through a green valley",
        "a fox pausing at the edge of a woodland",
        "stars appearing one by one in the evening sky",
        "a field of tall grass moving in the breeze",
        "a glass marble catching the light",
        "a warm cup held between your hands",
        "a little wooden cabin beside a lake",
        "a row of colourful doors on a sunny street",
        "a feather drifting gently to the ground",
        "a winding staircase in an old, quiet house",
        "a garden after a light rain",
        "a bright kite floating high above a hill",
        "a sleepy cat curled up in a patch of sunlight",
        "a wide, calm lake reflecting the sky",
        "a handful of smooth pebbles in different colours",
      ];
      const chosenVis =
        visualisations[Math.floor(Math.random() * visualisations.length)];
      const prefixes = [
        "Close your eyes and ",
        "With your eyes closed, ",
        "Shut yer peepers and ",
        "Inspect your eyelids and ",
        "Shut your eyes for a wee moment and ",
        "Give your peepers a wee rest and ",
        "Lids down for a moment, then ",
        "Let your eyes have a wee break and ",
      ];
      const middles = [
        "try to visualise ",
        "picture ",
        "try to see ",
        "imagine ",
        "bring to mind ",
      ];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const middle = middles[Math.floor(Math.random() * middles.length)];

      return (
        <div>
          <p>{prefix}{middle}{chosenVis}.</p>
        </div>
      );
    },
    conditions: [{ check: checkConditions.NO_APHANTASIA }],
  }
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
