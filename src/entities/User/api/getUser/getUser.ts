import camelize from 'camelize';

import { getDataFromDB } from '@/shared/api/supabase';

import type { GetUserResponse } from '../../types/user';

export const getUser = async (id: string) => {
  const { data: user } = await getDataFromDB<GetUserResponse>('users', ['*'], {
    key: 'id',
    value: id,
  });

  if (!user) {
    return null;
  }

  return camelize(user[0]);
};
