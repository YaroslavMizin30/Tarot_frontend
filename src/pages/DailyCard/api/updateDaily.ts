import { updateRaw, insertRaw } from '@/shared/api/supabase';

import { getSpreads } from '@/entities/Spread';

export const updateDaily = async (id: number, date: string) => {
  const response = await getSpreads(String(id));

  if (response?.lastDaily || response?.spreads) {
    await updateRaw(
      'spreads',
      {
        last_daily: date,
      },
      { key: 'user_id', value: id },
    );
  } else {
    await insertRaw('spreads', {
      last_daily: date,
      user_id: id,
    });
  }
};
