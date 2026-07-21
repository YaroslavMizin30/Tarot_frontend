import { backend } from '@/shared/api/backend';

import type { Spread } from '../types';
import { spreadFromRow, type SpreadRow } from './spreadMapper';

interface SpreadResponse {
  spread: SpreadRow;
}

export interface SpreadRatingDebug {
  requestId?: string;
  phase?: string;
  requestedRating?: number;
  previousRating?: number | null;
  persistedRating?: number | null;
  found?: boolean;
  canonicalOwnerMatches?: boolean;
  legacyOwnerMatches?: boolean;
  serverTime?: string;
  error?: { code?: string; message?: string };
}

export interface SpreadRatingResult {
  spread: Spread | null;
  debug: SpreadRatingDebug | null;
}

export const getSpreadById = async (spreadId: string): Promise<Spread> => {
  const response = await backend.invoke<SpreadResponse>('spread-library', {
    action: 'get',
    spreadId,
  });

  return spreadFromRow(response.spread);
};

export const saveDailySpread = async (
  spread: Spread,
  locale: string,
): Promise<Spread> => {
  const card = spread.cards[0];
  if (!card) throw new Error('Daily card is missing');

  const response = await backend.invoke<SpreadResponse>('spread-library', {
    action: 'saveDaily',
    spreadId: spread.spreadId,
    dayKey: spread.date,
    locale: locale.toLowerCase().startsWith('en') ? 'en' : 'ru',
    card,
    interpretation: spread.interpretation,
  });

  return spreadFromRow(response.spread);
};

export const rateSpread = async (
  spreadId: string,
  rating: number,
): Promise<SpreadRatingResult> => {
  const response = await backend.invoke<{
    spread: SpreadRow | null;
    debug?: SpreadRatingDebug;
  }>('spread-library', {
    action: 'rate',
    spreadId,
    rating,
  });

  return {
    spread: response.spread ? spreadFromRow(response.spread) : null,
    debug: response.debug ?? null,
  };
};
