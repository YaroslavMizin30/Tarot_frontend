import { type CSSProperties } from 'react';

import { SpreadType } from '@/shared/types/spread';

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
  {
    id: SpreadType.CELTIC_CROSS,
    label: 'Celtic Cross',
    cardCount: 10,
    description:
      'Ten cards. Can be used for any area of life, by asking both general and specific questions',
  },
];

const OneCardSpread = [
  { left: 'calc(50% - 38px)', top: 'calc(50% - 70px)', index: 1 },
];

const ThreeCardSpread = [
  { right: '50px', top: 'calc(50% - 70px)', index: 1, title: 'Past' },
  {
    left: 'calc(50% - 38px)',
    top: 'calc(50% - 70px)',
    index: 2,
    title: 'Present',
  },
  { left: '50px', top: 'calc(50% - 70px)', index: 3, title: 'Future' },
];

const PentagramSpread = [
  {
    left: 'calc(50% - 38px)',
    top: '40px',
    index: 1,
    title: 'Spirit',
    description:
      'Position 1 (Spirit) serves as the significator of the Querent if the spread is performed as a personality diagnosis. If the spread concerns a situation, then the first position indicates the very essence of the situation, its origins and underlying premises. The Spirit card determines the nature of the subsequent layout: if a sharply negative card appears in this position, it creates an unfavorable environment for the other Arcana and vice versa. It sets the tone for the entire spread.',
  },
  {
    right: '15px',
    top: '260px',
    index: 2,
    title: 'Fire',
    description:
      'Position 2 (Fire) indicates the will, ambitions, self-esteem, and life energy of the Querent. Here lie true aspirations, inspiration, determination, and potential for active actions. In analyzing a situation, this card points to driving forces and the epicenter of events.',
  },
  {
    left: '50px',
    top: '120px',
    index: 3,
    title: 'Air',
    description:
      "Position 3 (Air) reflects thinking, worldview, understanding, plans, and the communicative sphere of the Querent. This can be both the picture of the Querent's logical perception of the situation and the root of possible conflicts, challenges, and dangers related to the situation. This card can also show which external forces are currently influencing the Querent's life. Here may also lie information that is currently unknown to the Querent for various reasons.",
  },
  {
    right: '50px',
    top: '120px',
    index: 4,
    title: 'Water',
    description:
      "Position 4 (Water) reflects the emotional background of the situation. Here also lie intuitive hints, opportunities to adapt current circumstances to satisfy one's emotional needs and goals. This is also the sphere of close relationships where the Querent can receive necessary support.",
  },
  {
    left: '15px',
    top: '260px',
    index: 5,
    title: 'Earth',
    description:
      'Position 5 (Earth) indicates material matters, growth prospects, and the forces one can rely on. It also represents physical health and relationships with finances and property in personality analysis.',
  },
];

const CelticCrossSpread = [
  {
    right: '5px',
    top: '200px',
    transform: 'rotate(-90deg)',
    zIndex: '999',
    title: 'Topic',
    description:
      'Position 1. Significator (Main Theme). This is where everything begins. The card that falls into this position will reveal the essence of the problem or the main question you brought with you.',
    tooltipStyle: { transform: 'rotate(90deg)' },
  },
  {
    right: '5px',
    top: '200px',
    index: 2,
    title: 'Influence',
    description:
      "Position 2. Crossing Card (What Hinders or Helps). Lies across the first card and shows either an obstacle standing in the way or support helping you. It's important to understand that this isn't necessarily bad—perhaps this card shows what helps you move forward.",
  },
  {
    right: '5px',
    top: '60px',
    index: 3,
    title: 'Сonscious-ness',
    description:
      'Position 3. Foundation (Deep Causes). This card tells about what lies beneath the problem. What hidden motives or events led you to the current situation? If the problem resembles an iceberg, then this is its underwater part.',
  },
  {
    right: '5px',
    top: '340px',
    index: 4,
    title: 'Subcon-sciousness',
    description:
      'Position 4. Past (What Happened Before). Here are revealed recent past events that influenced your situation. Perhaps you need to pay attention to actions or decisions that led to the current state of affairs.',
  },
  {
    right: '115px',
    top: '200px',
    index: 5,
    title: 'Nearest past',
    description:
      "Position 5. Near Future. This card will show what awaits you in the coming weeks or months. Not about the future for your entire life, but about what's coming up soon. Hint: it's better to be prepared for what you'll see.",
    tooltipPosition: 'right',
  },
  {
    left: '28px',
    top: '200px',
    index: 6,
    title: 'Nearest future',
    description:
      "Position 6. Goal or Aspiration. This is what you really want. What goal drives you and leads to your decisions? This card reveals your true aspirations—sometimes even those you didn't realize existed.",
  },
  {
    left: '112px',
    top: '415px',
    index: 7,
    title: 'Me',
    description:
      "Position 7. Querent's Position. Here we see your current emotional state. How do you yourself perceive the situation? What is your attitude and what's happening inside you?",
    tooltipPosition: 'left',
  },
  {
    left: '112px',
    top: '280px',
    index: 8,
    title: 'Others',
    description:
      'Position 8. Surrounding Influences. This card speaks about how external factors affect you: people, circumstances, or situations that you cannot control.',
    tooltipPosition: 'left',
  },
  {
    left: '112px',
    top: '145px',
    index: 9,
    title: 'Hopes and concerns',
    description:
      'Position 9. Hopes and Fears. Oh, this card is always interesting. It shows your hidden desires or fears. This is what often remains off-screen but can greatly influence your actions.',
    tooltipPosition: 'left',
  },
  {
    left: '112px',
    top: '10px',
    index: 10,
    title: 'Conclusion',
    description:
      'Position 10. Conclusion (Long-term Result). And finally, how will everything end? This is a future card, but not final—one that will come if everything continues to develop according to the current scenario.',
    tooltipPosition: 'left',
  },
];

export const SpreadConfig: Record<
  `${SpreadType}`,
  Array<
    CSSProperties & {
      index?: number;
      title?: string;
      description?: string;
      tooltipPosition?: string;
      tooltipStyle?: CSSProperties;
    }
  >
> = {
  [SpreadType.SINGLE]: OneCardSpread,
  [SpreadType.THREE]: ThreeCardSpread,
  [SpreadType.PENTAGRAM]: PentagramSpread,
  [SpreadType.CELTIC_CROSS]: CelticCrossSpread,
} as const;
