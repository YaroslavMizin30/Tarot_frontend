import {
  DAILY_CARD_SPREAD_MARKER,
  type Spread,
} from '@/entities/Spread';
import type { CardName } from '@/entities/TarotCard';

const PERIOD_DAYS = 30;
const MIN_SUIT_SAMPLE = 6;
const LEGACY_DAILY_CARD_QUESTIONS = new Set(['Card of the day', 'Карта дня']);

export type TarotSuit = 'wands' | 'cups' | 'swords' | 'coins';

export interface ProfileInsightsData {
  completedSpreads: number;
  dominantSuit?: TarotSuit;
  dominantSuitPercent?: number;
  majorArcanaCount: number;
  repeatedCard?: CardName;
  repeatedCardCount: number;
  totalCards: number;
}

const getDateTimestamp = (value?: string) => {
  if (!value) return Number.NaN;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00`).getTime();
  }

  const localDate = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (localDate) {
    return new Date(`${localDate[3]}-${localDate[2]}-${localDate[1]}T12:00:00`).getTime();
  }

  return new Date(value).getTime();
};

const getSpreadTimestamp = (spread: Spread) => {
  const dateTimestamp = getDateTimestamp(spread.date);
  if (!Number.isNaN(dateTimestamp)) return dateTimestamp;

  return getDateTimestamp(spread.updatedAt);
};

const getCardSuit = (name: CardName): TarotSuit | undefined => {
  const match = String(name).match(/_of_(wands|cups|swords|coins)$/);

  return match?.[1] as TarotSuit | undefined;
};

const isCompletedSpread = (spread: Spread) =>
  spread.status === 'completed' || Boolean(spread.interpretation.trim());

const isDailyCard = (spread: Spread) =>
  spread.title === DAILY_CARD_SPREAD_MARKER ||
  LEGACY_DAILY_CARD_QUESTIONS.has(spread.question);

export const getProfileInsights = (
  spreads: Spread[],
  now = new Date(),
): ProfileInsightsData => {
  const periodStart = new Date(now);
  periodStart.setHours(0, 0, 0, 0);
  periodStart.setDate(periodStart.getDate() - (PERIOD_DAYS - 1));

  const periodEnd = new Date(now);
  periodEnd.setHours(23, 59, 59, 999);

  const completedSpreads = spreads.filter((spread) => {
    if (!isCompletedSpread(spread) || isDailyCard(spread)) return false;

    const timestamp = getSpreadTimestamp(spread);

    return (
      !Number.isNaN(timestamp) &&
      timestamp >= periodStart.getTime() &&
      timestamp <= periodEnd.getTime()
    );
  });

  const cards = completedSpreads.flatMap((spread) => spread.cards);
  const cardCounts = new Map<CardName, number>();
  const suitCounts: Record<TarotSuit, number> = {
    wands: 0,
    cups: 0,
    swords: 0,
    coins: 0,
  };
  let majorArcanaCount = 0;

  cards.forEach((card) => {
    cardCounts.set(card.name, (cardCounts.get(card.name) ?? 0) + 1);

    const suit = getCardSuit(card.name);
    if (suit) {
      suitCounts[suit] += 1;
    } else {
      majorArcanaCount += 1;
    }
  });

  const repeatedCardEntry = [...cardCounts.entries()].sort(
    ([leftName, leftCount], [rightName, rightCount]) =>
      rightCount - leftCount || String(leftName).localeCompare(String(rightName)),
  )[0];

  const suitEntries = (Object.entries(suitCounts) as [TarotSuit, number][])
    .sort(([, leftCount], [, rightCount]) => rightCount - leftCount);
  const [dominantSuitEntry, nextSuitEntry] = suitEntries;
  const minorArcanaCount = suitEntries.reduce(
    (total, [, count]) => total + count,
    0,
  );
  const hasDominantSuit =
    minorArcanaCount >= MIN_SUIT_SAMPLE &&
    dominantSuitEntry[1] > nextSuitEntry[1];

  return {
    completedSpreads: completedSpreads.length,
    dominantSuit: hasDominantSuit ? dominantSuitEntry[0] : undefined,
    dominantSuitPercent: hasDominantSuit
      ? Math.round((dominantSuitEntry[1] / minorArcanaCount) * 100)
      : undefined,
    majorArcanaCount,
    repeatedCard:
      repeatedCardEntry?.[1] >= 2 ? repeatedCardEntry[0] : undefined,
    repeatedCardCount: repeatedCardEntry?.[1] >= 2 ? repeatedCardEntry[1] : 0,
    totalCards: cards.length,
  };
};
