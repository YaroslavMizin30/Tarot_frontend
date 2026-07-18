import type {
  MoonCalendarEntry,
  MoonCalendarZodiacSign,
  ZodiacSign,
} from '../types';

export const createMoonCalendarIndex = (items: MoonCalendarEntry[]) => {
  const index = new Map<string, MoonCalendarEntry>();

  items.forEach((item) => {
    if (!index.has(item.date)) {
      index.set(item.date, item);
    }
  });

  return index;
};

export const getZodiacTranslationKey = (
  sign: MoonCalendarZodiacSign,
): ZodiacSign => {
  return `${sign.charAt(0).toUpperCase()}${sign.slice(1).toLowerCase()}` as ZodiacSign;
};
