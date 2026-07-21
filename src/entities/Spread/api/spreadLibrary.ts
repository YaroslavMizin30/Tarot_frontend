import { backend } from '@/shared/api/backend';

import type { Spread } from '../types';
import { spreadFromRow, type SpreadRow } from './spreadMapper';

interface SpreadResponse {
  spread: SpreadRow;
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
): Promise<Spread> => {
  const response = await backend.invoke<SpreadResponse>('spread-library', {
    action: 'rate',
    spreadId,
    rating,
  });

  return spreadFromRow(response.spread);
};
