export const MINIMUM_COOLDOWN_MINUTES = 1;

export const normalizeCooldownMinutes = (value) => {
  const minutes = Number(value);
  return Number.isSafeInteger(minutes) && minutes >= MINIMUM_COOLDOWN_MINUTES
    ? minutes
    : MINIMUM_COOLDOWN_MINUTES;
};
