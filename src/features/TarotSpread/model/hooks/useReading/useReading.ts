import { useState } from 'react';

import { ALL_TAROT_CARDS_ARRAY } from '../../../config/cards/cards';

import type { UseReadingResult, Card } from './useReading.types';

export const useReading = (): UseReadingResult => {
  const [cards, setCards] = useState<Card[]>([]);
  const [activeCard, setActiveCard] = useState(1);

  const prepareCards = (count: number) => {
    const allCards = [...ALL_TAROT_CARDS_ARRAY];

    const randomCards: Card[] = [];

    while (randomCards.length < count) {
      const randomIndex = Math.floor(Math.random() * allCards.length);

      const randomCard = allCards.splice(randomIndex, 1);

      const isInverted = Math.random() > 0.7;

      randomCards.push({ name: randomCard[0], isInverted });
    }

    setCards(randomCards);
  };

  const changeActiveCard = () => {
    setActiveCard((activeCard) => activeCard + 1);
  };

  return {
    cards,
    prepareCards,
    activeCard,
    changeActiveCard,
  };
};
