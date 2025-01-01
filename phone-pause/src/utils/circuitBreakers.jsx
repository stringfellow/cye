const checkConditions = {
  PET: (prefs, petTypes) => petTypes.includes(prefs.petType),
  NATURE_VIEW: (prefs) => prefs.hasNatureView === true,
  LOCATION: (prefs, locations, currentLocation) =>
    locations.includes(currentLocation),
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
    conditions: [],
  },
  {
    id: 2,
    render: "Close your eyes a wee minute, imagine a cloud",
    conditions: [],
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
    conditions: [],
  },
];

export const getValidCircuitBreakers = (
  prefs,
  time = Date.now(),
  location = null
) => {
  return circuitBreakers.filter(
    (circuitBreaker) =>
      !circuitBreaker.conditions.length ||
      circuitBreaker.conditions.every(({ check, args = [] }) =>
        check(prefs, ...args, time, location)
      )
  );
};
