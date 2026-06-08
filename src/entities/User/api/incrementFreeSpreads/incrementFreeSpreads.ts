import snakeize from 'snakeize';
import camelize from 'camelize';

import { getDataFromDB, updateRaw } from '@/shared/api/supabase';

import type { GetUserResponse } from '../../types/user';

export const incrementFreeSpreads = async (userId: string | number) => {
  const id = String(userId);

  const { data: userRows } = await getDataFromDB<GetUserResponse>(
    'users',
    ['free_spreads'],
    {
      key: 'id',
      value: id,
    },
  );

  if (!userRows || userRows.length === 0) {
    return false;
  }

  const currentFreeSpreads = Number(userRows[0].free_spreads ?? 0);
  const newFreeSpreads = currentFreeSpreads + 1;

  const { data, error } = await updateRaw(
    'users',
    snakeize({ free_spreads: newFreeSpreads }),
    {
      key: 'id',
      value: id,
    },
  );

  if (error || !data) {
    return false;
  }

  return camelize(data[0]);
};
