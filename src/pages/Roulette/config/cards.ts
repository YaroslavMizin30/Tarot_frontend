import { CardName } from '@/entities/TarotCard';
import type { DailyBonusRewardType } from '@/entities/BonusGame';

import type { Effect, PlayingCard } from '../types';

export const CARDS_DESCRIPTION: {
  id: CardName;
  prize: string;
  effect: Effect;
}[] = [
  {
    id: CardName.ACE_OF_COINS,
    prize: 'Pentacles add currency to your bonus balance',
    effect: 'coins',
  },
  {
    id: CardName.ACE_OF_WANDS,
    prize: 'Wands give credit toward your next tarot reading',
    effect: 'reading',
  },
  {
    id: CardName.ACE_OF_CUPS,
    prize: 'Cups advance the guaranteed reward meter',
    effect: 'horoscopes',
  },
  {
    id: CardName.ACE_OF_SWORDS,
    prize: 'Swords advance the guaranteed reward meter',
    effect: 'retry',
  },
  {
    id: CardName.THE_STAR,
    prize: 'Major arcana bring rare and more valuable rewards',
    effect: 'happy-card',
  },
];

const getSuit = (cardId: string) => {
  if (cardId.endsWith('_coins')) return 'pentacles';
  if (cardId.endsWith('_wands')) return 'wands';
  if (cardId.endsWith('_cups')) return 'cups';
  if (cardId.endsWith('_swords')) return 'swords';
  return 'major';
};

export function createPlayingCard(
  id: CardName,
  reward?: { type: DailyBonusRewardType; bonusDelta: number },
): PlayingCard {
  const suit = getSuit(id);
  let effect: Effect;
  let description: string;

  switch (suit) {
    case 'pentacles':
      effect = 'coins';
      description = 'Pentacles may add currency to your bonus balance';
      break;
    case 'wands':
      effect = 'reading';
      description = 'Wands may give credit toward a tarot reading';
      break;
    case 'cups':
      effect = 'horoscopes';
      description = 'Cups advance your guaranteed reward meter';
      break;
    case 'swords':
      effect = 'retry';
      description = 'Swords advance your guaranteed reward meter';
      break;
    default:
      effect = 'happy-card';
      description = 'Major arcana may bring a rare reward';
  }

  if (reward) {
    if (reward.type === 'risk_loss') {
      description = 'The stake was not returned';
    } else if (reward.type === 'risk_return') {
      description = 'Your stake was returned';
    } else if (reward.type === 'risk_win') {
      description = 'You receive 2 bonus pentacles, including your stake';
    } else if (reward.type === 'risk_jackpot') {
      description = 'You receive 4 bonus pentacles, including your stake';
    } else if (reward.type === 'progress') {
      description = reward.bonusDelta > 0
        ? 'The reward meter is complete. You receive 1 bonus pentacle'
        : 'The card advances your guaranteed reward meter';
    } else if (reward.type === 'reading_credit') {
      description = 'You receive 1 bonus pentacle for a tarot reading';
    } else if (reward.type === 'jackpot') {
      description = 'Jackpot: you receive 5 bonus pentacles';
    } else {
      description = reward.bonusDelta === 1
        ? 'You receive 1 bonus pentacle'
        : reward.bonusDelta === 2
          ? 'You receive 2 bonus pentacles'
          : 'You receive 3 bonus pentacles';
    }
  }

  return { id, effect, description };
}

export const DISPLAY_CARDS: PlayingCard[] = [
  CardName.ACE_OF_COINS,
  CardName.SIX_OF_WANDS,
  CardName.FOUR_OF_SWORDS,
  CardName.NINE_OF_CUPS,
  CardName.THREE_OF_COINS,
  CardName.QUEEN_OF_WANDS,
  CardName.EIGHT_OF_SWORDS,
  CardName.TWO_OF_CUPS,
  CardName.KING_OF_COINS,
  CardName.PAGE_OF_WANDS,
  CardName.SIX_OF_SWORDS,
  CardName.THE_STAR,
].map((id) => createPlayingCard(id));
