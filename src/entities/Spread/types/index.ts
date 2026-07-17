import { type Card } from '@/entities/TarotCard';

export interface SpreadParams {
  spreadId?: string;
  title?: string;
  userAnswer?: string;
  question: string;
  cardsCount: number;
  details?: string;
  detailsAnswer?: string;
  id: `${SpreadType}`;
  userId: number;
}

export type SpreadDraftResult =
  | {
      status: 'ready';
      draftId: string;
      spread: SpreadParams;
    }
  | {
      status: 'insufficient_balance';
      draftId: string;
      required: number;
      current: number;
    };

export type PendingSpreadDraftResult =
  | { status: 'empty' }
  | { status: 'found'; draftId: string; spread: SpreadParams };

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
  status?: 'draft' | 'charged' | 'processing' | 'completed' | 'failed';
  updatedAt?: string;
};
