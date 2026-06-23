import type { Spread } from '../types';

import { updateRaw } from '@/shared/api/supabase';

export const updateSpread = async (
  spreadId: string,
  spreadData: Partial<Spread>,
) => {
  await updateRaw('spreads', { ...spreadData }, {
    key: 'spreadId',
    value: spreadId,
  });
};
