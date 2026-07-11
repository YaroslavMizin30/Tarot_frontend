/**
 * Calculates the number of days between the target date and now.
 *
 * @param date - A Date object or an ISO 8601 timestampz string.
 * @returns A positive number if the date is in the future,
 *          a negative number if in the past, or 0 if today.
 *
 * @example
 * getDaysLeft('2026-07-14T12:00:00Z') // e.g. 3 (if today is 2026-07-11)
 * getDaysLeft('2026-07-08T12:00:00Z') // e.g. -3 (if today is 2026-07-11)
 * getDaysLeft(new Date())             // 0
 */
export const getDaysLeft = (date: Date | string): number => {
  const now = new Date();
  const target = new Date(date);

  // Reset hours to midnight to compare whole days
  const nowNormalized = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const targetNormalized = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  const diffInMs = targetNormalized.getTime() - nowNormalized.getTime();
  const msInDay = 1000 * 60 * 60 * 24;

  return Math.round(diffInMs / msInDay);
};
