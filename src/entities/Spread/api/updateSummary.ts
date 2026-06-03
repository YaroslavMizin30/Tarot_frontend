import snakeize from 'snakeize';

import type { Summary } from '../types';

import { updateRaw } from '@/shared/api/supabase';

export const updateSummary = async (
  spreadId: string,
  spreadData: Partial<Summary>,
) => {
  await updateRaw('spread_summaries', snakeize({ ...spreadData }), {
    key: 'spread_id',
    value: spreadId,
  });
};
