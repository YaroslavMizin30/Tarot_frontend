import snakeize from 'snakeize';

import type { Spread } from '../types';

import { updateRaw } from '@/shared/api/supabase';

export const updateSpread = async (
  spreadId: string,
  spreadData: Partial<Spread>,
) => {
  await updateRaw('spreads', snakeize({ ...spreadData }), {
    key: 'spread_id',
    value: spreadId,
  });
};
