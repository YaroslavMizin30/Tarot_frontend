import { capitalize } from '@/shared/utils';
import type { ZodiacSign } from '@/entities/Horoscope';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

export const findSign = (signs: string[]) => {
  //@ts-expect-error unknown string
  const found = signs.find((sign) => ZODIAC_SIGNS.includes(capitalize(sign)));

  if (found) {
    return capitalize(found);
  }
};
