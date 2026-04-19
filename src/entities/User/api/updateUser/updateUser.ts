import { updateRaw } from '@/shared/api/supabase';

import { type User, type GetUserResponse } from '../../types/user';

export const updateUser = async (userId: string, userData: GetUserResponse) => {
  const { data, error } = await updateRaw<User>(
    'users',
    { ...userData },
    {
      key: 'id',
      value: userId,
    },
  );

  if (error || !data) {
    return false;
  }

  return data[0];
};
