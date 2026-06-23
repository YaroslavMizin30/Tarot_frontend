import { getDataFromDB, updateRaw } from '@/shared/api/supabase';

import type { User } from '../../types/user';

export const incrementFreeSpreads = async (userId: string | number) => {
  const id = String(userId);

  const data = await getDataFromDB<User>('users', {
    key: 'id',
    value: id,
  });

  if (!data || data.length === 0) {
    return false;
  }

  const currentFreeSpreads = Number(data[0].freeSpreads ?? 0);
  const newFreeSpreads = currentFreeSpreads + 1;

  const updated = await updateRaw<User>(
    'users',
    { freeSpreads: newFreeSpreads },
    {
      key: 'id',
      value: id,
    },
  );

  if (!updated) {
    return false;
  }

  return updated[0];
};
