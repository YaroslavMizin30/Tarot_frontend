import type { Aspect } from '@/entities/Horoscope/types/chart';
import type { AspectType } from '@/entities/Horoscope/types';

const ASPECT_BY_DEGREE: Partial<Record<number, AspectType>> = {
  0: 'conjunction',
  60: 'sextile',
  90: 'square',
  120: 'trine',
  180: 'opposition',
};

const ASPECT_ALIASES: Record<string, AspectType> = {
  conjunction: 'conjunction',
  'соединение': 'conjunction',
  opposition: 'opposition',
  'оппозиция': 'opposition',
  trine: 'trine',
  'трин': 'trine',
  square: 'square',
  'квадрат': 'square',
  'квадратура': 'square',
  sextile: 'sextile',
  'секстиль': 'sextile',
  quincunx: 'quincunx',
  'квинконс': 'quincunx',
  semisextile: 'semisextile',
  'полусекстиль': 'semisextile',
};

export const normalizeNatalAspectType = (
  value: string,
): AspectType | null => ASPECT_ALIASES[value.toLowerCase()] ?? null;

export const getNatalAspectType = (aspect: Aspect): AspectType =>
  ASPECT_BY_DEGREE[aspect.deg] ??
  normalizeNatalAspectType(aspect.type) ??
  'conjunction';

export const getNatalAspectKey = (aspect: Aspect) =>
  `${aspect.p1}-${aspect.p2}-${getNatalAspectType(aspect)}`;
