import { updateRaw } from '@/shared/api/supabase';

import { type User } from '../../types/user';

export const updateUser = async (userId: string, userData: User) => {
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
