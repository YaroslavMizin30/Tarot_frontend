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
  lastSpin: string; // timestamp
  lastWin: string;
  cards: PlayingCard[];
}

export interface Activity {
  dailyCardLastDate: string;
  dailyHoroscopeLastDate: string;
  dailyHoroscopeLastId: number;
  monthlyHoroscopeLastDate: string;
  monthlyHoroscopeLastId: number;
  /**
   * ISO-8601 timestamp of the user's last natal chart update.
   * Used to enforce the once-per-paid-period update restriction.
   */
  natalChartLastUpdate?: string;
  roulette: Roulette;
}
