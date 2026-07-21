import { backend } from '@/shared/api/backend';

import type { Spread } from '../types';
import { spreadFromRow, type SpreadRow } from './spreadMapper';

export const SPREAD_HISTORY_PAGE_SIZE = 5;

export interface SpreadHistoryPage {
  hasMore: boolean;
  nextOffset: number;
  spreads: Spread[];
}

export const getSpreads = async (
  appUserId: string,
): Promise<Spread[] | null> => {
  const data = await backend.select<SpreadRow>('spreads', {
    filters: [{ column: 'appUserId', value: appUserId }],
  });

  return data.map(spreadFromRow);
};

export const getSpreadsPage = async (
  offset: number,
  limit = SPREAD_HISTORY_PAGE_SIZE,
): Promise<SpreadHistoryPage> => {
  const response = await backend.invoke<{
    page: {
      hasMore: boolean;
      nextOffset: number;
    };
    spreads: SpreadRow[];
  }>('spread-history', {
    offset,
    limit,
  });

  return {
    hasMore: response.page.hasMore,
    nextOffset: response.page.nextOffset,
    spreads: response.spreads.map(spreadFromRow),
  };
};
