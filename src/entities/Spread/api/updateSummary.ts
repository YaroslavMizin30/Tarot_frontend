import snakeize from 'snakeize';

import type { Summary } from '../types';

import { updateRaw } from '@/shared/api/supabase';

export const updateSummary = async (
  id: string,
  summaryData: Partial<Summary>,
) => {
  await updateRaw('spread_summaries', snakeize({ ...summaryData }), {
    key: 'id',
    value: id,
  });
};
