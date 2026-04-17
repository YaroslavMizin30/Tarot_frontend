import type { Spread } from '../types';

import { getSpreads } from './getSpreads';

import { insertRaw } from '@/shared/api/supabase';
import { updateRaw } from '@/shared/api/supabase';

export const addSpread = async (id: string, spread: Spread) => {
  const response = await getSpreads(id);

  if (response?.spreads) {
    await updateRaw(
      'spreads',
      {
        spreads: JSON.stringify([...response.spreads, spread]),
      },
      { key: 'user_id', value: id },
    );
  } else {
    await insertRaw('spreads', {
      spreads: JSON.stringify([spread]),
      user_id: id,
    });
  }
};
