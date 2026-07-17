const isValidDateParts = (year: number, month: number, day: number) => {
  const value = new Date(Date.UTC(year, month - 1, day));

  return (
    value.getUTCFullYear() === year &&
    value.getUTCMonth() === month - 1 &&
    value.getUTCDate() === day
  );
};

const formatIsoDate = (year: number, month: number, day: number) => {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/** Converts a Date or timestamp to a calendar key in `yyyy-mm-dd` format. */
export const toIsoDate = (
  value: string | Date | undefined | null,
): string | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return formatIsoDate(
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
    );
  }

  const datePart = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (datePart) {
    const year = Number(datePart[1]);
    const month = Number(datePart[2]);
    const day = Number(datePart[3]);

    return isValidDateParts(year, month, day)
      ? formatIsoDate(year, month, day)
      : null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return formatIsoDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
};

/** Returns today's local calendar date. */
export const todayIsoString = (): string => {
  const today = new Date();

  return formatIsoDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );
};

/** Parses `yyyy-mm-dd` as a Date in the local timezone. */
export const parseIsoDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return isValidDateParts(year, month, day)
    ? new Date(year, month - 1, day)
    : null;
};
