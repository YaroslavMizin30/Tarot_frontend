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
  isSummarized?: boolean;
  rating?: number;
};

export interface SpreadResponse {
  title?: string;
  user_answer?: string;
  question: string;
  cards_count: number;
  details?: string;
  details_answer?: string;
  id: `${SpreadType}`;
  cards: string;
  interpretation: string;
  date: string;
  spread_id: string;
  is_summarized?: boolean;
  rating?: number;
  user_id: number;
}

export interface Activity {
  lastDaily: string;
  lastHoroscope: string;
}

export interface ActivityResponse {
  last_daily: string;
  last_horoscope: string;
}
