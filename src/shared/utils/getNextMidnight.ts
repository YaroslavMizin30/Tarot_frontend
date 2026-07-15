/**
 * Returns the next midnight (00:00:00) Date based on the given reference date.
 * If the reference date is null/undefined, returns null.
 */
export const getNextMidnight = (from?: Date | string | null): Date | null => {
  if (!from) {
    return null;
  }

  const base = new Date(from);
  const next = new Date(base);
  next.setHours(24, 0, 0, 0);

  return next;
};
