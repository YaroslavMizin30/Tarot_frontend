import { backend } from '@/shared/api/backend';

import type { Spread } from '../types';
import { spreadFromRow, type SpreadRow } from './spreadMapper';

export const SPREAD_HISTORY_PAGE_SIZE = 5;

export interface SpreadHistoryPage {
  hasMore: boolean;
  nextOffset: number;
  spreads: Spread[];
}

const getRecentPeriodStart = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - 29);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getSpreads = async (): Promise<Spread[]> => {
  const response = await backend.invoke<{ spreads: SpreadRow[] }>(
    'spread-library',
    {
      action: 'recent',
      sinceDate: getRecentPeriodStart(),
    },
  );

  return response.spreads.map(spreadFromRow);
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
