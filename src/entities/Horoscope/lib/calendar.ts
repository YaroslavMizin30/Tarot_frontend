import type {
  MoonCalendarEntry,
  MoonCalendarLocalization,
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

export const getMoonCalendarLocalization = (
  item: MoonCalendarEntry,
  locale: 'en' | 'ru',
): MoonCalendarLocalization | null => {
  return item[locale] ?? item.en ?? item.ru;
};

export const getZodiacTranslationKey = (
  sign: MoonCalendarZodiacSign,
): ZodiacSign => {
  return `${sign.charAt(0).toUpperCase()}${sign.slice(1).toLowerCase()}` as ZodiacSign;
};
