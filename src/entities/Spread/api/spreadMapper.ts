import type { Spread, SpreadParams } from '../types';

type SpreadRow = {
  spread_id: string;
  user_id: number;
  id: SpreadParams['id'];
  title?: string | null;
  question: string;
  user_answer?: string | null;
  details?: string | null;
  details_answer?: string | null;
  cards_count: number;
  cards?: Spread['cards'] | string | null;
  interpretation?: string | null;
  date?: string | null;
  status?: Spread['status'] | null;
  updated_at?: string | null;
};

const parseCards = (cards: SpreadRow['cards']): Spread['cards'] => {
  if (Array.isArray(cards)) return cards;
  if (!cards) return [];

  try {
    const parsed = JSON.parse(cards) as unknown;
    return Array.isArray(parsed) ? parsed as Spread['cards'] : [];
  } catch {
    return [];
  }
};

export const spreadFromRow = (row: SpreadRow): Spread => ({
  spreadId: row.spread_id,
  userId: row.user_id,
  id: row.id,
  title: row.title ?? undefined,
  question: row.question,
  userAnswer: row.user_answer ?? undefined,
  details: row.details ?? undefined,
  detailsAnswer: row.details_answer ?? undefined,
  cardsCount: row.cards_count,
  cards: parseCards(row.cards),
  interpretation: row.interpretation ?? '',
  date: row.date ?? '',
  status: row.status ?? undefined,
  updatedAt: row.updated_at ?? undefined,
});

export const spreadParamsFromRow = (row: SpreadRow): SpreadParams => {
  const spread = spreadFromRow(row);

  return {
    spreadId: spread.spreadId,
    userId: spread.userId,
    id: spread.id,
    title: spread.title,
    question: spread.question,
    userAnswer: spread.userAnswer,
    details: spread.details,
    detailsAnswer: spread.detailsAnswer,
    cardsCount: spread.cardsCount,
  };
};

export const spreadToRow = (
  spread: Partial<Spread>,
): Record<string, unknown> => {
  const row: Record<string, unknown> = {};

  if (spread.spreadId !== undefined) row.spread_id = spread.spreadId;
  if (spread.userId !== undefined) row.user_id = spread.userId;
  if (spread.id !== undefined) row.id = spread.id;
  if (spread.title !== undefined) row.title = spread.title;
  if (spread.question !== undefined) row.question = spread.question;
  if (spread.userAnswer !== undefined) row.user_answer = spread.userAnswer;
  if (spread.details !== undefined) row.details = spread.details;
  if (spread.detailsAnswer !== undefined) {
    row.details_answer = spread.detailsAnswer;
  }
  if (spread.cardsCount !== undefined) row.cards_count = spread.cardsCount;
  if (spread.cards !== undefined) row.cards = JSON.stringify(spread.cards);
  if (spread.interpretation !== undefined) {
    row.interpretation = spread.interpretation;
  }
  if (spread.date !== undefined) row.date = spread.date;
  if (spread.status !== undefined) row.status = spread.status;
  if (spread.updatedAt !== undefined) row.updated_at = spread.updatedAt;

  return row;
};

export type { SpreadRow };
