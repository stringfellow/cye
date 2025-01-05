const checkConditions = {
  PET: (prefs, petTypes) => petTypes.includes(prefs.petType),
  NATURE_VIEW: (prefs) => prefs.hasNatureView === true,
  ALLOW_TASKS: (prefs) => prefs.allowTasks === true,
  NO_APHANTASIA: (prefs) => prefs.hasAphantasia === false,
  LOCATION: (prefs, locations, currentLocation) => true,

  TIME_SUNSET: (prefs, time, sunsetTime) => {
    const diff = sunsetTime - time;
    return diff > 0 && diff < 1800000; // Within 30 mins
  },
  TIME_MORNING: (prefs, time) => {
    const hour = new Date(time).getHours();
    return hour >= 5 && hour <= 9;
  },
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
    id: 6,
    render: "Laundry, g'won.",
    conditions: [
      { check: checkConditions.ALLOW_TASKS },
      { check: checkConditions.LOCATION, args: [["home"]] },
    ],
  },
  {
    id: 7,
    render: "Dishes, nice warm water on your hands. And some tunes perhaps!",
    conditions: [
      { check: checkConditions.ALLOW_TASKS },
      { check: checkConditions.LOCATION, args: [["home"]] },
    ],
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
    id: 13,
    render:
      "Anything need throwing out, recycling, posting? G'won, it'll only take a wee min",
    conditions: [
      { check: checkConditions.ALLOW_TASKS },
      { check: checkConditions.LOCATION, args: [["home"]] },
    ],
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
  return circuitBreakers.filter(
    (circuitBreaker) =>
      !circuitBreaker?.conditions?.length ||
      circuitBreaker.conditions.every(({ check, args = [] }) =>
        check(prefs, ...args, time, location)
      )
  );
};
