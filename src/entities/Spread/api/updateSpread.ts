import type { Spread } from '../types';

import { updateRaw } from '@/shared/api/supabase';

export const updateSpread = async (
  spreadId: string,
  spreadData: Partial<Spread>,
) => {
  const updatedSpread = await updateRaw<Spread>(
    'spreads',
    { ...spreadData },
    {
      key: 'spreadId',
      value: spreadId,
    },
  );

  if (!updatedSpread?.length) {
    throw new Error('Failed to update spread');
  }

  return updatedSpread[0];
};
