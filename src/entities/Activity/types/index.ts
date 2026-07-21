import { type CardName } from '@/entities/TarotCard';

export type Effect =
  | 'happy-card'
  | 'natal'
  | 'coins'
  | 'horoscopes'
  | 'offs'
  | 'reading'
  | 'negative'
  | 'retry';

export interface PlayingCard {
  id: CardName;
  effect?: Effect;
  description?: string;
}

export interface Roulette {
  lastSpin?: string | null; // timestamp
  lastWin?: string | null;
  cards: PlayingCard[];
  lastShuffle: string | null;
}

export interface Activity {
  dailyCardLastDate: string | null;
}

export interface ActivityPatch {
  dailyCardLastDate: string;
}
