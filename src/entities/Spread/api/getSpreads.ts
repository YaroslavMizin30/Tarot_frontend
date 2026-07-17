import { getDataFromDB } from '@/shared/api/supabase';

import type { Spread } from '../types';
import { spreadFromRow, type SpreadRow } from './spreadMapper';

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
