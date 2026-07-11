import { useEffect, startTransition } from 'react';

import { useActivity } from '@/entities/Activity';

import { isToday, getDaysLeft } from '@/shared/utils';

import type { PlayingCard } from '../types';
import {
  HIGH_CARDS,
  MIDDLE_CARDS,
  NEGATIVE_CARDS,
  REST,
} from '../config/cards';

const MAX_CARDS = 12;
const DAYS_AFTER_WIN = 7;

const getRandomCard = (cards: PlayingCard[], array: PlayingCard[]) => {
  let newIndex = Math.ceil(Math.random() * cards.length - 1);

  for (let i = newIndex; i < cards.length; i++) {
    if (cards[newIndex]) {
      newIndex = Math.ceil(Math.random() * cards.length - 1);

      continue;
    }

    cards[newIndex] = array[Math.ceil(Math.random() * array.length - 1)];

    break;
  }
};

export const useRoulette = () => {
  const { activity, updateActivity, isLoading, refetchActivity } =
    useActivity();

  const roulette = activity?.roulette;

  const shouldUpdate = () => {
    const daysLeft = getDaysLeft(roulette?.lastWin ?? '');

    const isWinValid = !isNaN(daysLeft) && daysLeft > 7;

    return (
      roulette &&
      !isToday(roulette.lastShuffle ?? '') &&
      !isToday(roulette.lastSpin ?? '') &&
      !isWinValid
    );
  };

  const prepareCards = async () => {
    const cards: PlayingCard[] = new Array(MAX_CARDS).fill(null);

    const REST_CARDS = REST.map((card) => {
      const { id } = card;

      return { id };
    });

    getRandomCard(cards, HIGH_CARDS);

    getRandomCard(cards, MIDDLE_CARDS);

    getRandomCard(cards, NEGATIVE_CARDS);

    const randomCards = cards.map((card) => {
      if (card) {
        return card;
      }

      return REST_CARDS.splice(
        Math.round(Math.random() * REST_CARDS.length - 1),
        1,
      )[0];
    });

    await updateActivity({
      roulette: {
        cards: randomCards,
        lastSpin: null,
        lastWin: roulette?.lastWin,
        lastShuffle: new Date().toISOString(),
      },
    });

    await refetchActivity();
  };

  const updateRoulette = async (
    cards: PlayingCard[],
    isWin?: boolean,
    isShuffle?: boolean,
  ) => {
    const date = new Date().toISOString();

    await updateActivity({
      roulette: {
        lastSpin: isShuffle ? null : date,
        lastWin: isWin ? date : '',
        cards,
        lastShuffle: date,
      },
    });

    await refetchActivity();
  };

  useEffect(() => {
    startTransition(() => {
      if (shouldUpdate()) {
        prepareCards();
      }
    });
  }, []);

  const winDaysPast = getDaysLeft(roulette?.lastWin ?? '');

  return {
    prepareCards,
    playingCards: roulette?.cards ?? [],
    winDaysPast,
    isLoading: isLoading && !activity,
    isSpinDisabled: isToday(roulette?.lastSpin ?? ''),
    isShuffleDisabled: winDaysPast < DAYS_AFTER_WIN,
    updateRoulette,
  };
};
