import { type CSSProperties } from 'react';

import { SpreadType } from '@/shared/types/spread';

import { OneCardSpread } from './single';
import { ThreeCardSpread } from './three';
import { FourCardSpread } from './four';
import { FiveCardSpread } from './five';
import { PentagramSpread } from './pentagram';
import { SixCardSpread } from './six';
import { TwoDecksSpread } from './two_decks';
import { SevenCardsSpread } from './seven';
import { NineCardsSpread } from './nine';

export interface Spread {
  id: `${SpreadType}`;
  label: string;
  cardCount: number;
  description?: string;
}

export const SPREADS: Spread[] = [
  {
    id: SpreadType.SINGLE,
    label: 'Single Card',
    cardCount: 1,
    description: 'This spread is suitable for quick assessment',
  },
  {
    id: SpreadType.THREE,
    label: 'Three Cards',
    cardCount: 3,
    description:
      "This simple Tarot spread will help you get answers to any questions you're interested in",
  },
  {
    id: SpreadType.PENTAGRAM,
    label: 'Pentagram',
    cardCount: 5,
    description:
      'This spread breaks down the situation into components and analyzes it by parts — its fiery aspect, watery aspect, and so on.',
  },
  // {
  //   id: SpreadType.CELTIC_CROSS,
  //   label: 'Celtic Cross',
  //   cardCount: 10,
  //   description:
  //     'Ten cards. Can be used for any area of life, by asking both general and specific questions',
  // },
];

export const SpreadConfig: Record<
  `${SpreadType}`,
  {
    cards: Array<
      CSSProperties & {
        index?: number;
        title?: string;
        description?: string;
        tooltipPosition?: string;
        tooltipStyle?: CSSProperties;
      }
    >;
    button: CSSProperties;
  }
> = {
  [SpreadType.SINGLE]: OneCardSpread,
  [SpreadType.THREE]: ThreeCardSpread,
  [SpreadType.FOUR]: FourCardSpread,
  [SpreadType.FIVE]: FiveCardSpread,
  [SpreadType.PENTAGRAM]: PentagramSpread,
  [SpreadType.SIX]: SixCardSpread,
  [SpreadType.TWO_DECKS]: TwoDecksSpread,
  [SpreadType.SEVEN]: SevenCardsSpread,
  [SpreadType.NINE]: NineCardsSpread,
  // [SpreadType.CELTIC_CROSS]: CelticCrossSpread,
} as const;
