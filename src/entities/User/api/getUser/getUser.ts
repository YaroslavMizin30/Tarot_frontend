import { getDataFromDB } from '@/shared/api/supabase';

import type { User } from '../../types/user';

export const getUser = async (id: string | number): Promise<User | null> => {
  const data = await getDataFromDB<User>('users', {
    key: 'id',
    value: String(id),
  });

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};
