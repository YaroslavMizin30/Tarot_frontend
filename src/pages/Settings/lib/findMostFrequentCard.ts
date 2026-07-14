import { type Card } from '@/entities/TarotCard';

export const findMostFrequentCard = (cards: Card[]): Card | undefined => {
  if (cards.length === 0) return undefined;

  // Подсчитываем частоту каждого имени
  const counts = new Map<string, { card: Card; count: number }>();

  for (const card of cards) {
    const existing = counts.get(card.name);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(card.name, { card, count: 1 });
    }
  }

  // Находим максимум
  let maxEntry: { card: Card; count: number } | undefined;
  for (const entry of counts.values()) {
    if (!maxEntry || entry.count > maxEntry.count) {
      maxEntry = entry;
    }
  }

  return maxEntry?.card;
};
