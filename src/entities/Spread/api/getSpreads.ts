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
  appUserId: string,
  offset: number,
  limit = SPREAD_HISTORY_PAGE_SIZE,
): Promise<SpreadHistoryPage> => {
  const rows = await backend.select<SpreadRow>('spreads', {
    filters: [{ column: 'appUserId', value: appUserId }],
    order: [
      { column: 'updatedAt', ascending: false, nullsFirst: false },
      { column: 'date', ascending: false },
      { column: 'spreadId', ascending: false },
    ],
    range: { from: offset, to: offset + limit },
  });
  const pageRows = rows.slice(0, limit);

  return {
    hasMore: rows.length > limit,
    nextOffset: offset + pageRows.length,
    spreads: pageRows.map(spreadFromRow),
  };
};
