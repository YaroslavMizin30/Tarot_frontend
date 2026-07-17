import type { Spread } from '../types';

import { insertRaw } from '@/shared/api/supabase';
import {
  spreadFromRow,
  spreadToRow,
  type SpreadRow,
} from './spreadMapper';

export const addSpread = async (spread: Spread) => {
  const insertedSpread = await insertRaw<SpreadRow>(
    'spreads',
    spreadToRow(spread),
  );

  if (!insertedSpread?.length) {
    throw new Error('Failed to create spread');
  }

  return spreadFromRow(insertedSpread[0]);
};
