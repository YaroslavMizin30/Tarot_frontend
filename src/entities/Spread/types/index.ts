import { type Card } from '@/entities/TarotCard';

export type SpreadStatus =
  | 'draft'
  | 'selecting'
  | 'awaiting_payment'
  | 'charged'
  | 'processing'
  | 'completed'
  | 'failed';

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
  cards?: Card[];
  selectedCount?: number;
  selectedIndices?: number[];
  status?: SpreadStatus;
}

export type SpreadDraftResult =
  | {
      status: 'ready' | 'selecting' | 'awaiting_payment' | 'charged';
      draftId: string;
      spread: SpreadParams;
      selectedCount?: number;
      selectedIndices?: number[];
    }
  | {
      status: 'insufficient_balance';
      draftId: string;
      required: number;
      current: number;
    };

export type CardSelectionResult = {
  status: 'selecting';
  draftId: string;
  selectedCount: number;
  selectedIndices: number[];
  isComplete: boolean;
};

export type FinalizeSpreadResult =
  | { status: 'ready'; draftId: string; spread: Spread }
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
  status?: SpreadStatus;
  updatedAt?: string;
};
