import { type Spread } from '@/entities/Spread';
import { type Card } from '@/entities/TarotCard';

export const combineAllCards = (spreads?: Spread[] | null) => {
  if (!spreads) {
    return [];
  }

  const allCards: Card[] = [];

  spreads.forEach((spread) => {
    const { cards } = spread;

    cards.forEach((card) => {
      allCards.push(card);
    });
  });

  return allCards;
};
