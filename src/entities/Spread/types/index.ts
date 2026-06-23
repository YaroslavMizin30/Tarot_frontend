import { type Card } from '@/entities/TarotCard';

export interface SpreadParams {
  title?: string;
  userAnswer?: string;
  question: string;
  cardsCount: number;
  details?: string;
  detailsAnswer?: string;
  id: `${SpreadType}`;
  userId: number;
}

export const enum SpreadType {
  SINGLE = 'single',
  THREE = 'three',
  FOUR = 'four',
  FIVE = 'five',
  PENTAGRAM = 'pentagram',
  SIX = 'six',
  TWO_DECKS = 'two_decks',
  SEVEN = 'seven',
  NINE = 'nine',
  // CELTIC_CROSS = 'celtic_cross',
}

export type Spread = SpreadParams & {
  cards: Card[];
  interpretation: string;
  date: string;
  spreadId: string;
  rating?: number;
};

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
}
