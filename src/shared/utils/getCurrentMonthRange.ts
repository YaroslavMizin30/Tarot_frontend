/**
 * Returns the current month date range starting from today to the last day of the month.
 * Dates are formatted as dd.mm.yyyy.
 */
export const getCurrentMonthRange = (): { start: string; end: string } => {
  const today = new Date();

  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

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
