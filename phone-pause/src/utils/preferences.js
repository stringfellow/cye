export const MINIMUM_COOLDOWN_MINUTES = 1;

export const DEFAULT_PERMANENT_TODOS = [
  "Laundry",
  "Do the dishes",
  "Tidy up",
  "Arrange the cushions",
  "Clear the decks",
  "Wipe down the surfaces",
  "Take out the rubbish",
  "Water the plants",
];

export const normalizeCooldownMinutes = (value) => {
  const minutes = Number(value);
  return Number.isSafeInteger(minutes) && minutes >= MINIMUM_COOLDOWN_MINUTES
    ? minutes
    : MINIMUM_COOLDOWN_MINUTES;
};
