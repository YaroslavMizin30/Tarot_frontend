/**
 * Returns the current week date range starting from today to the end of the week (Sunday).
 * Monday is considered the first day of the week.
 * Dates are formatted as dd.mm.yyyy.
 */
export const getCurrentWeekRange = (): { start: string; end: string } => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Convert to Monday-based week: Monday = 0, Tuesday = 1, ..., Sunday = 6
  const mondayBasedDay = currentDay === 0 ? 6 : currentDay - 1;
  const daysUntilEndOfWeek = 6 - mondayBasedDay;

  const end = new Date(today);
  end.setDate(today.getDate() + daysUntilEndOfWeek);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return {
    start: formatDate(today),
    end: formatDate(end),
  };
};
