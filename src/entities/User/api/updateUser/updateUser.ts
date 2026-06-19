import snakeize from 'snakeize';
import camelize from 'camelize';

import { updateRaw } from '@/shared/api/supabase';

import { type User, type GetUserResponse } from '../../types/user';

export const updateUser = async (userId: string, userData: Partial<User>) => {
  const { data, error } = await updateRaw<GetUserResponse>(
    'users',
    snakeize(userData),
    {
      key: 'id',
      value: userId,
    },
  );

  if (error || !data) {
    return false;
  }

  return camelize(data[0]);
};
