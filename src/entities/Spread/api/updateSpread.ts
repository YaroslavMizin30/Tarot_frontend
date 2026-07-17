import type { Spread } from '../types';

import { updateRaw } from '@/shared/api/supabase';
import {
  spreadFromRow,
  spreadToRow,
  type SpreadRow,
} from './spreadMapper';

export const updateSpread = async (
  spreadId: string,
  spreadData: Partial<Spread>,
) => {
  const updatedSpread = await updateRaw<SpreadRow>(
    'spreads',
    spreadToRow(spreadData),
    {
      key: 'spread_id',
      value: spreadId,
    },
  );

  if (!updatedSpread?.length) {
    throw new Error('Failed to update spread');
  }

  return spreadFromRow(updatedSpread[0]);
};
