import { v5 as createUuid } from 'uuid';

import {
  ALL_CARDS,
  CardName,
  type Card,
} from '@/entities/TarotCard';
import {
  DAILY_CARD_SPREAD_MARKER,
  SpreadType,
  type Spread,
} from '@/entities/Spread';

const DAILY_CARD_NAMESPACE = '1703d6c9-16b7-4e23-8f30-e63b8b55a8b2';
const LEGACY_DAILY_QUESTIONS = new Set(['Card of the day', 'Карта дня']);

const hashString = (value: string): number => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

export const getDailySpreadId = (userId: number, dayKey: string): string => {
  return createUuid(`${userId}:${dayKey}`, DAILY_CARD_NAMESPACE);
};

export const getDailyCard = (userId: number, dayKey: string): Card => {
  const seed = `${userId}:${dayKey}`;
  const cardIndex = hashString(`${seed}:card`) % ALL_CARDS.length;
  const orientation = hashString(`${seed}:orientation`) % 10;

  return {
    name: ALL_CARDS[cardIndex].id as CardName,
    isInverted: orientation < 3,
  };
};

export const findDailySpread = (
  spreads: Spread[] | null | undefined,
  spreadId: string,
  dayKey: string,
): Spread | null => {
  if (!spreads) {
    return null;
  }

  const exactSpread = spreads.find((spread) => spread.spreadId === spreadId);

  if (exactSpread) {
    return exactSpread;
  }

  const dailySpread = spreads.find((spread) => {
    return (
      spread.date === dayKey &&
      spread.id === SpreadType.SINGLE &&
      spread.title === DAILY_CARD_SPREAD_MARKER
    );
  });

  if (dailySpread) {
    return dailySpread;
  }

  return (
    spreads.find((spread) => {
      return (
        spread.date === dayKey &&
        spread.id === SpreadType.SINGLE &&
        LEGACY_DAILY_QUESTIONS.has(spread.question)
      );
    }) ?? null
  );
};
