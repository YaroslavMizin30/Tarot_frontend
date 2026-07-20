import { ensureSupabase, getDataFromDB } from '@/shared/api/supabase';

import type { Spread } from '../types';
import { spreadFromRow, type SpreadRow } from './spreadMapper';

export const SPREAD_HISTORY_PAGE_SIZE = 5;

export interface SpreadHistoryPage {
  hasMore: boolean;
  nextOffset: number;
  spreads: Spread[];
}

export const getSpreads = async (id: string): Promise<Spread[] | null> => {
  const data = await getDataFromDB<SpreadRow>('spreads', {
    key: 'user_id',
    value: id,
  }, { throwOnError: true });

  if (!data) {
    return null;
  }

  return data.map(spreadFromRow);
};

export const getSpreadsPage = async (
  id: string,
  offset: number,
  limit = SPREAD_HISTORY_PAGE_SIZE,
): Promise<SpreadHistoryPage> => {
  await ensureSupabase();

  const { data, error } = await window.supabase
    .from('spreads')
    .select('*')
    .eq('user_id', id)
    .order('updated_at', { ascending: false, nullsFirst: false })
    .order('date', { ascending: false })
    .order('spread_id', { ascending: false })
    .range(offset, offset + limit);

  if (error) throw error;

  const rows = (data ?? []) as SpreadRow[];
  const pageRows = rows.slice(0, limit);

  return {
    hasMore: rows.length > limit,
    nextOffset: offset + pageRows.length,
    spreads: pageRows.map(spreadFromRow),
  };
};
